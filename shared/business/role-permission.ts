export interface IRequirePrivilege {
	role: SYSTEM_ROLE;
	permission: PERMISSION[];
}

export enum SYSTEM_ROLE {
	ADMIN = "ADMIN",
	USER = "USER",
}

export enum PERMISSION {
	CREATE = "CREATE",
	EDIT = "EDIT",
	DELETE = "DELETE",
	GET = "GET",
}
