import * as ops from './operationMethods';

export class Operation {
    public method: ops.operationMethod;
    public numArgs: number;
    constructor(method: ops.operationMethod, numArgs: number){
        this.method = method;
        this.numArgs = numArgs;
    }
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([
    [0xA9, new Operation(ops.ldaImmediate, 1)]
]);