let fs = require('fs')

fs.readFile('./name.txt','utf8',(err,data) => {
  fs.readFile(data, 'utf8',(err,data) => {
    fs.readFile(data,'utf8',(err,data) => {
      console.log(data);
    })
  })
})

// Here is an example of method chaining I bet you’ve seen:
const a = 'Some awesome string';
const b = a.toUpperCase().replace('ST', '').toLowerCase();

console.log(b);


function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

read('./name.txt')
  .then(read)
  .then(read)
  .then(
    (data) => {
      console.log(data);
    },
    err => {
      console.log(err);
    }
  )

// libraries: bluebird、Q、ES6-Promise