[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/faaatopoa-byte/makefun-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/faaatopoa-byte/makefun-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

# tiny-stack-vm-01 — entry

`main.ts` (Node 22) is a VM for make.fun's tiny stack ISA
(kit: `generator/subject/ISA.md`). Each instance under `$MAKEFUN_INPUT_DIR`:
runs `program.bin` on `input.bin`, writes `$MAKEFUN_OUTPUT_DIR/<id>/stdout.bin`
+ `exit.txt`.

It implements the ISA in full — the rules the baseline skips:
32-bit MUL (`Math.imul`), DIVU/MODU/LTU, 5-bit shift counts, `INT_MIN / -1`,
PUSH8 sign extension, every trap with its exit code (2–11).

Kit checker: practice **40,000 / 40,000** (baseline 26,800); drawn sets
**80,000 / 80,000**. See ENTRY-NOTES.md, WORKLOG.md.
