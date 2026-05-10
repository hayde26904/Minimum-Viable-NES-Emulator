import { Util } from "./util";
export function brk(cpu, arg) {
}
export function lda(cpu, arg) {
    cpu.setAreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getAreg())} into A`);
}
export function ldx(cpu, arg) {
    cpu.setXreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getXreg())} into X`);
}
export function ldy(cpu, arg) {
    cpu.setYreg(arg);
    //console.log(`Loaded ${Util.hex(cpu.getYreg())} into Y`);
}
export function sta(cpu, arg) {
    cpu.writeToMem(cpu.getAreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
}
export function stx(cpu, arg) {
    cpu.writeToMem(cpu.getXreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}`);
}
export function sty(cpu, arg) {
    cpu.writeToMem(cpu.getYreg(), arg);
    //console.log(`Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}`);
}
export function tax(cpu, arg) {
    cpu.setXreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into X`);
}
export function txa(cpu, arg) {
    cpu.setAreg(cpu.getXreg());
    //console.log(`Transfered X ${Util.hex(cpu.getXreg())} into A`);
}
export function tay(cpu, arg) {
    cpu.setYreg(cpu.getAreg());
    //console.log(`Transfered A ${Util.hex(cpu.getAreg())} into Y`);
}
export function tya(cpu, arg) {
    cpu.setAreg(cpu.getYreg());
    //console.log(`Transfered Y ${Util.hex(cpu.getYreg())} into A`);
}
export function txs(cpu, arg) {
    cpu.setSP(cpu.getXreg());
    //console.log(`Stored X ${cpu.getXreg()} into stack pointer`);
}
export function tsx(cpu, arg) {
    cpu.setXreg(cpu.getSP());
    //console.log(`Stored SP ${cpu.getSP()} into X`);
}
export function inc(cpu, arg) {
    cpu.writeToMem(cpu.readFromMem(arg) + 1, arg);
    //console.log(`Incremented ${arg}`);
}
export function dec(cpu, arg) {
    cpu.writeToMem(cpu.readFromMem(arg) - 1, arg);
    //console.log(`Decremented ${arg}`);
}
export function inx(cpu, arg) {
    let val = cpu.getXreg() + 1;
    cpu.setXreg(val);
    //console.log(`Incremented X`);
}
export function dex(cpu, arg) {
    let val = cpu.getXreg() - 1;
    cpu.setXreg(val);
    //console.log(`Decremented X`);
}
export function iny(cpu, arg) {
    let val = cpu.getYreg() + 1;
    cpu.setYreg(val);
    //console.log(`Incremented Y`);
}
export function dey(cpu, arg) {
    let val = cpu.getYreg() - 1;
    cpu.setYreg(val);
    //console.log(`Decremented Y`);
}
export function jmp(cpu, arg) {
    cpu.setPC(arg);
    //console.log(`Jumped to ${Util.hex(arg)}`);
}
export function jsr(cpu, arg) {
    let from = cpu.getPC();
    let [lo, hi] = Util.addrToBytes(from);
    cpu.pushToStack(hi);
    cpu.pushToStack(lo);
    cpu.setPC(arg);
    //console.log(`Jumped to subroutine ${Util.hex(arg)} from ${Util.hex(Util.bytesToAddr(lo, hi))}`);
}
export function rts(cpu, arg) {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);
    cpu.setPC(returnAddr);
    //console.log(`Returned from subroutine to ${Util.hex(returnAddr)}`);
}
export function rti(cpu, arg) {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let statusReg = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);
    cpu.setStatusReg(statusReg);
    cpu.setPC(returnAddr);
    console.log(`Returned from interrupt to ${Util.hex(returnAddr)}`);
}
export function sec(cpu, arg) {
    cpu.setCarry();
    //console.log(`Set Carry`);
}
export function clc(cpu, arg) {
    cpu.clearCarry();
    //console.log(`Cleared Carry`);
}
export function adc(cpu, arg) {
    let c = Number(cpu.getFlags().C);
    let result = cpu.getAreg() + arg + c;
    cpu.setAreg(result);
    if (result > 0xFF) {
        cpu.setCarry();
    }
    else {
        cpu.clearCarry();
    }
    //console.log(`Added ${arg} to A`);
}
export function sbc(cpu, arg) {
    let c = Number(!cpu.getFlags().C);
    let result = cpu.getAreg() - arg - c;
    cpu.setAreg(result);
    if (result < 0) {
        cpu.clearCarry();
    }
    else {
        cpu.setCarry();
    }
    //console.log(`Subtracted ${arg} from A`);
}
export function cmp(cpu, arg) {
    let result = cpu.getAreg() - arg;
    cpu.setFlags(result);
    if (result < 0) {
        cpu.clearCarry();
    }
    else {
        cpu.setCarry();
    }
    //console.log(`Compared A (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}
export function cpx(cpu, arg) {
    let result = cpu.getXreg() - arg;
    cpu.setFlags(result);
    if (result < 0) {
        cpu.clearCarry();
    }
    else {
        cpu.setCarry();
    }
    //console.log(`Compared X (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}
export function cpy(cpu, arg) {
    let result = cpu.getYreg() - arg;
    cpu.setFlags(result);
    if (result < 0) {
        cpu.clearCarry();
    }
    else {
        cpu.setCarry();
    }
    ///console.log(`Compared Y (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
}
export function bit(cpu, arg) {
    cpu.setFlags(arg);
    if ((arg & 0x80) === 0x80)
        cpu.setNegative();
    else
        cpu.clearNegative();
    if ((arg & 0x40) === 0x40)
        cpu.setOverflow();
    else
        cpu.clearOverflow();
    ///console.log(`BIT with ${Util.hex(arg)}`);
}
export function beq(cpu, arg) {
    if (cpu.getFlags().Z) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if equal (${Util.hex(arg)})`);
}
export function bne(cpu, arg) {
    if (!cpu.getFlags().Z) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if not equal (${Util.hex(arg)})`);
}
export function bcc(cpu, arg) {
    if (!cpu.getFlags().C) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if carry clear (${Util.hex(arg)})`);
}
export function bcs(cpu, arg) {
    if (cpu.getFlags().C) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if carry set (${Util.hex(arg)})`);
}
export function bmi(cpu, arg) {
    if (cpu.getFlags().N) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if negative (${Util.hex(arg)})`);
}
export function bpl(cpu, arg) {
    if (!cpu.getFlags().N) {
        cpu.setPC(arg);
    }
    //console.log(`Branch if negative (${Util.hex(arg)})`);
}
export function and(cpu, arg) {
    cpu.setAreg(cpu.getAreg() & arg);
    //console.log(`AND ${arg} with A`);
}
export function ora(cpu, arg) {
    cpu.setAreg(cpu.getAreg() | arg);
    //console.log(`OR ${arg} with A`);
}
export function eor(cpu, arg) {
    cpu.setAreg(cpu.getAreg() ^ arg);
    //console.log(`EOR ${arg} with A`);
}
export function pha(cpu, arg) {
    cpu.pushToStack(cpu.getAreg());
    //console.log(`Pushed A to stack`);
}
export function pla(cpu, arg) {
    cpu.setAreg(cpu.pullFromStack());
    //console.log(`Pulled A from stack`);
}
export function php(cpu, arg) {
    cpu.pushToStack(cpu.getStatusReg());
    //console.log(`Pushed Status Reg to stack`);
}
export function plp(cpu, arg) {
    cpu.setStatusReg(cpu.pullFromStack());
    //console.log(`Pulled Status Reg from stack`);
}
