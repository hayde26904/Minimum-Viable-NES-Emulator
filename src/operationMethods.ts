import { CPU } from "./cpu";
import { Memory } from "./memory";

export type operationMethod = (cpu: CPU, mem: Memory, args: Uint8Array) => void;

export function ldaImmediate(cpu: CPU, mem: Memory, args: Uint8Array): void {
    let val = args[0];
    cpu.setAreg(val);
}

export function jmpAbsolute(cpu: CPU, mem: Memory, args: Uint8Array): void {
    let addr = args[0] | args[1] << 8;
    cpu.setPC(addr);
}