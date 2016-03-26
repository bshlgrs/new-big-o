window.TimeTellerWidget = React.createClass({
  getInitialState () {
    return { selectedStructureNames: {} };
  },

  handleStructuresClick (x, e) {
    var newSelectedStructureNames = this.state.selectedStructureNames;

    if (newSelectedStructureNames[x]) {
      delete newSelectedStructureNames[x];
    } else {
      newSelectedStructureNames[x] = true;
    }

    this.setState({ selectedStructureNames: newSelectedStructureNames });
    e.preventDefault();
  },

  render () {
    console.log(this.state.selectedStructureNames);
    var that = this;

    var selectedStructures = Object.keys(this.state.selectedStructureNames).map((name) => {
      return this.props.structures[name];
    });

    if (selectedStructures.length) {
      var times = BigO.methodTimesForCombinedStructures(selectedStructures, this.props.methods);
    } else {
      var times = {};
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
        TimeTeller
        </div>
        <div className="panel-body">
          <h4>structures</h4>
          <div className="row">
            {Object.keys(this.props.structures).map((x) => {
              return (
                <div className="col-xs-6" key={x}>
                  <label style={{fontWeight: "normal"}} onClick={this.handleStructuresClick.bind(this, x)} >
                    <input style={{marginRight: "10px"}} type="checkbox" checked={that.state.selectedStructureNames[x]}/>
                    {x}
                  </label>
                </div>);
            })}
          </div>

          <ul>
            {Object.keys(times).sort().map((methodName) => {
              return <li key={methodName}>
                {methodName}: {times[methodName]}
              </li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
});

          // <h4>methods</h4>
          // <div className="row">
          //   {this.props.methodNames.map((x) => {
          //     return (
          //       <div className="col-xs-4" key={x}>
          //         <label style={{fontWeight: "normal"}} onClick={this.handleMethodClick}>
          //           <input style={{marginRight: "10px"}} type="checkbox" />
          //           {x}
          //         </label>
          //       </div>);
          //   })}
          // </div>
