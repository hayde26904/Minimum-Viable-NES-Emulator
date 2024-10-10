export class Util {
    public static bytesToAddr(lobyte : number, hibyte : number): number {
        return (hibyte << 8) | lobyte;
    }

    public static hex(value : number) : string {
        return value.toString(16).toUpperCase();
    }
}