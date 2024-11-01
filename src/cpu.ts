import { Memory } from "./memory";
import { ops } from "./operation";
import { opcodeMap } from "./operation";
import { RAM } from "./ram";
import { ROM } from "./rom";
import * as addrModeHandlers from "./addrModeHandlers";
import * as headerParser from "./headerParser";
import { argTypes } from "./operation";
import { Util } from "./util";
import { Bus } from "./bus";

export interface CPUflags {
    Z: boolean;
    N: boolean;
    C: boolean;
    I: boolean;
    O: boolean;
    D: boolean;
    B: boolean;
}

export const enum addrModes {
    IMPLICIT,
    IMMEDIATE,
    ZEROPAGE,
    ZEROPAGE_X,
    ZEROPAGE_Y,
    ABSOLUTE,
    ABSOLUTE_X,
    ABSOLUTE_Y,
    ACCUMULATOR,
    RELATIVE,
    INDIRECT,
    INDIRECT_X, //(a,x)
    INDIRECT_Y //(a),y
}

export const addrModeSizeMap : Map<number,number> = new Map<number,number>([
    [addrModes.IMPLICIT, 1],
    [addrModes.IMMEDIATE, 2],
    [addrModes.ZEROPAGE, 2],
    [addrModes.ZEROPAGE_X, 2],
    [addrModes.ZEROPAGE_Y, 2],
    [addrModes.ABSOLUTE, 3],
    [addrModes.ABSOLUTE_X, 3],
    [addrModes.ABSOLUTE_Y, 3],
    [addrModes.ACCUMULATOR, 1],
    [addrModes.RELATIVE, 2],
    [addrModes.INDIRECT, 3],
    [addrModes.INDIRECT_X, 2],
    [addrModes.INDIRECT_Y, 2]
]);

export const addrModeHandlerMap : Map<number, addrModeHandlers.addrModeHandler> = new Map<number, addrModeHandlers.addrModeHandler>([
    [addrModes.IMPLICIT, addrModeHandlers.implicit],
    [addrModes.IMMEDIATE, addrModeHandlers.immediate],
    [addrModes.ZEROPAGE, addrModeHandlers.zeropage],
    [addrModes.ZEROPAGE_X, addrModeHandlers.zeropageX],
    [addrModes.ZEROPAGE_Y, addrModeHandlers.zeropageY],
    [addrModes.ABSOLUTE, addrModeHandlers.absolute],
    [addrModes.ABSOLUTE_X, addrModeHandlers.absoluteX],
    [addrModes.ABSOLUTE_Y, addrModeHandlers.absoluteY],
    [addrModes.ACCUMULATOR, addrModeHandlers.accumulator],
    [addrModes.RELATIVE, addrModeHandlers.relative],
    [addrModes.INDIRECT, addrModeHandlers.indirect],
    [addrModes.INDIRECT_X, addrModeHandlers.indirectX],
    [addrModes.INDIRECT_Y, addrModeHandlers.indirectY]
]);

export class CPU {

    private bus: Bus;
    private stack: RAM;
    private Areg: number = 0;
    private Xreg: number = 0;
    private Yreg: number = 0;
    private PC: number = 0;
    private SP: number = 0;
    private Cflag: boolean = false;
    private Zflag: boolean = false;
    private Nflag: boolean = false;
    private Iflag: boolean = false;
    private Oflag: boolean = false;
    private Dflag: boolean = false;
    private Bflag: boolean = false;

    private NMIvector: number = 0;
    private resetVector: number = 0;
    private IRQvector: number = 0;

    constructor() {

        this.stack = new RAM(0x100); // need an extra one because 0 indexing

    }

    public setBus(bus : Bus){
        this.bus = bus;
    }

    public readFromMem(address : number){
        return this.bus.read(address);
    }

    public writeToMem(value : number, address : number){
        this.bus.write(value, address);
    }

