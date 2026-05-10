import { Mapper } from "./mapper";
export class NROM extends Mapper {
    constructor() {
        super();
    }
    read(address) {
        return this.rom.read((address - 0x8000) % this.getPrgRom().getSize());
    }
    write(value, address) {
    }
}
