
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
    roles: Array<Role>;
    computedToken: string;
    tokenTimeToExpireMS: number;
    roleQueryOnly: boolean;
    permissions: Array<any>;
    _namespace?: string;
    _matchContext?: string;

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
    namespace?: string;
    _namespace?: string;
    _matchContext?: string;
}

export interface UserGroup {
    name: string;
    id: number;
    members: Array<User>;
    _namespace?: string;
    _matchContext?: string;
}

export type Role = 'Updater'|'Admin'|'Query'|'SuperUpdate'|'DataEntry'|'SuperDataEntry'|'Approver';
