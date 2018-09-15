import {cloneDeep, find, isNumber, sum} from "lodash";
import {compose, map, range, reduce} from "lodash/fp";
import * as React from "react";
import {Line} from "react-chartjs-2";
import {connect} from "react-redux";
import {DataWilshire} from "../../DataWilshire";
import {DataWilshireGDP} from "../../DataWilshireGDP";
import {IETFState} from "../../Reducers";
import {Month} from "../../types/Months";

const DataWilshireGDPClean = cloneDeep(DataWilshireGDP);
DataWilshireGDPClean.forEach((dataPoint, i, arr) => {
    dataPoint.RATIO = typeof dataPoint.RATIO === "number" ? dataPoint.RATIO : arr[i - 1].RATIO;
});
const DataWilshireGDPMap = DataWilshireGDPClean.reduce((acc, val) => ({...acc, [val.DATE]: val}), {});

const DataWilshireClean = cloneDeep(DataWilshire);
DataWilshireClean.forEach((dataPoint, i, arr) => {
    dataPoint.Price = typeof dataPoint.Price === "number" ? dataPoint.Price : arr[i - 1].Price;
});

export const mapStateToProps = (state: IETFState): IETFState => ({
    ...state
});

class Returns extends React.Component<Partial<IETFState>> {
    public static months: Month[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    public render() {
        return this.isValidScenario()
            ? (
                <div className="col-xs-10 col-xs-offset-1">
                    <h2>Returns</h2>
                    <div className="row">
                        <div className='col-xs-12 col-md-6'>
                            Total cash invested: {this.getTotalAmountInvested(this.props)} $
              </div>
                        <div className='col-xs-12 col-md-6'>
                            Total cash after period of investment: {this.computeTotalReturns()} $
              </div>
                    </div>
                    <Line
                        data={{
                            datasets: [
                                {
                                    borderColor: "blue",
                                    data: DataWilshireGDPClean.map(data => (typeof data.RATIO === "number" ? data.RATIO : 0)),
                                    fill: false,
                                    label: "Example"
                                }
                            ],
                            labels: DataWilshireGDPClean.map(data => data.DATE)
                        }}
                    />
                </div>
            )
            : <div className='red'>Invalid</div>;
    }

    private isValidScenario(): boolean {
        return isNumber(parseFloat(this.props.startYear.toString()))
            && isNumber(parseFloat(this.props.endYear.toString()))
            && parseFloat(this.props.startYear.toString()) > 1970 && parseFloat(this.props.startYear.toString()) < 2018
            && parseFloat(this.props.endYear.toString()) > 1971 && parseFloat(this.props.startYear.toString()) < 2019
            && parseFloat(this.props.startYear.toString()) < parseFloat(this.props.endYear.toString())
            && isNumber(parseFloat(this.props.monthlyInvestment.toString()))
            && parseFloat(this.props.monthlyInvestment.toString()) > 0
            && isNumber(parseFloat(this.props.managerialCost.toString()))
            && parseFloat(this.props.managerialCost.toString()) > 0
            && isNumber(parseFloat(this.props.monthlyTransactionCost.toString()))
            && parseFloat(this.props.monthlyTransactionCost.toString()) > 0
            && isNumber(parseFloat(this.props.ratioWeight.toString()));
    }

    private getTotalAmountInvested({monthlyInvestment, startYear, endYear}: Partial<IETFState>) {
        return (monthlyInvestment || 0) * ((endYear || 0) - (startYear || 0)) * 4;
    }

    private computeTotalReturns(): number {
        const startYear = this.props.startYear || 0;
        const endYear = this.props.endYear || 1;
        const stockEndYear = find(DataWilshireClean, {DATE: this.getFirstWednesdayOfMonth(endYear, "09" as Month)});
        const stockPriceEndYear = stockEndYear && parseFloat(stockEndYear.Price.toString()) || 0;

        return this.roundToTwoDecimalPoints(compose(
            reduce((totalReturn, returnsFor12Months) => totalReturn + sum(returnsFor12Months as number[]), 0),
            map((year: number) => {
                const returnsFor12Months = Returns.months.map((month) => {
                    const currentStock = find(DataWilshireClean, {DATE: this.getFirstWednesdayOfMonth(year, month)});
                    const currentStockPrice = currentStock && parseFloat(currentStock.Price.toString()) || 0;

                    return !!currentStockPrice
                        ? this.getAmountInvested(DataWilshireGDPMap[`${year}-${this.getNearestMonthForStockGDPRatio(month)}-01`].RATIO) * (stockPriceEndYear / currentStockPrice)
                        : 0;
                });
                return returnsFor12Months;
            }),
            () => range(startYear, endYear + 1),
        )());
    }


    private getAmountInvested(stockGDPRatio: number): number {
        const {orZero} = this;

        return (orZero(this.props.monthlyInvestment) - orZero(this.props.monthlyTransactionCost)) * (1 - orZero(this.props.managerialCost)) * ((1 / (orZero(stockGDPRatio)) * orZero(this.props.ratioWeight)));
    }

    private orZero(val?: number | string) {
        return parseFloat((val || 0).toString());
    }

    private getNearestMonthForStockGDPRatio(month: Month): string {
        if (/(01|02|03)/.test(month)) {
            return "01";
        } else if (/(04|05|06)/.test(month)) {
            return "04";
        } else if (/(07|08|09)/.test(month)) {
            return "07";
        } else {
            return "10";
        }
    }

    /**
     * Get date of the format yyyy-mm-dd of the first wednesday of a month based on the year and month
     * https://stackoverflow.com/questions/9481158/how-to-get-the-4-monday-of-a-month-with-js
     */
    private getFirstWednesdayOfMonth(year: number, currentMonth: Month): string {
        const d = new Date(year, parseInt(currentMonth, 10) - 1);

        d.setDate(1);

        // Get the first Wednesday in the month
        while (d.getDay() !== 3) {
            d.setDate(d.getDate() + 1);
        }

        return this.formatDate(d);
    }

    /**
     * Get date of the format yyyy-mm-dd
     * https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
     */
    private formatDate(d: Date): string {
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {month = '0' + month};
        if (day.length < 2) {day = '0' + day};

        return [year, month, day].join('-');
    }

    private roundToTwoDecimalPoints(num: number) {
        return Math.round(num * 100) / 100;
    }
}

const ReturnsConnected: React.ComponentClass<Partial<IETFState>> = connect(
    mapStateToProps,
)(Returns);

export default ReturnsConnected;
