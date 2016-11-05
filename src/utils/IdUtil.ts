class IdUtil {
    public static newId(): string {
        let callback: (result: string) => string = (result: string) => {
            return result += IdUtil.newSegment();
        };

        return _.reduce(_.range(4), callback, "");
    }

    private static newSegment(): string {
        return Math.floor((1 + Math.random()) * 10e8).toString(16);
    }
}

export default IdUtil;
