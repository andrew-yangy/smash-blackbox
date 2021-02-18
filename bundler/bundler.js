import fs from 'fs';
import path from 'path';
import babylon from 'babylon';
import traverse from '@babel/traverse';
import babel from '@babel/core';

let ID = 0;
const createAsset = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babylon.parse(content, {sourceType: 'module'});

  const dependencies = [];
  traverse.default(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value)
    }
  });

  const id = ID++;

  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"]
  });

  return {
    id,
    filename,
    dependencies,
    code
  }
}

const createGraph = entry => {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);

      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    })
  }
  return queue;
}

const bundle = graph => {
  let modules = '';
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],`
  })
  return `
    (function(modules) {
      function require(id) {
       const [fn, mapping] = modules[id];
       function localRequire(relativePath) {
        return require(mapping[relativePath])
       }
       const module = {exports:{}};
       fn(localRequire,module,module.exports);
       return module.exports;
      };
      require(0);
    }) ({${modules}})
  `;
}

const graph = createGraph('./example/entry.js')
const result = bundle(graph);

console.log(result);
fs.writeFileSync("./bundle.js", result);
