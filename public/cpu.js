import { opcodeMap } from "./operation";
import { RAM } from "./ram";
import * as addrModeHandlers from "./addrModeHandlers";
import { argTypes } from "./operation";
import { Util } from "./util";
export const addrModeSizeMap = new Map([
    [0 /* addrModes.IMPLICIT */, 1],
    [1 /* addrModes.IMMEDIATE */, 2],
    [2 /* addrModes.ZEROPAGE */, 2],
    [3 /* addrModes.ZEROPAGE_X */, 2],
    [4 /* addrModes.ZEROPAGE_Y */, 2],
    [5 /* addrModes.ABSOLUTE */, 3],
    [6 /* addrModes.ABSOLUTE_X */, 3],
    [7 /* addrModes.ABSOLUTE_Y */, 3],
    [8 /* addrModes.ACCUMULATOR */, 1],
    [9 /* addrModes.RELATIVE */, 2],
    [10 /* addrModes.INDIRECT */, 3],
    [11 /* addrModes.INDIRECT_X */, 2],
    [12 /* addrModes.INDIRECT_Y */, 2]
]);
export const addrModeHandlerMap = new Map([
    [0 /* addrModes.IMPLICIT */, addrModeHandlers.implicit],
    [1 /* addrModes.IMMEDIATE */, addrModeHandlers.immediate],
    [2 /* addrModes.ZEROPAGE */, addrModeHandlers.zeropage],
    [3 /* addrModes.ZEROPAGE_X */, addrModeHandlers.zeropageX],
    [4 /* addrModes.ZEROPAGE_Y */, addrModeHandlers.zeropageY],
    [5 /* addrModes.ABSOLUTE */, addrModeHandlers.absolute],
    [6 /* addrModes.ABSOLUTE_X */, addrModeHandlers.absoluteX],
    [7 /* addrModes.ABSOLUTE_Y */, addrModeHandlers.absoluteY],
    [8 /* addrModes.ACCUMULATOR */, addrModeHandlers.accumulator],
    [9 /* addrModes.RELATIVE */, addrModeHandlers.relative],
    [10 /* addrModes.INDIRECT */, addrModeHandlers.indirect],
    [11 /* addrModes.INDIRECT_X */, addrModeHandlers.indirectX],
    [12 /* addrModes.INDIRECT_Y */, addrModeHandlers.indirectY]
]);
export class CPU {
    constructor() {
        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
        this.Iflag = false;
        this.Oflag = false;
        this.Dflag = false;
        this.Bflag = false;
        this.NMIvector = 0;
        this.resetVector = 0;
        this.IRQvector = 0;
        this.stack = new RAM(0x100); // need an extra one because 0 indexing
    }
    setBus(bus) {
        this.bus = bus;
    }
    readFromMem(address) {
        return this.bus.read(address);
    }
    writeToMem(value, address) {
        this.bus.write(value, address);
    }
    reset() {
        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
        this.Iflag = false;
        this.Oflag = false;
        this.Dflag = false;
        this.NMIvector = 0;
        this.resetVector = 0;
        this.IRQvector = 0;
    }
    loadProgram(rom) {
        this.NMIvector = Util.bytesToAddr(this.bus.read(0xfffa), this.bus.read(0xfffb));
        this.resetVector = Util.bytesToAddr(this.bus.read(0xfffc), this.bus.read(0xfffd));
        console.log(`NMI: ${Util.hex(this.NMIvector)}`);
        console.log(`RESET: ${Util.hex(this.resetVector)}`);
        this.PC = this.resetVector;
    }
    //returns number of cycles
    executeNextOperation() {
        let opcode = this.bus.read(this.PC);
        //let operation = ops.find(op => op.opCodes.includes(opcode));
        let operation = opcodeMap.get(opcode);
        if (operation) {
            let opName = operation.name;
            let opMethod = operation.method;
            /*let opcodeIndex = operation.opCodes.indexOf(opcode);
            let opAddrMode = operation.addrModes[opcodeIndex];
            let opArgType = operation.argTypes[opcodeIndex];
            let opCycles = operation.cycles[opcodeIndex];*/
            let opAddrMode = operation.addrMode;
            let opArgType = operation.argType;
            let opCycles = operation.cycles;
            let opSize = addrModeSizeMap.get(opAddrMode);
            let numArgs = opSize - 1;
            let args = new Uint8Array(numArgs);
            for (let i = 0; i < args.length; i++) {
                args[i] = this.bus.read(this.PC + i + 1);
            }
            let arg = addrModeHandlerMap.get(opAddrMode)(this.bus, this, args, opArgType);
            let evaluatedArg;
            switch (opArgType) {
                case argTypes.value:
                    evaluatedArg = arg;
                    break;
                case argTypes.reference:
                    evaluatedArg = this.bus.read(arg);
                    break;
            }
            let oldPC = this.PC;
            this.PC += opSize;
            opMethod(this, evaluatedArg);
            // DO NOT ENABLE THIS AT FULL SPEED EMULATION IT WILL MAKE THE BROWSER HANG
            //console.log(`${Util.hex(oldPC)}: ${opName.toUpperCase()} ${Util.hex(arg)}`, `A: ${Util.hex(this.Areg)} X: ${Util.hex(this.Xreg)} Y: ${Util.hex(this.Yreg)}`);
            return opCycles;
        }
        else {
            //console.log(`Invalid or unimplemented opcode: ${Util.hex(opcode)}`);
            this.PC++;
            return 1; //1 cycle I guess
        }
    }
    goToNMI() {
        let [lo, hi] = Util.addrToBytes(this.getPC());
        this.setInterruptDisable();
        this.pushToStack(this.getStatusReg());
        this.pushToStack(hi);
        this.pushToStack(lo);
        this.setPC(this.NMIvector);
    }
    setPC(addr) {
        this.PC = addr;
        //console.log("SET PC: ", Util.hex(this.PC));
    }
    getPC() {
        return this.PC;
    }
    setSP(value) {
        this.SP = value & 0xFF;
        //console.log("SET SP: ", Util.hex(this.SP));
    }
    getSP() {
        return this.SP;
    }
    setAreg(value) {
        this.setFlags(value);
        this.Areg = value & 0xFF;
        //console.log(`Set A to ${this.Areg}`);
        //console.log(`Carry: ${Number(this.Cflag)}`);
    }
    setXreg(value) {
        this.Xreg = value & 0xFF;
        this.setFlags(this.Xreg);
    }
    setYreg(value) {
        this.Yreg = value & 0xFF;
        this.setFlags(this.Yreg);
    }
    getAreg() {
        return this.Areg;
    }
    getXreg() {
        return this.Xreg;
    }
    getYreg() {
        return this.Yreg;
    }
    getStatusReg() {
        let flags = this.getFlags();
        return Util.boolsToBitmask([flags.N, flags.O, true, flags.B, flags.D, flags.I, flags.Z, flags.C]);
    }
    setStatusReg(byte) {
        let guh;
        [this.Nflag, this.Oflag, guh, this.Bflag, this.Dflag, this.Iflag, this.Zflag, this.Cflag] = Util.bitmaskToBools(byte);
    }
    pushToStack(value) {
        this.SP--;
        this.stack.write(value, this.getSP());
        //console.log(`Pushed ${Util.hex(value)} SP: ${Util.hex(this.SP)}`);
    }
    pullFromStack() {
        let value = this.stack.read(this.getSP());
        this.SP++;
        //console.log(`Pulled SP: ${Util.hex(value)}  new SP: ${Util.hex(this.SP)}`);
        return value;
    }
    setCarry() {
        this.Cflag = true;
    }
    clearCarry() {
        this.Cflag = false;
    }
    setZero() {
        this.Zflag = true;
    }
    clearZero() {
        this.Zflag = false;
    }
    setNegative() {
        this.Nflag = true;
    }
    clearNegative() {
        this.Nflag = false;
    }
    setOverflow() {
        this.Oflag = true;
    }
    clearOverflow() {
        this.Oflag = false;
    }
    setInterruptDisable() {
        this.Iflag = true;
    }
    clearInterruptDisable() {
        this.Iflag = false;
    }
    setFlags(value) {
        this.Zflag = (value === 0);
        this.Nflag = (value & 0x80) === 0x80;
    }
    ;
    getFlags() {
        return {
            Z: this.Zflag,
            N: this.Nflag,
            C: this.Cflag,
            I: this.Iflag,
            O: this.Oflag,
            D: this.Dflag,
            B: this.Bflag
        };
    }
}
