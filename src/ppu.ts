import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";
import { CPU } from "./cpu";
import { Bus } from "./bus";

const patternTablesAddrRange = [0x0000, 0x1FFF];
const backgroundPalettesAddrRange = [0x3F00, 0x3F0F];
const spritePalettesAddrRange = [0x3F10, 0x3F1F];

/*const colorMap = [
    "#7C7C7C", "#0000FC", "#0000BC", "#4428BC", "#940084", "#A80020", "#A81000", "#881400",
    "#503000", "#007800", "#006800", "#005800", "#004058", "#000000", "#000000", "#000000",
    "#BCBCBC", "#0078F8", "#0058F8", "#6844FC", "#D800CC", "#E40058", "#F83800", "#E45C10",
    "#AC7C00", "#00B800", "#00A800", "#00A844", "#008888", "#000000", "#000000", "#000000",
    "#F8F8F8", "#3CBCFC", "#6888FC", "#9878F8", "#F878F8", "#F85898", "#F87858", "#FCA044",
    "#F8B800", "#B8F818", "#58D854", "#58F898", "#00E8D8", "#787878", "#000000", "#000000",
    "#FCFCFC", "#A4E4FC", "#B8B8F8", "#D8B8F8", "#F8B8F8", "#F8A4C0", "#F0D0B0", "#FCE0A8",
    "#F8D878", "#D8F878", "#B8F8B8", "#B8F8D8", "#00FCFC", "#F8D8F8", "#000000", "#000000"
];*/

const colorMap = [
    [124, 124, 124], [0, 0, 252], [0, 0, 188], [68, 40, 188], [148, 0, 132], [168, 0, 32], [168, 16, 0], [136, 20, 0],
    [80, 48, 0], [0, 120, 0], [0, 104, 0], [0, 88, 0], [0, 64, 88], [0, 0, 0], [0, 0, 0], [0, 0, 0],
    [188, 188, 188], [0, 120, 248], [0, 88, 248], [104, 68, 252], [216, 0, 204], [228, 0, 88], [248, 56, 0], [228, 92, 16],
    [172, 124, 0], [0, 184, 0], [0, 168, 0], [0, 168, 68], [0, 136, 136], [0, 0, 0], [0, 0, 0], [0, 0, 0],
    [248, 248, 248], [60, 188, 252], [104, 136, 252], [152, 120, 248], [248, 120, 248], [248, 88, 152], [248, 120, 88], [252, 160, 68],
    [248, 184, 0], [184, 248, 24], [88, 216, 84], [88, 248, 152], [0, 232, 216], [120, 120, 120], [0, 0, 0], [0, 0, 0],
    [252, 252, 252], [164, 228, 252], [184, 184, 248], [216, 184, 248], [248, 184, 248], [248, 164, 192], [240, 208, 176], [252, 224, 168],
    [248, 216, 120], [216, 248, 120], [184, 248, 184], [184, 248, 216], [0, 252, 252], [248, 216, 248], [0, 0, 0], [0, 0, 0]
];

export class PPU {

    private bus: Bus;

    private ctx: CanvasRenderingContext2D;
    private frameBuffer: ImageData;
    private NMIhandler: CallableFunction;
    private patternTables: Array<RAM> = [new RAM(0x1000), new RAM(0x1000)];
    private nameTables: Array<RAM> = [new RAM(0x400), new RAM(0x400), new RAM(0x400), new RAM(0x400)];
    private backgroundPalettes: RAM = new RAM(0x10);
    private spritePalettes: RAM = new RAM(0x10);
    private oam: RAM = new RAM(0xFF);

    // maps different RAM to different addresses
    private memoryMap: Map<Array<number>, RAM> = new Map([
        [[0x0000, 0x0FFF], this.patternTables[0]],
        [[0x1000, 0x1FFF], this.patternTables[1]],
        [[0x2000, 0x23FF], this.nameTables[0]],
        [[0x2400, 0x27FF], this.nameTables[1]],
        [[0x2800, 0x2BFF], this.nameTables[2]],
        [[0x2C00, 0x2FFF], this.nameTables[3]],
        [[0x3F00, 0x3F0F], this.backgroundPalettes],
        [[0x3F10, 0x3F1F], this.spritePalettes]
    ]);

    private mirroringMode: number = 0; // 0 horizontal 1 verticle

    private writeAddr: number = null;

    private writeCounter: number = 0;
    private scrollX: number = 0;
    private scrollY: number = 0;

    private oamDma: number;
    private oamAddr: number;
    private oamDmaSet: boolean = false;

