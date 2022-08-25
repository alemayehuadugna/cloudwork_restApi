import { AggregateRoot } from "@/_lib/DDD";
import { WalletId } from "./WalletId";
import { makeWithInvariants } from '@/_lib/WithInvariants';

namespace Wallet {
	type Wallet = AggregateRoot<WalletId> & Readonly<{
		userId: string;
		balance: number;
		invested: number;
		inTransaction: number;
		createdAt: Date;
		updatedAt: Date;
		version: number;
	}>;

	type WalletProps = Readonly<{
		id: WalletId;
		userId: string;
	}>;

	export const create = (props: WalletProps): Wallet => ({
		...props,
		balance: 0,
		invested: 0,
		inTransaction: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		version: 0
	});

	const withInvariants = makeWithInvariants<Wallet>(function (self, assert) {
		assert(self.balance >= 0);
		assert(self.invested >= 0);
		assert(self.userId?.length > 0);
	});

	export const deposit = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			balance: self.balance + amount
		}
	});

	export const withdraw = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			balance: self.balance - amount,
			inTransaction: self.inTransaction + amount,
		}
	});

	export const completeWithdraw = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			inTransaction: self.inTransaction - amount
		}
	})

	export const cancelWithdraw = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			inTransaction: self.inTransaction - amount,
			balance: self.balance + amount
		}
	})

	export const invest = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			balance: self.balance - amount,
			invested: self.invested + amount
		}
	});

	export const deductInvestment = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			invested: self.invested - amount
		}
	});

	export const cancelInvestment = withInvariants(function (self: Wallet, amount: number): Wallet {
		return {
			...self,
			balance: self.balance + amount,
			invested: self.invested - amount,
		}
	});

	export type Type = Wallet;
}

export { Wallet };