import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as ops from './operationMethods';
import { RAM } from './ram';
import { immediate } from './addrModeHandlers';

export type operationMethod = (cpu: CPU, ram: RAM, arg : number) => void;

export enum argTypes {
    value,
    pointer,
}

export interface Operation {
    method: operationMethod;
    addrMode: number;
    argType: number;
    cycles: number;
}

// IF YOU WANT VALUE FROM MEM ADDRESS, USE POINTER

export const opMap: Map<number, Operation> = new Map<number, Operation>([

    [0xA9, {method: ops.lda, addrMode: addrModes.IMMEDIATE, argType: argTypes.value, cycles: 2}],
    [0xA5, {method: ops.lda, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer, cycles: 3}],
    [0xB5, {method: ops.lda, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.pointer, cycles: 4}],
    [0xAD, {method: ops.lda, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer, cycles: 4}],
    [0xBD, {method: ops.lda, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.pointer, cycles: 4}],
    [0xB9, {method: ops.lda, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.pointer, cycles: 4}],
    [0xA1, {method: ops.lda, addrMode: addrModes.INDIRECT_X, argType: argTypes.pointer, cycles: 6}],
    [0xB1, {method: ops.lda, addrMode: addrModes.INDIRECT_Y, argType: argTypes.pointer, cycles: 5}],

    [0x85, {method: ops.sta, addrMode: addrModes.ZEROPAGE, argType: argTypes.value, cycles: 3}],
    [0x95, {method: ops.sta, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value, cycles: 4}],
    [0x8D, {method: ops.sta, addrMode: addrModes.ABSOLUTE, argType: argTypes.value, cycles: 4}],
    [0x9D, {method: ops.sta, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.value, cycles: 5}],
    [0x99, {method: ops.sta, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.value, cycles: 5}],
    [0x81, {method: ops.sta, addrMode: addrModes.INDIRECT_X, argType: argTypes.value, cycles: 6}],
    [0x91, {method: ops.sta, addrMode: addrModes.INDIRECT_Y, argType: argTypes.value, cycles: 6}],

    [0x4C, {method: ops.jmp, addrMode: addrModes.ABSOLUTE, argType: argTypes.value, cycles: 3}],
    [0x6C, {method: ops.jmp, addrMode: addrModes.INDIRECT, argType: argTypes.value, cycles: 5}],
    
]);