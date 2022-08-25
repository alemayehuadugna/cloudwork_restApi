import { server } from '@/_boot/server';
import { appModules } from '@/_boot/appModules';
import { asValue } from 'awilix';
import { database } from '@/_boot/database';
import { repl } from '@/_boot/repl';
import { withContext } from '@/context';
import { Configuration } from '@/config';
import { Logger } from 'pino';
import { pubSub } from '@/_boot/pubSub';
import { swagger } from '@/_boot/swagger';
import { MessageBundle } from '@/messages';
import { socket } from './socket';
import axios, { Axios } from 'axios';



const main = withContext(async ({ app, container, config, bootstrap, logger, messageBundle }) => {
	container.register({
		app: asValue(app),
		messageBundle: asValue(messageBundle),
		logger: asValue(logger),
		startedAt: asValue(new Date()),
		config: asValue(config),
		axios: asValue(axios),
	});

	await bootstrap(database, server, socket, swagger, pubSub, repl, ...appModules);
});

type MainRegistry = {
	app: any;
	messageBundle: MessageBundle;
	startedAt: Date;
	logger: Logger;
	config: Configuration;
	axios: Axios;
};

export { main };
export type { MainRegistry };
