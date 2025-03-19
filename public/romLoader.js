var _a;
(_a = document.getElementById('romInput')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                const romData = new Uint8Array(e.target.result);
                console.log(romData[0x8001]);
            }
        };
        reader.readAsArrayBuffer(file);
    }
});
