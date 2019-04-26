export interface Auth {
    id: number;
    version: number;
    namespace?: string;
    created: number;
    modified: number;
    deprecated: boolean;
    user: User;
    active: boolean;
    systemAuth: boolean;
    key: string;
    properties?: Array<any>;
    identifier: string;
    groups: Array<UserGroup>;
    roles: Array<'Updater|Admin|Query|SuperUpdate|DataEntry|SuperDataEntry|Approver'>;
    computedToken: string;
    tokenTimeToExpireMS: number;
    roleQueryOnly: boolean;
    permissions: Array<any>;
}

export interface User {
    id: number;
    version: number;
    created: number;
    modified: number;
    deprecated: boolean;
    provider?: string;
    username: string;
    email?: string;
    admin: boolean;
    uri?: string;
    selfie?: string;
}

export interface UserGroup {
    name: string;
    id: number;
    members: Array<User>;
}
