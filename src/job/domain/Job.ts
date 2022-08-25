import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from "@/_lib/WithInvariants";
import { ObjectId } from "mongodb";
import { MUUID } from "uuid-mongodb";
import { JobId } from "./JobId";

namespace Job {
  type Job = AggregateRoot<JobId> &
    {
      clientId: string;
      freelancerId?: string;
      title: string;
      description: string;
      budget: number;
      proposals: number;
      expiry?: Date;
      skills?: string[];
      links?: String[];
      experience: string;
      startDate?: Date;
      duration: number;
      qualification?: string;
      category: string;
      language?: string;
      question?: string;
      files: File[];
      milestones?: Milestone[];
      attachments?: string[];
      bid: Bid[];
      progress: "COMPLETED" | "ACTIVE" | "INACTIVE" | "DELETED" | "CANCELLED";
      createdAt: Date;
      updatedAt: Date;
      version: number;
    };

  const withInvariants = makeWithInvariants<Job>(function (self, assert) {
    assert(self.title?.length > 0);
    assert(self.description?.length > 0);
    assert(self.category?.length > 0);
  });
  type JobProps = Readonly<{
    id: JobId;
    clientId: string;
    title: string;
    category: string;
    language?: string;
    budget: number; 
    duration: number;
    expiry?: Date;
    links?: String[];
    description: string;
    skills?: string[];
  }>;

  export const create = function (props: JobProps): Job {
    return {
      ...props,
      experience: '',
      qualification: undefined, 
      question: undefined,
      freelancerId: undefined,
      proposals: 0.0,
      progress: "INACTIVE",
      files: [],
      milestones: [],
      attachments: [],
      bid: [],
      startDate: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    };
  };

  export const updateProgressState = withInvariants(function (
    self: Job,
    progress
  ): Job {
    return {
      ...self,
      progress: progress,
    };
  });

  export const updateFreelancerIdAndBid = withInvariants(function (
    self: Job,
    freelancerId, 
    bid, 
    proposals
  ): Job {
    return {
      ...self,
      freelancerId: freelancerId,
      bid: bid, 
      proposals: 0
    };
  });

  export const updateJobData = withInvariants(function (self: Job, data): Job {
    return {
      ...self,
      ...data,
    };
  });

  export const addBid = withInvariants(function (
    self: Job, 
    data, 
    proposals,
  ): Job {
    return {
      ...self,
      bid: data,
      proposals: proposals,
    };
  });

  export const markAsDeleted = withInvariants(function (self: Job): Job {
    return {
      ...self,
      progress: "DELETED",
    };
  });

  export const deleteJobFiles = withInvariants(function (
    self: Job,
    newFiles: string[]
  ): Job {
    return {
      ...self,
      attachments: newFiles,
    };
  });

  export const deleteFiles = withInvariants(function (
    self: Job,
    newFiles: File[]
  ): Job {
    return {
      ...self,
      files: newFiles,
    };
  });

  export const uploadJobFiles = withInvariants(function (
    self: Job,
    newAttachments: string[]
  ): Job {
    return {
      ...self,
      attachments: newAttachments,
    };
  });

  export const uploadFile = withInvariants(function (
    self: Job,
    files: File[]
  ): Job {
    return {
      ...self,
      files: files,
    };
  });

  export const hireFreelancer = withInvariants(function (
    self: Job, 
    freelancerId: string, 
    startDate: Date,
  ): Job {
    return {
      ...self, 
      freelancerId: freelancerId, 
      startDate: startDate, 
      progress: 'ACTIVE',
    }
  });

  export const addMilestone = withInvariants(function (
    self: Job, 
    data, 
  ): Job {
    return {
      ...self,
      milestones: data
    };
  });

  export const updateBudget = withInvariants(function (
    self: Job, 
    budget, 
  ): Job {
    return {
      ...self,
      budget: budget,
    };
  });

  export const updateMilestone = withInvariants(function (self: Job, milestone): Job {
    return {
      ...self,
      milestones: milestone,
    };
  });

  export type Type = Job;
}

type File = {
  id: ObjectId;
  title: string;
  description: string;
  link: string;
  uploader: string;
  uploadDate: Date;
  size: number;
};

type Milestone = {
  milestoneId: string; 
  name: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  description: string;
  state: string;
  datePaid: Date;
};

type Bid = {
  freelancerId: string;
  budget: number;
  hours: number;
  coverLetter: string;
  isTermsAndConditionAgreed: boolean;
  createdAt: Date;
};

export { Job };
export type { Milestone, File, Bid };
