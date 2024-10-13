export class Util {
    public static bytesToAddr(lobyte : number, hibyte : number): number {
        return (hibyte << 8) | lobyte;
    }

    public static addrToBytes(addr : number): Uint8Array {
        let lo = addr & 0xFF;
        let hi = (addr & 0xFF00) >> 8;
        return new Uint8Array([lo, hi]);
    }

    public static Uint8ArrayToHex(arr : Uint8Array) {
        return Array.from(arr).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
    }

    public static hex(value : number) : string {
        if(value === null){
            return "none";
        } else {
            return value.toString(16).toUpperCase().padStart(2, '0');
        }
    }
}