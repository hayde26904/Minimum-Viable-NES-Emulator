import { CPU } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export function lda(cpu: CPU, ram: RAM, arg: number) : void{
    cpu.setAreg(arg);
    console.log(`Loaded ${Util.hex(cpu.getAreg())} into A`);
}

export function sta(cpu: CPU, ram: RAM, arg: number) : void{
    ram.write(cpu.getAreg(), arg);
    console.log(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
}

export function jmp(cpu: CPU, ram: RAM, arg: number) : void{
    cpu.setPC(arg);
    console.log(`Jumped to ${Util.hex(arg)}`);
}