import { messageSource } from "@/_lib/message/MessageBundle";

type ReviewMessages = {
	review: {
		error: {
			alreadyWritten: { id: string };
		}
	}
}

const reviewMessages = messageSource<ReviewMessages>({
	review: {
		error: {
			alreadyWritten: 'You Already have written review for this job',
		}
	}
})

export { reviewMessages };
export type { ReviewMessages };