(()=>{"use strict";class e{static bytesToAddr(e,t){return t<<8|e}static addrToBytes(e){return new Uint8Array([255&e,(65280&e)>>8])}static Uint8ArrayToHex(e){return Array.from(e).map((e=>e.toString(16).padStart(2,"0"))).join(" ")}static hex(e){return null===e?"none":e.toString(16).toUpperCase().padStart(2,"0")}}function t(e,t,r){e.setYreg(r)}var r;!function(e){e[e.none=0]="none",e[e.value=1]="value",e[e.pointer=2]="pointer"}(r||(r={}));const o=[{name:"brk",method:function(e,t,r){},opCodes:[0],addrModes:[0],argTypes:[null]},{name:"lda",method:function(e,t,r){e.setAreg(r)},opCodes:[169,165,181,173,189,161,177],addrModes:[1,2,3,5,6,7,11,12],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"sta",method:function(e,t,r){t.write(e.getAreg(),r)},opCodes:[133,149,141,157,153,129,145],addrModes:[2,3,5,6,7,11,12],argTypes:[r.value,r.value,r.value,r.value,r.value,r.value,r.value]},{name:"ldx",method:function(e,t,r){e.setXreg(r)},opCodes:[162,166,182,174,190],addrModes:[1,2,4,5,7],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"stx",method:function(e,t,r){t.write(e.getXreg(),r)},opCodes:[134,150,142],addrModes:[2,4,5],argTypes:[r.value,r.value,r.value]},{name:"ldy",method:t,opCodes:[160,164,180,172,188],addrModes:[1,2,3,5,6],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"sty",method:t,opCodes:[132,148,140],addrModes:[2,3,5],argTypes:[r.value,r.value,r.value]},{name:"tax",method:function(e,t,r){e.setXreg(e.getAreg())},opCodes:[170],addrModes:[0],argTypes:[null]},{name:"txa",method:function(e,t,r){e.setAreg(e.getXreg())},opCodes:[138],addrModes:[0],argTypes:[null]},{name:"tay",method:function(e,t,r){e.setYreg(e.getAreg())},opCodes:[168],addrModes:[0],argTypes:[null]},{name:"tya",method:function(e,t,r){e.setAreg(e.getYreg())},opCodes:[152],addrModes:[0],argTypes:[null]},{name:"tsx",method:function(e,t,r){e.setXreg(e.getSP())},opCodes:[186],addrModes:[0],argTypes:[null]},{name:"txs",method:function(e,t,r){e.setSP(e.getXreg())},opCodes:[154],addrModes:[0],argTypes:[null]},{name:"jmp",method:function(e,t,r){e.setPC(r)},opCodes:[76,108],addrModes:[5,10],argTypes:[r.value,r.value]},{name:"jsr",method:function(t,r,o){let s=t.getPC(),[n,a]=e.addrToBytes(s);t.pushToStack(a),t.pushToStack(n),t.setPC(o)},opCodes:[32],addrModes:[5],argTypes:[r.value]},{name:"rts",method:function(t,r,o){let s=t.pullFromStack(),n=t.pullFromStack(),a=e.bytesToAddr(s,n);t.setPC(a),console.log(`Returned from subroutine to ${e.hex(a)}`)},opCodes:[96],addrModes:[0],argTypes:[null]},{name:"inc",method:function(e,t,r){t.write(t.read(r)+1,r)},opCodes:[230,246,238,254],addrModes:[2,3,5,6],argTypes:[r.value,r.value,r.value,r.value]},{name:"dec",method:function(e,t,r){t.write(t.read(r)-1,r)},opCodes:[198,214,206,222],addrModes:[2,3,5,6],argTypes:[r.value,r.value,r.value,r.value]},{name:"inx",method:function(e,t,r){e.setXreg(e.getXreg()+1)},opCodes:[230],addrModes:[0],argTypes:[null]},{name:"dex",method:function(e,t,r){e.setXreg(e.getXreg()-1)},opCodes:[202],addrModes:[0],argTypes:[null]},{name:"iny",method:function(e,t,r){e.setYreg(e.getYreg()+1)},opCodes:[200],addrModes:[0],argTypes:[null]},{name:"dey",method:function(e,t,r){e.setYreg(e.getYreg()-1)},opCodes:[136],addrModes:[0],argTypes:[null]},{name:"sec",method:function(e,t,r){e.setCarry()},opCodes:[56],addrModes:[0],argTypes:[null]},{name:"clc",method:function(e,t,r){e.clearCarry()},opCodes:[24],addrModes:[0],argTypes:[null]},{name:"adc",method:function(e,t,r){let o=Number(e.getFlags().C);e.setAreg(e.getAreg()+r+o),e.clearCarry()},opCodes:[105,101,117,109,125,121,97,113],addrModes:[1,2,3,5,6,7,11,12],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"sbc",method:function(e,t,r){let o=Number(!e.getFlags().C);e.setAreg(e.getAreg()-r-o),e.setCarry()},opCodes:[233,229,245,237,253,249,225,241],addrModes:[1,2,3,5,6,7,11,12],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"cmp",method:function(e,t,r){e.setFlags(e.getAreg()-r)},opCodes:[201,197,213,205,221,217,193,209],addrModes:[1,2,3,5,6,7,11,12],argTypes:[r.value,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer,r.pointer]},{name:"cpx",method:function(e,t,r){e.setFlags(e.getXreg()-r)},opCodes:[224,228,236],addrModes:[1,2,5],argTypes:[r.value,r.pointer,r.pointer]},{name:"cpy",method:function(e,t,r){e.setFlags(e.getYreg()-r)},opCodes:[192,196,204],addrModes:[1,2,5],argTypes:[r.value,r.pointer,r.pointer]},{name:"beq",method:function(e,t,r){e.getFlags().Z&&e.setPC(r)},opCodes:[240],addrModes:[9],argTypes:[r.value]},{name:"bne",method:function(e,t,r){e.getFlags().Z||e.setPC(r)},opCodes:[208],addrModes:[9],argTypes:[r.value]},{name:"bcc",method:function(e,t,r){e.getFlags().C||e.setPC(r)},opCodes:[144],addrModes:[9],argTypes:[r.value]},{name:"bcs",method:function(e,t,r){e.getFlags().C&&e.setPC(r)},opCodes:[176],addrModes:[9],argTypes:[r.value]},{name:"bmi",method:function(e,t,r){e.getFlags().N&&e.setPC(r)},opCodes:[48],addrModes:[9],argTypes:[r.value]},{name:"bpl",method:function(e,t,r){e.getFlags().N||e.setPC(r)},opCodes:[16],addrModes:[9],argTypes:[r.value]}];class s{constructor(e,t){this.memory=t||new Uint8Array(e).fill(0)}read(e){return this.memory[e]}write(e,t){this.memory[t]=e}getSize(){return this.memory.length}getMemory(){return this.memory}setMemory(e){this.memory=e}}class n extends s{constructor(e,t){super(e,t)}}class a extends s{constructor(e){super(e.length,e)}write(e,t){throw new Error("Did you just try to write to a ROM? Read-only memory? What is wrong with you? Why would you do that?")}}var d;!function(e){e[e.VERTICAL=0]="VERTICAL",e[e.HORIZONTAL=1]="HORIZONTAL"}(d||(d={}));const i=new Map([[0,1],[1,2],[2,2],[3,2],[4,2],[5,3],[6,3],[7,3],[8,1],[9,2],[10,3],[11,2],[12,2]]),g=new Map([[0,function(e,t,r,o){return null}],[1,function(e,t,r,o){return r[0]}],[2,function(e,t,r,o){return r[0]}],[3,function(e,t,r,o){return r[0]+t.getXreg()}],[4,function(e,t,r,o){return r[0]+t.getYreg()}],[5,function(t,r,o,s){return e.bytesToAddr(o[0],o[1])}],[6,function(t,r,o,s){return e.bytesToAddr(o[0],o[1])+r.getXreg()}],[7,function(t,r,o,s){return e.bytesToAddr(o[0],o[1])+r.getYreg()}],[8,function(e,t,r,o){return t.getAreg()}],[9,function(e,t,r,o){let s=128&~r[0]?r[0]:r[0]-254;return t.getPC()+s}],[10,function(t,r,o,s){return t.read(e.bytesToAddr(o[0],o[1]))}],[11,function(t,r,o,s){return t.read(e.bytesToAddr(o[0],o[1])+r.getXreg())}],[12,function(t,r,o,s){return e.bytesToAddr(o[0],o[1])+r.getYreg()}]]);class l{constructor(){this.ram=new n(65535),this.stack=new n(256),this.Areg=0,this.Xreg=0,this.Yreg=0,this.PC=0,this.SP=0,this.Cflag=!1,this.Zflag=!1,this.Nflag=!1}loadProgram(t){const r=function(e){let t=e.getMemory().slice(4);return{prgRomSize:16*t[0]*1024,chrRomSize:8*t[1]*1024,nametableMirroring:1&t[3],battery:Boolean(2&t[3]),mapperNumber:(240&t[3])>>4}}(t),o=t.getMemory().slice(16),s=new a(o.slice(0,r.prgRomSize));new a(o.slice(r.prgRomSize,o.length-1)),console.log(r),console.log(e.Uint8ArrayToHex(s.getMemory()));for(let e=0;e<32767;e++)this.ram.write(s.read(e%s.getSize()),32768+e);console.log(this.ram.getMemory());const n=e.bytesToAddr(this.ram.read(65530),this.ram.read(65531)),d=e.bytesToAddr(this.ram.read(65532),this.ram.read(65533));console.log(`RESET: ${e.hex(d)}`),console.log(`NMI: ${e.hex(n)}`),this.PC=d}reset(){this.Areg=0,this.Xreg=0,this.Yreg=0,this.PC=0,this.SP=0,this.Cflag=!1,this.Zflag=!1,this.Nflag=!1}executeOperation(){let t=this.ram,s=t.read(this.PC),n=o.find((e=>e.opCodes.includes(s)));if(n){let o=n.name,a=n.method,d=n.opCodes.indexOf(s),l=n.addrModes[d],u=n.argTypes[d],p=i.get(l),c=new Uint8Array(p-1);for(let e=0;e<c.length;e++)c[e]=t.read(this.PC+e+1);let h=g.get(l)(t,this,c,u);switch(u){case r.value:break;case r.pointer:h=t.read(h)}console.log(`${e.hex(this.PC)}: ${o.toUpperCase()} ${e.hex(h)}`),this.PC+=p,a(this,t,h)}else console.log(`Invalid or unimplemented opcode: ${e.hex(s)}`),this.PC++}setPC(e){this.PC=e}getPC(){return this.PC}setSP(e){this.SP=255&e}getSP(){return this.SP}setAreg(e){this.setFlags(e),this.Areg=255&e}setXreg(e){this.Xreg=255&e,this.setFlags(e)}setYreg(e){this.Yreg=255&e,this.setFlags(e)}getAreg(){return this.Areg}getXreg(){return this.Xreg}getYreg(){return this.Yreg}pushToStack(e){this.SP--,this.stack.write(e,this.getSP())}pullFromStack(){let e=this.stack.read(this.getSP());return this.SP++,e}setCarry(){this.Cflag=!0}clearCarry(){this.Cflag=!1}setFlags(e){e>255?this.Cflag=!0:e<0&&(this.Cflag=!1),this.Zflag=0===e,this.Nflag=!(128&~e)}getFlags(){return{Z:this.Zflag,N:this.Nflag,C:this.Cflag}}}var u;let p=new class{constructor(){this.cpu=new l,this.currentPrgRom=null}loadProgram(e){this.cpu.reset(),this.cpu.loadProgram(e),this.currentPrgRom=e}step(){this.cpu.executeOperation()}};function c(){p.step(),requestAnimationFrame(c)}null===(u=document.getElementById("romInput"))||void 0===u||u.addEventListener("change",(e=>{const t=e.target;if(t.files&&t.files[0]){const e=t.files[0],r=new FileReader;r.onload=e=>{var t;if(null===(t=e.target)||void 0===t?void 0:t.result){const t=new Uint8Array(e.target.result);let r=new a(t);p.loadProgram(r),c()}},r.readAsArrayBuffer(e)}}))})();