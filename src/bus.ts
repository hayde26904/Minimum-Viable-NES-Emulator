import { CPU } from "./cpu";
import { IMapper } from "./mapper";
import { PPU } from "./ppu";
import { RAM } from "./ram";

export class Bus {
    private cpu : CPU;
    private ppu : PPU;
    private ram : RAM;
    private mapper : IMapper;

    constructor(cpu : CPU, ppu : PPU){
        this.cpu = cpu;
        this.ppu = ppu;
        this.ram = new RAM(0x800);
    }

    public read(address : number){
        if(address < 0x2000){
            return this.ram.read(address % 0x800);
        } else if(address < 0x4000){
            return this.ppu.readRegister(address % 8);
        } else if(address > 0x8000){
            return this.mapper.read(address);
        }
    }

    public write(value : number, address : number){
        if(address < 0x2000){
            this.ram.write(value, address % 0x800);
        } else if(address < 0x4000){
            this.ppu.writeRegister(value, address % 8);
        } else if(address > 0x8000){
            this.mapper.write(value, address);
        }
    }
}