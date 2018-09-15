import { cloneDeep, find, isNumber, sum } from "lodash";
import { compose, map, range, reduce } from "lodash/fp";
import * as React from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import { DataWilshire } from "../../DataWilshire";
import { DataWilshireGDP } from "../../DataWilshireGDP";
import { IETFState } from "../../Reducers";
import { Month } from "../../types/Months";

const DataWilshireGDPClean = cloneDeep(DataWilshireGDP);
DataWilshireGDPClean.forEach((dataPoint, i, arr) => {
    dataPoint.RATIO = typeof dataPoint.RATIO === "number" ? dataPoint.RATIO : arr[i - 1].RATIO;
});
const DataWilshireGDPMap = DataWilshireGDPClean.reduce((acc, val) => ({ ...acc, [val.DATE]: val }), {});
DataWilshireGDPMap['2018-07-01'] = DataWilshireGDPMap['2018-04-01'];
DataWilshireGDPMap['2018-10-01'] = DataWilshireGDPMap['2018-04-01'];

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
        const isValidScenario = this.isValidScenario();

        const totalAmountInvested = isValidScenario && this.getTotalAmountInvested();
        const totalReturns = isValidScenario && this.computeTotalReturns();
        const growth = isValidScenario && this.roundToTwoDecimalPoints(totalReturns / totalAmountInvested * 100);
    
        return (
            <div className="col-xs-10 col-xs-offset-1">
                <h2>Returns</h2>
                {isValidScenario
                    ? (
                        <>
                            <div className="row">
                                <div className='col-xs-12 col-md-6 col-lg-4'>
                                    Total cash invested: {totalAmountInvested} $
                                </div>
                                <div className='col-xs-12 col-md-6 col-lg-4'>
                                    Total cash after period of investment: {totalReturns} $
                                </div>
                                <div className='col-xs-12 col-md-6 col-lg-4'>
                                    Growth: {growth} %
                                </div>
                            </div>
                            <Line
                                data={{
                                    datasets: [
                                        {
                                            borderColor: "green",
                                            data: this.getCompoundedReturns(),
                                            fill: false,
                                            label: `Yearly Compounded Returns based on Wilshire 500 and GDP - ${this.props.startYear}-${this.props.endYear}`
                                        }
                                    ],
                                    labels: range(parseInt(this.props.startYear.toString(), 10), parseInt(this.props.endYear.toString(), 10) + 1).map((val) => val.toString())
                                }}
                            />
                        </>
                    )
                    : <div className="col-xs-10 col-xs-offset-1"><div className='red'>Something went wrong. Check if the values provided are valid and make common sense.</div></div>
                }
            </div>
        );
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

    private getTotalAmountInvested(): number {
        const startYear = parseInt(this.props.startYear.toString(), 10) || 1971;
        const endYear = parseInt(this.props.endYear.toString(), 10) || 2018;

        return this.roundToTwoDecimalPoints(
            compose(
                reduce((totalAmount: number, amountInvestedFor12Months: number[]) => totalAmount + sum(amountInvestedFor12Months), 0),
                map((year: number) => Returns.months.map((month) => this.getAmountInvested(DataWilshireGDPMap[`${year}-${this.getNearestMonthForStockGDPRatio(month)}-01`].RATIO))),
                () => range(startYear, endYear + 1),
            )(),
        );
    }

    private computeTotalReturns(endY?: number): number {
        const startYear = this.props.startYear || 0;
        const endYear = endY || this.props.endYear || 1;
        const stockEndYear = find(DataWilshireClean, { DATE: this.getFirstWednesdayOfMonth(endYear, "09" as Month) });
        const stockPriceEndYear = stockEndYear && parseFloat(stockEndYear.Price.toString()) || 0;

        return this.roundToTwoDecimalPoints(compose(
            reduce((totalReturn: number, returnsFor12Months: number[]) => totalReturn + sum(returnsFor12Months), 0),
            map((year: number) => {
                const returnsFor12Months = Returns.months.map((month) => {
                    const currentStock = find(DataWilshireClean, { DATE: this.getFirstWednesdayOfMonth(year, month) });
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

    private getCompoundedReturns(): number[] {
        const startYear = this.props.startYear || 1971;
        const endYear = this.props.endYear || 2018;

        return compose(
            map((year: number) => this.computeTotalReturns(year)),
            () => range(startYear, endYear + 1),
        )();
    }


    private getAmountInvested(stockGDPRatio: number): number {
        const { orZero } = this;
        const amountMultiplier = orZero(this.props.ratioWeight) === 0 ? 1 : (1 / (orZero(stockGDPRatio)) * orZero(this.props.ratioWeight));
        return (orZero(this.props.monthlyInvestment) - orZero(this.props.monthlyTransactionCost)) * (1 - orZero(this.props.managerialCost)) * amountMultiplier;
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

        if (month.length < 2) { month = '0' + month };
        if (day.length < 2) { day = '0' + day };

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
