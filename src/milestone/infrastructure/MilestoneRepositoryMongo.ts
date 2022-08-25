import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
import { Milestone } from "../domain/Milestone";
import { MilestoneId } from "../domain/MilestoneId";
import {
  MilestoneListItemDTO,
  MilestoneRepository,
} from "../domain/MilestoneRepository";
import { MilestoneCollection, MilestoneSchema } from "./MilestoneCollection";
import { MilestoneIdProvider } from "./MilestoneIdProvider";
import { MilestoneMapper } from "./MilestoneMapper";

type Dependencies = {
  milestoneCollection: MilestoneCollection;
};

const makeMongoMilestoneRepository = ({
  milestoneCollection,
}: Dependencies): MilestoneRepository => ({
  async getNextId(): Promise<MilestoneId> {
    return Promise.resolve(MilestoneIdProvider.create(v4().toString()));
  },
  async findById(id: string): Promise<Milestone.Type> {
    const milestone = await milestoneCollection.findOne({ _id: from(id) });

    if (!milestone) {
      throw new Error("Milestone not found");
    }

    return MilestoneMapper.toDomainEntity(milestone);
  },
 
  async store(entity: Milestone.Type): Promise<void> {
    MilestoneIdProvider.validate(entity.id);

    const { _id, ...data } = MilestoneMapper.toOrmEntity(entity);

    const count = await milestoneCollection.countDocuments({ _id });

    if (count) {
      await milestoneCollection.updateOne(
        { _id,  deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
            
          },
        }
      );

      return;
    }

    await milestoneCollection.insertOne({
      _id,
      ...data,
      
    });
  },
  async findMilestones({
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<MilestoneListItemDTO[]>> {
    let match: Filter<MilestoneSchema> = {
      deleted: false,
    };

    if (filter.Name) {
      match = {
        ...match,
        Name: { $regex: `^${filter.Name}`, $options: "i" },
      };
    }

    const milestones = await milestoneCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(1 - pagination.page, 0) * pagination.pageSize,
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
          $lookup: {
            from: "comment",
            as: "comments",
            let: { articleId: "$_id" },
            pipeline: [
              {
                $match: {
                  deleted: false,
                  $expr: { $eq: ["$articleId", "$$articleId"] },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const totalElements = await milestoneCollection.countDocuments(match);

    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: MilestoneMapper.toDomainEntities(milestones),
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
  async updateMilestone(entity: Milestone.Type): Promise<Milestone.Type> {
    MilestoneIdProvider.validate(entity.id);

    const { _id, ...data } = MilestoneMapper.toOrmEntity(entity);

    const milestone: any = await milestoneCollection.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          Name: data.Name,
          Budget: data.Budget,
          Paid: data.Paid,
          StartDate: data.StartDate,
		  EndDate: data.EndDate,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return MilestoneMapper.toDomainEntity(milestone.value);
  },
  async searchMilestone({pagination, filter}): Promise<PaginatedQueryResult<MilestoneListItemDTO[]>> {
    // creating index
    let check = 0;
    if(check == 0) {
      milestoneCollection.createIndex( {firstName: "text", lastName: "text" });
      check++;
    }
    console.log("in repo: ", filter.searchItem);

    // find searched item
    const milestones = await milestoneCollection
      .aggregate([
        {
          $match: { $text: { $search: filter.searchItem}}
        },
        {
          $sort: { score: { $meta: "textScore"}}
        },
				{
					$skip:
						Math.max(1 - pagination.page, 0) * pagination.pageSize,
				},
				{
					$limit: pagination.pageSize,
				},
      ]).toArray();

      const totalElements = await milestoneCollection.countDocuments();
      const totalPages = Math.ceil(totalElements / pagination.pageSize);

      return {
        data: MilestoneMapper.toDomainEntities(milestones),
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

export { makeMongoMilestoneRepository };
