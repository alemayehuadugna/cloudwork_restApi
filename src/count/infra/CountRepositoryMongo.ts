import { ClientCollection } from "@/client/infra/ClientCollection";
import { FreelancerCollection } from "@/freelancer/infra/FreelancerCollection";
import { JobCollection } from "@/job/infra/JobCollection";
import { WalletCollection } from "@/wallet/infra/WalletCollection";
import { Count } from "../domain/Count";
import { CountRepository } from "../domain/CountRepository";

type Dependencies = {
	freelancerCollection: FreelancerCollection;
	clientCollection: ClientCollection;
	jobCollection: JobCollection;
	walletCollection: WalletCollection;
};

const makeMongoCountRepository = ({
	jobCollection, clientCollection, freelancerCollection, walletCollection
}: Dependencies): CountRepository => ({
	async getAllCounts(): Promise<Count.Type> {
		const walletResult = await walletCollection.aggregate([
			{
				$group: {
					_id: null,
					balance: {
						$sum: "$balance"
					},
					invested: {
						$sum: "$invested"
					},
					inTransaction: {
						$sum: "$inTransaction"
					}
				}
			}
		]).toArray();

		// console.log("walletResult: ", walletResult[0]);
		let totalBalance = walletResult[0].balance;
		let totalInvested = walletResult[0].invested;
		let totalInTransaction = walletResult[0].inTransaction;

		const completedJobs = await jobCollection.countDocuments({ progress: 'COMPLETED' });
		const activeJobs = await jobCollection.countDocuments({ progress: 'ACTIVE' });
		const totalFreelancers = await freelancerCollection.countDocuments();
		const totalClients = await clientCollection.countDocuments();


		return {
			totalBalance: totalBalance,
			totalInvestmentBalance: totalInvested,
			totalTransactionBalance: totalInTransaction,
			totalUsers: totalFreelancers + totalClients,
			completedJobs: completedJobs,
			activeJobs: activeJobs,
		}
	},
});

export { makeMongoCountRepository };
