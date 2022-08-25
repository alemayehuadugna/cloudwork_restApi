import {
  CreateClient,
  makeCreateClient,
} from "@/client/app/usecase/CreateClient";
import { ClientRepository } from "@/client/domain/ClientRepository";

describe("Create Client", () => {
  const id = "client-id";
  const firstName = "firstName";
  const lastName = "lastName";
  const phone = "phone";
  const email = "biruk@gmail.com";
  const password = "password";
  const description = "description";
  const address = {
    region: "region",
    city: "city",
    areaName: "areaName",
    postalCode: "postal_code",
  };
  const languages = [{ language: "amharic", proficiencyLevel: "high" }];
  const companyName = "companyName";

  const clientRepository: ClientRepository = {
    getNextId: jest.fn().mockReturnValue(Promise.resolve({ value: id })),
    store: jest.fn(),
  };

  let createClient: CreateClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    createClient = makeCreateClient({ clientRepository });
  });

  test("should return the created id", async () => {
    const result = await createClient({
      firstName,
      lastName,
      phone,
      email,
      password,
      description,
      address,
      languages,
      companyName,
    });

    expect(result).toBe(id);
  });

  test("should store the client", async () => {
    await createClient({
      firstName,
      lastName,
      phone,
      email,
      password,
      description,
      address,
      languages,
      companyName,
    });

    expect(clientRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({
        id: { value: id },
        firstName,
        lastName,
        phone,
        email,
        password,
        description,
        address,
        languages,
        companyName,
      })
    );
  });
});
