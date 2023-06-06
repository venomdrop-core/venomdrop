import { ProviderRpcClient, Transaction } from "everscale-inpage-provider";

export type TransactionWithOutput = { transaction: Transaction; output?: Record<string, unknown> | undefined };
export type TransactionParameter = TransactionWithOutput | { tx: TransactionWithOutput } | Transaction;

export const extractTransactionFromParams = (transaction: TransactionParameter): Transaction => {
  if ("tx" in transaction) {
    return transaction.tx.transaction;
  }
  if ("transaction" in transaction) {
    return transaction.transaction;
  }
  return transaction;
};

export const waitFinalized = async <T extends TransactionParameter>(provider: ProviderRpcClient, transactionProm: Promise<T>): Promise<T> => {
  const transaction = await transactionProm;
  const subscription = new provider.Subscriber();
  return subscription
    .trace(extractTransactionFromParams(transaction))
    .finished()
    .then(subscription.unsubscribe.bind(subscription))
    .then(() => transaction);
};
