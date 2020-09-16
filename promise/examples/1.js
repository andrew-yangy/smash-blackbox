// passing executor function
const p1 = new Promise((resolve, reject) => {
  console.log('create a promise');
  resolve('successData');
  // will only execute the first resolve or reject
  reject('faiiiiillll')
})

console.log("after new promise");

const p2 = p1.then(data => {
  console.log('p2 then: ', data)
  throw new Error('fail')
})

const p3 = p2.then(data => {
  console.log('p3 then: ', data)
}, err => {
  console.log('fail', err)
})

