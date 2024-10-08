import { CPU } from './cpu';
import { Memory } from './memory';

let testRom : Uint8Array = new Uint8Array([0xA9, 0x69]);
let cpu : CPU = new CPU();
let mem : Memory = new Memory();



function loop(){
    console.log(cpu.getAreg());
    cpu.executeOperation(mem);
}

setInterval(loop, 500);