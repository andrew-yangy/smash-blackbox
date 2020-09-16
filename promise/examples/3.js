// 3 states：PENDING、FULFILLED、REJECTED [1]
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) { // [2]
    // default state is PENDING [4]
    this.status = PENDING;
    // default value is undefined
    this.value = undefined;
    // default reason is undefined
    this.reason = undefined;

    // store callbacks
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks= [];

    // resolve function [3]
    let resolve = (value) => {
      // only update value when status is pending [6]
      // first win
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // invoke callbacks in order
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    // reject function [3]
    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // invoke callbacks in order
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      // execute immediately
      executor(resolve,reject)
    } catch (error) {
      // reject when an error throw
      reject(error)
    }
  }

  // [7,8]
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECTED) {
      onRejected(this.reason)
    }

    if (this.status === PENDING) {
      // if the status is PENDING when `then` is called, then we need to store both onFulfilled and onRejected,
      // and execute them when resolve or reject functions being called
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      });

      this.onRejectedCallbacks.push(()=> {
        onRejected(this.reason);
      })
    }
  }
}

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('wahahahahahaha');
  }, 2000)
}).then(
  (data) => {
    console.log('success: ', data)
  },
  (err) => {
    console.log('fail: ', err)
  }
)


// however...
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('wahahahahahaha');
//   }, 1000)
// }).then(
//   (data) => {
//     console.log('success: ', data)
//   },
//   (err) => {
//     console.log('fail: ', err)
//   }
// ).then(
//   (data) => {
//     console.log('success: ', data)
//   },
//   (err) => {
//     console.log('fail: ', err)
//   }
// )

// Publish/subscribe pattern
// https://medium.com/easyread/difference-between-pub-sub-pattern-and-observable-pattern-d5ae3d81e6ce
