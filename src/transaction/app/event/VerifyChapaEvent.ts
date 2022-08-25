import { Event } from "@/_lib/events/Event";
import { v4 } from "uuid-mongodb";

namespace VerifyChapaEvent {
	export const topic = 'Verify Transaction' as const;
	export const eventType = 'VerifyChapaEvent' as const;

	type Params = {
		userId: string;
		amount: number;
	};

	type VerifyChapaEvent = Event<Params, typeof eventType, typeof topic>;

	export const create = (userId: string, amount: number): VerifyChapaEvent => ({
		eventId: v4().toString(),
		eventType,
		topic,
		payload: { userId, amount }
	});

	export type Type = VerifyChapaEvent;
}

export { VerifyChapaEvent };