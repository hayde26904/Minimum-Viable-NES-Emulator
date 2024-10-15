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