import * as React from "react";
import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <div className="App row">
        <div
          className="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4"
        >
          <div className="box">Responsive</div>
        </div>
        <div
          className="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4"
        >
          <div className="box">Responsive</div>
        </div>
      </div>
    );
  }
}

export default App;
