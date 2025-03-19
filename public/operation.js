import * as opMethods from './operationMethods';
//value is immediate value and pointer gets the value from the address
export var argTypes;
(function (argTypes) {
    argTypes[argTypes["none"] = 0] = "none";
    argTypes[argTypes["value"] = 1] = "value";
    argTypes[argTypes["reference"] = 2] = "reference";
})(argTypes || (argTypes = {}));
export const ops = [
    {
        name: "brk",
        method: opMethods.brk,
        opCodes: [0x00],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [1]
    },
    {
        name: "lda",
        method: opMethods.lda,
        opCodes: [0xA9, 0xA5, 0xB5, 0xAD, 0xBD, 0xA1, 0xB1],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "sta",
        method: opMethods.sta,
        opCodes: [0x85, 0x95, 0x8D, 0x9D, 0x99, 0x81, 0x91],
        addrModes: [2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [3, 4, 4, 5, 5, 6, 6]
    },
    {
        name: "ldx",
        method: opMethods.ldx,
        opCodes: [0xA2, 0xA6, 0xB6, 0xAE, 0xBE],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 4 /* addrModes.ZEROPAGE_Y */, 5 /* addrModes.ABSOLUTE */, 7 /* addrModes.ABSOLUTE_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4]
    },
    {
        name: "stx",
        method: opMethods.stx,
        opCodes: [0x86, 0x96, 0x8E],
        addrModes: [2 /* addrModes.ZEROPAGE */, 4 /* addrModes.ZEROPAGE_Y */, 5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.value, argTypes.value, argTypes.value],
        cycles: [3, 4, 4]
    },
    {
        name: "ldy",
        method: opMethods.ldy,
        opCodes: [0xA0, 0xA4, 0xB4, 0xAC, 0xBC],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4]
    },
    {
        name: "sty",
        method: opMethods.sty,
        opCodes: [0x84, 0x94, 0x8C],
        addrModes: [2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.value, argTypes.value, argTypes.value],
        cycles: [3, 4, 4]
    },
    {
        name: "tax",
        method: opMethods.tax,
        opCodes: [0xAA],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "txa",
        method: opMethods.txa,
        opCodes: [0x8A],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "tay",
        method: opMethods.tay,
        opCodes: [0xA8],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "tya",
        method: opMethods.tya,
        opCodes: [0x98],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "tsx",
        method: opMethods.tsx,
        opCodes: [0xBA],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "txs",
        method: opMethods.txs,
        opCodes: [0x9A],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "jmp",
        method: opMethods.jmp,
        opCodes: [0x4C, 0x6C],
        addrModes: [5 /* addrModes.ABSOLUTE */, 10 /* addrModes.INDIRECT */],
        argTypes: [argTypes.value, argTypes.reference],
        cycles: [3, 5]
    },
    {
        name: "jsr",
        method: opMethods.jsr,
        opCodes: [0x20],
        addrModes: [5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.value],
        cycles: [6]
    },
    {
        name: "rts",
        method: opMethods.rts,
        opCodes: [0x60],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [6]
    },
    {
        name: "rti",
        method: opMethods.rti,
        opCodes: [0x40],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [6]
    },
    {
        name: "inc",
        method: opMethods.inc,
        opCodes: [0xE6, 0xF6, 0xEE, 0xFE],
        addrModes: [2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [5, 6, 6, 7]
    },
    {
        name: "dec",
        method: opMethods.dec,
        opCodes: [0xC6, 0xD6, 0xCE, 0xDE],
        addrModes: [2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [5, 6, 6, 7]
    },
    {
        name: "inx",
        method: opMethods.inx,
        opCodes: [0xE8],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "dex",
        method: opMethods.dex,
        opCodes: [0xCA],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "iny",
        method: opMethods.iny,
        opCodes: [0xC8],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "dey",
        method: opMethods.dey,
        opCodes: [0x88],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "sec",
        method: opMethods.sec,
        opCodes: [0x38],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "clc",
        method: opMethods.clc,
        opCodes: [0x18],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [2]
    },
    {
        name: "adc",
        method: opMethods.adc,
        opCodes: [0x69, 0x65, 0x75, 0x6D, 0x7D, 0x79, 0x61, 0x71],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "sbc",
        method: opMethods.sbc,
        opCodes: [0xE9, 0xE5, 0xF5, 0xED, 0xFD, 0xF9, 0xE1, 0xF1],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "cmp",
        method: opMethods.cmp,
        opCodes: [0xC9, 0xC5, 0xD5, 0xCD, 0xDD, 0xD9, 0xC1, 0xD1],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "cpx",
        method: opMethods.cpx,
        opCodes: [0xE0, 0xE4, 0xEC],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4]
    },
    {
        name: "cpy",
        method: opMethods.cpy,
        opCodes: [0xC0, 0xC4, 0xCC],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4]
    },
    {
        name: "bit",
        method: opMethods.bit,
        opCodes: [0x24, 0x2C],
        addrModes: [2 /* addrModes.ZEROPAGE */, 5 /* addrModes.ABSOLUTE */],
        argTypes: [argTypes.reference, argTypes.reference],
        cycles: [3, 4]
    },
    {
        name: "beq",
        method: opMethods.beq,
        opCodes: [0xF0],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "bne",
        method: opMethods.bne,
        opCodes: [0xD0],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "bcc",
        method: opMethods.bcc,
        opCodes: [0x90],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "bcs",
        method: opMethods.bcs,
        opCodes: [0xB0],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "bmi",
        method: opMethods.bmi,
        opCodes: [0x30],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "bpl",
        method: opMethods.bpl,
        opCodes: [0x10],
        addrModes: [9 /* addrModes.RELATIVE */],
        argTypes: [argTypes.value],
        cycles: [2]
    },
    {
        name: "and",
        method: opMethods.and,
        opCodes: [0x29, 0x25, 0x35, 0x2D, 0x3D, 0x39, 0x21, 0x31],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "ora",
        method: opMethods.ora,
        opCodes: [0x09, 0x05, 0x15, 0x0D, 0x1D, 0x19, 0x01, 0x11],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "eor",
        method: opMethods.eor,
        opCodes: [0x49, 0x45, 0x55, 0x4D, 0x5D, 0x59, 0x41, 0x51],
        addrModes: [1 /* addrModes.IMMEDIATE */, 2 /* addrModes.ZEROPAGE */, 3 /* addrModes.ZEROPAGE_X */, 5 /* addrModes.ABSOLUTE */, 6 /* addrModes.ABSOLUTE_X */, 7 /* addrModes.ABSOLUTE_Y */, 11 /* addrModes.INDIRECT_X */, 12 /* addrModes.INDIRECT_Y */],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2, 3, 4, 4, 4, 4, 6, 5]
    },
    {
        name: "pha",
        method: opMethods.pha,
        opCodes: [0x48],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [3]
    },
    {
        name: "pla",
        method: opMethods.pla,
        opCodes: [0x68],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [4]
    },
    {
        name: "php",
        method: opMethods.php,
        opCodes: [0x08],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [3]
    },
    {
        name: "plp",
        method: opMethods.plp,
        opCodes: [0x28],
        addrModes: [0 /* addrModes.IMPLICIT */],
        argTypes: [null],
        cycles: [4]
    },
];
export const opcodeMap = new Map();
ops.forEach(op => {
    op.opCodes.forEach((opcode, index) => {
        opcodeMap.set(opcode, {
            name: op.name,
            method: op.method,
            addrMode: op.addrModes[index],
            argType: op.argTypes[index],
            cycles: op.cycles[index]
        });
    });
});
