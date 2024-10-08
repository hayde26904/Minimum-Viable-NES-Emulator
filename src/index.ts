import { CPU } from './cpu';
import { ROM } from './rom';

let romBytes = new Uint8Array(2);
romBytes[0] = 0xA9;
romBytes[1] = 0x69;
let testRom : ROM = new ROM(romBytes);
let cpu : CPU = new CPU();
let prgRom = new ROM();

function loop(){
    console.log(cpu.getAreg());
    cpu.executeOperation();
}

setInterval(loop, 500);