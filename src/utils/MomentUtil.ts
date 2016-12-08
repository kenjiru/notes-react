import * as moment from "moment";

class MomentUtil {
    public static getDuration(lastChanged: string): moment.Duration {
        let lastChangedDate: moment.Moment = moment(lastChanged);
        let lastChangedRange: moment.Range = moment.range(lastChangedDate, moment());

        return  moment.duration(lastChangedRange.valueOf() * -1);
    }

    public static formatAsDateTime(dateStr: string|moment.Moment): string {
        let date: moment.Moment = moment(dateStr);
        let formatStr: string = "MMMM D hh:mm A";

        if (date.year() !== moment().year()) {
            formatStr = "MMMM D YYYY hh:mm A";
        }

        return date.format(formatStr);
    }
}

export default MomentUtil;
