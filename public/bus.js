import { RAM } from "./ram";
import { Util } from "./util";
export class Bus {
    constructor(cpu, ppu) {
        this.cpu = cpu;
        this.ppu = ppu;
        this.ram = new RAM(0x800);
    }
    setMapper(mapper) {
        this.mapper = mapper;
    }
    read(address) {
        if (address < 0x2000) {
            return this.ram.read(address % 0x800);
        }
        else if (address < 0x4000) {
            try {
                return this.ppu.readRegister(0x2000 + (address % 8));
            }
            catch (err) {
                throw new Error(`PC: ${Util.hex(this.cpu.getPC())}  ${err.message}`);
            }
        }
        else if (address >= 0x8000) {
            return this.mapper.read(address);
        }
        return 0;
    }
    write(value, address) {
        if (address < 0x2000) {
            this.ram.write(value, address % 0x800);
        }
        else if (address < 0x4000) {
            try {
                this.ppu.writeRegister(value, 0x2000 + (address % 8));
            }
            catch (err) {
                //throw new Error(`PC: ${Util.hex(this.cpu.getPC())}  ${err.message}`);
            }
        }
        else if (address === 0x4014) { //OAM DMA
            this.ppu.writeRegister(value, address);
        }
        else if (address > 0x8000) {
            this.mapper.write(value, address);
        }
    }
}
