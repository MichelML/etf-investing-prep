import * as React from "react";

const NumberInput = (props: {
  id: string;
  label: string;
  valueOnMount?: string;
  inputProps?: any;
}) => (
  <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
    <label htmlFor={props.id}>{props.label}</label>
    <input
      id={props.id}
      className="u-full-width"
      type="number"
      defaultValue={props.valueOnMount}
      {...props.inputProps || {}}
    />
  </div>
);

export default NumberInput;
