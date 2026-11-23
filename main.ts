// tiny-stack-vm-01 entry: a VM for make.fun's tiny stack ISA (kit generator/subject/ISA.md), every
// rule incl. the hard ones: wrapping MUL, unsigned DIVU/MODU/LTU, 5-bit shift counts, INT_MIN/-1,
// each trap its own exit code (2-11), in ISA.md's order; a trap keeps prior output.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
// opcode -> [immediate bytes, pops, pushes]; binary ops fill in below except unary NEG/NOT.
const T = { 0:[0,0,0], 1:[1,0,1], 2:[4,0,1], 3:[0,1,0], 4:[0,1,2], 5:[0,2,2], 6:[0,2,3], 7:[0,3,3],
  23:[0,1,1], 27:[0,1,1], 48:[2,0,0], 49:[2,1,0], 50:[2,1,0], 51:[2,0,0], 52:[0,0,0], 64:[0,1,1],
  65:[0,2,0], 80:[0,1,0], 81:[0,1,0], 82:[0,0,1], 83:[0,1,0] };
for (let o = 16; o <= 34; o++) if (o !== 23 && o !== 27 && o !== 31) T[o] = [0, 2, 1];
function run(p, inp) {
  const n = p.length, D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256);
  const out = new Uint8Array(65536);
  let sp = 0, csp = 0, olen = 0, ip = 0, pc = 0, steps = 0;
  const done = (code) => ({ out: out.slice(0, olen), code });
  for (;;) {
    if (steps === 1000000) return done(10);
    if (pc < 0 || pc >= n) return done(9);
    const op = p[pc], t = T[op];
    if (t === undefined) return done(5);
    if (pc + t[0] >= n) return done(9);
    steps++;
    if (sp < t[1]) return done(2);
    if (sp - t[1] + t[2] > 256) return done(3);
    const next = pc + 1 + t[0];
    pc = next;
    switch (op) {
      case 0: return done(0);
      case 1: D[sp++] = (p[next - 1] << 24) >> 24; break;
      case 2: D[sp++] = p[next - 4] | (p[next - 3] << 8) | (p[next - 2] << 16) | (p[next - 1] << 24); break;
      case 3: sp--; break;
      case 4: D[sp] = D[sp - 1]; sp++; break;
      case 5: { const x = D[sp - 1]; D[sp - 1] = D[sp - 2]; D[sp - 2] = x; break; }
      case 6: D[sp] = D[sp - 2]; sp++; break;
      case 7: { const a = D[sp - 3]; D[sp - 3] = D[sp - 2]; D[sp - 2] = D[sp - 1]; D[sp - 1] = a; break; }
      case 23: D[sp - 1] = -D[sp - 1] | 0; break;
      case 27: D[sp - 1] = ~D[sp - 1]; break;
      case 48: case 49: case 50: {
        const rel = ((p[next - 2] | (p[next - 1] << 8)) << 16) >> 16;
        let take = op === 48;
        if (op !== 48) take = (op === 49) === (D[--sp] === 0);
        if (take) pc = next + rel;
        break;
      }
      case 51:
        if (csp === 64) return done(7);
        C[csp++] = next; pc = p[next - 2] | (p[next - 1] << 8); break;
      case 52:
        if (csp === 0) return done(8);
        pc = C[--csp]; break;
      case 64: { const a = D[sp - 1]; if (a < 0 || a > 255) return done(6); D[sp - 1] = M[a]; break; }
      case 65: { const a = D[sp - 1]; if (a < 0 || a > 255) return done(6); M[a] = D[sp - 2]; sp -= 2; break; }
      case 80: {
        const s = String(D[sp - 1]);
        if (olen + s.length > 65536) return done(11);
        sp--;
        for (let i = 0; i < s.length; i++) out[olen++] = s.charCodeAt(i);
        break;
      }
      case 81:
        if (olen + 1 > 65536) return done(11);
        out[olen++] = D[--sp] & 255; break;
      case 82: D[sp++] = ip < inp.length ? inp[ip++] : -1; break;
      case 83: return done(D[--sp] & 255);
      default: {
        const b = D[sp - 1], a = D[sp - 2];
        let r;
        if (op === 16) r = (a + b) | 0;
        else if (op === 17) r = (a - b) | 0;
        else if (op === 18) r = Math.imul(a, b);
        else if (op === 19) { if (b === 0) return done(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; }
        else if (op === 20) { if (b === 0) return done(4); r = b === -1 ? 0 : a % b | 0; }
        else if (op === 21) { if (b === 0) return done(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; }
        else if (op === 22) { if (b === 0) return done(4); r = (a >>> 0) % (b >>> 0) | 0; }
        else if (op === 24) r = a & b;
        else if (op === 25) r = a | b;
        else if (op === 26) r = a ^ b;
        else if (op === 28) r = a << (b & 31);
        else if (op === 29) r = a >> (b & 31);
        else if (op === 30) r = (a >>> (b & 31)) | 0;
        else if (op === 32) r = a === b ? 1 : 0;
        else if (op === 33) r = a < b ? 1 : 0;
        else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
        sp -= 2; D[sp++] = r;
      }
    }
  }
}
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(new Uint8Array(readFileSync(join(I, id, 'program.bin'))), new Uint8Array(readFileSync(join(I, id, 'input.bin'))));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.out);
  writeFileSync(join(O, id, 'exit.txt'), `${r.code}\n`);
}
