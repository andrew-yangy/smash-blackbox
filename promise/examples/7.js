// const Promise = require('./5');

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let val = promises[i];
      if (val && typeof val.then === 'function') {
        val.then(resolve, reject);
      } else {
        resolve(val)
      }
    }
  });
}

// abort version

function wrap(promise) {
  let abort;
  let newPromise = new Promise((resolve, reject) => {
    abort = reject;
  });
  let p = Promise.race([promise, newPromise]);
  p.abort = abort;
  return p;
}

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

let newPromise = wrap(promise);

setTimeout(() => {
  // timeout after 3s
  newPromise.abort('timeout');
}, 3000);

newPromise.then((data => {
  console.log('success: ' + data)
})).catch(e => {
  console.log('fail: ' + e)
})

// promisify

const promisify = (fn) => {
  return (...args)=>{
    return new Promise((resolve,reject)=>{
      fn(...args,function (err,data) {
        if(err) return reject(err);
        resolve(data);
      })
    });
  }
}