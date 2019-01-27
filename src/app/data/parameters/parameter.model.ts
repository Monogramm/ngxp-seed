export class ParameterDTO {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public type: string,
        public value: any,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) { }
}

export class Parameter extends ParameterDTO {
    constructor(
        public id: string = null,
        public name: string = null,
        public description: string = null,
        public type: string = null,
        public value: any = null,
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
            type,
            value,
            createdAt ? new Date(createdAt) : null,
            createdBy,
            modifiedAt ? new Date(modifiedAt) : null,
            modifiedBy,
            owner
        );
    }
}