import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";

const patternTable = [0x0000, 0x1FFF];

export class PPU {
    private ctx : CanvasRenderingContext2D;
    private ram : RAM

    constructor(ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
        this.ram = new RAM(0x3FFF);
    }

    public loadCHR(rom : ROM){

        for(let i = 0; i < patternTable[1]; i++){
            this.ram.write(rom.read(i), i);
        }

    }

    public draw(){
        for(let i = 0; i < patternTable[1]; i++){

            let chrIndex = i * 16;
            let chr = this.ram.getMemory().slice(chrIndex, chrIndex + 8);

            for(let r = 0; r < chr.length; r++){
                let row = chr[r];
                let x = (i % 16) * 8;
                let y = r + Math.floor(i / 16) * 8;

                // the triple for loop goes crazy
                for(let b = 0; b < 8; b++) {
                    //Looping backwards doesn't work for some reason
                    let bit = (row >> (7 - b)) & 1;
                    this.ctx.fillStyle = (bit) ? 'white' : 'black';
                    this.ctx.fillRect(x + b,y,1,1);
                }
                
            }

        }
    }
}