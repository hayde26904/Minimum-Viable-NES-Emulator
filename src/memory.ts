export class Memory {
    private memory: Uint8Array;

    constructor() {
        this.memory = new Uint8Array(2048).fill(0);
    }

    public read(address: number): number {
        return this.memory[address];
    }

    public write(address: number, value: number): void {
        this.memory[address] = value;
    }
}