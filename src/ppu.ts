import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";
import { CPU } from "./cpu";

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
    private ctx : CanvasRenderingContext2D;
    private cpu : CPU;
    private ram : RAM;
    private oam : RAM;

    public oamDma : number;
    public oamAddr : number;
    public oamDmaSet : boolean = false;

    public spriteZeroHit : boolean = false;
    public NMIenabled : boolean = true;

    private testPalette : number[] = [
        0x12,0x16,0x27,0x18
    ];

    constructor(ctx : CanvasRenderingContext2D, cpu : CPU){
        this.ctx = ctx;
        this.cpu = cpu;
        this.ram = new RAM(0x3FFF);
        this.oam = new RAM(0xFF);
    }

    public loadCHR(rom : ROM){

        for(let i = 0; i < patternTables[1]; i++){
            this.ram.write(rom.read(i), i);
        }

    }

    private copyFromOamDma(){
        //copy from OAM DMA address in CPU memory to OAM memory
        let oamDmaAddr = Util.bytesToAddr(this.oamAddr, this.oamDma);

        for(let addr = 0; addr < this.oam.getSize(); addr++){
            this.oam.write(this.cpu.readFromMem(oamDmaAddr + addr), addr);
        }
    }

    public copyRegistersFromCPU(cpuRam : RAM){
        this.oamAddr = this.cpu.readFromMem(reg.OAMADDR);
        this.oamDma = this.cpu.readFromMem(reg.OAMDMA);

        let ppuCtrl = this.cpu.readFromMem(reg.PPUCTRL);
        this.NMIenabled = Boolean(Util.getBit(ppuCtrl, 7));

    }


    public writeRegistersToCPU(cpuRam : RAM){

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

    private drawSprite(tile : number, xPos : number, yPos : number, attributes : number){

            //pattern tables start at address 0 in PPU memory
            let chrIndex = tile * 16;
            let chr = this.ram.getMemory().slice(chrIndex, chrIndex + 8);
            let attr = this.ram.getMemory().slice(chrIndex + 8, chrIndex + 16);

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

    public tick(){
    }

    public draw(){

        this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

        this.copyFromOamDma();

        for(let spriteIndex = 0; (spriteIndex + 4) < this.oam.getSize(); spriteIndex += 4){

            let tileIndex = this.oam.read(spriteIndex + 1);
            let xPos = this.oam.read(spriteIndex + 3);
            let yPos = this.oam.read(spriteIndex);
            let attributes = this.oam.read(spriteIndex + 2);

            if(tileIndex !== 0) console.log(`Drawing sprite $${Util.hex(tileIndex)} at X: ${Util.hex(xPos)} Y: ${Util.hex(yPos)}`);
            this.drawSprite(tileIndex, xPos, yPos, attributes);
        }

    }

}