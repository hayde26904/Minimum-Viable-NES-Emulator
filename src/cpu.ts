import { Memory } from "./memory";
import { opMap } from "./operation";
import { ROM } from "./rom";

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
        let opcode = rom.read(this.PC);

        if(opMap.has(opcode)){

            let operation = opMap.get(opcode);
            let args = new Uint8Array(operation.numArgs);

            for(let i = 0; i < operation.numArgs; i++){
                args[i] = rom.read(this.PC + i + 1);
            }

            operation.method(this, rom, args);
            this.PC += operation.numArgs + 1;

        } else {
            console.log(`Invalid or unimplemented opcode: ${opcode}`);
        }
    }

    public setAreg(value: number): void {
        this.Areg = value;
        this.setFlags(value);
    }

    public setXreg(value: number): void {
        this.Xreg = value;
        this.setFlags(value);
    }

    public setYreg(value: number): void {
        this.Yreg = value;
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
        this.Cflag = (val > 0xFF);
        this.Zflag = val === 0;
        this.Nflag = (val & 0x80) === 0x80;
    };

}