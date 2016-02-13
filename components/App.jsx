var App = React.createClass({
  render() {
    var methods = MethodsParser.parse(this.props.methodsText);
    var structures = StructuresParser.parse(this.props.structuresText);

    var implementations = {};

    Object.keys(structures).forEach((structureName) => {
      implementations[structureName] = BigO.searchMethods(structures[structureName], methods);
    })
    return (
      <div>
        <h2>Input</h2>
        <h3>methods text:</h3>
        <pre>{this.props.methodsText}</pre>
        <h3>structures text:</h3>
        <pre>{this.props.structuresText}</pre>
        <h2>Output</h2>
        <ul>
          {Object.keys(implementations).map((structureName) => {
            return (
              <li key={structureName}>{structureName}
                <ul>
                  {Object.keys(implementations[structureName]).map((methodName) => {
                    if (structures[structureName][methodName]) {
                      return (
                        <li key={methodName}>
                          <strong>
                            {methodName}: {implementations[structureName][methodName]}
                          </strong>
                        </li>
                      );
                    } else {
                      return <li key={methodName}>{methodName}: {implementations[structureName][methodName]}</li>;
                    }

                  })}
                </ul>
              </li>
            );
          })}
        </ul>

      </div>
    );
  }
});

$.get("public/methods.txt", function (data) {
  var methodsText = data;
  $.get("public/structures.txt", function (data) {
    var structuresText = data;
    ReactDOM.render(
      <App methodsText={methodsText} structuresText={structuresText} />,
        document.getElementById("render-target")
    );
  });
});
