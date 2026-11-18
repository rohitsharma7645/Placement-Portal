# Account and credential reference

This file records what can be verified from the project source. It intentionally does not contain passwords, Firebase service-account data, or live user records.

| Account / role | Email shown in the UI | Password | Status |
| --- | --- | --- | --- |
| Placement Officer / admin label | `admin@sviet.ac.in` | Not defined in the source | This email is a display label in the app layout, not a seeded login account. |
| Other portal users | Stored in Firebase under `users` | Stored with each user record | There are no other account emails or passwords defined in the checked-in source. Live Firebase records are not available in this repository. |

## Getting valid login credentials

Use an account provisioned in the configured Firebase Realtime Database under `users`, or ask the Firebase/database administrator to provide an account through a secure channel. The app does not ship with a default admin password or demo account.

Do not add real user passwords or Firebase service-account credentials to this file or commit them to Git. The current backend stores and compares passwords directly; use test-only accounts with no reused passwords, and replace this authentication flow before handling real accounts.
