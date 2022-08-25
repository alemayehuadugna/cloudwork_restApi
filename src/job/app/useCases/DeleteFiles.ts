import { File, Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";
type Dependencies = {
  jobRepository: JobRepository;
  fileRepository: FileRepository;
};

type DeleteFilesDTO = Readonly<{
  file: string;
  fileId: string;
  jobId: string;
}>;

type DeleteFiles = ApplicationService<DeleteFilesDTO, void>;

const makeDeletedFiles =
  ({ jobRepository, fileRepository }: Dependencies): DeleteFiles =>
  async (payload) => {
    let job = await jobRepository.findById(payload.jobId);

    var files: File[] = [];

    job.files.forEach((file, index) => {
      if (!file.id.equals(payload.fileId)) {
        files.push(file);
      } 
    });

    job = Job.deleteFiles(job, files);

    await fileRepository.deleteFile({
        file: payload.file, 
        id: job.id.value, 
        folder: 'jobFiles'
    })

    await jobRepository.store(job);
  };

export { makeDeletedFiles };
export type { DeleteFiles };
