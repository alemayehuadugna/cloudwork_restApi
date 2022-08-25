import { Repository } from "@/_lib/DDD";
import { Wallet } from "./Wallet";
import { WalletId } from "./WalletId";

type WalletRepository = Repository<Wallet.Type> & {
	findById(id: string): Promise<Wallet.Type>;
	findByUserId(userId: string): Promise<Wallet.Type>;
}