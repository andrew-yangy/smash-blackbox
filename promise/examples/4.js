/*
1. Both onFulfilled and onRejected are optional arguments:
        - If onFulfilled is not a function, it must be ignored.
        - If onRejected is not a function, it must be ignored.
     [Promise/A+ 2.2.1、2.2.1.1、2.2.1.2]
2. then must return a promise [3.3]. [Promise/A+ 2.2.7]
    promise2 = promise1.then(onFulfilled, onRejected);
3. If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [Promise/A+ 2.2.7.1]
4. If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason. [Promise/A+ 2.2.7.2]
5. If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
   If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
6. If promise and x refer to the same object, reject promise with a TypeError as the reason. [Promise/A+ 2.3.1]
 */

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

module.exports = class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks= [];

    let resolve = (value) => {
      // if value is a promise
      if(value instanceof Promise){
        return value.then(resolve,reject)
      }
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve,reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    //If onFulfilled or onRejected is not a function, it must be ignored.
    //Promise/A+ 2.2.1 / Promise/A+ 2.2.5 / Promise/A+ 2.2.7.3 / Promise/A+ 2.2.7.4
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    // need to throw the error otherwise it will be caught by following then functions
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // return a new promise  Promise/A+ 2.2.7
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //Promise/A+ 2.2.2
        //Promise/A+ 2.2.4 --- setTimeout
        setTimeout(() => {
          try {
            //Promise/A+ 2.2.7.1
            let x = onFulfilled(this.value);
            // if x is a promise
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            //Promise/A+ 2.2.7.2
            reject(e)
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        //Promise/A+ 2.2.3
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(()=> {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}

const resolvePromise = (promise2, x, resolve, reject) => {
  // If promise and x refer to the same object, reject promise with a TypeError as the reason  Promise/A+ 2.3.1
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // Promise/A+ 2.3.3.3.3 ONCE DONE IS DONE
  let called;
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      // if x is a promise
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          // iteration Promise/A+ 2.3.3.3.1
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          // If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason. Promise/A+ 2.3.3.3.2
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // If then is not a function, fulfill promise with x  Promise/A+ 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      // Promise/A+ 2.3.3.2
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    // If x is not an object or function, fulfill promise with x.  Promise/A+ 2.3.4
    resolve(x)
  }
}

// new Promise((resolve, reject) => {
//   reject('fail');
// }).then()
//   .then()
//   .then(
//     data=>{
//       console.log('data: ', data);
//     },
//     err=>{
//       console.log('err: ',err);
//     }
//   )

// new Promise((resolve, reject) => {
//   resolve('data');
// })
//   .then(() => 'newData')
//   .then(console.log)