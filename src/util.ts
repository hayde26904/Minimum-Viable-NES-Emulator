export class Util {
    public static bytesToAddr(lobyte : number, hibyte : number): number {
        return (hibyte << 8) | lobyte;
    }

    public static addrToBytes(addr : number): Uint8Array {
        let lo = addr & 0xFF;
        let hi = (addr & 0xFF00) >> 8;
        return new Uint8Array([lo, hi]);
    }

    public static hex(value : number) : string {
        if(value === null){
            return "none";
        } else {
            return value.toString(16).toUpperCase();
        }
    }
}