import { Memory } from "./memory";
import { ops } from "./operation";
import { RAM } from "./ram";
import { ROM } from "./rom";
import * as addrModeHandlers from "./addrModeHandlers";
import * as headerParser from "./headerParser";
import { argTypes } from "./operation";
import { Util } from "./util";

export interface CPUflags {
    Z: boolean;
    N: boolean;
    C: boolean;
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
    [addrModes.INDIRECT_X, 3],
    [addrModes.INDIRECT_Y, 3]
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

    private ram: RAM;
    private stack: RAM;
    private Areg: number;
    private Xreg: number;
    private Yreg: number;
    private PC: number;
    private SP: number;
    private Cflag: boolean;
    private Zflag: boolean;
    private Nflag: boolean;

    constructor() {

        this.ram = new RAM(0xffff);
        this.stack = new RAM(0x100); // need an extra one because 0 indexing

        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
    }

    public loadProgram(rom: ROM): void {
        const romInfo = headerParser.parseiNES1(rom);
        const romBytes = rom.getMemory().slice(16);
        const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
        const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1))

        console.log(romInfo);
        console.log(Util.Uint8ArrayToHex(prg.getMemory()));

        for(let i = 0; i < 0x7fff; i++){
            this.ram.write(prg.read(i % prg.getSize()), 0x8000 + i); // mirrors it if it doesn't fill in one go
        }

        console.log(this.ram.getMemory());

        const NMI = Util.bytesToAddr(this.ram.read(0xfffa), this.ram.read(0xfffb));
        const reset = Util.bytesToAddr(this.ram.read(0xfffc), this.ram.read(0xfffd));

        console.log(`RESET: ${Util.hex(reset)}`);
        console.log(`NMI: ${Util.hex(NMI)}`);

        this.PC = reset;
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
    }

    public executeOperation(): void {

        let ram = this.ram;
        let opcode = ram.read(this.PC);
        let operation = ops.find(op => op.opCodes.includes(opcode));

        if(operation){
            
            let opName = operation.name;
            let opMethod = operation.method;
            let opcodeIndex = operation.opCodes.indexOf(opcode);
            let opAddrMode = operation.addrModes[opcodeIndex];
            let opArgType = operation.argTypes[opcodeIndex];
            let opSize = addrModeSizeMap.get(opAddrMode);
            let numArgs = opSize - 1;
            let args = new Uint8Array(numArgs);

            for(let i = 0; i < args.length; i++){
                args[i] = ram.read(this.PC + i + 1);
            }

            let arg = addrModeHandlerMap.get(opAddrMode)(ram, this, args, opArgType);
            switch (opArgType) {
                case argTypes.value:
                    break
                case argTypes.pointer:
                    arg = ram.read(arg);
                    break;
            }

            console.log(`${opName} ${Util.hex(arg)}`);

            this.PC += opSize;
            opMethod(this, ram, arg);
        } else {
            console.log(`Invalid or unimplemented opcode: ${Util.hex(opcode)}`);
            this.PC++;
        }
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
        console.log("SET SP: ", Util.hex(this.SP));
    }

    public getSP(): number {
        return this.SP;
    }

    public setAreg(value: number): void {
        this.Areg = value & 0xFF;
        this.setFlags(value);
        //console.log("SET AREG: ", Util.hex(this.Areg));
    }

    public setXreg(value: number): void {
        this.Xreg = value & 0xFF;
        this.setFlags(value);
    }

    public setYreg(value: number): void {
        this.Yreg = value & 0xFF;
        this.setFlags(value);
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

    public pushToStack(value : number): void{
        this.SP--;
        this.stack.write(value, this.getSP());
        console.log(`SP: ${Util.hex(this.SP)}`);
    }

    public pullFromStack() : number {
        let value = this.stack.read(this.getSP());
        this.SP++;
        console.log(`SP: ${Util.hex(this.SP)}`);
        return value;
    }

    public setCarry(){
        this.Cflag = true;
    }

    public clearCarry(){
        this.Cflag = false;
    }

    public setFlags(value: number): void {
        if(value === -1) return;
        this.Zflag = value === 0;
        this.Nflag = (value & 0x80) === 0x80;
    };

    public getFlags(): CPUflags {
        return {
            Z: this.Zflag,
            N: this.Nflag,
            C: this.Cflag
        }
    }

}