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

    public static readonly URL_REGEX = '.*';
    public static readonly PATH_REGEX = '.*';
    public static readonly COLOR_REGEX = '^\\#[0-9A-F]{6,8}$';
    public static readonly TIME_REGEX = '^[0-2]?[0-9]\\:[0-5]?[0-9]$';
    public static readonly DATE_REGEX = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9]$';
    public static readonly DATE_TIME_REGEX = '^[0-9]{4}\-[0-1]?[0-9]\-[0-1]?[0-9] [0-2]?[0-9]\\:[0-5]?[0-9]$';
    public static readonly DOUBLE_REGEX = '^(-)?\\d+(\\.\\d||,\\d)?\\d*$';
    public static readonly INTEGER_REGEX = '^(-)?\\d+$';
    public static readonly BOOLEAN_REGEX = '^[0-1]?$';
    public static readonly STRING_REGEX = '.*';
    public static readonly ANY_REGEX = '.*';

    public static pad(number: number): string {
        if (number < 10) {
            return '0' + number;
        }
        return '' + number;
    }

    public static convertValue(type: string, value: any): any {
        let finalValue: any = null;

        switch (type) {
            case 'DATE_TIME':
                if (value instanceof Date) {
                    finalValue = value.getUTCFullYear() +
                        '-' + Parameter.pad(value.getUTCMonth() + 1) +
                        '-' + Parameter.pad(value.getUTCDate()) +
                        ' ' + Parameter.pad(value.getUTCHours()) +
                        ':' + Parameter.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'TIME':
                if (value instanceof Date) {
                    finalValue = Parameter.pad(value.getUTCHours()) +
                        ':' + Parameter.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'DATE':
                if (value instanceof Date) {
                    finalValue = Parameter.pad(value.getUTCMonth()) +
                        ':' + Parameter.pad(value.getUTCDate());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'BOOLEAN':
                if (typeof value === 'boolean') {
                    finalValue = value ? 1 : 0;
                } else {
                    finalValue = String(value).trim();
                }
                break;

            default:
                finalValue = String(value).trim();

        }

        return finalValue;
    }

    public static isValueValid(value: any, pattern: string): boolean {
        var valid: boolean;
        if (value === null) {
            valid = true;
        } else {
            var reg = new RegExp(pattern, 'i');
            valid = reg.test(String(value).trim());
        }
        return valid;
    }
}