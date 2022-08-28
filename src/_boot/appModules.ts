import { authModule, AuthRegistry } from "@/auth";
import { AuthMessages } from "@/auth/messages";
import { feedbackModule, FeedbackRegistry } from "@/feedback";
import { FeedbackMessages } from "@/feedback/messages";
import { employeeModule, EmployeeRegistry } from "@/employee";
import { EmployeeMessages } from "@/employee/messages";
import { FreelancerMessages } from "@/freelancer/messages";
import { freelancerModule, FreelancerRegistry } from "@/freelancer";
import { jobModule, JobRegistry } from "@/job";
import { ClientMessages } from "@/client/messages";
import { clientModule, ClientRegistry } from "@/client";
import { fileModule, FileRegistry } from "@/_sharedKernel";
import { FileMessages } from "@/_sharedKernel/fileMessages";
import { categoryModule, CategoryRegistry } from "@/Category";
import { CategoryMessages } from "@/Category/message";
import { JobMessages } from "@/job/message";
import { TransactionMessages } from "@/transaction/messages";
import { WalletMessages } from "@/wallet/messages";
import { transactionModule, TransactionRegistry } from "@/transaction";
import { walletModule, WalletRegistry } from "@/wallet";
import { ReviewMessages } from "@/review/messages";
import { reviewModule, ReviewRegistry } from "@/review";
import { countModule, CountRegistry } from "@/count";
import { CountMessages } from "@/count/messages";
import { milestoneModule, MilestoneRegistry } from "@/milestone";
import { MilestoneMessages } from "@/milestone/messages";


type AppModuleMessages =
	AuthMessages &
	FileMessages &
	FeedbackMessages &
	EmployeeMessages &
	CountMessages &	
	FreelancerMessages &
	JobMessages &
	FreelancerMessages &
	ClientMessages &
	CategoryMessages &
	WalletMessages &
	TransactionMessages &
	ClientMessages &
	ReviewMessages &
	MilestoneMessages;

type AppModuleConfig = {};

const appModules = [
	authModule,
	fileModule,
	freelancerModule,
	feedbackModule,
	employeeModule,
	reviewModule,
	jobModule,
	clientModule,
	categoryModule,
	walletModule,
	transactionModule,
	clientModule,
	countModule,
	milestoneModule
];

type AppModulesRegistry =
	AuthRegistry &
	FileRegistry &
	FeedbackRegistry &
	EmployeeRegistry &
	ReviewRegistry &
	FreelancerRegistry &
	JobRegistry &
	ClientRegistry &
	CategoryRegistry &
	WalletRegistry &
	TransactionRegistry &
	ClientRegistry &
	CountRegistry &
	MilestoneRegistry;


export { appModules };
export type { AppModuleMessages, AppModuleConfig, AppModulesRegistry };
