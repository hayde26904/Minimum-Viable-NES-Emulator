export abstract class Memory {
    private memory: Uint8Array;

    constructor(size : number, bytes? : Uint8Array) {
        if(!bytes){
            this.memory = new Uint8Array(size).fill(0);
        } else {
            this.memory = bytes;
        }
    }

    public read(address: number): number {
        return this.memory[address];
    }

    public write(address: number, value: number): void {
        this.memory[address] = value;
    }
}