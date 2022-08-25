import { Router } from "express";
import multer from "multer";
import { addBidHandler } from "./controllers/AddBidHandler";
import { createJobHandler } from "./controllers/CreateJobHandler";
import { deleteBidHandler } from "./controllers/DeleteBidHandler";
import { deleteFilesHandler } from "./controllers/DeleteFilesHandler";
import { deleteJobForeverHandler } from "./controllers/DeleteForeverHandler";
import { deleteJobFilesHandler } from "./controllers/DeleteJobFilesHandler";
import { deleteJobHandler } from "./controllers/DeleteJobHandler";
import { editBidHandler } from "./controllers/EditBidHandler";
import { getJobForEmployees, getJobHandler } from "./controllers/GetJobHandler";
import { hireFreelancerHandler } from "./controllers/HireFreelancerHandler";
import { listBidHandler } from "./controllers/ListBidHandler";
import { listJobHandler } from "./controllers/ListJobsHandler";
import { searchJobHandler } from "./controllers/SearchJobHandler";
import { updateJobHandler } from "./controllers/UpdateJobHandler";
import { updateProgressHandler } from "./controllers/UpdateProgressHandler";
import { uploadFilesHandler } from "./controllers/UploadJobFileHandler";
import { uploadJobFilesHandler } from "./controllers/UploadJobAttachementssHandler";
import { addMilestoneHandler } from "./controllers/AddMilestoneHandler";
import { listMilestoneHandler } from "./controllers/ListMilestoneHandler";
import { payFreelancerHandler } from "./controllers/PayFreelancerHandler";
import { listJobForUserHandler } from "./controllers/ListJobsForUserHandler";
import { getJobForFreelancerHandler } from "./controllers/GetJobForFreelancer";
import { listJobForFreelancerHandler } from "./controllers/ListJobsForFreelancerHandler";
import { listBidForFreelancerHandler } from "./controllers/ListBidForFreelancer";
import { verifyTokenHandler } from '@/auth/interface/controllers/VerifyTokenHandler';


type Dependencies = {
    apiRouter: Router;
};

const makeJobController = ({ apiRouter }: Dependencies) => {
    const router = Router();

    router.post("/jobs", createJobHandler);
    router.get("/jobs", listJobHandler);
    router.patch("/list/bids/freelancer", verifyTokenHandler, listBidForFreelancerHandler);
    router.get("/jobs/user/:userId", listJobForUserHandler);
    router.get("/jobs/freelancer", verifyTokenHandler, listJobForFreelancerHandler);
    router.patch('/update/progress/:jobId', updateProgressHandler);
    router.patch('/update/job/:jobId', updateJobHandler);
    router.delete('/jobs/:jobId', deleteJobHandler);
    router.delete('/jobs/forEver/:jobId', deleteJobForeverHandler);
    router.get("/jobs/:jobId", getJobHandler);
    router.get("/jobs/freelancer/detail/:jobId", getJobForFreelancerHandler);
    router.get("/jobs/employees/:jobId", getJobForEmployees);
    router.get("/jobs/search", searchJobHandler);
    router.patch("/jobs/files/:jobId", multer().array('files', 10), uploadJobFilesHandler);
    router.patch("/jobs/delete/files/:jobId", deleteJobFilesHandler);
    router.patch("/jobs/file/:jobId", multer().single("file"), uploadFilesHandler);
    router.patch("/jobs/delete/file/:jobId", deleteFilesHandler);
    router.patch('/add/bid/:jobId', addBidHandler);
    router.patch('/edit/bid/:jobId', editBidHandler);
    router.patch("/list/bids/:jobId", listBidHandler);
    router.patch('/delete/bid/:jobId', deleteBidHandler);
    router.patch("/jobs/hire/:jobId", hireFreelancerHandler);
    router.patch('/add/milestone/:jobId', addMilestoneHandler);
    router.patch("/list/milestones/:jobId", listMilestoneHandler);
    router.patch("/jobs/payFreelancer/:jobId", payFreelancerHandler);

    apiRouter.use(router);
}

export { makeJobController };

