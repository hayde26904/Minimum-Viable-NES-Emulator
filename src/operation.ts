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
    },

    {
        name: "sec",
        method: opMethods.sec,
        opCodes: [0x38],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "clc",
        method: opMethods.clc,
        opCodes: [0x18],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null]
    },

    {
        name: "adc",
        method: opMethods.adc,
        opCodes: [0x69, 0x65, 0x75, 0x6D, 0x7D, 0x79, 0x61, 0x71],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]

    },

    {
        name: "sbc",
        method: opMethods.sbc,
        opCodes: [0xE9, 0xE5, 0xF5, 0xED, 0xFD, 0xF9, 0xE1, 0xF1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "cmp",
        method: opMethods.cmp,
        opCodes: [0xC9, 0xC5, 0xD5, 0xCD, 0xDD, 0xD9, 0xC1, 0xD1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "cpx",
        method: opMethods.cpx,
        opCodes: [0xE0, 0xE4, 0xEC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "cpy",
        method: opMethods.cpy,
        opCodes: [0xC0, 0xC4, 0xCC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer]
    },

    {
        name: "beq",
        method: opMethods.beq,
        opCodes: [0xF0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "bne",
        method: opMethods.bne,
        opCodes: [0xD0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "bcc",
        method: opMethods.bcc,
        opCodes: [0x90],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "bcs",
        method: opMethods.bcs,
        opCodes: [0xB0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "bmi",
        method: opMethods.bmi,
        opCodes: [0x30],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "bpl",
        method: opMethods.bpl,
        opCodes: [0x10],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value]
    },

    {
        name: "and",
        method: opMethods.and,
        opCodes: [0x29, 0x25, 0x35, 0x2D, 0x3D, 0x39, 0x21, 0x31],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer, argTypes.pointer]
    },

];