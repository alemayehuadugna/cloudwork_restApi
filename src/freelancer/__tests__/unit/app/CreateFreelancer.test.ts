// import {
// 	CreateFreelancer,
// 	makeCreateFreelancer,
// } from "@/freelancer/app/usecases/CreateFreelancer";
// import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";

// describe("CreateFreelancer", () => {
// 	const id = "mock-freelancer-id";
// 	const firstName = "firstName";
// 	const lastName = "lastName";
// 	const phone = "phone";
// 	const email = "email";
// 	const password = "password";
// 	const gender = "gender";
// 	const skills = ["skills"];
// 	const overview = "overview";
// 	const hourlyRate = 55.6;
// 	const expertise = "Frontend Developer";
// 	const socialLinks = [{ socialMedia: "twitter", link: "url_link" }];
// 	const address = {
// 		region: "region",
// 		city: "city",
// 		areaName: "areaName",
// 		postalCode: "postal_code",
// 	};
// 	const language = [{ language: "amharic", proficiencyLevel: "high" }];
// 	const education = [
// 		{
// 			institution: "University",
// 			dateAttended: { start: new Date(), end: new Date() },
// 			degree: "degree",
// 			areaOfStudy: "area_of_study",
// 			description: "description",
// 		},
// 	];
// 	const employments = [
// 		{
// 			company: "company",
// 			city: "city",
// 			region: "region",
// 			title: "title",
// 			period: { from: new Date(), to: new Date() },
// 			summary: "summary",
// 		},
// 	];
// 	const otherExperience = [
// 		{ subject: "subject", description: "description" },
// 	];

// 	const freelancerRepository: FreelancerRepository = {
// 		getNextId: jest.fn().mockReturnValue(Promise.resolve({ value: id })),
// 		store: jest.fn(),
// 		findById: jest.fn(),
// 		findByPhone: jest.fn(),
// 		find: jest.fn(),
// 		search: jest.fn(),
// 		delete: jest.fn()
// 	};

// 	let createFreelancer: CreateFreelancer;

// 	beforeEach(async () => {
// 		jest.clearAllMocks();
// 		createFreelancer = makeCreateFreelancer({ freelancerRepository });
// 	});

// 	it("should return the created id", async () => {
// 		const result = await createFreelancer({
// 			firstName,
// 			lastName,
// 			phone,
// 			email,
// 			password,
// 			gender,
// 			skills,
// 			overview,
// 			hourlyRate,
// 			expertise,
// 			socialLinks,
// 			address,
// 			language,
// 			education,
// 			employments,
// 			otherExperience,
// 		});
// 		expect(result).toBe(id);
// 	});

// 	it("should store the article", async () => {
// 		await createFreelancer({
// 			firstName,
// 			lastName,
// 			phone,
// 			email,
// 			password,
// 			gender,
// 			skills,
// 			overview,
// 			hourlyRate,
// 			expertise,
// 			socialLinks,
// 			address,
// 			language,
// 			education,
// 			employments,
// 			otherExperience,
// 		});

// 		expect(freelancerRepository.store).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				id: { value: id },
// 				firstName,
// 				lastName,
// 				phone,
// 				email,
// 				password,
// 				gender,
// 				skills,
// 				overview,
// 				hourlyRate,
// 				socialLinks,
// 				address,
// 				language,
// 				education,
// 				employments,
// 				otherExperience,
// 			})
// 		);
// 	});
// });
