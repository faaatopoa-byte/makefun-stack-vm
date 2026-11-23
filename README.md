# tiny-stack-vm-01 — entry

`main.ts` (Node 22, no dependencies) is a virtual machine for make.fun's tiny stack ISA (kit:
`generator/subject/ISA.md`). For every instance under `$MAKEFUN_INPUT_DIR` (`/input`) it runs
`program.bin` on `input.bin` and writes `$MAKEFUN_OUTPUT_DIR/<id>/stdout.bin` + `exit.txt`.

It implements the ISA in full — the rules the house baseline skips are the point of the contest:
wrapping 32-bit MUL (`Math.imul`), unsigned DIVU/MODU/LTU, 5-bit shift counts, `INT_MIN / -1`,
PUSH8 sign extension, every trap with its own exit code (2–11), in ISA.md's order.

Measured with the kit's own checker against the kit's keys:

- Practice set: **40,000 / 40,000** — the house baseline scores 26,800.
- Two drawn sets (seeds `01234567…`, `fedcba98…`): **80,000 / 80,000**.

See ENTRY-NOTES.md and WORKLOG.md.
