import { makeModule } from "@/context";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { asFunction } from "awilix";
import { AddBid, makeAddBid } from "./app/useCases/AddBid";
import { CreateJob, makeCreateJob } from "./app/useCases/CreateJob";
import { DeleteBid, makeDeleteBid } from "./app/useCases/DeleteBid";
import { DeleteFiles, makeDeletedFiles } from "./app/useCases/DeleteFiles";
import { DeleteJobForever, makeDeleteJobForever } from "./app/useCases/DeleteForever";
import { DeleteJob, makeDeleteJob } from "./app/useCases/DeleteJob";
import { DeleteJobFiles, makeDeletedJobFiles } from "./app/useCases/DeleteJobFiles";
import { EditBid, makeEditBid } from "./app/useCases/EditBid";
import { GetJob, makeGetJob } from "./app/useCases/GetJob";
import { HireFreelancer, makeHireFreelancer } from "./app/useCases/HireFreelancer";
import { ListBid, makeListBid } from "./app/useCases/ListBid";
import { ListJob, makeListJob } from "./app/useCases/ListJob";
import { makeSearchJob, SearchJob } from "./app/useCases/SearchJob";
import { makeUpdateJob, UpdateJob } from "./app/useCases/UpdateJob";
import { makeUpdateProgress, UpdateProgress } from "./app/useCases/UpdateProgress";
import { makeUploadFiles, UploadFiles } from "./app/useCases/UploadJobFile";
import { makeUploadJobFiles, UploadJobFiles } from "./app/useCases/UploadJobAttachements";
import { JobRepository } from "./domain/JobRepository";
import { initJobCollection, JobCollection } from "./infra/JobCollection"
import { makeMongoJobRepository } from "./infra/JobRepositoryMongo";
import { makeJobController } from "./interface/router";
import { jobMessages } from "./message";
import { AddMilestone, makeAddMilestone } from "./app/useCases/AddMilestone";
import { ListMilestone, makeListMilestone } from "./app/useCases/ListMilestones";
import { makePayFreelancer, PayFreelancer } from "./app/useCases/PayFreelancer";
import { ListJobForUser, makeListJobForUser } from "./app/useCases/ListJobsForUser";
import { GetJobForFreelancer, makeGetJobForFreelancer } from "./app/useCases/GetJobForFreelancer";
import { ListJobForFreelancer, makeListJobForFreelancer } from "./app/useCases/ListJobsForFreelancer";
import { ListBidForFreelancer, makeListBidForFreelancer } from "./app/useCases/ListBidForFreelancer";

type JobRegistry = {
    jobCollection: JobCollection;
    jobRepository: JobRepository;
    createJob: CreateJob;
    listJob: ListJob;
    updateProgress: UpdateProgress;
    updateJob: UpdateJob;
    deleteJob: DeleteJob;
    deleteJobForever: DeleteJobForever;
    getJob: GetJob;
    searchJob: SearchJob;
    uploadJobFiles: UploadJobFiles;
    deletedJobFiles: DeleteJobFiles;
    uploadFiles: UploadFiles;
    deletedFiles: DeleteFiles;
    addBid: AddBid;
    editBid: EditBid;
    listBid: ListBid;
    deleteBid: DeleteBid;
    hireFreelancer: HireFreelancer;
    addMilestone: AddMilestone;
    listMilestone: ListMilestone;
    payFreelancer: PayFreelancer;
    listJobForUser: ListJobForUser;
    getJobForFreelancer: GetJobForFreelancer;
    listJobForFreelancer: ListJobForFreelancer;
    listBidForFreelancer: ListBidForFreelancer;
};

const jobModule = makeModule(
    "job",
    async ({
        container: { register, build },
        messageBundle: { updateBundle },
    }) => {
        const collections = await build(
            withMongoProvider({
                jobCollection: initJobCollection,
            })
        );

        updateBundle(jobMessages);

        register({
            ...toContainerValues(collections),
            jobRepository: asFunction(makeMongoJobRepository),
            createJob: asFunction(makeCreateJob),
            listJob: asFunction(makeListJob),
            updateProgress: asFunction(makeUpdateProgress),
            updateJob: asFunction(makeUpdateJob),
            deleteJob: asFunction(makeDeleteJob),
            deleteJobForever: asFunction(makeDeleteJobForever),
            getJob: asFunction(makeGetJob),
            searchJob: asFunction(makeSearchJob),
            uploadJobFiles: asFunction(makeUploadJobFiles),
            deletedJobFiles: asFunction(makeDeletedJobFiles),
            uploadFiles:  asFunction(makeUploadFiles),
            deletedFiles: asFunction(makeDeletedFiles),
            addBid: asFunction(makeAddBid),
            editBid: asFunction(makeEditBid),
            listBid: asFunction(makeListBid),
            deleteBid: asFunction(makeDeleteBid),
            hireFreelancer: asFunction(makeHireFreelancer),
            addMilestone: asFunction(makeAddMilestone),
            listMilestone: asFunction(makeListMilestone), 
            payFreelancer: asFunction(makePayFreelancer), 
            listJobForUser: asFunction(makeListJobForUser),
            listJobForFreelancer: asFunction(makeListJobForFreelancer),
            getJobForFreelancer: asFunction(makeGetJobForFreelancer),
            listBidForFreelancer: asFunction(makeListBidForFreelancer),
        });

        build(makeJobController);
    }
);

export { jobModule };
export type { JobRegistry };