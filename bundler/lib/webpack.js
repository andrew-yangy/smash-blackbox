const { bundle, createGraph } = require("./Compilation");
const fs = require('fs');

const webpack = (options) => {
  options.forEach(option => {
    const graph = createGraph(option.entry);
    const result = bundle(graph);
    fs.writeFileSync(option.output.filename, result);
  })
}

exports.webpack = webpack;