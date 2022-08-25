import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Feedback } from "./Feedback";
import { FeedbackId } from "./FeedbackId";

type FeedbackListItemDTO = Readonly<{
  id: FeedbackId;
  firstName: string;
  lastName: string;
  message: string;
  title: string;
}>;

type FeedbackFilter = {
    title?: string;
    firstName?: string
};

type FeedbackRepository = Repository<Feedback.Type> & {
  
  findById(id: string): Promise<Feedback.Type>;
  findFeedbacks({pagination, filter, sort}): Promise<PaginatedQueryResult<FeedbackListItemDTO[]>>;
};

export { FeedbackRepository};

export type {FeedbackListItemDTO, FeedbackFilter}
