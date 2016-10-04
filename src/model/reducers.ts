import {IStore} from "./store";
import {IAction} from "./actions";

let defaultStore: IStore = {
};

export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
    switch (action.type) {
    }

    return store;
}