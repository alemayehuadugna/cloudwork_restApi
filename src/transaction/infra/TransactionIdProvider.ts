import { makeIdProvider } from "@/_lib/IdProvider";
import { TransactionId } from "../domain/TransactionId";

const TransactionIdProvider = makeIdProvider<TransactionId>('TransactionId');

export { TransactionIdProvider };