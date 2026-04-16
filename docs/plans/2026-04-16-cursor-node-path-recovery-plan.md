# Cursor Remote Node Path Recovery Plan

## Goal

Document how to verify and recover from the mismatch where Cursor agent
shells resolve `node` to Cursor's bundled remote binary instead of the
devcontainer's Node installation.

## Current Understanding

- The project devcontainer uses Node 24 via
  `mcr.microsoft.com/devcontainers/javascript-node:24-bookworm`.
- Interactive terminals in the container resolve `node` to the correct
  devcontainer runtime and report `v24.14.0`.
- Some Cursor-managed shell contexts may resolve `node` to
  `~/.cursor-server/bin/.../node`, which can report a different version
  such as `v20.18.2`.
- This mismatch does not necessarily mean the project or container is on the
  wrong Node version.

## Recovery Steps

### 1) Confirm the active Node binary in a fresh terminal

Run:

```bash
which node
node -v
/usr/local/bin/node -v
```

Expected result:

- `node -v` should report the devcontainer version, currently `v24.14.0`.
- `/usr/local/bin/node -v` should also report `v24.14.0`.
- If `which node` points to `/usr/local/bin/node`, the shell is using the
  expected runtime.

### 2) Reload Cursor before rebuilding anything

Use the Command Palette and run:

- `Developer: Reload Window`

Then reopen the container if prompted and retest `which node` and `node -v`
in a fresh terminal.

### 3) Reconnect or rebuild the devcontainer if the mismatch persists

Use the Command Palette and try one of:

- `Dev Containers: Reopen in Container`
- `Dev Containers: Rebuild Container`
- `Dev Containers: Rebuild and Reopen in Container`

Retest after the container comes back up.

### 4) Avoid changing Cursor's bundled Node directly

- Do not manually upgrade or replace the Node binary under
  `~/.cursor-server/bin/...`.
- Treat that binary as Cursor's internal runtime, not the project's runtime.
- Prefer fixing the active session by reloading Cursor or reconnecting to the
  container.

### 5) Use an explicit workaround if needed

If a shell context still resolves the wrong `node`, run commands with the
container binary explicitly:

```bash
/usr/local/bin/node -v
/usr/local/bin/pnpm --filter web build
```

### 6) Only consider container replacement as a last resort

Rebuild or recreate the container only if:

- fresh terminals stop reporting Node 24,
- `/usr/local/bin/node` is missing or wrong, or
- reconnecting and rebuilding do not restore the expected environment.

## Decision

- The first response should be to reload Cursor and retest.
- The second response should be to reopen or rebuild the devcontainer.
- Full container deletion should be reserved for cases where the devcontainer
  runtime itself is clearly incorrect.
