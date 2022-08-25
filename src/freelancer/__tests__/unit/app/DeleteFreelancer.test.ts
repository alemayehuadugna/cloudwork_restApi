import {
	DeleteFreelancer,
	makeDeleteFreelancer,
} from "@/freelancer/app/usecases/DeleteFreelancer";
import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { BaseError } from "@/_lib/errors/BaseError";
import { NotFoundError } from "@/_lib/errors/NotFoundError";

describe("DeleteFreelancer", () => {
	const id = "mock-freelancer-id";
	const firstName = "firstName";
	const lastName = "lastName";
	const userName = "username"
	const phone = "phone";
	const email = "email";
	const password = "password";
	const gender = "gender";
	const skills = ["skills"];
	const overview = "overview";
	const hourlyRate = 55.6;
	const expertise = "Frontend Developer";
	const socialLinks = [{ socialMedia: "twitter", link: "url_link" }];
	const address = {
		region: "region",
		city: "city",
		areaName: "areaName",
		postalCode: "postal_code",
	};
	const language = [{ language: "amharic", proficiencyLevel: "high" }];
	const education = [
		{
			institution: "University",
			dateAttended: { start: new Date(), end: new Date() },
			degree: "degree",
			areaOfStudy: "area_of_study",
			description: "description",
		},
	];
	const employments = [
		{
			company: "company",
			city: "city",
			region: "region",
			title: "title",
			period: { from: new Date(), to: new Date() },
			summary: "summary",
		},
	];
	const otherExperience = [
		{ subject: "subject", description: "description" },
	];

	const freelancerRepository: FreelancerRepository = {
		findById: jest.fn().mockImplementation(async (freelancerId) => {
			if (freelancerId !== id) {
				throw NotFoundError.create(freelancerId);
			}

			return Freelancer.create({
				id: { value: id },
				firstName,
				lastName,
				userName,
				phone,
				email,
				password,
				gender,
				skills,
				overview,
				hourlyRate,
				expertise,
				socialLinks,
				address,
				language,
				education,
				employments,
				otherExperience,
			});
		}),
		getNextId: jest.fn(),
		store: jest.fn(),
		findByPhone: jest.fn(),
		find: jest.fn(),
		search: jest.fn(),
		delete: jest.fn(),
	};

	let deleteFreelancer: DeleteFreelancer;

	beforeEach(async () => {
		jest.clearAllMocks();
		deleteFreelancer = makeDeleteFreelancer({ freelancerRepository });
	});

	it("should save the freelancer as deleted", async () => {
		await deleteFreelancer(id);

		expect(freelancerRepository.delete).toHaveBeenCalledWith(id);
	});

	it("should throw error if not found", async () => {
		await expect(deleteFreelancer("some-wrong-id")).rejects.toThrowError(
			BaseError
		);
	});
});
