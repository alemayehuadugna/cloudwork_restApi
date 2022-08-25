import { AggregateId } from "@/_lib/DDD";

type IdProvider<T extends AggregateId<N>, N = T["value"]> = {
	create(id: N): T;
	ensure(id: T): id is T;
	validate(id: T): void;
};

const makeIdProvider = function <T extends AggregateId<N>, N = T["value"]>(idName: string): IdProvider<T, N> {
	const key = Symbol();

	return {
		create: function (id: N): T {
			return ({
				value: id,
				[key]: true,
			} as unknown as T);
		},
		ensure: function (id: T | any): id is T {
			return Boolean(id[key]);
		},
		validate: function (id: T) {
			if (!id[key]) {
				throw new TypeError(`${id.value} is not a valid ${idName}`);
			}
		},
	};
};

export { makeIdProvider };
export type { IdProvider };
