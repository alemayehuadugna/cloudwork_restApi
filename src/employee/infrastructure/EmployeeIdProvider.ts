import { makeIdProvider } from "@/_lib/IdProvider";
import { EmployeeId } from "../domain/EmployeeId";

const EmployeeIdProvider = makeIdProvider<EmployeeId>("EmployeeId");

export { EmployeeIdProvider };