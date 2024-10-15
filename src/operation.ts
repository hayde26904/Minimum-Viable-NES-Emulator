import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as opMethods from './operationMethods';
import { RAM } from './ram';
import { immediate } from './addrModeHandlers';

export type operationMethod = (cpu: CPU, ram: RAM, arg: number) => void;

//value is immediate value and pointer gets the value from the address
export enum argTypes {
    none,
    value,
    pointer,
}

export interface Operation {
    name: string;
    method: operationMethod;
    opCodes: Array<number>;
    addrModes: Array<number>;
    argTypes: Array<number>;
}

export const ops: Array<Operation> = [
    {
        name: "brk",
        method: opMethods.brk,
        opCodes: [0x00],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]

    },

    {
        name: "lda",
        method: opMethods.lda,
        opCodes: [0xA9, 0xA5, 0xB5, 0xAD, 0xBD, 0xA1, 0xB1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "sta",
        method: opMethods.sta,
        opCodes: [0x85, 0x95, 0x8D, 0x9D, 0x99, 0x81, 0x91],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value]
    },

    {
        name: "ldx",
        method: opMethods.ldx,
        opCodes: [0xA2, 0xA6, 0xB6, 0xAE, 0xBE],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_Y, addrModes.ABSOLUTE, addrModes.ABSOLUTE_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "stx",
        method: opMethods.stx,
        opCodes: [0x86, 0x96, 0x8E],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_Y, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.value, argTypes.value]
    },

    {
        name: "ldy",
        method: opMethods.ldy,
        opCodes: [0xA0, 0xA4, 0xB4, 0xAC, 0xBC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "sty",
        method: opMethods.ldy,
        opCodes: [0x84, 0x94, 0x8C],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.value, argTypes.value]
    },

    {
        name: "tax",
        method: opMethods.tax,
        opCodes: [0xAA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "txa",
        method: opMethods.txa,
        opCodes: [0x8A],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "tay",
        method: opMethods.tay,
        opCodes: [0xA8],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "tya",
        method: opMethods.tya,
        opCodes: [0x98],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "tsx",
        method: opMethods.tsx,
        opCodes: [0xBA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "txs",
        method: opMethods.txs,
        opCodes: [0x9A],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "jmp",
        method: opMethods.jmp,
        opCodes: [0x4C, 0x6C],
        addrModes: [addrModes.ABSOLUTE, addrModes.INDIRECT],
        argTypes: [argTypes.value, argTypes.value]
    },

    {
        name: "jsr",
        method: opMethods.jsr,
        opCodes: [0x20],
        addrModes: [addrModes.ABSOLUTE],
        argTypes: [argTypes.value]
    },

    {
        name: "rts",
        method: opMethods.rts,
        opCodes: [0x60],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "inc",
        method: opMethods.inc,
        opCodes: [0xE6, 0xF6, 0xEE, 0xFE],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value]
    },

    {
        name: "dec",
        method: opMethods.dec,
        opCodes: [0xC6, 0xD6, 0xCE, 0xDE],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value]
    },

    {
        name: "inx",
        method: opMethods.inx,
        opCodes: [0xE6],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "dex",
        method: opMethods.dex,
        opCodes: [0xCA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "iny",
        method: opMethods.iny,
        opCodes: [0xC8],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "dey",
        method: opMethods.dey,
        opCodes: [0x88],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    }

];

