const nodeAbi = require('node-abi')
 
console.log("Node: " + nodeAbi.getAbi('8.17.0', 'node'))
console.log("Electron: " + nodeAbi.getAbi('2.0.18', 'electron'))

const find = require('find-process');

find('pid', 12345)
  .then(function (list) {
    console.log(list);
  }, function (err) {
    console.log(err.stack || err);
  })