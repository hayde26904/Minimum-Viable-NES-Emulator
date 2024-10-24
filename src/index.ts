import { CPU } from './cpu';
import { PPU } from './ppu';
import { ROM } from './rom';
import * as headerParser from "./headerParser";
import * as reg from "./registers";
import { Util } from './util';
import { Bus } from './bus';
import { IMapper, Mapper } from './mapper';
import { mapperMap } from './mapperMap';

const TARGET_FPS = 60

const CYCLES_PER_SECOND = 1789773;
const CYCLES_PER_FRAME = 27120;
const CYCLES_PER_NMI = 2486;

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 960;

ctx.scale(4, 4);

let mapper: Mapper;
let cpu: CPU = new CPU();
let ppu: PPU = new PPU(ctx);

let bus: Bus = new Bus(cpu, ppu);
cpu.setBus(bus);
ppu.setBus(bus);

let currentPrgRom: ROM;

document.getElementById('nmi-btn')?.addEventListener('click', cpu.NMI.bind(cpu));

document.getElementById('romInput')?.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        const romData = new Uint8Array(e.target.result as ArrayBuffer);
        let testRom: ROM = new ROM(romData);
        loadProgram(testRom);
        //setInterval(loop, 1000/60);
        loop();
      }
    };

    reader.readAsArrayBuffer(file);
  }
});

function loadProgram(rom: ROM) {

  const romInfo = headerParser.parseiNES1(rom);
  const romBytes = rom.getMemory().slice(16);
  const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
  const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1))

  console.log(romInfo);
  console.log(Util.Uint8ArrayToHex(prg.getMemory()));

  
  mapper = mapperMap.get(romInfo.mapperNumber) as Mapper;
  mapper.setRom(rom);

  cpu.reset();
  ppu.loadCHR(chr);

  currentPrgRom = rom;
}


let lastFrameTime = performance.now();

function loop() {

  bus.write(0x80, 0x2002);

  const currentTime = performance.now();
  const deltaTime = (currentTime - lastFrameTime) / (1000 / TARGET_FPS);

  //const cyclesToExecute = Math.floor((CYCLES_PER_SECOND / TARGET_FPS) * (deltaTime / 1000));
  const cyclesToExecuteFrame = Math.floor(CYCLES_PER_FRAME * deltaTime);
  const cyclesToExecuteNMI = Math.floor(CYCLES_PER_NMI * deltaTime);
  let cyclesExecuted = 0;


  console.log(`FRAME START  PC: ${Util.hex(cpu.getPC())}`);
  while (cyclesExecuted < cyclesToExecuteFrame) {
    const cycles = cpu.executeNextOperation();
    cyclesExecuted += cycles;
    ppu.tick();
  }

  console.log(`FRAME END  PC: ${Util.hex(cpu.getPC())}`);

  cyclesExecuted = 0;
  if (ppu.NMIenabled) {
    
    cpu.NMI();
    console.log(`NMI START  PC: ${Util.hex(cpu.getPC())}`);
    while (cyclesExecuted < cyclesToExecuteNMI) {
      const cycles = cpu.executeNextOperation();
      cyclesExecuted += cycles;
      ppu.tick();

    }
    console.log(`NMI END  PC: ${Util.hex(cpu.getPC())}`);

  }

  /*cpu.executeNextOperation();
  ppu.tick();*/
  ppu.draw();

  lastFrameTime = currentTime;
  requestAnimationFrame(loop);

}