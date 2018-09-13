import * as React from "react";

const NumberInput = (props: {label: string;} & React.HTMLProps<HTMLInputElement>) => (
    <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
        <label htmlFor={props.id}>{props.label}</label>
        <input
            {...props}
            id={props.id}
            className="u-full-width"
            type="number"
            value={props.value}
        />
    </div>
);

export default NumberInput;
