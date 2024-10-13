import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as ops from './operationMethods';
import { RAM } from './ram';
import { immediate } from './addrModeHandlers';

export type operationMethod = (cpu: CPU, ram: RAM, arg : number) => void;

//value is immediate value and pointer gets the value from the address
export enum argTypes {
    none,
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

    [0xA2, {name: "LDX", method: ops.ldx, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA6, {name: "LDX", method: ops.ldx, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB6, {name: "LDX", method: ops.ldx, addrMode: addrModes.ZEROPAGE_Y, argType: argTypes.pointer}],
    [0xAE, {name: "LDX", method: ops.ldx, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBE, {name: "LDX", method: ops.ldx, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.pointer}],

    [0xA0, {name: "LDY", method: ops.ldy, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA4, {name: "LDY", method: ops.ldy, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB4, {name: "LDY", method: ops.ldy, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.pointer}],
    [0xAC, {name: "LDY", method: ops.ldy, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBC, {name: "LDY", method: ops.ldy, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.pointer}],

    [0x85, {name: "STA", method: ops.sta, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x95, {name: "STA", method: ops.sta, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0x8D, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x9D, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.value}],
    [0x99, {name: "STA", method: ops.sta, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.value}],
    [0x81, {name: "STA", method: ops.sta, addrMode: addrModes.INDIRECT_X, argType: argTypes.value}],
    [0x91, {name: "STA", method: ops.sta, addrMode: addrModes.INDIRECT_Y, argType: argTypes.value}],

    [0x86, {name: "STX", method: ops.stx, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x96, {name: "STX", method: ops.stx, addrMode: addrModes.ZEROPAGE_Y, argType: argTypes.value}],
    [0x8E, {name: "STX", method: ops.stx, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],

    [0x84, {name: "STY", method: ops.sty, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x94, {name: "STY", method: ops.sty, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0x8C, {name: "STY", method: ops.sty, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],

    [0xAA, {name: "TAX", method: ops.tax, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x8A, {name: "TXA", method: ops.txa, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0xA8, {name: "TAY", method: ops.tay, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x98, {name: "TYA", method: ops.tya, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0xBA, {name: "TSX", method: ops.tsx, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x9A, {name: "TXS", method: ops.txs, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x4C, {name: "JMP", method: ops.jmp, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x6C, {name: "JMP", method: ops.jmp, addrMode: addrModes.INDIRECT, argType: argTypes.value}],

    [0x20, {name: "JSR", method: ops.jsr, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    
    [0x60, {name: "RTS", method: ops.rts, addrMode: addrModes.IMPLICIT, argType: argTypes.none}]
    
]);