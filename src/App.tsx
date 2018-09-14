import {cloneDeep} from "lodash";
import * as React from "react";
import {Line} from "react-chartjs-2";
import {Provider} from "react-redux";
import "./App.css";
import Header from "./components/header/Header";
import ScenarioSelection from "./components/scenario-selection/ScenarioSelection";
import {DataWilshire} from "./DataWilshire";
import {DataWilshireGDP} from "./DataWilshireGDP";
import Store from "./Store";

const DataWilshireGDPClean = cloneDeep(DataWilshireGDP);
DataWilshireGDPClean.forEach((dataPoint, i, arr) => {
    dataPoint.RATIO = typeof dataPoint.RATIO === 'number' ? dataPoint.RATIO : arr[i - 1].RATIO;
});

const DataWilshireClean = cloneDeep(DataWilshire);
DataWilshireClean.forEach((dataPoint, i, arr) => {
    dataPoint.Price = typeof dataPoint.Price === 'number' ? dataPoint.Price : arr[i - 1].Price;
});


console.log(DataWilshireClean, DataWilshireGDPClean);

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Header />
                <Provider store={Store}>
                    <ScenarioSelection />
                </Provider>
                <div className="col-xs-10 col-xs-offset-1">
                    <h2>Returns</h2>
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

            </div>
        );
    }
}

export default App;
