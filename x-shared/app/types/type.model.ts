export class TypeDTO {
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

export class Type extends TypeDTO {
    constructor(
        public id: string = null,
        public name: string = null,
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
