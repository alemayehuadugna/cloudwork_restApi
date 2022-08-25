import { createContainer } from "awilix";
import { MainRegistry } from "@/_boot";
import { DatabaseRegistry } from "@/_boot/database";
import { ServerRegistry } from "@/_boot/server";
import { PubSubRegistry } from "@/_boot/pubSub";
import { AppModulesRegistry } from "@/_boot/appModules";
import { SocketRegistry } from "./_boot/socket";

type Registry = MainRegistry &
	DatabaseRegistry &
	ServerRegistry &
	PubSubRegistry &
	SocketRegistry &
	AppModulesRegistry;

const container = createContainer<Registry>();

type Container = typeof container;

export { container };
export type { Container, Registry };
