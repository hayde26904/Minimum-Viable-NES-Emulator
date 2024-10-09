import { Memory } from "./memory";
import { opMap } from "./operation";
import { RAM } from "./ram";
import { ROM } from "./rom";

const prgStart = 0x8000;

export interface CPUflags {
    Z: boolean;
    N: boolean;
    C: boolean;
}

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
        let zeroedPC = this.PC - 0x8000;
        let opcode = rom.read(zeroedPC);
        //console.log("PC: ", this.PC);
        if(opMap.has(opcode)){

            let operation = opMap.get(opcode);
            let args = new Uint8Array(operation.numArgs);

            for(let i = 0; i < operation.numArgs; i++){
                args[i] = rom.read(zeroedPC + i + 1);
            }
            //console.log("opcode: ", opcode);
            //console.log("args ", args);
            operation.method(this, ram, args);
            this.PC += operation.numArgs + 1;
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