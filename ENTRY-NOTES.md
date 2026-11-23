# Entry notes — tiny-stack-vm-01

Verified requirements (kit RULES.txt, competition.yaml, ISA.md):

- `main.ts` at repo root, Node 22; one run answers 40 instances:
  `/input/<id>/{program.bin,input.bin}` → `/output/<id>/{stdout.bin,exit.txt}`
  (env: `MAKEFUN_INPUT_DIR`, `MAKEFUN_OUTPUT_DIR`).
- Per instance: 800 points for byte-identical stdout, 200 for the exit code
  (traps included). Places: beat the baseline; ties to the smaller entry.
- Repo ≤ 8,192 bytes, every file counted. LICENSE: kit starter's, byte
  for byte. Deadline 2026-11-25T04:00:00Z; 1 CPU, 512 MB, 60 s.

How met: main.ts follows ISA.md's step order exactly and the reference VM's
arithmetic where pinned down. The dev checker lives outside this repo.

Unverified: scored set drawn after the deadline (score unknowable);
Node 24 local vs 22 contest.
