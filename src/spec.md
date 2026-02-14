# Specification

## Summary
**Goal:** Add in-app short share links for photos that can be created by authorized admins and opened by anyone.

**Planned changes:**
- Backend: store and resolve unique short codes that map to existing photo IDs, with an admin-only method to create/retrieve a short code and a public method to resolve a short code to a photo ID.
- Backend: ensure short-code mappings persist across canister upgrades when stable state is used (adding migration logic only if required by the existing stable layout).
- Frontend: add a “Copy share link” control in the photo viewer that generates a short URL in the form `<origin>/#s=<shortCode>`, copies it to the clipboard, and shows an English success/error message.
- Frontend: hide or disable the “Copy share link” control for users who are not authorized to create short links, with an English explanation if disabled.
- Frontend: on initial page load, detect `#s=<shortCode>`, resolve it, and open the corresponding photo in the existing photo viewer dialog without requiring authentication; show an English, user-friendly message if invalid.

**User-visible outcome:** Admins can copy short share links for photos from the viewer, and anyone can open a photo directly by visiting a short-link URL using `#s=<shortCode>`.
