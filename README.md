# SBA14
# Cheyenne's Secure Web Portal (SBA)

## Quickstart
1. copy `.env` (example provided) to project root and fill values
2. npm install
3. npm run dev
4. Visit: http://localhost:5000

## Endpoints
- POST /api/users/register
- POST /api/users/login
- GET  /api/users/auth/github
- GET  /api/users/auth/github/callback
- CRUD bookmarks: /api/bookmarks (all protected)

## Notes
- Do NOT commit `.env` to git.
- GitHub OAuth redirect must match GITHUB_CALLBACK_URL in your GitHub OAuth app settings.