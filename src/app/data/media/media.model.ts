export class MediaDTO {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public startDate: Date,
        public endDate: Date,
        public path: string,
        public resource: File,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) { }
}

export class Media extends MediaDTO {
    constructor(
        public id: string = null,
        public name: string = null,
        public description: string = null,
        public startDate: Date = null,
        public endDate: Date = null,
        public path: string = null,
        public resource: File = null,
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
            description,
            startDate,
            endDate,
            path,
            resource,
            createdAt ? createdAt : null,
            createdBy,
            modifiedAt ? modifiedAt : null,
            modifiedBy,
            owner
        );
    }
}