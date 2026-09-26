# Shinobi Legends authentication UI

The login and registration screens are frontend previews. They do not create accounts, authenticate passwords, send emails, or isolate saves between users. They intentionally leave the existing local game save intact.

## Connect a backend

Replace `window.ShinobiAuthService` in `dist/auth-service.js` with server calls. The UI awaits these methods and handles success, errors, validation, and loading:

- `login({identifier, password})` resolves to `{displayName}` only after a successful server authentication.
- `register({displayName, email, password})` resolves to `{displayName}` only if the backend creates an authenticated session. If registration requires verification first, adapt the success flow in `auth.js` to show that state instead of entering the game.
- `signOut()` invalidates the server session.

Use secure HttpOnly cookies for real sessions, server-side validation, password hashing on the server, and appropriate request protection. Remove the demo note and guest path only when the real backend behavior is implemented. Do not save plaintext passwords or put credentials in localStorage.

`shinobi-legends-demo-entry` in sessionStorage currently hides the welcome UI in the same tab. It is not an authentication token or security boundary. Replace that check with the server's session check. Current gameplay still uses one browser save (`veilstorm-save-v1`); move persistence to authenticated server-owned player records before enabling real multi-user gameplay.

Email and password fields are never persisted in demo mode. Signing out only removes the demo entry marker and leaves gameplay progress untouched.

## Expanded local gameplay systems

`dist/systems.js` adds inventory quantities, independent attack/defense loadouts,
mission supply consumption and AutoBuy, story chapter progress, timed duties,
all five stat upgrades, elemental profile identity, Council commendations,
team recruitment, gifts, local rankings and local forum threads.

All state still uses `veilstorm-save-v1`. `systemVersion: 1` migrates old boolean
item ownership to quantity 1 and grants the initial supply bundle exactly once.
Do not reset saved mission/jutsu mastery or rename the save key.

Social screens explicitly describe local simulation. Referral URLs carry an opaque
local referral code but do not register accounts or credit remote users. No email,
message, gift or forum post is transmitted. Replace these local actions with
server-authoritative operations when connecting accounts. Persist timer deadlines,
one-time claims, inventory/currency transactions, HP and combat records on the
server; validate every action there. The UI and localStorage are not security boundaries.

Current gameplay rules (original design where the references were incomplete):
- Missions/fights consume stamina; jutsus consume spirit. Damage cap: 27 per fighter.
- One best item per slot per squad member; attack and defense sets are independent.
- Slots: weapon, armor, tool, charm. Supplies are consumed by missions.
- Teammates contribute 30% of stats and +5 maximum spirit; recruitment restores 5 spirit.
- Health/attack/defense/spirit: +5 per point. Stamina: +1 per 2 points.
- 3 stat points per level; 2-point Council commendations at levels 3/5/8/12/16.
- Spirit Pack fills to floor(maxSpirit * 1.25), once per 23 hours. Excess remains
  until used; normal regeneration never refills above the normal maximum.
- Free supply gift has an independent 23-hour timer. Sending has per-ally timers.
- Story chapters award ordinary contract rewards, then one-time chapter rewards.
- Duties have persisted deadlines and single-claim rewards. Forum is device-local.
- AI leaderboard wins/kills are actual local encounters, not fabricated global data.

There are no video features, video rewards, real-money purchases or real multiplayer
in this demo. `checks/systems.cjs` covers migration, transactions, claims, timers,
loadouts, profile upgrades, story progression, safe forum rendering and persistence.

## Interactive duties

`dist/duties.js` upgrades duty records to version 2. New duties have a route choice,
an NPC ambush at 35%, a discovery at 70%, and a final single-claim reward. Travel
elapsed time advances to the next checkpoint then pauses for input, including
across reloads or offline time. Existing timed duties retain their earned progress
and finish without newly inserted encounters.

Weapon strikes need no additional stamina beyond the assignment cost. Spirit
strikes require a learned jutsu and 8 Spirit. Both incoming and outgoing damage
are capped at 27 and clamped to current HP. Death fails the duty and updates the
lifetime record; kills count immediately, while bonus currency/XP are paid only
on completion. Evasion has a 70% clean escape chance; otherwise one capped hit
is taken before escape. Investigating consumes 5 Spirit. Retreat forfeits rewards.

These are local NPC encounters, not attacks by real users. The record contains
elapsed, lastTick, stage, event, bonuses and journal; persist and validate them
server-side when connecting accounts. User decisions never cause background damage.
