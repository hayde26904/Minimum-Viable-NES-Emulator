import { Memory } from "./memory";
import { opMap } from "./operation";
import { RAM } from "./ram";
import { ROM } from "./rom";
import * as addrModeHandlers from "./addrModeHandlers";
import { argTypes } from "./operation";

const prgStart = 0x8000;

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
    [addrModes.IMMEDIATE, 1],
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

    private Areg: number;
    private Xreg: number;
    private Yreg: number;
    private PC: number;
    private SP: number;
    private Cflag: boolean;
    private Zflag: boolean;
    private Nflag: boolean;
    private overflow: boolean;

    constructor() {
        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0x8000;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
    }

    public reset(): void {
        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0x8000;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
    }

    public executeOperation(ram : RAM, prgRom : ROM): void {
        let rom = prgRom;
        let zeroedPC = this.PC - prgStart;
        let opcode = rom.read(zeroedPC);

        if(opMap.has(opcode)){

            let operation = opMap.get(opcode);
            let opMethod = operation.method;
            let opAddrMode = operation.addrMode;
            let opArgType = operation.argType;
            let opSize = addrModeSizeMap.get(opAddrMode);
            let args = new Uint8Array(opSize);

            for(let i = 0; i < opSize; i++){
                args[i] = rom.read(zeroedPC + i);
            }

            let arg = addrModeHandlerMap.get(opAddrMode)(ram, this, args, opArgType);
            switch (opArgType) {
                case argTypes.value:
                    break
                case argTypes.pointer:
                    arg = ram.read(arg);
                    break;
            }
            console.log(`executing opcode: ${opcode.toString(16)} with arg: ${arg.toString(16)}`);
            operation.method(this, ram, arg);
            this.PC += opSize;
        } else {
            console.log(`Invalid or unimplemented opcode: ${opcode}`);
            this.PC++;
        }
    }

    public setPC(addr: number): void {
        this.PC = addr;
        console.log("SET PC: ", this.PC);
    }

    public getPC(): number {
        return this.PC;
    }

    public setAreg(value: number): void {
        this.Areg = value & 0xFF;
        this.setFlags(value);
        console.log("SET AREG: ", this.Areg);
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

    public setFlags(value: number): void {
        if(value === -1) return;
        let val = value;
        this.Cflag = this.overflow;
        this.Zflag = val === 0;
        this.Nflag = (val & 0x80) === 0x80;
    };

    public getFlags(): CPUflags {
        return {
            Z: this.Zflag,
            N: this.Nflag,
            C: this.Cflag
        }
    }

}