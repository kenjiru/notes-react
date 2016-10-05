import {IStore} from "../model/store";

export interface IAction {
    type: string;
    payload?: Error|any;
    error?: boolean;
    meta?: any;
}

export interface IActionCallback {
    (dispatch: IDispatchFunction, getState?: IGetStateFunction): Promise<any>;
}

export interface IDispatchFunction {
    (action: IAction|IActionCallback): Promise<any>;
}

export interface IGetStateFunction {
    (): IStore;
}

export function createAction(type: string, payload?: any) {
    return {
        type,
        payload
    };
}