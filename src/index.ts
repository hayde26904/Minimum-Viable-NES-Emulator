import { CPU } from './cpu';
import { NES } from './nes';
import { ROM } from './rom';

let romBytes = new Uint8Array(13).fill(0);
romBytes[0] = 0xA9; //lda #$69
romBytes[1] = 0x69;
romBytes[2] = 0x85; //sta $01
romBytes[3] = 0x01;
romBytes[4] = 0xA5; //lda $01
romBytes[5] = 0x01;
romBytes[6] = 0x85; //sta $02
romBytes[7] = 0x02;
romBytes[8] = 0x4C; //jmp $8000
romBytes[9] = 0x00;
romBytes[10] = 0x80;

let testRom : ROM = new ROM(romBytes);
let nes : NES = new NES();
nes.loadProgram(testRom);

function loop(){
    nes.step();
}

setInterval(loop, 500);