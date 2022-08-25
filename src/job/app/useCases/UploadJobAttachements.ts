import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";

type Dependencies = {
  jobRepository: JobRepository;
  fileRepository: FileRepository;
  messageBundle: MessageBundle;
};

type UploadJobFilesDTO = Readonly<{
  files: Express.Multer.File[];
  jobId: string;
}>;

type UploadJobFiles = ApplicationService<UploadJobFilesDTO, string[]>;

const makeUploadJobFiles =
  ({
    jobRepository,
    fileRepository,
    messageBundle: { useBundle },
  }: Dependencies): UploadJobFiles =>
  async (payload) => {
    let job = await jobRepository.findById(payload.jobId);

    if (job != null) {
      var uploadJobFilesUrl = await fileRepository.saveFiles({
        files: payload.files,
        id: job.id.value,
        folder: "jobAttachments",
      });

      uploadJobFilesUrl = uploadJobFilesUrl.concat(job.attachments!);

      job = Job.uploadJobFiles(job, uploadJobFilesUrl);

      await jobRepository.store(job);

      return uploadJobFilesUrl;
    } else {
      throw BusinessError.create(
        useBundle("job.error.noAttachments", { id: payload.jobId })
      );
    }
  };

export { makeUploadJobFiles };
export type { UploadJobFiles };
