import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as ops from './operations';
import { RAM } from './ram';

export type operationMethod = (cpu: CPU, ram: RAM, arg) => void;

export interface Operation {
    method: operationMethod;
    addrMode: number;
    cycles: number;
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([
    [0xA9, {method: ops.LDA.immediate, addrMode: addrModes.IMMEDIATE, cycles: 1}],

]);