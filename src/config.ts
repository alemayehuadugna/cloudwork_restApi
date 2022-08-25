import { REPLConfig } from '@/_boot/repl';
import { environment, EnvironmentConfig, envNumber, envString } from '@/_lib/Environment';
import { ServerConfig } from '@/_boot/server';
import { DatabaseConfig } from '@/_boot/database';
import { SwaggerConfig } from '@/_boot/swagger';
import { SocketConfig } from './_boot/socket';
// import { AppModulesConfig } from '@/_boot/appModules';

type Configuration = ServerConfig & DatabaseConfig & EnvironmentConfig & REPLConfig & SwaggerConfig & SocketConfig;

const config: Configuration = {
	appName: 'cloudwork-api',
	cli: process.argv.includes('--cli'),
	environment: environment(),
	repl: {
		port: envNumber('REPL_PORT', 2580),
	},
	http: {
		host: envString('HOST', 'localhost'),
		port: envNumber('PORT', 3000),
	},
	swagger: {
		title: 'Cloudwork API',
		version: '1.0.0',
		basePath: '/api',
		docEndpoint: '/api-docs',
	},
	mongodb: {
		database: envString('DB_NAME', 'cloudwork'),
		host: envString('DB_HOST', 'mongodb://localhost:27017'),
		username: envString('DB_USER', 'cloudwork'),
		password: envString('DB_PASS', 'cloudwork'),
	},
	socket: {
		uri: envString('URI', 'http://localhost:3030'),
		id: envString('SERVER_ID', "303jtf6o3a5gqn2wr7d4")
	}
};

export { config };
export type { Configuration };
