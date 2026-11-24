# ADR-004: District + landmark location, six fixed categories

- **Status:** Accepted
- **Context:** The form needs a usable location input and a triage-friendly violation type, without adding a map library or backend geocoding to a UI-only assignment.
- **Decision:** Location = dropdown of Surabaya districts plus a free-text `patokan` (landmark). Violation type = six fixed radio cards: lampu merah, tidak pakai helm, parkir liar, lawan arah, putar balik ilegal, kecepatan berlebih.
- **Alternatives considered:** Clickable stylized map (more visual, more custom code); free-text violation type (weak triage story); eight categories (unnecessary breadth).
- **Consequences:** The district list is hard-coded in `app.js` and reused by the form and dashboard. Adding a category later means updating the shared `KATEGORI` array, the glossary, and the landing page cards.
