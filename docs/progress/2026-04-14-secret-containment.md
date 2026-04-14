## Objective
- Contain active secret exposure paths found in local audit.

## Scope
- `.gitignore`
- `apps/web/.dev.vars`

## Changes
- Sanitized `apps/web/.dev.vars` by clearing Cloudflare token/account values.
- Added `apps/web/.dev.vars` to root ignore rules.
- Removed `apps/web/.dev.vars` from git tracking (`git rm --cached`) so future local values stay untracked.

## Validation
- `git rm --cached "apps/web/.dev.vars"` succeeded.
- Verified staged changes with `git status --short`.

## Risks or blockers
- Existing leaked tokens and shell history entries still require manual revocation/rotation and local history cleanup.

## Next actions
- Rotate any previously exposed Cloudflare tokens.
- Scrub shell history entries containing literal bearer tokens.
