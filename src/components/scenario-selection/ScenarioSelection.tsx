import * as React from "react";
import NumberInput from "./NumberInput";

const ScenarioSelection = () => (
  <div className="row">
    <NumberInput
      id="start-year"
      label="Start from year: "
      valueOnMount="1971"
      inputProps={{ min: "1971", max: "2018" }}
    />
    <NumberInput
      id="end-year"
      label="End at year: "
      valueOnMount="2018"
      inputProps={{ min: "1971", max: "2018" }}
    />
    <NumberInput
      id="monthly-investment-average"
      label="Monthly investment average ($): "
    />
    <NumberInput id="offset-stock-gdp-ratio" label="Stock/GDP Ratio Weight: " />
    <NumberInput
      id="monthly-transaction-cost"
      label="Monthly transaction cost ($): "
    />
    <NumberInput id="managerial-cost" label="Managerial cost (%): " />
  </div>
);

export default ScenarioSelection;
