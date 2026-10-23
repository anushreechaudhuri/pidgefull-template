# Pidgefull template

A reusable birthday card for the web: an animated envelope opens to an illustrated front, a handwritten note, then a horizontal row of uncropped Polaroid photos. Each print keeps its natural aspect ratio and the same displayed image height.

Use **Use this template** on GitHub to make your own copy. This repository contains placeholder photographs and sample text. Personal cards and the original Biro Script font are excluded.

## Start locally

Use Node.js 24 or newer:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/demo/birthday. Edit at `/studio/demo/birthday`. Local drafts and version-specific share links work without a database. Run `npm run build` for production assets in `dist/`.

## Make your card

Edit `public/card.json`: set the recipient, sender, front text, note, seal initial and photo-navigation label. Replace the placeholder assets under `public/photos/` and list each image’s source, actual pixel dimensions, alt text, caption, and unique numeric ID. Any positive number of photos is supported. Put them in the desired order. Photo crops are never required.

Set `path` and `slug` for your card, and update its exact route in `vercel.json` to point to `/card-page.html`. `aliases` accepts old recipient paths; add matching rewrites when you use aliases. The home page shows the default envelope. `/studio<path>` opens the editor.

Replace `public/birthday-art-clean.webp` with your front illustration, retaining its name (or update the two references in `public/app.js`). Caveat supplies the handwritten lettering; Manrope supplies utility controls. Both fonts are self-hosted, with their Open Font Licenses in `public/fonts/`. The envelope is CSS, and icons are SVG. The supplied watercolor illustration is reusable under this repository’s license.

## Deploy on Vercel

```sh
vercel
```

The static recipient flow works immediately. To let the editor’s **Update clean URL** button publish:

1. Create a private Blob store and connect it to your Vercel project: `vercel blob create-store cards --access private --yes`.
2. Generate a random publisher secret: `openssl rand -hex 32`. Save it as `CARD_PUBLISH_KEY` in the production environment. Keep it out of Git.
3. Redeploy, then open `https://your-site/studio<path>#edit.<your-secret>` once in your browser. Bookmark this private link. Share only the recipient route or a version-specific link.

Connected Vercel Blob stores use `BLOB_STORE_ID` and Vercel OIDC credentials. A supported Blob read/write token can also be used. No publishing key is shipped in browser source. The public GET endpoint serves only the published card text; POST requires the publisher secret.

## Sharing and previews

**Copy version-specific link** includes a compressed text snapshot in the URL fragment. This version stays fixed. **Update clean URL** publishes the current text for everyone visiting the plain card URL. Drafts stay in the current browser until published or exported. Visitors do not see editor controls.

For a card thumbnail, add a 1200×630 PNG/JPEG, set `previewImage` to its public path and `siteUrl` to your production origin (or set `SITE_URL` in Vercel). Set `shareTitle` for the preview title. The build puts these tags only in `/card-page.html`; the homepage and studio keep generic metadata without the card image. URL fragments cannot have different thumbnails because preview crawlers don’t send fragments to the server. Most chat apps cache previews, so an already shared link may take time to refresh.

## Back up and reuse

After publishing, set `siteUrl`, run `npm run backup:card`, then commit and push. The script saves published text under `cards/<slug>/` and syncs the default manifest. Photo assets are tracked normally in Git. **Download backup** exports a browser draft.

This template serves one active card per deployment. Create another copy/project for another friend to retain each existing live link. Keeping several live cards in one deployment requires additional manifest routing and per-card ownership; that is outside this template.

## Verification and license

The original implementation was checked at 375×667 and 320×568 using Safari’s rendering engine, including reduced motion, touch/keyboard navigation and repeated opening. Test your own photos and note length on the devices you expect recipients to use.

Code, icons, sample assets and illustration: MIT. Fonts: SIL Open Font License, as supplied in `public/fonts/`. Dependencies retain their respective licenses. Your photographs and messages remain yours.

## Message + one-photo card (jam cover)

Open `/demo/jam-birthday` for the second included layout. Its editor is `/studio/demo/jam-birthday`. A pink envelope opens to a watercolor toast-and-jam cover, then a single inside photo and your note. There is no gallery. The two original layouts coexist.

Create additional independently addressable cards with:

```sh
npm run card:new -- --recipient Name --date 2026-11-12 --sender "Your name" --owner your-name --site https://your-site.example
```

This updates `public/stationery-cards.json` and the Vercel rewrites. Deploy, then open the new editor. The same jam artwork is reusable; change the record’s `art` and cover text for a different cover. Set `photo` to a local asset, or choose/paste one in the editor. All people and photo edges are preserved. Notes have a 6,000-character limit.

This layout uses the same private Blob store and publisher secret as the gallery template. Its private editor keys are scoped to an individual card: HMAC-SHA256 of `stationery:<slug>` with `CARD_PUBLISH_KEY`. To generate the edit URL, load the production environment into ignored `.env.local`, then run `npm run card:edit-link -- <slug>`. Share only the recipient URL. **Update share link** publishes text/photo; **Copy share link** copies the clean URL. A draft must be published before it can be shared.

Run `npm run backup:stationery -- <slug>` to archive a published card and sync its fallback text/photo assets, then commit/push. Unlike the original gallery’s one-active-card arrangement, this registry supports multiple message-and-photo cards on one deployment.

The jam illustration was produced with the built-in image-generation tool and is reusable under the repository’s MIT license. Its exact prompt and provenance accompany `public/templates/jam/art.webp`. The public demo contains only placeholder content.
