# side b: a feelings archive

A small static site with no build step. Open `index.html` to view it.

## Edit your content
Everything you'll change lives at the top of `app.js`:
- `MEMORIES.taiwan` holds the slide label, photo, hazy background, tag text, and the six things.
- Each thing has a `note` (shown on the tag) and a `song` with `title`, `artist`, `cover` and `spotify`. Clicking the thing plays that track in the small Spotify player inside the tag; clicking the CD opens it in Spotify.
- Visitors logged into Spotify in their browser hear full songs; everyone else hears Spotify's ~30-second preview.
- `pos` sets where a thing floats on a computer and `mpos` sets where it floats on a phone (left/top as %, plus a size). `tilt` rotates it and `z` puts it in front of the others.
- `GRID` is the 3×3 sheet. Each pocket holds a memory id, `'readme'`, or `null` (empty).
- To add a memory, copy the `taiwan` block, give it a new id, add its pictures to `assets/`, and put the id in a `GRID` pocket.

## Preview on your computer
In this folder run `python3 -m http.server`, then visit http://localhost:8000

## Put it on Vercel
- Quick: go to vercel.com → Add New → Project, then drag this folder in (or run `npx vercel` in this folder).
- Ongoing: push this folder to a GitHub repo and import that repo into Vercel. Every push redeploys.
- Custom domain: Vercel project → Settings → Domains.
