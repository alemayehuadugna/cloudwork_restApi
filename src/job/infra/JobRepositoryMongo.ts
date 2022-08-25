import { FreelancerIdProvider } from "@/freelancer/infra/FreelancerIdProvider";
import { PaginatedQueryResult } from "@/_lib/CQRS";
import { privateEncrypt } from "crypto";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
import { Job } from "../domain/Job";
import { JobId, MilestoneId } from "../domain/JobId";
import { JobRepository } from "../domain/JobRepository";
import { JobCollection, JobSchema } from "./JobCollection";
import { JobIdProvider, MilestoneIdProvider } from "./JobIdProvider";
import { JobMapper } from "./JobMapper";

type Dependencies = {
  jobCollection: JobCollection;
};

const makeMongoJobRepository = ({
  jobCollection,
}: Dependencies): JobRepository => ({
  async getNextId(): Promise<JobId> {
    return Promise.resolve(JobIdProvider.create(v4().toString()));
  },
  async getMilestoneNextId(): Promise<MilestoneId> {
    return Promise.resolve(JobIdProvider.create(v4().toString()));
  },
  async findById(id: string): Promise<Job.Type> {
    const job = await jobCollection.findOne({
      _id: from(id),
    });

    if (!job) {
      throw new Error("Job not Found");
    }
    return JobMapper.toDomainEntity(job);
  },

  async getJob(id: string): Promise<Job.Type[]> {
    const job = await jobCollection
      .aggregate([
        {
          $match: { _id: from(id) },
        },
        {
          $lookup: {
            from: "freelancers",
            as: "freelancer",
            let: {
              fId: "$freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$fId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    if (!job) {
      throw new Error("Job not Found");
    }
    return JobMapper.toDomainEntities(job);
  },
  async store(entity: Job.Type): Promise<void> {
    const { _id, version, ...data } = JobMapper.toOrmEntity(entity);

    const count = await jobCollection.countDocuments({ _id });

    if (count) {
      await jobCollection.updateOne(
        { _id, version },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
            version: version + 1,
          },
        }
      );
      return;
    }

    await jobCollection.insertOne({
      _id,
      ...data,
      version,
    });
  },
  async find({
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    let match: Filter<JobSchema> = {};

    if (filter.progress) {
      match = {
        ...match,
        progress: { $regex: `^${filter.progress}`, $options: "i" },
      };
    }
    if (filter.experience) {
      match = {
        ...match,
        experience: { $regex: `^${filter.experience}`, $options: "i" },
      };
    }

    if (filter.startDateBetween) {
      match = {
        ...match,
        startDate: {
          $gte: new Date(filter.startDateBetween[0]),
          $lt: new Date(filter.startDateBetween[1]),
        },
      };
    }

    const jobs = await jobCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
        // {
        //   $unwind: "$freelancerId",
        // },
        {
          $lookup: {
            from: "clients",
            as: "client",
            let: {
              cId: "$clientId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  completedJobs: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "freelancers",
            as: "test",
            let: {
              fId: "$bid.freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $ifNull: ["$$fId", []],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  numberOfReviews: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid: {
              $map: {
                input: "$bid",
                as: "a",
                in: {
                  $mergeObjects: [
                    "$$a",
                    {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$test",
                              cond: {
                                $eq: ["$$a.freelancerId", "$$this._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            test: "$$REMOVE",
          },
        },
      ])
      .toArray();

    const totalElements = await jobCollection.countDocuments(match);

    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: JobMapper.toDomainEntitiesForClient(jobs),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async search({
    pagination,
    filter,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    const jobs = await jobCollection
      .aggregate([
        {
          $match: { $text: { $search: filter.searchItem } },
        },
        {
          $sort: { score: { $meta: "textScore" } },
        },
        {
          $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
      ])
      .toArray();

    const totalElements = await jobCollection.countDocuments();
    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: JobMapper.toDomainEntities(jobs),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async updateProgress(entity: Job.Type): Promise<Job.Type> {
    JobIdProvider.validate(entity.id);
    const { _id, version, ...data } = JobMapper.toOrmEntity(entity);

    const job: any = await jobCollection.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          progress: data.progress,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return JobMapper.toDomainEntity(job.value);
  },
  async updateJob(entity: Job.Type): Promise<Job.Type> {
    JobIdProvider.validate(entity.id);

    const { _id, version, ...data } = JobMapper.toOrmEntity(entity);

    const job: any = await jobCollection.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          title: data.title,
          category: data.category,
          lang: data.lang,
          budget: data.budget,
          duration: data.duration,
          skills: data.skills,
          expiry: data.expiry,
          links: data.links,
          description: data.description,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return JobMapper.toDomainEntity(job.value);
  },
  async deleteForever(id: string): Promise<void> {
    await jobCollection.findOneAndDelete({ _id: from(id) });
  },

  async findBid({ jobId }): Promise<any> {
    const jobs = await jobCollection
      .aggregate([
        {
          $lookup: {
            from: "freelancers",
            as: "test",
            let: {
              fId: "$bid.freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $ifNull: ["$$fId", []],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  numberOfReviews: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid: {
              $map: {
                input: "$bid",
                as: "a",
                in: {
                  $mergeObjects: [
                    "$$a",
                    {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$test",
                              cond: {
                                $eq: ["$$a.freelancerId", "$$this._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            test: "$$REMOVE",
          },
        },
        {
          $match: {
            _id: from(jobId),
          },
        },
      ])
      .toArray();

    return JobMapper.toProposalDomainEntities(jobs);
  },

  async findMilestone({
    jobId,
    pagination,
    filter,
    sort,
    type,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    await jobCollection.findOne({
      _id: from(jobId),
    });
    const milestones = await jobCollection
      .aggregate([
        {
          $match: {
            _id: from(jobId),
          },
        },
        { $unwind: "$milestones" },
        {
          $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
        {
          $group: {
            _id: {},
            milestones: { $push: "$milestones" },
          },
        },
      ])
      .toArray();

    var totalElements = 0;
    console.log("milestone: ", milestones);

    var data: any = [];
    if (milestones.length === 0) {
      data = [];
    } else if (type == "all" && milestones.length > 0) {
      console.log("all");
      milestones[0].milestones.map((milestone) => {
        totalElements++;
        data.push({
          milestoneId: MilestoneIdProvider.create(
            from(milestone.milestoneId).toString()
          ).value,
          name: milestone.name,
          budget: milestone.budget,
          startDate: milestone.startDate,
          endDate: milestone.endDate,
          description: milestone.description,
          state: milestone.state,
          datePaid: milestone.datePaid,
        });
      });
    } else if (type == "completed" && milestones.length > 0) {
      console.log("completed");
      milestones[0].milestones.map((milestone) => {
        if (milestone.state == "Paid") {
          totalElements++;
          data.push({
            milestoneId: MilestoneIdProvider.create(
              from(milestone.milestoneId).toString()
            ).value,
            name: milestone.name,
            budget: milestone.budget,
            startDate: milestone.startDate,
            endDate: milestone.endDate,
            description: milestone.description,
            state: milestone.state,
            datePaid: milestone.datePaid,
          });
        }
      });
    }

    // const totalElements = job!.milestones?.length;

    const totalPages = Math.ceil(totalElements! / pagination.pageSize);
    console.log("data: ", data);
    return {
      data: data,
      page: {
        totalPages,
        totalElements,
        pageSize: pagination.pageSize,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async findForUser({
    userId,
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    let match: Filter<JobSchema> = {};

    match = {
      ...match,
      clientId: from(userId),
    };

    if (filter.progress) {
      match = {
        ...match,
        progress: { $regex: `^${filter.progress}`, $options: "i" },
      };
    }
    if (filter.experience) {
      match = {
        ...match,
        experience: { $regex: `^${filter.experience}`, $options: "i" },
      };
    }

    if (filter.startDateBetween) {
      match = {
        ...match,
        startDate: {
          $gte: new Date(filter.startDateBetween[0]),
          $lt: new Date(filter.startDateBetween[1]),
        },
      };
    }

    const jobs = await jobCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
        // {
        //   $unwind: "$freelancerId",
        // },
        {
          $lookup: {
            from: "freelancers",
            as: "freelancer",
            let: {
              fId: "$freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$fId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const totalElements = await jobCollection.countDocuments(match);

    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: JobMapper.toDomainEntities(jobs),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async getJobForFreelancer(id: string): Promise<Job.Type[]> {
    
    const job = await jobCollection
      .aggregate([
        {
          $match: { _id: from(id) },
        },
        {
          $lookup: {
            from: "clients",
            as: "client",
            let: {
              cId: "$clientId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  completedJobs: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "freelancers",
            as: "test",
            let: {
              fId: "$bid.freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $ifNull: ["$$fId", []],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  numberOfReviews: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid: {
              $map: {
                input: "$bid",
                as: "a",
                in: {
                  $mergeObjects: [
                    "$$a",
                    {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$test",
                              cond: {
                                $eq: ["$$a.freelancerId", "$$this._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            test: "$$REMOVE",
          },
        },
      ])
      .toArray();

      console.log("job for freelancer is: ", job[0].bid);
    if (!job) {
      throw new Error("Job not Found");
    }
    return JobMapper.toDomainEntitiesForClient(job);
  },

  async findForFreelancer({
    userId,
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    let match: Filter<JobSchema> = {};

    match = {
      ...match,
      freelancerId: from(userId),
    };

    if (filter.progress) {
      match = {
        ...match,
        progress: { $regex: `^${filter.progress}`, $options: "i" },
      };
    }
    if (filter.experience) {
      match = {
        ...match,
        experience: { $regex: `^${filter.experience}`, $options: "i" },
      };
    }

    if (filter.startDateBetween) {
      match = {
        ...match,
        startDate: {
          $gte: new Date(filter.startDateBetween[0]),
          $lt: new Date(filter.startDateBetween[1]),
        },
      };
    }

    const jobs = await jobCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
        // {
        //   $unwind: "$freelancerId",
        // },
        {
          $lookup: {
            from: "clients",
            as: "client",
            let: {
              cId: "$clientId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  completedJobs: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "freelancers",
            as: "test",
            let: {
              fId: "$bid.freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $ifNull: ["$$fId", []],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  numberOfReviews: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid: {
              $map: {
                input: "$bid",
                as: "a",
                in: {
                  $mergeObjects: [
                    "$$a",
                    {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$test",
                              cond: {
                                $eq: ["$$a.freelancerId", "$$this._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            test: "$$REMOVE",
          },
        },
      ])
      .toArray();

    const totalElements = await jobCollection.countDocuments(match);

    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: JobMapper.toDomainEntitiesForClient(jobs),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async findBidForFreelancer({
    freelancerId,
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<Job.Type[]>> {
    const jobs = await jobCollection
      .aggregate([
		
        {
          $lookup: {
            from: "clients",
            as: "client",
            let: {
              cId: "$clientId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cId"],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  completedJobs: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "freelancers",
            as: "test",
            let: {
              fId: "$bid.freelancerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $ifNull: ["$$fId", []],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  test: "$test",
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  numberOfReviews: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid: {
              $map: {
                input: "$bid",
                as: "a",
                in: {
                  $mergeObjects: [
                    "$$a",
                    {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$test",
                              cond: {
                                $eq: ["$$a.freelancerId", "$$this._id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            test: "$$REMOVE",
          },
        },
      ])
      .toArray();

    var totalElements = 0;

    var data: any = [];
    // var bid: any = [];
    jobs.map((job) => {
      job.bid.map(function (b) {
        if (
          FreelancerIdProvider.create(from(b.freelancerId).toString()).value ==
          freelancerId
        ) {
          // bid.push(b);
          job.bid = [];
          job.bid.push(b);
          data.push(job);
          totalElements++;
          // return;
        }
      });
    });

    const totalPages = Math.ceil(totalElements! / pagination.pageSize);

    return {
      data: JobMapper.toDomainEntitiesForClient(data),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },
});

export { makeMongoJobRepository };
