import { Collection, Db} from "mongodb";
import { MUUID } from "uuid-mongodb";

type EmployeeSchema = {
    _id: MUUID;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    gender: string;
    roles: string[];
    state: 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    version: number;
};

type EmployeeCollection = Collection<EmployeeSchema>;

const initEmployeeCollection = async function (db: Db): Promise<EmployeeCollection> {
    const collection: EmployeeCollection = db.collection("employees");

    await collection.createIndex({ phone: 1 }, { unique: true });
    await collection.createIndex({ _id:1, deleted: 1});
	await collection.createIndex({ firstName: "text", lastName: "text", email: "text", phone: "text" });

    return collection;
};

export { initEmployeeCollection };
export type { EmployeeSchema, EmployeeCollection };

