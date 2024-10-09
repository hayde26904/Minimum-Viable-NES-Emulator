export class Util {
    public static bytesToAddr(lobyte : number, hibyte : number): number {
        return (hibyte << 8) | lobyte;
    }
}