    public reset(): void {
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

    public loadProgram(rom: ROM): void {

        this.NMIvector = Util.bytesToAddr(this.bus.read(0xfffa), this.bus.read(0xfffb));
        this.resetVector = Util.bytesToAddr(this.bus.read(0xfffc), this.bus.read(0xfffd));

        console.log(`NMI: ${Util.hex(this.NMIvector)}`);
        console.log(`RESET: ${Util.hex(this.resetVector)}`);

        this.PC = this.resetVector;


    }

    //returns number of cycles
    public executeNextOperation(): number {

        let opcode = this.bus.read(this.PC);
        //let operation = ops.find(op => op.opCodes.includes(opcode));
        let operation = opcodeMap.get(opcode);

        if(operation){
            
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

            for(let i = 0; i < args.length; i++){
                args[i] = this.bus.read(this.PC + i + 1);
            }

            let arg = addrModeHandlerMap.get(opAddrMode)(this.bus, this, args, opArgType);
            let evaluatedArg;
            switch (opArgType) {
                case argTypes.value:
                    evaluatedArg = arg;
                    break
                case argTypes.reference:
                    evaluatedArg = this.bus.read(arg);
                    break;
            }

            let oldPC = this.PC;
            this.PC += opSize;
            opMethod(this, evaluatedArg);

            // DO NOT ENABLE THIS AT FULL SPEED EMULATION IT WILL MAKE THE BROWSER HANG
            //console.log(`${Util.hex(oldPC)}: ${opName.toUpperCase()} ${Util.hex(evaluatedArg)}`, `A: ${Util.hex(this.Areg)} X: ${Util.hex(this.Xreg)} Y: ${Util.hex(this.Yreg)}`);

            return opCycles;

        } else {
            //console.log(`Invalid or unimplemented opcode: ${Util.hex(opcode)}`);
            this.PC++;
            return 1; //1 cycle I guess
        }
    }

    public goToNMI(){
        let [lo, hi] = Util.addrToBytes(this.getPC());
        this.setInterruptDisable();
        this.pushToStack(this.getStatusReg());
        this.pushToStack(hi);
        this.pushToStack(lo);
        this.setPC(this.NMIvector);
    }

    public setPC(addr: number): void {
        this.PC = addr;
        //console.log("SET PC: ", Util.hex(this.PC));
    }

    public getPC(): number {
        return this.PC;
    }

    public setSP(value: number): void {
        this.SP = value & 0xFF;
        //console.log("SET SP: ", Util.hex(this.SP));
    }

    public getSP(): number {
        return this.SP;
    }

    public setAreg(value: number): void {
        this.setFlags(value);
        this.Areg = value & 0xFF;
        //console.log(`Set A to ${this.Areg}`);
        //console.log(`Carry: ${Number(this.Cflag)}`);
    }

    public setXreg(value: number): void {
        this.Xreg = value & 0xFF;
    }

    public setYreg(value: number): void {
        this.Yreg = value & 0xFF;
    }

    public getAreg(): number {
        return this.Areg;
    }

    public getXreg(): number {
        return this.Xreg;
    }

    public getYreg(): number {
        return this.Yreg;
    }

    public getStatusReg(): number {
        let flags = this.getFlags();

        return Util.boolsToBitmask([flags.N, flags.O, true, flags.B, flags.D, flags.I, flags.Z, flags.C]);

    }

    public setStatusReg(byte : number) : void{
        let guh : boolean;
        [this.Nflag, this.Oflag, guh, this.Bflag, this.Dflag, this.Iflag, this.Zflag, this.Cflag] = Util.bitmaskToBools(byte);
    }

    public pushToStack(value : number): void{
        this.SP--;
        this.stack.write(value, this.getSP());
        console.log(`Pushed ${Util.hex(value)} SP: ${Util.hex(this.SP)}`);
    }

    public pullFromStack() : number {
        let value = this.stack.read(this.getSP());
        this.SP++;
        console.log(`Pulled SP: ${Util.hex(value)}  new SP: ${Util.hex(this.SP)}`);
        return value;
    }

    public setCarry(){
        this.Cflag = true;
    }

    public clearCarry(){
        this.Cflag = false;
    }

    public setZero(){
        this.Zflag = true;
    }

    public clearZero(){
        this.Zflag = false;
    }

    public setNegative(){
        this.Nflag = true;
    }

    public clearNegative(){
        this.Nflag = false;
    }

    public setOverflow(){
        this.Oflag = true;
    }

    public clearOverflow(){
        this.Oflag = false;
    }

    public setInterruptDisable(){
        this.Iflag = true;
    }

    public clearInterruptDisable(){
        this.Iflag = false;
    }

    public setFlags(value: number): void {

        if(value > 0xFF){
            this.Cflag = true;
        } else if(value < 0x00){
            this.Cflag = false;
        }

        this.Zflag = (value === 0);
        this.Nflag = (value & 0x80) === 0x80;

    };

    public getFlags(): CPUflags {
        return {
            Z: this.Zflag,
            N: this.Nflag,
            C: this.Cflag,
            I: this.Iflag,
            O: this.Oflag,
            D: this.Dflag,
            B: this.Bflag
        }
    }

}