import { from, v4 } from "uuid-mongodb";
import { ClientId } from "../domain/ClientId";
import { Client } from "../domain/Client";
import { ClientFavoritesDTO, ClientRepository } from "../domain/ClientRepository";
import { ClientCollection, ClientSchema } from "./ClientCollection";
import { ClientIdProvider } from "./ClientIdProvider";
import { ClientMapper } from "./ClientMapper";
import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";

type Dependencies = {
  clientCollection: ClientCollection;
};

const makeMongoClientRepository = ({
  clientCollection,
}: Dependencies): ClientRepository => ({
  async getNextId(): Promise<ClientId> {
    return Promise.resolve(ClientIdProvider.create(v4().toString()));
  },

  async delete(id: string): Promise<void> {
    await clientCollection.findOneAndDelete({_id: from(id)});
  },

  async findById(id: string): Promise<Client.Type> {
    const client = await clientCollection.findOne({
      _id: from(id),
    });

    if (!client) {
      throw new Error("Client not found");
    }

    return ClientMapper.toDomainEntity(client);
  },

  async findClients({
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<Client.Type[]>> {
    let match: Filter<ClientSchema> = {
      
    };
    if (filter.joinedBetween) {
      match = {
        ...match,
        joinedDate: {
					$gte: new Date(filter.joinedBetween[0]),
					$lt: new Date(filter.joinedBetween[1])
				}
      }
    }
    if (filter.verified) {
      match = {
				...match,
				verified: filter.verified === "true"
			}
    }
        const clients = await clientCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(pagination.page - 1) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
      ])
      .toArray();

    const totalElements = await clientCollection.countDocuments(match);
    console.log("pagination.pageSize", pagination.pageSize);
    const totalPages = Math.ceil(totalElements / pagination.pageSize);
    
    
    

    return {
      data: ClientMapper.toDomainEntities(clients),
      page: {
        totalPages, 
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async store(entity: Client.Type): Promise<void> {
    ClientIdProvider.validate(entity.id);

    const { _id, version, ...data } = ClientMapper.toOrmEntity(entity);

    const count = await clientCollection.countDocuments({ _id });
    if (count) {
      await clientCollection.updateOne(
        { _id, version, deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
            version: version + 1,
          },
        } 
      );
      return;
    }

    await clientCollection.insertOne({
      _id,
      ...data,
      version,
    });
    
  },

  async findByEmail(email: string): Promise<Client.Type>{
    const client = await clientCollection.findOne({email: email, state: 'ACTIVE',});
    
    console.log("client", client);

    if(!client){
        throw new Error("Client not found");
    }

    return ClientMapper.toDomainEntity(client);
  },

  async findByPhone(phone: string): Promise<Client.Type>{
    const client = await clientCollection.findOne({phone: phone, state: 'ACTIVE',});
    if(!client){
        throw new Error("Client not found");
    }

    return ClientMapper.toDomainEntity(client);
  },

  async listFavorites({pagination, clientId}): Promise<PaginatedQueryResult<ClientFavoritesDTO[]>>{
    
    console.log("pagination", pagination.pageSize);

    const clients  = await clientCollection.aggregate([
      {
        $match: {
          _id: from(clientId)
        }
      },
      {
        $skip: Math.max(pagination.page - 1) * pagination.pageSize,
      },
      {
        $limit: pagination.pageSize,
      },
      {
        $lookup: {
          from: "freelancers",
          as: "favorite_freelancers",
          let: {
            fId: "$favorites.freelancerId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $ifNull: ["$$fId", []],
                    },
                  ],
                },
              },
            },
            {
              $skip: Math.max(pagination.page - 1) * pagination.pageSize,
            },
            {
              $limit: pagination.pageSize,
            },
            {
              $project: {
               firstName :'$firstName',
               lastName: "$lastName",
               address: "$address",
               skills: "$skills",
               profilePicture: "$profilePicture",
               expertise: "$expertise",
               rating: "$rating"
              },
            },
          ],
        },
      },
    ]).toArray();

    console.log("clients", clients);

    const totalElements = clients[0].favorite_freelancers.length;
    console.log("page size", pagination.pageSize);
    const totalPages = Math.ceil(totalElements/ pagination.pageSize);

    return {
      data: clients[0].favorite_freelancers.map((fav) => ({
      id: from(fav._id).toString(),
      firstName: fav.firstName,
      lastName: fav.lastName,
      address: fav.address,
      skills: fav.skills,
      profilePicture: fav.profilePicture,
      expertise: fav.expertise,
      skillRating: fav.rating.skill,
      qualityOfWorkRating: fav.rating.qualityOfWork,
      availabilityRating: fav.rating.availability,
      adherenceToScheduleRating: fav.rating.adherenceToSchedule,
      communicationRating: fav.rating.communication,
      cooperationRating: fav.rating.cooperation
    })),
    page:{
      totalPages,
      totalElements,
      pageSize: pagination.pageSize,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
    }};
  },

  async search({
    pagination,
    filter
  }): Promise<PaginatedQueryResult<Client.Type[]>>{
    console.log("ere tew", pagination, filter);
    const clients = await clientCollection.aggregate([
      {
        $match: { $text: { $search: filter.searchTerm } }
      },
      {
        $sort: { score: { $meta: "textScore" } }
      },
      {
        $skip: Math.max(pagination.page - 1, 0) * pagination.pageSize,
      },
      {
        $limit: pagination.pageSize
      },
    ]).toArray();

    console.log(clients);

    const totalElements = await clientCollection.countDocuments();
    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: ClientMapper.toDomainEntities(clients),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      }
    }
  }
});



export { makeMongoClientRepository };
