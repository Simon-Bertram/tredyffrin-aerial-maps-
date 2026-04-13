// Drizzle owns migrations for the Hono API database only (Alchemy `database` D1).
// EmDash CMS data lives on a separate D1 (`emdash-database`); do not define or
// migrate EmDash tables here — see docs/emdash-cms-integration.md §2.
export {};
