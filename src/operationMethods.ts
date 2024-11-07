import { CPU } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export type operationMethod = (cpu: CPU, arg: number) => void;

export function brk(cpu: CPU, arg: number) : void {
    
}

export function lda(cpu: CPU, arg: number) : void {
    cpu.setAreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getAreg())} into A`);
}

export function ldx(cpu: CPU, arg: number) : void {
    cpu.setXreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getXreg())} into X`);
}

export function ldy(cpu: CPU, arg: number) : void {
    cpu.setYreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getYreg())} into Y`);
}

export function sta(cpu: CPU, arg: number) : void {
    cpu.writeToMem(cpu.getAreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
}

export function stx(cpu: CPU, arg: number) : void {
    cpu.writeToMem(cpu.getXreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}`);
}

export function sty(cpu: CPU, arg: number) : void {
    cpu.writeToMem(cpu.getYreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}`);
}

export function tax(cpu: CPU, arg: number) : void {
    cpu.setXreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into X`);
}

export function txa(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.getXreg());
    //console.log(`Transfered X ${Util.hex(cpu.getXreg())} into A`);
}

export function tay(cpu: CPU, arg: number) : void {
    cpu.setYreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into Y`);
}

export function tya(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.getYreg());
    //console.log(`Transfered Y ${Util.hex(cpu.getYreg())} into A`);
}

export function txs(cpu: CPU, arg: number) : void {
    cpu.setSP(cpu.getXreg());
    //console.log(`Stored X ${cpu.getXreg()} into stack pointer`);
}

export function tsx(cpu: CPU, arg: number) : void {
    cpu.setXreg(cpu.getSP());
    //console.log(`Stored SP ${cpu.getSP()} into X`);
}

export function inc(cpu: CPU, arg: number) : void {
    cpu.writeToMem(cpu.readFromMem(arg) + 1, arg);
    //console.log(`Incremented ${arg}`);
}

export function dec(cpu: CPU, arg: number) : void {
    cpu.writeToMem(cpu.readFromMem(arg) - 1, arg);
    //console.log(`Decremented ${arg}`);
}

export function inx(cpu: CPU, arg: number) : void {
    let val = cpu.getXreg() + 1;
    cpu.setXreg(val);
    //console.log(`Incremented X`);
}

export function dex(cpu: CPU, arg: number) : void {
    let val = cpu.getXreg() - 1;
    cpu.setXreg(val);
    //console.log(`Decremented X`);
}

export function iny(cpu: CPU, arg: number) : void {
    let val = cpu.getYreg() + 1;
    cpu.setYreg(val);
    //console.log(`Incremented Y`);
}

export function dey(cpu: CPU, arg: number) : void {
    let val = cpu.getYreg() - 1;
    cpu.setYreg(val);
    //console.log(`Decremented Y`);
}

export function jmp(cpu: CPU, arg: number) : void {
    cpu.setPC(arg);
    //console.log(`Jumped to ${Util.hex(arg)}`);
}

export function jsr(cpu: CPU, arg: number) : void {
    let from = cpu.getPC();
    let [lo, hi] = Util.addrToBytes(from);

    cpu.pushToStack(hi);
    cpu.pushToStack(lo);
    cpu.setPC(arg);
    //console.log(`Jumped to subroutine ${Util.hex(arg)} from ${Util.hex(Util.bytesToAddr(lo, hi))}`);
}

export function rts(cpu: CPU, arg: number) : void {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);

    cpu.setPC(returnAddr);
    //console.log(`Returned from subroutine to ${Util.hex(returnAddr)}`);
}

export function rti(cpu: CPU, arg: number) : void {

    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let statusReg = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);

    cpu.setStatusReg(statusReg);
    cpu.setPC(returnAddr);
    console.log(`Returned from interrupt to ${Util.hex(returnAddr)}`);
}

export function sec(cpu: CPU, arg: number) : void {
    cpu.setCarry();
    //console.log(`Set Carry`);
}

export function clc(cpu: CPU, arg: number) : void {
    cpu.clearCarry();
    //console.log(`Cleared Carry`);
}

export function adc(cpu: CPU, arg: number) : void {
    let c = Number(cpu.getFlags().C);
    let result = cpu.getAreg() + arg + c;
    cpu.setAreg(result);

    if(result > 0xFF){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    //console.log(`Added ${arg} to A`);
}

export function sbc(cpu: CPU, arg: number) : void {
    let c = Number(!cpu.getFlags().C);
    let result = cpu.getAreg() - arg - c;
    cpu.setAreg(result);
    
    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    //console.log(`Subtracted ${arg} from A`);
}

export function cmp(cpu: CPU, arg: number) : void {
    let result = cpu.getAreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    //console.log(`Compared A (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}

export function cpx(cpu: CPU, arg: number) : void {
    let result = cpu.getXreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    //console.log(`Compared X (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}

export function cpy(cpu: CPU, arg: number) : void {
    let result = cpu.getYreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    ///console.log(`Compared Y (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}

export function bit(cpu: CPU, arg: number) : void {
    
    cpu.setFlags(arg);
    if((arg & 0x80) === 0x80) cpu.setNegative(); else cpu.clearNegative();
    if((arg & 0x40) === 0x40) cpu.setOverflow(); else cpu.clearOverflow();
    ///console.log(`BIT with ${Util.hex(arg)}`);
}

export function beq(cpu: CPU, arg: number) : void {
    if(cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    //console.log(`Branch if equal (${Util.hex(arg)})`);
}

export function bne(cpu: CPU, arg: number) : void {
    if(!cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    //console.log(`Branch if not equal (${Util.hex(arg)})`);
}

export function bcc(cpu: CPU, arg: number) : void {
    if(!cpu.getFlags().C){
        cpu.setPC(arg);
    }
    //console.log(`Branch if carry clear (${Util.hex(arg)})`);
}

export function bcs(cpu: CPU, arg: number) : void {
    if(cpu.getFlags().C){
        cpu.setPC(arg);
    }
    //console.log(`Branch if carry set (${Util.hex(arg)})`);
}

export function bmi(cpu: CPU, arg: number) : void {
    if(cpu.getFlags().N){
        cpu.setPC(arg);
    }
    //console.log(`Branch if negative (${Util.hex(arg)})`);
}

export function bpl(cpu: CPU, arg: number) : void {
    if(!cpu.getFlags().N){
        cpu.setPC(arg);
    }
    //console.log(`Branch if negative (${Util.hex(arg)})`);
}

export function and(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.getAreg() & arg);
    //console.log(`AND ${arg} with A`);
}

export function ora(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.getAreg() | arg);
    //console.log(`OR ${arg} with A`);
}

export function eor(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.getAreg() ^ arg);
    //console.log(`EOR ${arg} with A`);
}

export function pha(cpu: CPU, arg: number) : void {
    cpu.pushToStack(cpu.getAreg());
    //console.log(`Pushed A to stack`);
}

export function pla(cpu: CPU, arg: number) : void {
    cpu.setAreg(cpu.pullFromStack());
    //console.log(`Pulled A from stack`);
}

export function php(cpu: CPU, arg: number) : void {
    cpu.pushToStack(cpu.getStatusReg());
    //console.log(`Pushed Status Reg to stack`);
}

export function plp(cpu: CPU, arg: number) : void {
    cpu.setStatusReg(cpu.pullFromStack());
    //console.log(`Pulled Status Reg from stack`);
}