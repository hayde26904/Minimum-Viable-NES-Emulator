import { CPU } from './cpu';
import { ROM } from './rom';

let romBytes = new Uint8Array(5).fill(0);
romBytes[0] = 0xA9;
romBytes[1] = 0x69;
romBytes[2] = 0x4C;
romBytes[3] = 0x00;
romBytes[4] = 0x80;

let testRom : ROM = new ROM(romBytes);
let cpu : CPU = new CPU();

document.getElementById('romInput')?.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const romData = new Uint8Array(e.target.result as ArrayBuffer);
          cpu.loadProgram(new ROM(romData));
          setInterval(loop, 500);
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
});

function loop(){
    cpu.executeOperation();
}