import { cloneDeep } from "lodash";
import * as React from "react";
import { Provider } from "react-redux";
import "./App.css";
import Header from "./components/header/Header";
import ReturnsConnected from "./components/returns/Returns";
import ScenarioSelection from "./components/scenario-selection/ScenarioSelection";
import { DataWilshire } from "./DataWilshire";
import { DataWilshireGDP } from "./DataWilshireGDP";
import Store from "./Store";

const DataWilshireGDPClean = cloneDeep(DataWilshireGDP);
DataWilshireGDPClean.forEach((dataPoint, i, arr) => {
    dataPoint.RATIO = typeof dataPoint.RATIO === "number" ? dataPoint.RATIO : arr[i - 1].RATIO;
});

const DataWilshireClean = cloneDeep(DataWilshire);
DataWilshireClean.forEach((dataPoint, i, arr) => {
    dataPoint.Price = typeof dataPoint.Price === "number" ? dataPoint.Price : arr[i - 1].Price;
});

class App extends React.Component {
    public render() {
        return (
            <Provider store={Store}>
                <div className="App">
                    <Header />
                    <ScenarioSelection />
                    <ReturnsConnected />
                </div>
            </Provider>
        );
    }
}

export default App;
