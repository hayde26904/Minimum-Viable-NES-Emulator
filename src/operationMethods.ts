import { CPU } from "./cpu";
import { Memory } from "./memory";

export type operationMethod = (cpu: CPU, mem: Memory, args: Uint8Array) => number;

export function ldaImmediate(cpu: CPU, mem: Memory, args: Uint8Array): number {
    let val = args[0];
    cpu.setAreg(val);
    return val;
}