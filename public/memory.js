export class Memory {
    constructor(size, bytes) {
        if (!bytes) {
            this.memory = new Uint8Array(size).fill(0);
        }
        else {
            this.memory = bytes;
        }
    }
    read(address) {
        return this.memory[address];
    }
    readRange(start, end) {
        return this.memory.slice(start, end);
    }
    write(value, address) {
        this.memory[address] = value;
    }
    getSize() {
        return this.memory.length;
    }
    getMemory() {
        return this.memory;
    }
    setMemory(bytes) {
        this.memory = bytes;
    }
}