    private NMIenabled: boolean = true;
    private masterSlave: boolean = false;
    private spriteSizeMode: boolean = false;
    private backgroundAddr: boolean = false;
    private spriteAddr: boolean = false;
    private vramIncrement: boolean = false;
    private currentNametable: number = 0;

    private emphasizeBlue: boolean = false;
    private emphasizeGreen: boolean = false;
    private emphasizeRed: boolean = false;
    private showSprites: boolean = false;
    private showBackground: boolean = false;
    private showLeftSprites: boolean = false;
    private showLeftBackground: boolean = false;
    private greyscale: boolean = false;

    private inVblank: boolean = true;
    private spriteZeroHit: boolean = false;
    private spriteOverflow: boolean = false;


    /*private testPalette : number[] = [
        0x12,0x16,0x27,0x18
    ];*/

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.frameBuffer = this.ctx.createImageData(this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public setNMIhandler(callback: CallableFunction) {
        this.NMIhandler = callback;
    }

    public setBus(bus: Bus): void {
        this.bus = bus;
    }

    public setMirroringMode(mode: number) {
        this.mirroringMode = mode;
    }

    public loadCHR(rom: ROM) {

        let patternTable0 = this.patternTables[0];
        let patternTable1 = this.patternTables[1];

        for (let i = 0; i < patternTable0.getSize(); i++) {
            //both pattern tables are the same size, and they never won't be the same size, so it ok
            patternTable0.write(rom.read(i), i)
            patternTable1.write(rom.read(i), i + patternTable0.getSize());
        }

    }

    private copySpritesFromOamDma() {
        //copy from OAM DMA address in CPU memory to OAM memory
        let oamDmaAddr = Util.bytesToAddr(this.oamAddr, this.oamDma);

        for (let addr = 0; addr < this.oam.getSize(); addr++) {
            this.oam.write(this.bus.read(oamDmaAddr + addr), addr);
        }
    }

    private writeToMem(value: number, address: number) {
        console.log(`attempting data write of ${Util.hex(value)} to ${Util.hex(address)}`);
        let memoryMapArray = Array.from(this.memoryMap);
        let index = memoryMapArray.findIndex(([range, ram]) => address >= range[0] && address <= range[1]); //finds the correct ram object from a given memory address
        let startAddress = memoryMapArray[index][0][0] // gets the starting address of the section of memory
        let ramObject = memoryMapArray[index][1]
        ramObject.write(value, address - startAddress); // converts the address to an index to index the ram object

    }

    public tick() {

    }

    public NMI() {
        if (this.NMIenabled) {
            this.NMIhandler();
        }
    }

    public readRegister(address: number) {

        switch (address) {
            case reg.PPUSTATUS:

                this.writeCounter = 0; // reset latch

                return Util.boolsToBitmask([
                    this.inVblank,
                    this.spriteZeroHit,
                    this.spriteOverflow,
                    false,
                    false,
                    false,
                    false,
                    false
                ]);

            case reg.OAMADDR:
                return this.oamAddr;
            case reg.OAMDATA:
                return this.oam.read(this.oamAddr);
            case reg.PPUDATA:
                return 0; // Not implemented yet
            default:
                throw new Error(`Attempted read from invalid PPU register address: ${Util.hex(address)}`);
                break;
        }
    }



    public writeRegister(value: number, address: number) {

        console.log(`attempting to write ${Util.hex(value)} to PPU reg ${Util.hex(address)}`);

        switch (address) {
            case reg.PPUCTRL:
                [
                    this.NMIenabled,
                    this.masterSlave,
                    this.spriteSizeMode,
                    this.backgroundAddr,
                    this.spriteAddr,
                    this.vramIncrement
                ] = Util.bitmaskToBools(value);

                this.currentNametable = value & 3;
                break;

            case reg.PPUMASK:

                [
                    this.emphasizeBlue,
                    this.emphasizeGreen,
                    this.emphasizeRed,
                    this.showSprites,
                    this.showBackground,
                    this.showLeftSprites,
                    this.showLeftBackground,
                    this.greyscale
                ] = Util.bitmaskToBools(value);
                break;
            case reg.OAMDMA:
                this.oamDma = value;
                break;
            case reg.OAMADDR:
                this.oamAddr = value;
                break;
            case reg.OAMDATA:

                this.oam.write(value, this.oamAddr);
                break;
            case reg.PPUSCROLL:

                if (this.writeCounter === 0) {
                    this.scrollX = value;
                } else if (this.writeCounter === 1) {
                    this.scrollY = value;
                }

                this.writeCounter++;
                if (this.writeCounter > 1) this.writeCounter = 0;
                break;

            case reg.PPUADDR:

                if (this.writeCounter === 0) { // hi byte
                    this.writeAddr = 0; // reset it
                    this.writeAddr |= (value << 8);
                } else if (this.writeCounter === 1) { // lo byte
                    this.writeAddr |= value;
                }

                this.writeCounter++;
                if (this.writeCounter > 1) this.writeCounter = 0;

                break;

            case reg.PPUDATA:

                if (this.writeAddr !== null) {
                    this.writeToMem(value, this.writeAddr);
                    this.writeAddr += this.vramIncrement ? 32 : 1; // auto increment ppu write address while also accounting for the increment mode
                }

                break;

            default:
                throw new Error(`Attempted write to invalid PPU register address: ${Util.hex(address)}`);
                break;
        }
    }

    private getColorIndex(chrBit: number, attrBit: number) {
        if (attrBit === 0 && chrBit === 0) {
            return 0;
        } else if (attrBit === 0 && chrBit === 1) {
            return 1;
        } else if (attrBit === 1 && chrBit === 0) {
            return 2;
        } else if (attrBit === 1 && chrBit === 1) {
            return 3;
        }
    }

    private drawPixel(x: number, y: number, color: Array<number>) {
        let index = (y * this.ctx.canvas.width + x) * 4;
        this.frameBuffer.data[index] = color[0] // red
        this.frameBuffer.data[index + 1] = color[1] // green
        this.frameBuffer.data[index + 2] = color[2] // blue
        this.frameBuffer.data[index + 3] = 255 // alpha
    }

    private drawTile(tile: number, xPos: number, yPos: number, paletteIndex: number, flipH: boolean, flipV: boolean, priority: boolean, palettes: RAM, patternTable: RAM, backgroundTransparent: boolean) {

        //pattern tables start at address 0 in PPU memory
        let chrIndex = tile * 16;
        let chr = patternTable.getMemory().slice(chrIndex, chrIndex + 8);
        let attr = patternTable.getMemory().slice(chrIndex + 8, chrIndex + 16);

        let palette = palettes.readRange(paletteIndex, paletteIndex + 4);

        for (let r = 0; r < chr.length; r++) {
            let chrRow = chr[r];
            let attrRow = attr[r];
            let x = xPos;
            let y = yPos + r;

            for (let b = 0; b < 8; b++) {
                let chrBit = (chrRow >> (7 - b)) & 1;
                let attrBit = (attrRow >> (7 - b)) & 1;

                let colorIndex = this.getColorIndex(chrBit, attrBit);
                let colorId = palette[colorIndex];
                let color = colorMap[colorId];
                // TRANSPARENCY
                if (!(colorIndex === 0 && backgroundTransparent)) this.drawPixel(x + b, y, color) //this.ctx.fillRect(x + b, y, 1, 1);
            }

        }
    }

    private drawSprites() {
        for (let spriteIndex = 0; (spriteIndex + 4) < this.oam.getSize(); spriteIndex += 4) {

            let tileIndex = this.oam.read(spriteIndex + 1);
            let xPos = this.oam.read(spriteIndex + 3);
            let yPos = this.oam.read(spriteIndex);
            let attributes = this.oam.read(spriteIndex + 2);

            let paletteIndex = attributes & 3;

            if (tileIndex !== 0) console.log(`Drawing sprite $${Util.hex(tileIndex)} at X: ${Util.hex(xPos)} Y: ${Util.hex(yPos)}`);
            this.drawTile(tileIndex, xPos, yPos, paletteIndex, false, false, false, this.spritePalettes, this.patternTables[0], true);
        }
    }

    private drawBackground() {

        let nametable = this.nameTables[this.currentNametable];

        for (let i = 0; i < nametable.getSize(); i++) {
            let tileIndex = nametable.read(i);
            let xPos = (i % 32) * 8;
            let yPos = (i / 32) * 8;

            this.drawTile(tileIndex, xPos, yPos, 0, false, false, false, this.spritePalettes, this.patternTables[1], false);
        }
    }

    public draw() {

        this.copySpritesFromOamDma();

        this.drawBackground();
        this.drawSprites();

        this.ctx.putImageData(this.frameBuffer, 0, 0);
        this.frameBuffer = this.ctx.createImageData(this.ctx.canvas.width, this.ctx.canvas.height);

    }

}