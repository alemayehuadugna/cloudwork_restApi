import {
	GetFreelancer,
	makeGetFreelancer,
} from "@/freelancer/app/usecases/GetFreelancer";
import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { BaseError } from "@/_lib/errors/BaseError";
import { NotFoundError } from "@/_lib/errors/NotFoundError";

describe("GetFreelancer", () => {
	beforeEach(async () => {
		jest.clearAllMocks();
		getFreelancer = makeGetFreelancer({ freelancerRepository });
	});

	const id = "mock-freelancer-id";
	const firstName = "firstName";
	const lastName = "lastName";
	const userName = "username";
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
		getNextId: jest.fn().mockReturnValue(Promise.resolve({ value: id })),
		store: jest.fn(),
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
		findByPhone: jest.fn(),
		find: jest.fn(),
		delete: jest.fn(),
		search: jest.fn()
	};

	let getFreelancer: GetFreelancer;

	it("should return the freelancer by the id", async () => {
		const spy = jest.spyOn(global, "Date");
		const result = await getFreelancer(id);
		const date = spy.mock.instances[0];

		expect(result).toEqual({
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
			socialLinks,
			address,
			language,
			education,
			employments,
			otherExperience,
			testimonials: [],
			profilePicture: "profile_image_url",
			completedJobs: 0,
			ongoingJobs: 0,
			cancelledJobs: 0,
			numberOfReviews: 0,
			expertise: 'Frontend Developer',
			verified: false,
			joinedDate: new Date(),
			jobOffers: [],
			roles: ["Freelancer"],
			earning: 0.0,
			rating: {
				skill: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				qualityOfWork: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				availability: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				adherenceToSchedule: {
					rate: 0.0,
					totalRate: 0.0,
					totalRaters: 0,
				},
				communication: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				cooperation: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
			},
			state: "ACTIVE",
			createdAt: date,
			updatedAt: date,
			version: 0,
		});
	});

	it("should throw error if not found", async () => {
		await expect(getFreelancer("some-wrong-id")).rejects.toThrowError(
			BaseError
		);
	});
});
