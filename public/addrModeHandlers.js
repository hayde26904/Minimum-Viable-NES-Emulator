import { Util } from "./util";
export function implicit(bus, cpu, args, argType) {
    return null;
}
export function immediate(bus, cpu, args, argType) {
    return args[0];
}
export function zeropage(bus, cpu, args, argType) {
    return args[0];
}
export function zeropageX(bus, cpu, args, argType) {
    return args[0] + cpu.getXreg();
}
export function zeropageY(bus, cpu, args, argType) {
    return args[0] + cpu.getYreg();
}
export function absolute(bus, cpu, args, argType) {
    return Util.bytesToAddr(args[0], args[1]);
}
export function absoluteX(bus, cpu, args, argType) {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
}
export function absoluteY(bus, cpu, args, argType) {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getYreg();
}
export function accumulator(bus, cpu, args, argType) {
    return cpu.getAreg();
}
export function relative(bus, cpu, args, argType) {
    let isNegative = (args[0] & 0x80) === 0x80;
    //DO NOT TOUCH THESE NUMBERS THEY ARE MAGIC
    let offset = isNegative ? args[0] - 254 : args[0] + 2;
    return cpu.getPC() + offset;
}
export function indirect(bus, cpu, args, argType) {
    let addr = Util.bytesToAddr(args[0], args[1]);
    let lo = bus.read(addr);
    let hi = bus.read(addr + 1);
    return Util.bytesToAddr(lo, hi);
}
export function indirectX(bus, cpu, args, argType) {
    let addr = Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
    let lo = bus.read(addr);
    let hi = bus.read(addr + 1);
    return Util.bytesToAddr(lo, hi);
}
export function indirectY(bus, cpu, args, argType) {
    let addr = Util.bytesToAddr(args[0], args[1]);
    let lo = bus.read(addr);
    let hi = bus.read(addr + 1);
    return Util.bytesToAddr(lo, hi) + cpu.getYreg();
}
