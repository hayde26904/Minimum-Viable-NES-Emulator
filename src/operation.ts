import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as ops from './operationMethods';
import { RAM } from './ram';
import { immediate } from './addrModeHandlers';

export type operationMethod = (cpu: CPU, ram: RAM, arg : number) => void;

//value is immediate value and pointer gets the value from the address
export enum argTypes {
    value,
    pointer,
}

export interface Operation {
    name: string;
    method: operationMethod;
    addrMode: number;
    argType: number;
}

export const opMap: Map<number, Operation> = new Map<number, Operation>([

    [0x00, {name: "BRK", method: ops.brk, addrMode: addrModes.IMPLICIT, argType: null}],

    [0xA9, {name: "LDA", method: ops.lda, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA5, {name: "LDA", method: ops.lda, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB5, {name: "LDA", method: ops.lda, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.pointer}],
    [0xAD, {name: "LDA", method: ops.lda, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBD, {name: "LDA", method: ops.lda, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.pointer}],
    [0xB9, {name: "LDA", method: ops.lda, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.pointer}],
    [0xA1, {name: "LDA", method: ops.lda, addrMode: addrModes.INDIRECT_X, argType: argTypes.pointer}],
    [0xB1, {name: "LDA", method: ops.lda, addrMode: addrModes.INDIRECT_Y, argType: argTypes.pointer}],

    [0x85, {name: "STA", method: ops.sta, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x95, {name: "STA", method: ops.sta, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0x8D, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x9D, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.value}],
    [0x99, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.value}],
    [0x81, {name: "STA", method: ops.sta, addrMode: addrModes.INDIRECT_X, argType: argTypes.value}],
    [0x91, {name: "STA", method: ops.sta, addrMode: addrModes.INDIRECT_Y, argType: argTypes.value}],

    [0x4C, {name: "JMP", method: ops.jmp, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x6C, {name: "JMP", method: ops.jmp, addrMode: addrModes.INDIRECT, argType: argTypes.value}],
    
]);