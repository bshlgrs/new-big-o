var Hideable = React.createClass({
  getInitialState () {
    return { showing: false };
  },

  handleClick () {
    this.setState({ showing: ! this.state.showing });
  },

  render () {
    return (
      <div>
        <p>{this.props.title} <a onClick={this.handleClick}>{ this.state.showing ? "hide" : "show" }</a></p>
        {this.state.showing && this.props.children}
      </div>
    );
  }
})

var App = React.createClass({
  render() {
    var methods = MethodsParser.parse(this.props.methodsText);
    var structures = StructuresParser.parse(this.props.structuresText);

    var allMethodNames = BigO.getAllMethods(methods);


    var implementations = {};

    Object.keys(structures).forEach((structureName) => {
      implementations[structureName] = BigO.searchMethods(structures[structureName], methods);
    });

    return (
      <div>
        <h2>Input</h2>
        <Hideable title="methods text">
          <pre>{this.props.methodsText}</pre>
        </Hideable>

        <Hideable title="structures text">
          <pre>{this.props.structuresText}</pre>
        </Hideable>

        <Hideable title="inferences for all structures">
          <ul>
            {Object.keys(implementations).map((structureName) => {
              return (
                <li key={structureName}>{structureName}
                  <ul>
                    {Object.keys(implementations[structureName].costs).sort().map((methodName) => {
                      var style = structures[structureName][methodName] ? {"fontWeight": "bold"} : {};
                      return <li key={methodName} style={style}>
                        {methodName}: {implementations[structureName].costs[methodName]}
                          ({implementations[structureName].sources[methodName].originalText});
                      </li>;
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Hideable>

        <TimeTellerWidget methods={methods} methodNames={allMethodNames} structures={structures} />
      </div>
    );
  }
});

$.get("public/methods.txt?" + Math.random(), function (data) {
  var methodsText = data;
  $.get("public/structures.txt?" + Math.random(), function (data) {
    var structuresText = data;
    ReactDOM.render(
      <App methodsText={methodsText} structuresText={structuresText} />,
        document.getElementById("render-target")
    );
  });
});
