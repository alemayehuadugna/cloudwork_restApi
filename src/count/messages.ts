import { messageSource } from "@/_lib/message/MessageBundle";

type CountMessages = {
	task: {
		error: {
			notFound: { id: string };
			alreadyExists: { id: string };
		};
		created: { id: string };
	};
};

const countMessages = messageSource<CountMessages>({
	task: {
		error: {
			alreadyExists:
				"Can't recreate the task #({{ id }}) because it was already created.",
			notFound: "Can't find task #({{ id }})",
		},
		created: "Task created with id #({{ id }})",
	},
});

export { countMessages };
export type { CountMessages };