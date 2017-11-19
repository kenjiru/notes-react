import * as Dropbox from "dropbox";

class DropboxMultiUpload {
    private dropbox: any;

    constructor(accessToken: string) {
        this.dropbox = new Dropbox({
            clientId: "17zzlf216nsykj9",
            accessToken
        });
    }

    public test(): void {
        console.log("DropboxMultiUpload.test");

        let f1 = this.dropbox.filesUploadSessionStart({
            contents: new Blob(["First file"]),
            close: true
        });

        let f2 = this.dropbox.filesUploadSessionStart({
            contents: new Blob(["Second file"]),
            close: true
        });

        console.log("blob length", new Blob(["Second file"]).size);

        Promise.all([f1, f2]).then((result: any[]) => {
            this.dropbox.filesUploadSessionFinishBatch({
                entries: [
                    {
                        cursor: {
                            session_id: result[0].session_id,
                            offset: 10
                        },
                        commit: {
                            "path": "/file1.txt",
                            "mode": {
                                ".tag": "overwrite"
                            }
                        }
                    },
                    {
                        cursor: {
                            session_id: result[1].session_id,
                            offset: 11
                        },
                        commit: {
                            "path": "/file2.txt",
                            "mode": {
                                ".tag": "overwrite"
                            }
                        }
                    },
                ]
            }).then((sessionFinishBatchArg: any): void => {
                console.log({sessionFinishBatchArg});

                this.dropbox.filesUploadSessionFinishBatchCheck({
                    async_job_id: sessionFinishBatchArg.async_job_id
                }).then((sessionFinishBatchJobStatus: any): void => {
                    console.log({sessionFinishBatchJobStatus});
                }, (error: any): void => {
                    console.log({error});
                });
            }, (error: any): void => {
                console.log({error});
            });
        });
    }
}

export default DropboxMultiUpload;
