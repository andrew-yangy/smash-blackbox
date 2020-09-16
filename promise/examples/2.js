/*
1. A promise must be in one of three states: pending, fulfilled, or rejected. [Promise/A+ 2.1]
2. when calling `new Promise()`, an executor function is needed, and invoke synchronously
3. executor has two params, resolve and reject, only first will win. [Promise/A+ 2.3.3.3.3]
4. default state: pending
5. “value” is any legal JavaScript value (including undefined, a thenable, or a promise). [Promise/A+ 1.3]
6. “reason” is a value that indicates why a promise was rejected. [Promise/A+ 1.5]
6. pending to rejected, pending to fulfilled ONLY, ONCE DONE IS DONE.
7. A promise must provide a then method to access its current or eventual value or reason.
8. A promise’s then method accepts two arguments:
       promise.then(onFulfilled, onRejected)
   [Promise/A+ 2.2]
9. if a promise has already fulfilled, then run onFulfilled, param is value
10. if a promise has already rejected, then run onRejected, param is reason
11. if an Error happened during then function, call onRejected for the next then
 */

// Based on the core concepts, we can start building a very basic prototype

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

    // resolve function [3]
    let resolve = (value) => {
      // only update value when status is pending [6]
      // first win
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    }

    // reject function [3]
    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
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
  }
}

new Promise((resolve, reject) => {
  resolve('woooolalalalalallala');
}).then(
  (data) => {
    console.log('success: ', data)
  },
  (err) => {
    console.log('fail: ', err)
  }
)

// however ...

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
// )