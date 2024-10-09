import { CPU } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export class LDA {
    public static immediate(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let val = args[0];
        cpu.setAreg(val);
        console.log(`Loading immediate value into A register: ${val}`);
    }

    public static zeroPage(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value from zeropage at address: ${addr} into A register: ${val}`);
    }

    public static absolute(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value from memory at address: ${addr} into A register: ${val}`);
    }
}

export class STA {
    public static zeroPage(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        ram.write(addr, cpu.getAreg());
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }
}

export class JMP {
    public static absolute(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        cpu.setPC(addr - args.length - 1);
        console.log(`Jumping to address: ${addr}`);
    }
}