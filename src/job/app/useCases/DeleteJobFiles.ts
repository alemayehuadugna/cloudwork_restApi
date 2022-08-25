import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";

type Dependencies = {
  jobRepository: JobRepository;
  fileRepository: FileRepository;
};

type DeleteJobFilesDTO = Readonly<{
  file: string;
  jobId: string;
}>;

type DeleteJobFiles = ApplicationService<DeleteJobFilesDTO, void>;

const makeDeletedJobFiles =
  ({ jobRepository, fileRepository }: Dependencies): DeleteJobFiles =>
  async (payload) => {
    let job = await jobRepository.findById(payload.jobId);

    var uploadedJobFiles: string[] = [];

    job.attachments?.forEach((attachment, index) => {
      if(attachment != payload.file) {
        uploadedJobFiles.push(attachment);
    }
    });

    job = Job.deleteJobFiles(job, uploadedJobFiles);

    await fileRepository.deleteFile({
        file: payload.file, 
        id: job.id.value,
        folder: 'jobAttachments'
    });
    await jobRepository.store(job);
  };

export { makeDeletedJobFiles };
export type { DeleteJobFiles };
