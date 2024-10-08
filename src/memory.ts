export abstract class Memory {
    private memory: Uint8Array;

    constructor(bytes? : Uint8Array) {
        this.memory = new Uint8Array(2048);

        if(bytes !== null){
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