import { File, Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";
import { ObjectId } from "mongodb";

type Dependencies = {
    jobRepository: JobRepository;
    fileRepository: FileRepository;
};

type UploadFilesDTO = Readonly<{
    file: Express.Multer.File;
    jobId: string;
    title: string,
    description: string,
    uploader: string,
    size: number,
}>;

type UploadFiles = ApplicationService<UploadFilesDTO, string>;

const makeUploadFiles = 
    ({ jobRepository, fileRepository }: Dependencies): UploadFiles => 
    async (payload) => {
        let job = await jobRepository.findById(payload.jobId);
        
        var uploadFilesUrl = await fileRepository.save({
            file: payload.file, 
            userName: job.id.value,
            folder: "jobFiles"
        });
        let files: File = {
            id: new ObjectId(), 
            title: payload.title, 
            description: payload.description, 
            link: uploadFilesUrl, 
            uploader: payload.uploader, 
            uploadDate: new Date(),                          
            size: payload.size,
        };

        job.files.push(files);

        job = Job.uploadFile(job, job.files);

        await jobRepository.store(job);

        return uploadFilesUrl;
    }

export { makeUploadFiles };
export type { UploadFiles };