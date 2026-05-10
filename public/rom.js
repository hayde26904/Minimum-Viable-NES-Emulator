import { Memory } from "./memory";
export class ROM extends Memory {
    constructor(bytes) {
        super(bytes.length, bytes);
    }
    write(value, address) {
        throw new Error("Did you just try to write to a ROM? Read-only memory? What is wrong with you? Why would you do that?");
    }
}
