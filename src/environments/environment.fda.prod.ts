import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.production = true;
environment.version = 'fda';
environment.apiBase = 'https://localhost:9000/ginas/app/api/v1';