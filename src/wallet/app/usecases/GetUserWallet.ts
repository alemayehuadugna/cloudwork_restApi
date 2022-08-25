import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
	walletRepository: WalletRepository;
};

type GetUserWallet = ApplicationService<string, Wallet.Type>;

const makeGetUserWallet = ({ walletRepository }: Dependencies): GetUserWallet =>
	async (payload: string) => {
		return await walletRepository.findByUserId(payload);
	}

export { makeGetUserWallet };
export type { GetUserWallet };