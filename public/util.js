export class Util {
    static bytesToAddr(lobyte, hibyte) {
        let lo = lobyte & 0xFF;
        let hi = hibyte & 0xFF;
        return (hi << 8) | lo;
    }
    static addrToBytes(addr) {
        let lo = addr & 0xFF;
        let hi = (addr & 0xFF00) >> 8;
        return new Uint8Array([lo, hi]);
    }
    static Uint8ArrayToHex(arr) {
        return Array.from(arr).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
    }
    static hex(value) {
        if (typeof value === 'undefined' || value === null) {
            return "none";
        }
        else {
            return value.toString(16).toUpperCase().padStart(2, '0');
        }
    }
    static binary(value) {
        if (value === null) {
            return "none";
        }
        else {
            return value.toString(2);
        }
    }
    static getBit(byte, bit) {
        return (byte >> bit) & 1;
    }
    //bitmask matches order that booleans come in array. true true false false = 1100
    static boolsToBitmask(bools) {
        let mask = 0;
        let startingPoint = 1 << bools.length - 1;
        bools.forEach((value, i) => {
            if (value) {
                mask = mask ^ (startingPoint >> i);
            }
        });
        return mask;
    }
    static bitmaskToBools(bitmask) {
        let len = Math.floor(Math.log2(bitmask)) + 1;
        let startingPoint = 1 << len - 1;
        let bools = new Array();
        for (let i = 0; i < len; i++) {
            if ((bitmask >> (len - 1 - i)) & 1) {
                bools[i] = Boolean(bitmask ^ (startingPoint >> i));
            }
            else {
                bools[i] = false;
            }
        }
        return bools;
    }
}
