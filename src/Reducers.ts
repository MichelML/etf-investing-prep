import { combineReducers, Reducer } from "redux";
import { Actions } from "./Actions";
import { ReducerGenerator } from "./ReducerGenerator";

export interface IETFState {
    startYear: number;
    endYear: number;
    monthlyInvestment: number;
    ratioWeight: number;
    monthlyTransactionCost: number;
    managerialCost: number;
}

export const Reducers: Reducer<IETFState> = combineReducers<IETFState>({
    endYear: ReducerGenerator(Actions.setEndDate, 2018),
    managerialCost: ReducerGenerator(Actions.setManagerialCost, 0.5),
    monthlyInvestment: ReducerGenerator(Actions.setMonthlyInvestment, 500),
    monthlyTransactionCost: ReducerGenerator(Actions.setMonthlyTransactionCost, 30),
    ratioWeight: ReducerGenerator(Actions.setRatioWeight, 1),
    startYear: ReducerGenerator(Actions.setStartDate, 1971)
});
