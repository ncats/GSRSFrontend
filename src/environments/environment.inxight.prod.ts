import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.production = true;
environment.version = 'inxight';
environment.apiBase = 'https://localhost:9000/ginas/app/api/v1';
