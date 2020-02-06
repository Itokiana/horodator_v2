const nodeAbi = require('node-abi')
 
console.log("Node: " + nodeAbi.getAbi('8.17.0', 'node'))
console.log("Electron: " + nodeAbi.getAbi('2.0.18', 'electron'))

var monitor = require('active-window');
 
