document.getElementById('romInput')?.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const romData = new Uint8Array(e.target.result as ArrayBuffer);
          // Load the ROM data into your emulator
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
  });