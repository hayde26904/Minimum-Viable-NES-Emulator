import { CPU } from './cpu';
import { Memory } from './memory';
import * as ops from './operations';
import { RAM } from './ram';

export type operationMethod = (cpu: CPU, ram: RAM, args: Uint8Array) => void;

export class Operation {
    public method: operationMethod;
    public numArgs: number;
    public cycles: number;

    constructor(method: operationMethod, numArgs: number, cycles: number = 1) {
        this.method = method;
        this.numArgs = numArgs;
    }
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([
    [0xA9, new Operation(ops.LDA.immediate, 1, 2)],
    [0xA5, new Operation(ops.LDA.zeroPage, 1, 3)],
    [0xB5, new Operation(ops.LDA.zeroPageX, 1, 4)],
    [0xAD, new Operation(ops.LDA.absolute, 2, 4)],
    [0xBD, new Operation(ops.LDA.absoluteX, 2, 4)],
    [0xB9, new Operation(ops.LDA.absoluteY, 2, 4)],
    [0xA1, new Operation(ops.LDA.indirectX, 1, 6)],
    [0xB1, new Operation(ops.LDA.indirectY, 1, 5)],

    [0x85, new Operation(ops.STA.zeroPage, 1, 3)],
    [0x95, new Operation(ops.STA.zeroPageX, 1, 4)],
    [0x8D, new Operation(ops.STA.absolute, 2, 4)],
    [0x9D, new Operation(ops.STA.absoluteX, 2, 5)],
    [0x99, new Operation(ops.STA.absoluteY, 2, 5)],
    [0x81, new Operation(ops.STA.indirectX, 1, 6)],
    [0x91, new Operation(ops.STA.indirectY, 1, 6)],

    [0xA2, new Operation(ops.LDX.immediate, 1, 2)],
    [0xA6, new Operation(ops.LDX.zeroPage, 1, 3)],
    [0xB6, new Operation(ops.LDX.zeroPageY, 1, 4)],
    [0xAE, new Operation(ops.LDX.absolute, 2, 4)],
    [0xBE, new Operation(ops.LDX.absoluteY, 2, 4)],

    [0x4C, new Operation(ops.JMP.absolute, 2, 3)],
    [0x6C, new Operation(ops.JMP.indirect, 2, 5)]


]);