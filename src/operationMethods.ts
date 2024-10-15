import { CPU } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export function brk(cpu: CPU, ram: RAM, arg: number) : void {
    
}

export function lda(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setAreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getAreg())} into A`);
}

export function ldx(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setXreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getXreg())} into X`);
}

export function ldy(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setYreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getYreg())} into Y`);
}

export function sta(cpu: CPU, ram: RAM, arg: number) : void {
    ram.write(cpu.getAreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
}

export function stx(cpu: CPU, ram: RAM, arg: number) : void {
    ram.write(cpu.getXreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}`);
}

export function sty(cpu: CPU, ram: RAM, arg: number) : void {
    ram.write(cpu.getYreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}`);
}

export function tax(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setXreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into X`);
}

export function txa(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setAreg(cpu.getXreg());
    //console.log(`Transfered X ${Util.hex(cpu.getXreg())} into A`);
}

export function tay(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setYreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into Y`);
}

export function tya(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setAreg(cpu.getYreg());
    //console.log(`Transfered Y ${Util.hex(cpu.getYreg())} into A`);
}

export function txs(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setSP(cpu.getXreg());
    //console.log(`Stored X ${cpu.getXreg()} into stack pointer`);
}

export function tsx(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setXreg(cpu.getSP());
    //console.log(`Stored SP ${cpu.getSP()} into X`);
}

export function inc(cpu: CPU, ram: RAM, arg: number) : void {
    ram.write(ram.read(arg) + 1, arg);
    //console.log(`Incremented ${arg}`);
}

export function dec(cpu: CPU, ram: RAM, arg: number) : void {
    ram.write(ram.read(arg) - 1, arg);
    //console.log(`Decremented ${arg}`);
}

export function inx(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setXreg(cpu.getXreg() + 1);
    //console.log(`Incremented X`);
}

export function dex(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setXreg(cpu.getXreg() - 1);
    //console.log(`Decremented X`);
}

export function iny(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setYreg(cpu.getYreg() + 1);
    //console.log(`Incremented Y`);
}

export function dey(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setYreg(cpu.getYreg() - 1);
    //console.log(`Decremented Y`);
}

export function jmp(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setPC(arg);
    //console.log(`Jumped to ${Util.hex(arg)}`);
}

export function jsr(cpu: CPU, ram: RAM, arg: number) : void {
    let from = cpu.getPC();
    let [lo, hi] = Util.addrToBytes(from);

    cpu.pushToStack(hi);
    cpu.pushToStack(lo);
    cpu.setPC(arg);
    //cpu.skipPCinc = true;
    //console.log(`Jumped to subroutine ${Util.hex(arg)} from ${Util.hex(Util.bytesToAddr(lo, hi))}`);
}

export function sec(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.setCarry();
    //console.log(`Set Carry`);
}

export function clc(cpu: CPU, ram: RAM, arg: number) : void {
    cpu.clearCarry();
    //console.log(`Cleared Carry`);
}

export function adc(cpu: CPU, ram: RAM, arg: number) : void {
    let c = Number(cpu.getFlags().C);
    cpu.setAreg(cpu.getAreg() + arg + c);
    //console.log(`Added ${arg} to A`);
}

export function sbc(cpu: CPU, ram: RAM, arg: number) : void {
    let c = Number(cpu.getFlags().C);
    cpu.setAreg(cpu.getAreg() - arg - c);
    //console.log(`Subtracted ${arg} from A`);
}

export function rts(cpu: CPU, ram: RAM, arg: number) : void {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);

    cpu.setPC(returnAddr);
    console.log(`Returned from subroutine to ${Util.hex(returnAddr)}`);
}