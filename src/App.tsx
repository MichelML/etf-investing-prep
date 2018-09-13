import * as React from "react";
import { Line } from "react-chartjs-2";
import { Provider } from "react-redux";
import "./App.css";
import Header from "./components/header/Header";
import ScenarioSelection from "./components/scenario-selection/ScenarioSelection";
import { DataWilshireGDP } from "./DataWilshireGDP";
import Store from "./Store";

const DataWilshireGDPClean = DataWilshireGDP.filter(data => typeof data.RATIO !== "string");

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Header />
                <Provider store={Store}>
                    <ScenarioSelection />
                </Provider>
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
        );
    }
}

export default App;
