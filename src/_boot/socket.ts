import { makeModule } from "@/context";
import { asValue } from "awilix";
import { io, Socket } from "socket.io-client";

type SocketConfig = {
	socket: {
		uri: string;
		id: string;
	}
}

const socket = makeModule(
	'socket',
	async ({ 
		container: { register }, 
		app: { onReady },  
		config: { socket } ,
		logger,
	}) => {
		const client = io(socket.uri, { auth: { userId: socket.id } });

		onReady(async () => {
			await client.on("connect", () => {
				logger.info(
					`Socket Connection Ready with Id: ${client.id}`
				);
			});
		});

		register({
			socket: asValue(client),
		});

		return async () => {
			client.on("disconnect", () => {
				console.log(client.id);
			});
		}
	}
);

type SocketRegistry = {
	socket: Socket;
}

export { socket };
export type { SocketConfig, SocketRegistry };