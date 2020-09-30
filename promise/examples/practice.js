const Promise = require('./5');

Promise.all = function(values) {
  if (!Array.isArray(values)) {
    return new TypeError();
  }
  // [1, 2, 3, p1, p2]
  let resultArr = [];
  let order = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < values.length; i++) {
      Promise.resolve(values[i]).then(value => {
        order ++;
        resultArr[i] = value;
        if (order === values.length) {
          resolve(resultArr);
        }
      }, reject)

    }
  })
}

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok1');
  }, 2000);
  // resolve('ok1');
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('ok2');
    reject('not ok2');
  }, 1000);
  // resolve('ok2');
})

Promise.all([1,2,3,p1,p2])
  .then(data => {
    console.log('resolve', data);
    // [1, 2, 3, 'ok1', 'ok2']
  }, err => {
    console.log('reject', err);
  })

Promise.race = function(promises) {
  if (!Array.isArray(promises)) {
    return new TypeError();
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(resolve, reject)
    }
  })
}
