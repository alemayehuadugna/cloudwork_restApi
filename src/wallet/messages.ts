import { messageSource } from "@/_lib/message/MessageBundle";

type WalletMessages = {
	wallet: {
		error: {
			notFound: { id: string };
			insufficientBalance;
		}
	}
}

const walletMessages = messageSource<WalletMessages>({
	wallet: {
		error: {
			notFound: "Can't find wallet by your id: #({{ id }})",
			insufficientBalance: "Can't process transaction your balance is insufficient",
		},

	}
})

export { walletMessages };
export type { WalletMessages };