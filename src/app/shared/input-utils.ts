

/**
 * Simple utilities for converting input values to appropriate objects.
 */
export class InputUtils {

    public static convertValue(type: string, value: any): any {
        let finalValue: any = null;

        switch (type) {
            case 'DATE_TIME':
                if (value instanceof Date) {
                    finalValue = value.getUTCFullYear() +
                        '-' + InputUtils.pad(value.getUTCMonth() + 1) +
                        '-' + InputUtils.pad(value.getUTCDate()) +
                        ' ' + InputUtils.pad(value.getUTCHours()) +
                        ':' + InputUtils.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'TIME':
                if (value instanceof Date) {
                    finalValue = InputUtils.pad(value.getUTCHours()) +
                        ':' + InputUtils.pad(value.getUTCMinutes());
                } else {
                    finalValue = String(value).trim();
                }
                break;

            case 'DATE':
                if (value instanceof Date) {
                    finalValue = InputUtils.pad(value.getUTCMonth()) +
                        ':' + InputUtils.pad(value.getUTCDate());
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

    private static pad(value: number) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    }

}
