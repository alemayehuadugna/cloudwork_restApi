import { messageSource } from "@/_lib/message/MessageBundle";

type MilestoneMessages = {
	milestone: {
		error: {
			notFound: { id: string };
			alreadyExists: { id: string };
		};
		created: { id: string };
	};
};

const milestoneMessages = messageSource<MilestoneMessages>({
	milestone: {
		error: {
			alreadyExists:
				"Can't recreate the milestone #({{ id }}) because it was already created.",
			notFound: "Can't find milestone #({{ id }})",
		},
		created: "Milestone created with id #({{ id }})",
	},
});

export { milestoneMessages };
export type { MilestoneMessages };