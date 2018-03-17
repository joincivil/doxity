import { getFunctionSignature } from '../helpers';

const FALLBACK = 'fallback';
const CONSTRUCTOR = 'constructor';
const FUNCTION = 'function';
const EVENT = 'event';

function determineFileLineNumberIfExists(method, contractName, source) {
    if (method.type == FALLBACK) {
        return undefined;
    }

    const sourceByLineArray = source.split('\n');
    let lineNumber = undefined;

    sourceByLineArray.forEach((line, index) => {
        let isEventDeclaration;
        let isMethodDeclaration;
        let isPropertyDeclaration;
        let isConstructorDeclaration;

        switch (method.type) {
            case EVENT:
                isEventDeclaration = line.includes(`event ${method.name}(`);
                break;
            case FUNCTION:
                isMethodDeclaration = line.includes(`function ${method.name}(`);
                isPropertyDeclaration = line.includes(`public ${method.name}`);
                break;
            case CONSTRUCTOR:
                isConstructorDeclaration = line.includes(`function ${contractName}(`);
                break;
            default:
                process.stdout.write(`method type "${method.type}" is not supported`);
        }

        if (isEventDeclaration || isMethodDeclaration || isPropertyDeclaration || isConstructorDeclaration) {
            lineNumber = index + 1;
        }
    });

    return lineNumber;
}

export default function(contract, contractName, source) {
    return contract.abi.map(method => {
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

        const fileLineNumber = determineFileLineNumberIfExists(method, contractName, source);

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
