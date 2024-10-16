import { CPU } from "./cpu";
import { RAM } from "./ram";
import { Util } from "./util";
import { argTypes } from "./operation";

//Handles every addressing mode and outputs the final value which is then used in the operation.

export type addrModeHandler = (ram : RAM, cpu : CPU, args : Uint8Array, argType : number) => number;

export function implicit(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return null;
}

export function immediate(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return args[0];
}

export function zeropage(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return args[0];
}

export function zeropageX(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number{
    return args[0] + cpu.getXreg();
}

export function zeropageY(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number{
    return args[0] + cpu.getYreg();
}

export function absolute(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number{
    return Util.bytesToAddr(args[0], args[1]);
}

export function absoluteX(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
}

export function absoluteY(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getYreg();
}

export function accumulator(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number{
    return cpu.getAreg();
}

export function relative(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    let isNegative = (args[0] & 0x80) === 0x80;
    let offset = args[0] & 0b01111111;
    return isNegative ? cpu.getPC() - offset : cpu.getPC() + offset;
}

export function indirect(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return ram.read(Util.bytesToAddr(args[0], args[1]));
}

export function indirectX(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return ram.read(Util.bytesToAddr(args[0], args[1]) + cpu.getXreg());
}

export function indirectY(ram : RAM, cpu : CPU, args : Uint8Array, argType : number) : number {
    return (Util.bytesToAddr(args[0], args[1])) + cpu.getYreg();
}