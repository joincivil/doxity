import { getFunctionSignature } from '../helpers';

export default function (contract, source) {

  console.log('in parse-abi')

  function determineFileLineNumber(method, source){

    // code here to determine fileLineNumber
    // split source by newline into array of strings
    // look for first match in array and return index of match 
    console.log('in determineFileLineNumber...')
    console.log(`source: ${source}`)
    let fileLineNumber = '8'

    return fileLineNumber
  }

  return contract.abi.map((method) => {
  
    // get find relevent docs
    const inputParams = method.inputs || [];
    const signature = method.name && `${method.name}(${inputParams.map(i => i.type).join(',')})`;
    const devDocs = (contract.devdoc.methods || {})[signature] || {};
    const userDocs = (contract.userdoc.methods || {})[signature] || {};
    // map abi inputs to devdoc inputs
    const params = devDocs.params || {};
    const inputs = inputParams.map(param => ({ ...param, description: params[param.name] }));
    // don't write this
    delete devDocs.params;

    // START HACK workaround pending https://github.com/ethereum/solidity/issues/1277
    // TODO map outputs properly once compiler splits them out
    // in the meantime, use json array
    // parse devDocs.return as a json object
    let outputs;
    try {
      const outputParams = JSON.parse(devDocs.return);
      outputs = method.outputs.map(param => ({ ...param, description: outputParams[param.name] }));
    } catch (e) {
      outputs = method.outputs;
    }
    // END HACK

    const fileLineNumber = determineFileLineNumber(method, source)

    return {
      ...method,
      ...devDocs,
      ...userDocs,
      fileLineNumber,
      inputs,
      outputs,
      signature,
      signatureHash: signature && getFunctionSignature(signature),
    };
  });
}
