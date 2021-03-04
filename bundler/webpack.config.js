module.exports = [
  {
    entry: "./example/entry.js",
    output: {
      filename: "output.js"
    },
  },
];
// module.exports = function (env, argv) {
//   return {
//     entry: 'function-entry'
//   }
// }
// module.exports = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         entry: 'promise-entry',
//         /* ... */
//       });
//     }, 1000);
//   });
// };
