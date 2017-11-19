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

    public static newLockContents(transactionId: string, revision: number, lockDuration: string = "00:02:00",
                                  renewCount: number = 10, clientId: string = ""): Blob {
        let fileContent = `<?xml version="1.0" encoding="utf-8"?>
<lock>
  <transaction-id>${transactionId}</transaction-id>
  <client-id>${clientId}</client-id>
  <renew-count>${renewCount}</renew-count>
  <lock-expiration-duration>${lockDuration}</lock-expiration-duration>
  <revision>${revision}</revision>
</lock>`;
        return new Blob([fileContent], {type: 'text/xml'})
    }
}

export default LockUtil;
