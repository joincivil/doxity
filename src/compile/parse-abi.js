import { getFunctionSignature } from '../helpers';

export default function (contract, contractName, source) {

  function determineFileLineNumber(method, source){

    if (method.type == 'fallback'){
      return null
    } 

    const sourceByLineArray = source.split("\n")
    let lineNumber = null
    let lineNumberFound = false
    let constructorFoundCount = 0

    sourceByLineArray.forEach((line, index) => {
      if(method.type == 'constructor'){
        
        if (line.includes(contractName)){
          constructorFoundCount = constructorFoundCount + 1
        }   
        if (constructorFoundCount > 1 && !lineNumberFound){
          lineNumber = index + 1
          lineNumberFound = true
        }
      } else if (method.type == 'function' || method.type == 'event') {
          if (line.includes(method.name) && !lineNumberFound){
            lineNumber = index + 1
            lineNumberFound = true
          }
      } 
    })

    return (lineNumber ? lineNumber.toString() : lineNumber)
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
