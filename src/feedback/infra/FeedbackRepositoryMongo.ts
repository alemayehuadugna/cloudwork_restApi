import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
import { Feedback } from "../domain/Feedback";
import { FeedbackId } from "../domain/FeedbackId";
import {
  FeedbackListItemDTO,
  FeedbackRepository,
} from "../domain/FeedbackRepository";
import { FeedbackCollection, FeedbackSchema } from "./FeedbackCollection";
import { FeedbackIdProvider } from "./FeedbackIdProvider";
import { FeedbackMapper } from "./FeedbackMapper";

type Dependencies = {
  feedbackCollection: FeedbackCollection;
};

const makeMongoFeedbackRepository = ({
  feedbackCollection,
}: Dependencies): FeedbackRepository => ({
  async getNextId(): Promise<FeedbackId> {
    return Promise.resolve(FeedbackIdProvider.create(v4().toString()));
  },

  async findById(id: string): Promise<Feedback.Type> {
    const feedback = await feedbackCollection.findOne({ _id: from(id) });

    if (!feedback) {
      throw new Error("Feedback not found");
    }

    return FeedbackMapper.toDomainEntity(feedback);
  },
  async store(entity: Feedback.Type): Promise<void> {
    FeedbackIdProvider.validate(entity.id);

    const { _id, ...data } = FeedbackMapper.toOrmEntity(entity);

    const count = await feedbackCollection.countDocuments({ _id });

    if (count) {
      await feedbackCollection.updateOne(
        { _id, deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        }
      );

      return;
    }

    await feedbackCollection.insertOne({
      _id,
      ...data,
    });
  },
  async findFeedbacks({
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<FeedbackListItemDTO[]>> {
    let match: Filter<FeedbackSchema> = {
      status: "CREATED",
      deleted: false,
    };

    if (filter.title) {
      match = {
        ...match,
        title: { $regex: `^${filter.title}`, $options: "i" },
      };
    }

    if (filter.firstName) {
      match = {
        ...match,
        firstName: { $regex: `^${filter.firstName}`, $options: "i" },
      };
    }
    const feedbacks = await feedbackCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: (pagination.page-1) * pagination.pageSize,
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
      ])
      .toArray();

    const totalElements = await feedbackCollection.countDocuments(match);
    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: FeedbackMapper.toDomainEntities(feedbacks),
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

export { makeMongoFeedbackRepository };
