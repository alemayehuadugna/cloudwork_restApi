import { messageSource } from "@/_lib/message/MessageBundle";

type ClientMessages = {
    client: {
		error: {
			notFound: { id: string };
			alreadyExists: { id: string };
			wrongPassword;
		};
		created: { id: string };
	};
};

const clientMessages = messageSource<ClientMessages>({
    client: {
        error: {
			alreadyExists:
				"can't recreate the client #({{ id }}) because it was already created.",
			notFound: "Can't find Client #({{ id }})",
			wrongPassword: "You have submitted incorrect password",
		},
		created: "Client created with id #({{ id }})",
    }
});

export {clientMessages};

export type {ClientMessages}