export const opMap: Map<number, Operation> = new Map<number, Operation>([

    [0x00, {name: "BRK", method: opMethods.brk, addrMode: addrModes.IMPLICIT, argType: null}],

    [0xA9, {name: "LDA", method: opMethods.lda, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA5, {name: "LDA", method: opMethods.lda, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB5, {name: "LDA", method: opMethods.lda, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.pointer}],
    [0xAD, {name: "LDA", method: opMethods.lda, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBD, {name: "LDA", method: opMethods.lda, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.pointer}],
    [0xB9, {name: "LDA", method: opMethods.lda, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.pointer}],
    [0xA1, {name: "LDA", method: opMethods.lda, addrMode: addrModes.INDIRECT_X, argType: argTypes.pointer}],
    [0xB1, {name: "LDA", method: opMethods.lda, addrMode: addrModes.INDIRECT_Y, argType: argTypes.pointer}],

    [0xE6, {name: "INC", method: opMethods.inc, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0xF6, {name: "INC", method: opMethods.inc, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0xEE, {name: "INC", method: opMethods.inc, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0xFE, {name: "INC", method: opMethods.inc, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.value}],

    [0xA2, {name: "LDX", method: opMethods.ldx, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA6, {name: "LDX", method: opMethods.ldx, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB6, {name: "LDX", method: opMethods.ldx, addrMode: addrModes.ZEROPAGE_Y, argType: argTypes.pointer}],
    [0xAE, {name: "LDX", method: opMethods.ldx, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBE, {name: "LDX", method: opMethods.ldx, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.pointer}],

    [0xA0, {name: "LDY", method: opMethods.ldy, addrMode: addrModes.IMMEDIATE, argType: argTypes.value}],
    [0xA4, {name: "LDY", method: opMethods.ldy, addrMode: addrModes.ZEROPAGE, argType: argTypes.pointer}],
    [0xB4, {name: "LDY", method: opMethods.ldy, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.pointer}],
    [0xAC, {name: "LDY", method: opMethods.ldy, addrMode: addrModes.ABSOLUTE, argType: argTypes.pointer}],
    [0xBC, {name: "LDY", method: opMethods.ldy, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.pointer}],

    [0x85, {name: "STA", method: opMethods.sta, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x95, {name: "STA", method: opMethods.sta, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0x8D, {name: "STA", method: opMethods.sta, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x9D, {name: "STA", method: opMethods.sta, addrMode: addrModes.ABSOLUTE_X, argType: argTypes.value}],
    [0x99, {name: "STA", method: opMethods.sta, addrMode: addrModes.ABSOLUTE_Y, argType: argTypes.value}],
    [0x81, {name: "STA", method: opMethods.sta, addrMode: addrModes.INDIRECT_X, argType: argTypes.value}],
    [0x91, {name: "STA", method: opMethods.sta, addrMode: addrModes.INDIRECT_Y, argType: argTypes.value}],

    [0x86, {name: "STX", method: opMethods.stx, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x96, {name: "STX", method: opMethods.stx, addrMode: addrModes.ZEROPAGE_Y, argType: argTypes.value}],
    [0x8E, {name: "STX", method: opMethods.stx, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],

    [0x84, {name: "STY", method: opMethods.sty, addrMode: addrModes.ZEROPAGE, argType: argTypes.value}],
    [0x94, {name: "STY", method: opMethods.sty, addrMode: addrModes.ZEROPAGE_X, argType: argTypes.value}],
    [0x8C, {name: "STY", method: opMethods.sty, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],

    [0xAA, {name: "TAX", method: opMethods.tax, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x8A, {name: "TXA", method: opMethods.txa, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0xA8, {name: "TAY", method: opMethods.tay, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x98, {name: "TYA", method: opMethods.tya, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0xBA, {name: "TSX", method: opMethods.tsx, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x9A, {name: "TXS", method: opMethods.txs, addrMode: addrModes.IMPLICIT, argType: argTypes.none}],

    [0x4C, {name: "JMP", method: opMethods.jmp, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    [0x6C, {name: "JMP", method: opMethods.jmp, addrMode: addrModes.INDIRECT, argType: argTypes.value}],

    [0x20, {name: "JSR", method: opMethods.jsr, addrMode: addrModes.ABSOLUTE, argType: argTypes.value}],
    
    [0x60, {name: "RTS", method: opMethods.rts, addrMode: addrModes.IMPLICIT, argType: argTypes.none}]
    
]);