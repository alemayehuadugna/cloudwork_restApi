import { FeedbackFilter, FeedbackListItemDTO, FeedbackRepository } from "@/feedback/domain/FeedbackRepository";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";


type Dependencies = {
    feedbackRepository: FeedbackRepository;
};

// type ListFeedbacks = ApplicationService<PaginatedQuery, PaginatedQueryResult<Feedback.Type[]>>;

type ListFeedbacks = QueryHandler<SortedPaginatedQuery<FeedbackFilter>, PaginatedQueryResult<FeedbackListItemDTO[]>>;

const makeListFeedback = ({feedbackRepository}: Dependencies): ListFeedbacks => async (payload) => {
    const {pagination, sort, filter} = payload;
    
    const result =await feedbackRepository.findFeedbacks({pagination, filter, sort});
    return result;
};

export {makeListFeedback};

export type {ListFeedbacks}