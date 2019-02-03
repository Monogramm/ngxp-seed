
/**
 * Simple Date utils.
 */
export class DateUtils {
    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
     * https://stackoverflow.com/a/1214753/18511
     *
     * @param date Date to start with.
     * @param units One of: year, quarter, month, week, day, hour, minute, second.
     * @param interval Number of units of the given interval to add.
     */
    static add(date: Date, units: string, interval: number): Date {
        // don't change original date
        let ret: Date = new Date(date);

        const checkRollover = () => {
            if (ret.getDate() !== date.getDate()) {
                ret.setDate(0);
            }
        };

        switch (units.toLowerCase()) {
            case 'year': ret.setFullYear(ret.getFullYear() + interval); checkRollover(); break;
            case 'quarter': ret.setMonth(ret.getMonth() + 3 * interval); checkRollover(); break;
            case 'month': ret.setMonth(ret.getMonth() + interval); checkRollover(); break;
            case 'week': ret.setDate(ret.getDate() + 7 * interval); break;
            case 'day': ret.setDate(ret.getDate() + interval); break;
            case 'hour': ret.setTime(ret.getTime() + interval * 3600000); break;
            case 'minute': ret.setTime(ret.getTime() + interval * 60000); break;
            case 'second': ret.setTime(ret.getTime() + interval * 1000); break;
            default: ret = undefined; break;
        }

        return ret;
    }
}
