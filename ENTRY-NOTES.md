# Entry notes — tiny-stack-vm-01

Verified requirements (kit RULES.txt, competition.yaml, ISA.md):

- `main.ts` at the repo root, Node 22; one run answers 40 instances: `/input/<id>/`
  `{program.bin,input.bin}` → `/output/<id>/{stdout.bin,exit.txt}` (env `MAKEFUN_INPUT_DIR` /
  `MAKEFUN_OUTPUT_DIR` override the mounts).
- Per instance: 800 points for stdout byte-identical to the reference VM's, 200 for its exit
  code, traps included. A place requires beating the house baseline; equal scores go to the
  smaller entry.
- Repository at most 8,192 bytes, every file counted. LICENSE is the kit
  starter's file, byte for byte. Deadline 2026-11-25T04:00:00Z; limits 1 CPU, 512 MB, 60 s.

How met: main.ts follows ISA.md's step order exactly (step limit → pc range → opcode known →
immediate fits → stack needs → own traps → effect) and the reference VM's arithmetic where the
ISA pins it down. Measured with the kit checker: practice 40,000 / 40,000 (baseline 26,800);
two drawn sets, 80 instances, 80,000 / 80,000. The dev checker lives outside this repo (every
repo byte counts); WORKLOG.md describes it.

Unverified: the scored set is drawn after the deadline, so its score is unknowable here; local
Node 24 vs the contest's Node 22 (nothing version-specific beyond type-stripped .ts).
