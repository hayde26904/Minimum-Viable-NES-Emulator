import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";
import { CPU } from "./cpu";
import { Bus } from "./bus";

const patternTables = [0x0000, 0x1FFF];
const backgroundPalettes = [0x3F00, 0x3F0F];
const spritePalettes = [0x3F10, 0x3F1F];

const colors = [
    "#7C7C7C", "#0000FC", "#0000BC", "#4428BC", "#940084", "#A80020", "#A81000", "#881400",
    "#503000", "#007800", "#006800", "#005800", "#004058", "#000000", "#000000", "#000000",
    "#BCBCBC", "#0078F8", "#0058F8", "#6844FC", "#D800CC", "#E40058", "#F83800", "#E45C10",
    "#AC7C00", "#00B800", "#00A800", "#00A844", "#008888", "#000000", "#000000", "#000000",
    "#F8F8F8", "#3CBCFC", "#6888FC", "#9878F8", "#F878F8", "#F85898", "#F87858", "#FCA044",
    "#F8B800", "#B8F818", "#58D854", "#58F898", "#00E8D8", "#787878", "#000000", "#000000",
    "#FCFCFC", "#A4E4FC", "#B8B8F8", "#D8B8F8", "#F8B8F8", "#F8A4C0", "#F0D0B0", "#FCE0A8",
    "#F8D878", "#D8F878", "#B8F8B8", "#B8F8D8", "#00FCFC", "#F8D8F8", "#000000", "#000000"
];

export class PPU {

    private bus : Bus;

    private ctx : CanvasRenderingContext2D;
    private NMIhandler : CallableFunction;
    private patternTable0 : RAM;
    private patternTable1 : RAM;
    private backgroundPalette : RAM;
    private spritePalette : RAM;
    private oam : RAM;

    private addr : number;
    private data : number;

    private writeCounter : number = 0;
    private scrollX : number = 0;
    private scrollY : number = 0;

    private oamDma : number;
    private oamAddr : number;
    private oamDmaSet : boolean = false;

    private NMIenabled : boolean = true;
    private masterSlave : boolean = false;
    private spriteSizeMode : boolean = false;
    private backgroundAddr : boolean = false;
    private spriteAddr : boolean = false;
    private vramIncrement : boolean = false;
    private baseNametableAddr : number = 0;

    private emphasizeBlue : boolean = false;
    private emphasizeGreen : boolean = false;
    private emphasizeRed : boolean = false;
    private showSprites : boolean = false;
    private showBackground : boolean = false;
    private showLeftSprites : boolean = false;
    private showLeftBackground : boolean = false;
    private greyscale : boolean = false;

    private inVblank : boolean = true;
    private spriteZeroHit : boolean = false;
    private spriteOverflow : boolean = false;


    private testPalette : number[] = [
        0x12,0x16,0x27,0x18
    ];

    constructor(ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
        this.patternTable0 = new RAM(0x1000);
        this.patternTable1 = new RAM(0x1000);
        this.backgroundPalette = new RAM(0x10);
        this.spritePalette = new RAM(0x10);
        this.oam = new RAM(0xFF);
    }

    public setNMIhandler(callback : CallableFunction){
        this.NMIhandler = callback;
    }

    public setBus(bus: Bus): void {
        this.bus = bus;
    }

    public loadCHR(rom : ROM){

        for(let i = 0; i < this.patternTable0.getSize(); i++){
            //both pattern tables are the same size, and they never won't be the same size, so it ok
            this.patternTable0.write(rom.read(i), i)
            this.patternTable1.write(rom.read(i), i + this.patternTable0.getSize());
        }

    }

    private copySpritesFromOamDma(){
        //copy from OAM DMA address in CPU memory to OAM memory
        let oamDmaAddr = Util.bytesToAddr(this.oamAddr, this.oamDma);

        for(let addr = 0; addr < this.oam.getSize(); addr++){
            this.oam.write(this.bus.read(oamDmaAddr + addr), addr);
        }
    }

    public tick(){

    }

    public NMI(){
        if(this.NMIenabled){
            this.NMIhandler();
        }
    }

    public readRegister(address : number){

        switch(address){
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



    public writeRegister(value : number, address : number){

        switch(address){
            case reg.PPUCTRL:
                [
                    this.NMIenabled, 
                    this.masterSlave, 
                    this.spriteSizeMode, 
                    this.backgroundAddr, 
                    this.spriteAddr, 
                    this.vramIncrement
                ] = Util.bitmaskToBools(value);

                this.baseNametableAddr = value & 3;
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

                if(this.writeCounter === 0){
                    this.scrollX = value;
                } else if(this.writeCounter === 1){
                    this.scrollY = value;
                }

                this.writeCounter++;
                if(this.writeCounter > 1) this.writeCounter = 0;
                break;
            case reg.PPUADDR:

                if(this.writeCounter === 0){ // hi byte
                    this.addr |= (value << 8);
                } else if(this.writeCounter === 1){ // lo byte
                    this.addr |= value;
                }

                this.writeCounter++;
                if(this.writeCounter > 1) this.writeCounter = 0;
                break;
            case reg.PPUDATA:
                break;
            default:
                throw new Error(`Attempted write to invalid PPU register address: ${Util.hex(address)}`);
                break;
        }
    }

    private getColorIndex(chrBit : number, attrBit : number){
        if(attrBit === 0 && chrBit === 0){
            return 0;
        } else if(attrBit === 0 && chrBit === 1){
            return 1;
        } else if(attrBit === 1 && chrBit === 0){
            return 2;
        } else if(attrBit === 1 && chrBit === 1){
            return 3;
        }
    }

    private drawTile(tile : number, xPos : number, yPos : number, attributes : number){

            //pattern tables start at address 0 in PPU memory
            let chrIndex = tile * 16;
            let chr = this.patternTable0.getMemory().slice(chrIndex, chrIndex + 8);
            let attr = this.patternTable0.getMemory().slice(chrIndex + 8, chrIndex + 16);

            for(let r = 0; r < chr.length; r++){
                let chrRow = chr[r];
                let attrRow = attr[r];
                let x = xPos;
                let y = yPos + r;

                for(let b = 0; b < 8; b++) {
                    let chrBit = (chrRow >> (7 - b)) & 1;
                    let attrBit = (attrRow >> (7 - b)) & 1;
                    this.ctx.fillStyle = colors[this.testPalette[this.getColorIndex(chrBit, attrBit)]];
                    this.ctx.fillRect(x + b, y, 1, 1);
                }
                
            }
    }

    public drawSprites(){
        for(let spriteIndex = 0; (spriteIndex + 4) < this.oam.getSize(); spriteIndex += 4){

            let tileIndex = this.oam.read(spriteIndex + 1);
            let xPos = this.oam.read(spriteIndex + 3);
            let yPos = this.oam.read(spriteIndex);
            let attributes = this.oam.read(spriteIndex + 2);

            if(tileIndex !== 0) console.log(`Drawing sprite $${Util.hex(tileIndex)} at X: ${Util.hex(xPos)} Y: ${Util.hex(yPos)}`);
            this.drawTile(tileIndex, xPos, yPos, attributes);
        }
    }

    public draw(){

        this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
        this.copySpritesFromOamDma();

        this.drawSprites();
        

    }

}