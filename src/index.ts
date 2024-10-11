import { CPU } from './cpu';
import { NES } from './nes';
import { ROM } from './rom';
/*let romBytes = new Uint8Array(0x800C).fill(0);
romBytes[0x8001] = 0xA9; //lda #$69
romBytes[0x8002] = 0x69;
romBytes[0x8003] = 0x85; //sta $01
romBytes[0x8004] = 0x01;
romBytes[0x8005] = 0xA5; //lda $01
romBytes[0x8006] = 0x01;
romBytes[0x8007] = 0x85; //sta $02
romBytes[0x8008] = 0x02;
romBytes[0x8009] = 0x4C; //jmp $8000
romBytes[0x800A] = 0x00;
romBytes[0x800B] = 0x80;*/
let nes : NES = new NES();
document.getElementById('romInput')?.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const romData = new Uint8Array(e.target.result as ArrayBuffer);
          let testRom : ROM = new ROM(romData);
          nes.loadProgram(testRom);
          loop();
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
});

//let testRom : ROM = new ROM(romBytes);
//let nes : NES = new NES();
//nes.loadProgram(testRom);

function loop(){
    nes.step();
    requestAnimationFrame(loop);
}