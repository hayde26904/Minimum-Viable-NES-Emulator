import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";

const patternTable = [0x0000, 0x1FFF];

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
    private ram : RAM;
    private testPalette : number[] = [
        0x12,0x16,0x27,0x18
    ];

    constructor(ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
        this.ram = new RAM(0x3FFF);
    }

    public loadCHR(rom : ROM){

        for(let i = 0; i < patternTable[1]; i++){
            this.ram.write(rom.read(i), i);
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

    public draw(){
        for(let i = 0; i < patternTable[1]; i++){

            let chrIndex = i * 16;
            let chr = this.ram.getMemory().slice(chrIndex, chrIndex + 8);
            let attr = this.ram.getMemory().slice(chrIndex + 8, chrIndex + 16);

            for(let r = 0; r < chr.length; r++){
                let chrRow = chr[r];
                let attrRow = attr[r];
                let x = (i % 16) * 8;
                let y = r + Math.floor(i / 16) * 8;

                // the triple for loop goes crazy
                for(let b = 0; b < 8; b++) {
                    //Looping backwards doesn't work for some reason
                    let chrBit = (chrRow >> (7 - b)) & 1;
                    let attrBit = (attrRow >> (7 - b)) & 1;
                    this.ctx.fillStyle = colors[this.testPalette[this.getColorIndex(chrBit, attrBit)]];
                    this.ctx.fillRect(x + b,y,1,1);
                }
                
            }

        }
    }
}