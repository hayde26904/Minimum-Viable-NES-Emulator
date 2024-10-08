import { CPU } from './cpu';
import { ROM } from './rom';

let romBytes = new Uint8Array(2).fill(0);
romBytes[0] = 0xA9;
romBytes[1] = 0x00;

let testRom : ROM = new ROM(romBytes);
let cpu : CPU = new CPU();

cpu.loadProgram(testRom);

function loop(){
    cpu.executeOperation();
}

setInterval(loop, 500);