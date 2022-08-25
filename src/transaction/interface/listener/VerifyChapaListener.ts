import { Logger } from 'pino';
import { MessageBundle } from '@/messages';
import { eventConsumer } from '@/_lib/pubSub/EventEmitterConsumer';
import { VerifyChapaEvent } from '@/transaction/app/event/VerifyChapaEvent';
import { Socket } from 'socket.io-client';

type Dependencies = {
	logger: Logger;
	messageBundle: MessageBundle;
	socket: Socket;
};

const makeVerifyChapaListener = eventConsumer<VerifyChapaEvent.Type, Dependencies>(
	VerifyChapaEvent,
	({ logger, messageBundle: { getMessage, useBundle }, socket }) =>
		async (event) => {
			socket.emit('send-notification',
				{
					'userId': event.payload.userId,
					'title': 'Chapa',
					'message': `${event.payload.amount} Birr has been deposited to your wallet.`
				},
				(res) =>  {
					logger.info("chapa deposit notification sent to userId: " + event.payload.userId);
				}
			)

		}
)

export { makeVerifyChapaListener };