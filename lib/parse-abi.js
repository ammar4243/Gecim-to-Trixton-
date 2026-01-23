// This is a helper script to parse and understand the contract ABI
const fs = require('fs');
const abi = require('./contract-abi.json');

const functions = abi.filter(item => item.type === 'function' && item.stateMutability === 'view');
console.log('View Functions in Contract:');
functions.forEach(fn => {
  console.log(`- ${fn.name}(${fn.inputs.map(i => i.name).join(', ')})`);
});

console.log('\nWrite Functions in Contract:');
const writeFunctions = abi.filter(item => item.type === 'function' && item.stateMutability !== 'view');
writeFunctions.forEach(fn => {
  console.log(`- ${fn.name}(${fn.inputs.map(i => i.name).join(', ')})`);
});
