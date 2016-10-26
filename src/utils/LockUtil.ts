import {ILock} from "../model/store";

class LockUtil {
    public static convertLock(lockObj: any): ILock {
        return {
            transactionId: lockObj.lock["transaction-id"],
            clientId: lockObj.lock["client-id"],
            renewCount: parseInt(lockObj.lock["renew-count"]),
            lockExpirationDuration: lockObj.lock["lock-expiration-duration"],
            revision: parseInt(lockObj.lock["revision"])
        }
    }
}

export default LockUtil;
