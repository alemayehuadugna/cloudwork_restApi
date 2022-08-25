import { initWalletCollection, WalletCollection } from "./infra/WalletCollection"
import { WalletRepository } from '@/wallet/domain/WalletRepository';
import { withMongoProvider } from "@/_lib/MongoProvider";
import { walletMessages } from "./messages";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { asFunction } from "awilix";
import { makeMongoWalletRepository } from "./infra/MongoWalletRepository";
import { makeModule } from "@/context";
import { GetUserWallet, makeGetUserWallet } from "./app/usecases/GetUserWallet";
import { makeWalletController } from "./interface/router";

type WalletRegistry = {
	walletCollection: WalletCollection;
	walletRepository: WalletRepository;
	getUserWallet: GetUserWallet;
}

const walletModule = makeModule(
	'wallet',
	async ({
		container: { register, build},
		messageBundle: { updateBundle },
	}) => {
		const collections = await build(
			withMongoProvider({
				walletCollection: initWalletCollection,
			})
		);

		
		

		updateBundle(walletMessages);

		register({
			...toContainerValues(collections),
			walletRepository: asFunction(makeMongoWalletRepository),
			getUserWallet: asFunction(makeGetUserWallet),
		});

		build(makeWalletController);
	}
)

export { walletModule };
export type { WalletRegistry };