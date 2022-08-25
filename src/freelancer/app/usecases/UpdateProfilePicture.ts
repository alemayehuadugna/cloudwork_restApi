import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	fileRepository: FileRepository;
};

type UpdateProfileDTO = Readonly<{
	file?: Express.Multer.File;
	id: string;
}>;

type UpdateProfilePicture = ApplicationService<UpdateProfileDTO, string>;

const makeUpdateProfilePicture = ({ freelancerRepository, fileRepository }: Dependencies): UpdateProfilePicture =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);

		const profilePictureUrl = await fileRepository.save({
			file: payload.file,
			userName: freelancer.userName,
			folder: "freelancers"
		});
		let completedPercentage = freelancer.profileCompletedPercentage;

		if (!(!!freelancer.profilePicture) && !!profilePictureUrl)
			completedPercentage += (100 / 13);

		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateProfilePicture(freelancer, profilePictureUrl, completedPercentage);

		await freelancerRepository.store(freelancer);

		return profilePictureUrl;
	}

export { makeUpdateProfilePicture };
export type { UpdateProfilePicture };