/*
  Promise.resolve()
  Promise.reject()
  Promise.prototype.catch()
  Promise.prototype.finally()
  Promise.all()
  Promise.race(）
 */
const PromiseOri = require('./4');

// Promise.resolve
module.exports = class Promise extends PromiseOri {
  static resolve(data) {
    return new Promise((resolve,reject) => {
      resolve(data);
    })
  }

  static reject(reason) {
    return new Promise((resolve,reject) => {
      reject(reason);
    })
  }

}

PromiseOri.prototype.catch = function(errCallback){
  return this.then(null,errCallback)
}
/*
The finally() method returns a Promise. When the promise is settled, i.e either fulfilled or rejected, the specified callback function is executed.
This provides a way for code to be run whether the promise was fulfilled successfully or rejected once the Promise has been dealt with.

This helps to avoid duplicating code in both the promise's then() and catch() handlers.
 */
PromiseOri.prototype.finally = function(callback) {
  return this.then((value)=>{
    return Promise.resolve(callback()).then(()=>value)
  },(reason)=>{
    return Promise.resolve(callback()).then(()=>{throw reason})
  })
}

// Promise.resolve(new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject('not ok');
//   }, 3000);
// })).then(data=>{
//   console.log(data,'success')
// }).catch(err=>{
//   console.log(err,'error')
// })


// Promise.reject(456)
//   .then(data=>{
//     console.log(data,'onThen')
//   })
//   .catch(err=>{
//     console.log(err,'onCatch')
//   })
//   .finally(()=>{
//     console.log('onFinally');
//     // return new Promise((resolve, reject)=>{
//     //   setTimeout(() => {
//     //     resolve(123);
//     //   }, 3000);
//     // })
//   })


