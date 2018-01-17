export class RoleDTO {
    constructor(
        public id: string,
        public name: string,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) { }
}

export class Role extends RoleDTO {
    constructor(
        public id: string,
        public name: string,
        public selected: boolean = false,
        public deleted: boolean = false,
        public deleting: boolean = false,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) {
        super(
            id,
            name,
            createdAt ? new Date(createdAt) : null,
            createdBy,
            modifiedAt ? new Date(modifiedAt) : null,
            modifiedBy,
            owner
        );
    }
}