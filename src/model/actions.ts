export interface IAction {
    type: string;
    payload?: Error|any;
    error?: boolean;
    meta?: any;
}