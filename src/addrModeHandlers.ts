import { CPU } from "./cpu";
import { RAM } from "./ram";
import { Util } from "./util";

//Handles every addressing mode and outputs the final value which is then used in the operation.

type addrModeHandler = (ram : RAM, cpu : CPU, args : Uint8Array) => number;

function implicit(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    return null;
}

function immediate(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    return args[0];
}

function zeropage(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    return ram.read(args[0]);
}

function zeropageX(ram : RAM, cpu : CPU, args : Uint8Array) : number{
    return ram.read(args[0] + cpu.getXreg());
}

function zeropageY(ram : RAM, cpu : CPU, args : Uint8Array) : number{
    return ram.read(args[0] + cpu.getYreg());
}

function absolute(ram : RAM, cpu : CPU, args : Uint8Array) : number{
    return ram.read(Util.bytesToAddr(args[0], args[1]));
}

function absoluteX(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    return ram.read(Util.bytesToAddr(args[0], args[1]) + cpu.getXreg());
}

function absoluteY(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    return ram.read(Util.bytesToAddr(args[0], args[1]) + cpu.getYreg());
}

function accumulator(ram : RAM, cpu : CPU, args : Uint8Array) : number{
    return cpu.getAreg();
}

function relative(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    let isNegative = (args[0] & 0x80) === 0x80;
    let offset = isNegative ? args[0] - 256 : args[0];
    return ram.read(cpu.getPC() + offset);
}

function indirect(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    let addr = ram.read(Util.bytesToAddr(args[0], args[1]));
    return ram.read(addr);
}

function indirectX(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    let addr = ram.read(Util.bytesToAddr(args[0], args[1]) + cpu.getXreg());
    return ram.read(addr);
}

function indirectY(ram : RAM, cpu : CPU, args : Uint8Array) : number {
    let addr = ram.read(Util.bytesToAddr(args[0], args[1]));
    return ram.read(addr + cpu.getYreg());
}