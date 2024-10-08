export class CPU {
    private Areg: number;
    private Xreg: number;
    private Yreg: number;
    private PC: number;
    private SP: number;
    private Cflag: boolean;
    private Zflag: boolean;
    private Nflag: boolean;

    constructor() {
        this.Areg = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.PC = 0;
        this.SP = 0;
        this.Cflag = false;
        this.Zflag = false;
        this.Nflag = false;
    }

    public setFlags(value: number = -1): void {
        if(value === -1) return;
        let val = value;
        this.Cflag = (val > 0xFF);
        this.Zflag = val === 0;
        this.Nflag = (val & 0x80) === 0x80;
    };

}