# sherpacarta — Last Updated 2026-08-26 by Ziggy (kanban t_4aede6a3)

Brief: wired the two dead email inputs to a real capture backend — #newsletter-email (Rights Dispatch waitlist)
and #coalition-contact (coalition endorsement interest) now POST to /api/capture (CF Pages Function + KV),
with success/error states and mailto fallback. Both inputs previously fired no network request.
Commit: (see git log — pushed to origin/main)
Deploy: https://sherpacarta.org · CF Pages auto-deploy via GitHub Actions (deploy.yml)
