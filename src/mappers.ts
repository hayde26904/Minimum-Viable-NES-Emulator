export interface Bank {
    fixed: boolean;
    range: [number, number];
}

export interface MemoryMap {
    prg: Bank;
    chr: Bank;
}