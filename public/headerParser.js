export var NametableMirroringTypes;
(function (NametableMirroringTypes) {
    NametableMirroringTypes[NametableMirroringTypes["VERTICAL"] = 0] = "VERTICAL";
    NametableMirroringTypes[NametableMirroringTypes["HORIZONTAL"] = 1] = "HORIZONTAL";
})(NametableMirroringTypes || (NametableMirroringTypes = {}));
export function parseiNES1(rom) {
    let header = rom.getMemory().slice(4);
    return {
        prgRomSize: (header[0] * 16) * 1024,
        chrRomSize: (header[1] * 8) * 1024,
        nametableMirroring: header[3] & 1,
        battery: Boolean(header[3] & 2),
        mapperNumber: (header[3] & 0b11110000) >> 4
    };
}
