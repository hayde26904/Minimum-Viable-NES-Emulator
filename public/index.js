var _a, _b;
import { CPU } from './cpu';
import { PPU } from './ppu';
import { ROM } from './rom';
import * as headerParser from "./headerParser";
import { Util } from './util';
import { Bus } from './bus';
import { mapperMap } from './mapperMap';
const TARGET_FPS = 60;
const CYCLES_PER_SECOND = 1789773;
const CYCLES_PER_FRAME = 27120;
const CYCLES_PER_NMI = 2486;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
canvas.width = 1024;
canvas.height = 960;
//canvas.width = 255;
//canvas.height = 240;
//ctx.scale(4, 4);
let mapper;
let cpu = new CPU();
let ppu = new PPU(ctx);
ppu.setNMIhandler(cpu.goToNMI.bind(cpu));
let bus = new Bus(cpu, ppu);
cpu.setBus(bus);
ppu.setBus(bus);
let currentPrgRom;
(_a = document.getElementById('nmi-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', ppu.NMI.bind(ppu));
(_b = document.getElementById('romInput')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                const romData = new Uint8Array(e.target.result);
                let testRom = new ROM(romData);
                loadProgram(testRom);
                //setInterval(loop, 1000/60);
                loop();
            }
        };
        reader.readAsArrayBuffer(file);
    }
});
function loadProgram(rom) {
    const romInfo = headerParser.parseiNES1(rom);
    const romBytes = rom.getMemory().slice(16);
    const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
    const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1));
    console.log(romInfo);
    console.log(Util.Uint8ArrayToHex(prg.getMemory()));
    mapper = mapperMap.get(romInfo.mapperNumber);
    mapper.setPrgRom(prg);
    bus.setMapper(mapper);
    console.log(mapper);
    cpu.reset();
    cpu.loadProgram(prg);
    ppu.loadCHR(chr);
    currentPrgRom = rom;
}
let lastFrameTime = performance.now();
function loop() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastFrameTime) / (1000 / TARGET_FPS);
    //const cyclesToExecute = Math.floor((CYCLES_PER_SECOND / TARGET_FPS) * (deltaTime / 1000));
    const cyclesToExecuteFrame = Math.floor(CYCLES_PER_FRAME * deltaTime);
    const cyclesToExecuteNMI = Math.floor(CYCLES_PER_NMI * deltaTime);
    let cyclesExecuted = 0;
    //console.log(`FRAME START  PC: ${Util.hex(cpu.getPC())}`);
    while (cyclesExecuted < cyclesToExecuteFrame) {
        const cycles = cpu.executeNextOperation();
        cyclesExecuted += cycles;
        ppu.tick();
    }
    //console.log(`FRAME END  PC: ${Util.hex(cpu.getPC())}`);
    cyclesExecuted = 0;
    ppu.NMI();
    //console.log(`NMI START  PC: ${Util.hex(cpu.getPC())}`);
    while (cyclesExecuted < cyclesToExecuteNMI) {
        const cycles = cpu.executeNextOperation();
        cyclesExecuted += cycles;
        ppu.tick();
    }
    //console.log(`NMI END  PC: ${Util.hex(cpu.getPC())}`);
    //cpu.executeNextOperation();
    //ppu.tick();
    ppu.draw();
    lastFrameTime = currentTime;
    requestAnimationFrame(loop);
}
