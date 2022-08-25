
namespace Count {

	type Count =
		Readonly<{
			totalUsers: number;
			completedJobs: number;
			activeJobs: number;
			totalBalance: number;
			totalInvestmentBalance: number;
			totalTransactionBalance: number;
		}>;

	export type Type = Count;
}

export { Count };