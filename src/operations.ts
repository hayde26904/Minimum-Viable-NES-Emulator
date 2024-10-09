import { CPU } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export class LDA {
    public static immediate(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let val = args[0];
        cpu.setAreg(val);
        console.log(`Loading immediate value (${val}) into A register`);
    }

    public static zeroPage(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from zeropage at address: ${addr} into A register`);
    }

    public static absolute(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from memory at address: ${addr} into A register`);
    }

    public static zeroPageX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getXreg();
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from zeropage at address: ${addr} into A register`);
    }

    public static zeroPageY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getYreg();
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from zeropage at address: ${addr} into A register`);
    }

    public static absoluteX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from memory at address: ${addr} into A register`);
    }

    public static absoluteY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]) + cpu.getYreg();
        let val = ram.read(addr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from memory at address: ${addr} into A register`);
    }

    public static indirectX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getXreg();
        let newAddr = Util.bytesToAddr(ram.read(addr), ram.read(addr + 1));
        let val = ram.read(newAddr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from memory at address: ${newAddr} into A register`);
    }

    public static indirectY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        let newAddr = Util.bytesToAddr(ram.read(addr), ram.read(addr + 1)) + cpu.getYreg();
        let val = ram.read(newAddr);
        cpu.setAreg(val);
        console.log(`Loading value (${val}) from memory at address: ${newAddr} into A register`);
    }
}

export class STA {
    public static zeroPage(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static absolute(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static zeroPageX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getXreg();
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static zeroPageY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getYreg();
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static absoluteX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static absoluteY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]) + cpu.getYreg();
        ram.write(cpu.getAreg(), addr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${addr}`);
    }

    public static indirectX(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0] + cpu.getXreg();
        let newAddr = Util.bytesToAddr(ram.read(addr), ram.read(addr + 1));
        ram.write(cpu.getAreg(), newAddr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${newAddr}`);
    }

    public static indirectY(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = args[0];
        let newAddr = Util.bytesToAddr(ram.read(addr), ram.read(addr + 1)) + cpu.getYreg();
        ram.write(cpu.getAreg(), newAddr);
        console.log(`Storing A register (${cpu.getAreg()}) in memory at address: ${newAddr}`);
    }
}

export class JMP {
    public static absolute(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        cpu.setPC(addr - args.length - 1);
        console.log(`Jumping to address: ${addr}`);
    }

    public static indirect(cpu: CPU, ram: RAM, args: Uint8Array): void {
        let addr = Util.bytesToAddr(args[0], args[1]);
        let newAddr = Util.bytesToAddr(ram.read(addr), ram.read(addr + 1));
        cpu.setPC(newAddr - args.length - 1);
        console.log(`Jumping to address: ${newAddr}`);
    }
}