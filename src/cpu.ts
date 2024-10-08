import { Memory } from "./memory";
import { opMap } from "./operation";
import { ROM } from "./rom";

const prgStart = 0x8000;

export interface CPUflags {
    Z: boolean;
    N: boolean;
    C: boolean;
}

export class CPU {

    private prgRom: ROM;
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
        this.prgRom;

        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0x8000;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
    }

    public loadProgram(program : ROM): void {
        this.prgRom = program;
    }

    public executeOperation(): void {
        let rom = this.prgRom;
        let zeroedPC = this.PC - 0x8000;
        let opcode = rom.read(zeroedPC);
        if(opMap.has(opcode)){

            let operation = opMap.get(opcode);
            let args = new Uint8Array(operation.numArgs);

            for(let i = 0; i < operation.numArgs; i++){
                args[i] = rom.read(zeroedPC + i + 1);
            }
            console.log("opcode: ", opcode);
            console.log("args ", args);
            operation.method(this, rom, args);
            this.PC += operation.numArgs + 1;
        } else {
            console.log(`Invalid or unimplemented opcode: ${opcode}`);
        }
    }



    public setPC(value: number): void {
        this.PC = value;
    }

    public setAreg(value: number): void {
        this.Areg = value & 0xFF;
        this.setFlags(value);
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