import { makeIdProvider } from "@/_lib/IdProvider";
import { WalletId } from "../domain/WalletId";

const WalletIdProvider = makeIdProvider<WalletId>('WalletId');

export { WalletIdProvider };