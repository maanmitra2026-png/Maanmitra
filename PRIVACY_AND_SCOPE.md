# Privacy and MVP scope notes

These notes map key BRD rules to this MVP. They are implementation notes, not a legally approved privacy policy.

| BRD rule | MVP implementation | Remaining work |
|---|---|---|
| Phone numbers must never be exposed to other users | Public user serializers do not return phone or email | Add privacy regression tests and security review |
| Chat only after accepted connection | Message read/write endpoints check accepted connection and block status | WebSocket implementation must repeat the same authorization check |
| Users can block/report | API endpoints for block and report; admin report review | Add UI flows for reporting/blocking, notifications and audit events |
| Medical information has separate privacy controls | Health reports are in a separate table and owner-scoped upload/download/delete endpoints | Production-grade object storage, encryption/key management, antivirus scanning, retention policy and access audit |
| Users control discoverability | Profile setting and discover endpoint filter | Add granular location visibility and who-can-request controls |
| Counsellors verified before professional services | Seed directory explicitly marked `verified: false`, `demo_only: true`; booking is request-only | Credential verification and professional onboarding must be completed before enabling real sessions |
| Account deletion workflow | Authenticated delete endpoint deletes user-owned database rows via cascading foreign keys and attempts to delete report files | Legal retention exceptions, backups/replicas, deletion confirmation and audit review |
| Reported content reviewable by admins | Admin list/update report endpoints | Add moderation UI, escalation policy and audit history |
| Sensitive information encrypted/access-controlled | Password hashing, JWT auth, private report ownership checks; secrets are env-based | TLS, encryption at rest, managed secrets, key rotation, audit logging, penetration testing |

## Not live in this MVP
OTP, email verification, password reset, payment gateway, subscriptions, push notifications, WebSockets, real voice/video calling, AI medical analysis, AI moderation, production counsellor services, and cloud media storage are not connected. Do not market these as operational until implemented and tested.
