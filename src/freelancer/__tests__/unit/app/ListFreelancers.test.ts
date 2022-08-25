import {
	ListFreelancer,
	makeListFreelancer,
} from "@/freelancer/app/usecases/ListFreelancer";

import {
	FreelancerRepository,
} from "@/freelancer/domain/FreelancerRepository";

describe("ListFreelancers", () => {
	const id = "mock-freelancer-id";
	// const firstName = "firstName";
	// const lastName = "lastName";
	// const phone = "phone";
	// const email = "email";

	// const gender = "gender";
	// const skills = ["skills"];
	// const hourlyRate = 55.6;
	// const address = {
	// 	region: "region",
	// 	city: "city",
	// 	areaName: "areaName",
	// 	postalCode: "postal_code",
	// };

	// const rating: Rating = { rate: 0.0, totalRate: 0.0, totalRaters: 0 };
	const freelancerRepository: FreelancerRepository = {
		getNextId: jest.fn().mockReturnValue(Promise.resolve({ value: id })),
		store: jest.fn(),
		findById: jest.fn(),
		findByPhone: jest.fn(),
		find: jest
			.fn()
			.mockImplementation(async ({ pagination, filter, sort }) => {
				const freelancerList = [

				];
				return freelancerList;
			}),
		search: jest.fn(),
		delete: jest.fn()
	};

	let listFreelancer: ListFreelancer;

	beforeEach(async () => {
		jest.clearAllMocks();
		listFreelancer = makeListFreelancer({ freelancerRepository });
	});

	it("should return list of freelancers", async () => {
		const pagination = { page: 0, pageSize: 0 };
		const filter = {
			hourlyRate: [],
			expertise: "Frontend Developer",
			earning: [],
			rating: [],
		};
		const sort = [];

		const result = await listFreelancer({ pagination, filter, sort });

		expect(result).toStrictEqual([]);
	});
});
