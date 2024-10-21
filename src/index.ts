import { CPU } from './cpu';
import { PPU } from './ppu';
import { ROM } from './rom';
import * as headerParser from "./headerParser";
import * as reg from "./registers";
import { Util } from './util';

const TARGET_FPS = 60

const CYCLES_PER_SECOND = 1789773;
const CYCLES_PER_FRAME = 81600;
const CYCLES_PER_NMI = 2273;

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

canvas.width = 510;
canvas.height = 480;

ctx.scale(3,3);

let cpu : CPU = new CPU();
let ppu : PPU = new PPU(ctx, cpu);

let currentPrgRom : ROM;

document.getElementById('nmi-btn')?.addEventListener('click', cpu.doNMI.bind(cpu));

document.getElementById('romInput')?.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const romData = new Uint8Array(e.target.result as ArrayBuffer);
        let testRom : ROM = new ROM(romData);
        loadProgram(testRom);
        //setInterval(loop, 1000/60);
        loop();
      }
    };
    
    reader.readAsArrayBuffer(file);
  }
});

function loadProgram(rom: ROM){

  const romInfo = headerParser.parseiNES1(rom);
  const romBytes = rom.getMemory().slice(16);
  const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
  const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1))

  console.log(romInfo);
  console.log(Util.Uint8ArrayToHex(prg.getMemory()));

  cpu.reset();
  cpu.loadProgram(prg);
  ppu.loadCHR(chr);

  currentPrgRom = rom;
}


let lastFrameTime = performance.now();

cpu.writeToMem(0x80, 0x2002);

function loop(){

  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime;

  //const cyclesToExecute = Math.floor((CYCLES_PER_SECOND / TARGET_FPS) * (deltaTime / 1000));
  const cyclesToExecuteFrame = Math.floor(CYCLES_PER_FRAME * (deltaTime / (1000 / TARGET_FPS)));
  const cyclesToExecuteNMI = Math.floor(CYCLES_PER_NMI * (deltaTime / (1000 / TARGET_FPS)));
  const cyclesToExecute = cyclesToExecuteFrame;
  let cyclesExecuted = 0;

  /*while(cyclesExecuted < cyclesToExecute){
    const cycles = cpu.executeNextOperation();
    cyclesExecuted += cycles;
    ppu.tick();
  }*/

  

  cpu.executeNextOperation();

  ppu.tick();
  ppu.draw();

  lastFrameTime = currentTime;
  requestAnimationFrame(loop);

}