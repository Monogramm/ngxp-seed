export class PermissionDTO {
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

export class Permission extends PermissionDTO {
    constructor(
        public id: string,
        public name: string,
        public selected = false,
        public deleted = false,
        public deleting = false,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) {
        super(
            id,
            name,
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy,
            owner
        );
    }
}
