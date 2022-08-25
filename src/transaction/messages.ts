import { messageSource } from "@/_lib/message/MessageBundle";

type TransactionMessages = {
	transaction: {
		error: {
			notFound: { id: string };
			alreadyExists: { id: string };
			alreadyCompleted: { id: string };
			alreadyOnHold: { id: string };
			alreadyCancelled: { id: string };
		},
		created: { id: string };
		completed: { id: string; completedAt: Date };
		cancelled: { id: string; cancelledAt: Date };
	}
}

const transactionMessages = messageSource<TransactionMessages>({
	transaction: {
		error: {
			notFound: "Can't find transaction by id: #({{ id }})",
			alreadyExists: "Can't recreate the transaction #({{ id }}) because it was already created.",
			alreadyCompleted: "Can't complete the transaction #({{ id }}) because it was already completed.",
			alreadyOnHold: "Can't hold transaction #({{ id }}) because it was already on hold.",
			alreadyCancelled: "Can't cancel transaction #({{ id }}) because it was already cancelled."
		},
		created: "Transaction created with id #({{ id }})",
		completed: "Completed transaction #({{ id }}) at {{ completedAt.toISOString()}} ",
		cancelled: "Cancelled Transaction #({{ id }}) at {{ cancelledAt.toISOString()}} "
	},

});

export { transactionMessages };
export type { TransactionMessages };