import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as ops from './operationMethods';
import { RAM } from './ram';

export type operationMethod = (cpu: CPU, ram: RAM, arg : number) => void;

export interface Operation {
    method: operationMethod;
    addrMode: number;
    cycles: number;
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([
    [0xA9, {method: ops.lda, addrMode: addrModes.IMMEDIATE, cycles: 2}],
    [0xA5, {method: ops.lda, addrMode: addrModes.ZEROPAGE, cycles: 3}],
    [0xB5, {method: ops.lda, addrMode: addrModes.ZEROPAGE_X, cycles: 4}],
    [0xAD, {method: ops.lda, addrMode: addrModes.ABSOLUTE, cycles: 4}],
    [0xBD, {method: ops.lda, addrMode: addrModes.ABSOLUTE_X, cycles: 4}],
    [0xB9, {method: ops.lda, addrMode: addrModes.ABSOLUTE_Y, cycles: 4}],
    [0xA1, {method: ops.lda, addrMode: addrModes.INDIRECT_X, cycles: 6}],
    [0xB1, {method: ops.lda, addrMode: addrModes.INDIRECT_Y, cycles: 5}],

    [0x85, {method: ops.sta, addrMode: addrModes.ZEROPAGE, cycles: 3}],
    [0x95, {method: ops.sta, addrMode: addrModes.ZEROPAGE_X, cycles: 4}],
    [0x8D, {method: ops.sta, addrMode: addrModes.ABSOLUTE, cycles: 4}],
    [0x9D, {method: ops.sta, addrMode: addrModes.ABSOLUTE_X, cycles: 5}],
    [0x99, {method: ops.sta, addrMode: addrModes.ABSOLUTE_Y, cycles: 5}],
    [0x81, {method: ops.sta, addrMode: addrModes.INDIRECT_X, cycles: 6}],
    [0x91, {method: ops.sta, addrMode: addrModes.INDIRECT_Y, cycles: 6}],

    [0x4C, {method: ops.jmp, addrMode: addrModes.ABSOLUTE, cycles: 3}],
    [0x6C, {method: ops.jmp, addrMode: addrModes.INDIRECT, cycles: 5}],
]);