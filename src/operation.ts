import { CPU } from './cpu';
import { Memory } from './memory';
import * as ops from './operations';
import { RAM } from './ram';

export type operationMethod = (cpu: CPU, ram: RAM, args: Uint8Array) => void;

export class Operation {
    public method: operationMethod;
    public numArgs: number;
    constructor(method: operationMethod, numArgs: number){
        this.method = method;
        this.numArgs = numArgs;
    }
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([
    [0xA9, new Operation(ops.LDA.immediate, 1)],
    [0xA5, new Operation(ops.LDA.zeroPage, 1)],
    [0xAD, new Operation(ops.LDA.absolute, 2)],
    [0x85, new Operation(ops.STA.zeroPage, 1)],
    [0x4C, new Operation(ops.JMP.absolute, 2)],
]);