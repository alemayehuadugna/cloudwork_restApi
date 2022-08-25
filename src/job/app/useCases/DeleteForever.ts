import { JobRepository } from "@/job/domain/JobRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    jobRepository: JobRepository;
};

type DeleteJobForever = ApplicationService<string, void>;

const makeDeleteJobForever = 
    ({ jobRepository }: Dependencies): DeleteJobForever =>
        async (payload: string) => {
            let job = await jobRepository.findById(payload);

            await jobRepository.deleteForever(job.id.value);
        };
export { makeDeleteJobForever };
export type { DeleteJobForever };