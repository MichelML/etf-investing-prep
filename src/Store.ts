import * as Redux from "redux";
import { Reducers } from "./Reducers";

const Store: Redux.Store<any> = Redux.createStore<any, any, any, any>(Reducers);

export default Store;
