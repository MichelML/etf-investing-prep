import * as React from "react";
import { connect } from "react-redux";
import { Actions } from "../../Actions";
import { setValue } from "../../ReducerGenerator";
import { IETFState } from "../../Reducers";
import NumberInput from "./NumberInput";

export const mapStateToProps = (state: IETFState): IETFState => ({
    ...state
});

export const mapDispatchToProps = (dispatch: any) => ({
    setValue: (action: string, value: any) => dispatch(setValue(action, value))
});

class ScenarioSelection extends React.Component<Partial<IETFState & { setValue: (...args: any[]) => void }>> {
    constructor(props: Partial<IETFState & { setValue: (...args: any[]) => void }>) {
        super(props);

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setMonthlyInvestment = this.setMonthlyInvestment.bind(this);
        this.setRatioWeight = this.setRatioWeight.bind(this);
        this.setMonthlyTransactionCost = this.setMonthlyTransactionCost.bind(this);
        this.setManagerialCost = this.setManagerialCost.bind(this);
    }

    public render() {
        return (
            <div className="row">
                <NumberInput
                    id="start-year"
                    label="Start from year: "
                    value={this.props.startYear}
                    onChange={this.setStartDate}
                />
                <NumberInput
                    id="end-year"
                    label="End at year: "
                    value={this.props.endYear}
                    onChange={this.setEndDate}
                />
                <NumberInput
                    id="monthly-investment-average"
                    label="Monthly investment average ($): "
                    value={this.props.monthlyInvestment}
                    onChange={this.setMonthlyInvestment}
                />
                <NumberInput
                    id="offset-stock-gdp-ratio"
                    label="Stock/GDP Ratio Weight: "
                    value={this.props.ratioWeight}
                    onChange={this.setRatioWeight}
                />
                <NumberInput
                    id="monthly-transaction-cost"
                    label="Monthly transaction cost ($): "
                    value={this.props.monthlyTransactionCost}
                    onChange={this.setMonthlyTransactionCost}
                />
                <NumberInput
                    id="managerial-cost"
                    label="Managerial cost (%): "
                    value={this.props.managerialCost}
                    onChange={this.setManagerialCost}
                />
            </div>
        );
    }

    private setStartDate(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setStartDate, e.target.value);
        }
    }

    private setEndDate(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setEndDate, e.target.value);
        }
    }
    private setMonthlyInvestment(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setMonthlyInvestment, e.target.value);
        }
    }
    private setRatioWeight(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setRatioWeight, e.target.value);
        }
    }
    private setMonthlyTransactionCost(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setMonthlyTransactionCost, e.target.value);
        }
    }
    private setManagerialCost(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.setValue) {
            this.props.setValue(Actions.setManagerialCost, e.target.value);
        }
    }
}

const ScenarioSelectionConnected: React.ComponentClass<Partial<IETFState>> = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioSelection);

export default ScenarioSelectionConnected;
