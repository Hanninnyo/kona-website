# Journey media

Two NASA satellite images, one licensed clip, one owner-supplied take and two
owner-supplied photographs. This file is the record of where each came from
and exactly how it was cut.

## How this media is used

The journey is a **seventeen-second animation that starts on its own** when
the homepage loads. It is muted, it plays inline, and it carries no audio of
any kind. Nothing is forced on a first visit and nothing is suppressed on a
second — no session flag is written or read, so it plays whenever the homepage
is newly loaded or replayed from the footer. `Enter Kona` is on screen from
the first frame to the last, so the homepage is never more than one action
away. `Skip` goes straight to the end; `Pause` stops the clock and every video
where it stands; `Escape` leaves.

A visitor who has asked for reduced motion gets none of it: no timeline, no
camera, no video, nothing that starts by itself — the same story as three
stills, their words and the destination choice, in document order, with
`Enter Kona` immediately available.

The centre of it is the satellite imagery. One geographic camera windows both
NASA images and the route overlay together, pulling back from the Kona coast
to the whole North Pacific, moving in on California, and dissolving directly
from the map into the photograph of the Mountain View café. There is no
landmark between the map and the café.

## What this imagery is, and is not

The satellite images are **real NASA Earth observation imagery**. They show
where the journey happens. They do **not** document a shipment, a flight or
any particular day's cargo, and no copy anywhere on the site may describe them
that way.

**The route line is a Kona Island Coffee visualisation drawn over NASA's
photograph — it is not part of the NASA imagery.** It is the great circle
between two verified endpoints, Kona International Airport and San Francisco
Bay, and it represents the verified journey the coffee makes: from Kona, over
the Pacific, to Northern California. It is not a record of a specific flight
path, aircraft or shipment.

**No NASA logo, insignia or identifier is used anywhere in the journey, and
NASA does not endorse Kona Island Coffee.** NASA imagery is generally not
copyrighted and may be used for editorial purposes; NASA's guidance on images
and media is at https://www.nasa.gov/nasa-brand-center/images-and-media/ and
its emblems may not be used in a way that implies endorsement. Nothing here
implies any.

Each piece of footage **represents** its phase. The two licensed clips are
atmospheric imagery and are **not** a record of our farm, our aircraft, our
shipment or any particular flight. The farm footage is different in kind: it
is our own, and it shows the farm.

What it does **not** show is roasting. There is no roasting equipment and no
roasting activity in any frame of it. The claim that the coffee is roasted on
the farm is owner-verified and carried by the words; the picture is never
asked to prove it, and no copy may say the footage depicts roasting.

The verified story is narrow and stated in words, not implied by pictures:
the coffee is grown in Kona on Hawaiʻi Island
and roasted on the farm; it travels through Kona International Airport and
across the Pacific to Northern California; the same farm-roasted coffee is
served at the Mountain View café and from the Kona coffee truck.

The coastline establishes where Kona is. It does not depict the farm property.

## Sources

### NASA satellite imagery

| Production files | What it shows | Original source |
| --- | --- | --- |
| `hawaii-wide.jpg` | Hawaiʻi Island, the close view | `hawaii_tmo_2014026_geo.tif` — owner-supplied, downloaded from NASA by the owner. **The exact original page URL was not retained by the owner.** The filename follows NASA Earth Observatory's convention for a Terra MODIS scene of Hawaiʻi, 2014 day 026. |
| `pacific-wide.jpg`, `pacific-mid.jpg` | The North Pacific and North America, the wide view | NASA Blue Marble Next Generation, January, tile A1. Authoritative original: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/january/world.200401.3x21600x21600.A1.jpg — source page: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/ |

The Blue Marble original is 21600 × 21600 and roughly 45 MB. It could not be
fetched from the build environment, whose egress policy refuses every NASA
host, so the owner downloaded it and supplied an 8000 × 8000 derivative of it
(`world-nasa-8000.png`, 29.3 MB) as a working source. That working source was
verified against the 2048 × 2048 reference preview the owner also supplied —
downsampled to 2048 it differs by a mean of 3.3 (summed across three channels,
out of 765) over 599,187 sampled pixels, which is JPEG noise and nothing else.

**Neither the 45 MB original nor the 8000 px working source is committed.**
Only the four optimised derivatives below are. Both working files live outside
the repository.

Both satellite images are **equirectangular (Plate Carrée, WGS84)**, which is
what allows one camera to drive them together. The close view is a GeoTIFF and
carries its own georeferencing: tie point (0, 0) at 20.6225 N, 156.9344 W with
a pixel scale of 0.0023926° longitude and 0.0022483° latitude. The Blue Marble
A1 tile covers longitude −180° to −90° and latitude 0° to 90°; this was
confirmed independently by locating land pixels, which put the Hawaiian chain
at −159.785…−154.907 longitude and 19.028…22.236 latitude against a real
extent of −159.79…−154.81 and 18.91…22.23.

### Licensed stock

| Scene    | Title                    | Credit         | Source                                              | Licence          | Downloaded |
| -------- | ------------------------ | -------------- | --------------------------------------------------- | ---------------- | ---------- |
| origin   | Kona coast (aerial)      | Roger Holzberg | Pexels                                              | Pexels free use  | 2026-08-24 |
| crossing | Sea of Clouds *(no longer used)* | Pixabay | https://www.pexels.com/video/sea-of-clouds-855679/  | CC0 / free use   | 2026-08-24 |
| arrival  | San Francisco at dawn *(no longer used)* | Tyler Francis | Pexels                       | Pexels free use  | 2026-08-24 |

Two clips are **no longer used**, and both have had their encodes and posters
removed from this branch:

- *Sea of Clouds* was replaced by the satellite crossing.
- *San Francisco at dawn* was the Golden Gate arrival. The scene itself has
  been removed: the route now reaches the Bay Area and the map dissolves
  straight into the café, because the café is the arrival and a landmark on
  the way to it was a second destination competing with the real one. Its four
  files — `arrival-wide.mp4`, `arrival-tall.mp4`, `arrival-wide.jpg` and
  `arrival-tall.jpg`, 392.4 kB together — are deleted.

The approved versions remain on the branches that shipped them. Both entries
are kept here because the licence record for material this site once served
belongs in the record whether or not the files are still present.

### Owner-supplied

| Production file | Original filename | Source         | Ownership          | Supplied   | Intended use |
| --------------- | ----------------- | -------------- | ------------------ | ---------- | ------------ |
| `farm-wide.mp4`, `farm-tall.mp4`, `farm-wide.jpg`, `farm-tall.jpg` | `IMG_1202.mov` | Owner-supplied | Kona Island Coffee | 2026-08-25 | The opening phase of the journey, under *Grown in Kona. Roasted on the farm.* |

The farm footage carries its own capture metadata — an iPhone 16 Pro Max,
iOS 18.6, recorded 2025-09-05 at 11:39 local time, with GPS at 19.5596 N,
155.9312 W and an elevation of 456 m. That places it in the Kona coffee belt
on Hawaiʻi Island, and it corroborates the owner's confirmation that this is
the farm the beans come from. No capture date is asserted here beyond what
that metadata contains.

Two further owner-supplied assets were reviewed and are **not used**:

- `IMG_1590.MOV` — a farm overview, technically sound but flat under heavy
  overcast, with shade cloth across the top of frame and a corrugated roof in
  the lower corner. It did not materially improve the sequence, and is neither
  optimized nor committed.
- `IMG_1245.png` — an authentic farm processing structure. Excluded by the
  owner: the farm take tells the story more elegantly, and the structure image
  is not to be used merely to argue that roasting happens. Nothing in the
  journey needs it, because nothing in the journey asks a picture to carry
  the roasting claim.

**No AI-generated imagery is used anywhere in the journey, and no generative
image editing was used on any asset in it.** Every frame is either real NASA
satellite imagery, licensed stock photography of real places, or
owner-supplied footage and photographs. Several AI-generated truck and café images exist
elsewhere in `public/images/` — identifiable by a four-point sparkle
watermark, garbled signage and stripped metadata — and none of them is used
here or may be introduced here.

### The closing photographs

| Production files | Original filename | Source | Ownership | Supplied | Depicts |
| --- | --- | --- | --- | --- | --- |
| `cafe-wide.jpg`, `cafe-tall.jpg` | `kona-cafe-current.jpg` | Owner-supplied | Kona Island Coffee | 2026-08-26 | The **current Mountain View café**, entrance open beneath the round sign |
| `truck-wide.jpg`, `truck-tall.jpg` | `kona-truck-authentic.jpg` | Owner-supplied | Kona Island Coffee | 2026-08-26 | The **authentic Kona coffee truck**, service window open, a customer ordering |

Both originals are 1536 × 2048. They were delivered inside
`kona-destination-photos.zip`, extracted outside the repository, and only the
derivatives below are committed.

**The truck photograph carries older menu graphics** — a printed panel
advertising crepes, and an A-frame board — which no longer reflect what is
served. The crop pushes that panel to the edge of frame and leaves the A-frame
board out entirely, and the composition leads with the truck, the round Kona
logo, the open service window and a real customer at it. The dog, the parked
car and the figure at the right edge fall outside the crop for the same
reason. The closing composition then crops it further: the photograph is held
in a portrait frame carried to the right edge of the stage, which minimises
the menu panel again without altering the original photograph in any way.

In the linear story — what a reduced-motion visitor and a visitor without
JavaScript see — the two photographs stack, and the truck is held in the same
portrait proportion and cropped the same way for the same reason.

**Nothing in either photograph was erased, replaced, extended or repainted.**
No generative image editing of any kind was used, on these or on anything else
in the journey. The only operations applied were cropping, scaling,
positioning and the shared colour grade, exactly as for the footage — both
originals arrive soft and slightly milky, and the grade brings them onto the
same curve as the footage so the close does not look like a different piece of
work.

| Output | Crop | Scale |
| --- | --- | --- |
| `cafe-wide.jpg` | `1536:960:0:280` | `1600:1000` |
| `cafe-tall.jpg` | `940:1740:300:200` | `700:1296` |
| `truck-wide.jpg` | `945:1181:0:380` | `720:900` |
| `truck-tall.jpg` | `945:1181:0:380` | `480:600` |

**The café was re-framed on its entrance**, and the two crops are cut
separately because one cannot serve both shapes of screen. The original is
3 : 4. A widescreen stage can only show about half its height, and the
distance from the top of the round sign to the foot of the doorway is more
than that — so a single crop cannot hold the sign and the whole doorway on a
desktop. The wide crop takes the full width of the original, starts just above
the sign so the sign is complete and clear of the site header, and runs down
through the awning, the glass frontage, the house number and the open door.
The tall crop has the room the wide one does not and carries the sign, the
door, the interior and the walkway together.

Nothing above the sign is kept: the earlier framing spent its upper third on
empty façade and roofline, which is not what arriving at a café looks like.
Both are crops, scales and the grade below — nothing was extended, retouched
or repainted, and no generative editing was used.

Photograph grade, applied before the shared grade:
`eq=contrast=1.16:saturation=1.06:gamma=0.95:brightness=-0.012`

Two further clips were evaluated and **rejected**: a Kīlauea eruption clip
(it would imply the farm sits at an active volcano, which it does not) and an
earlier in-flight clip (a recognisable airline livery, and carbonate banks
that read as the Caribbean rather than the Pacific). Neither is used, and
neither source file is in this repository.

Full-resolution source files are never committed. Only the encodes below are.

## Encodes

Shared grade, applied to everything so the sequence cuts together — a small
warm shift and a highlight roll-off, nothing that would count as a look:

```
colorbalance=rs=0.012:gs=0.004:bs=-0.014:rm=0.010:bm=-0.010,
curves=all='0/0 0.5/0.5 0.85/0.835 1/0.965'
```

Per-scene correction, applied before the shared grade:

| Scene    | Correction                                                  |
| -------- | ----------------------------------------------------------- |
| origin   | `eq=brightness=0.010:contrast=1.00:saturation=0.92:gamma=1.038` |

Crops and ranges. Every output keeps its source's native frame rate; nothing
is slowed, stretched, looped or frame-doubled.

**Phase progression is not synchronised to any of these durations.** One
clock drives the whole sequence, and each take is shown for as long as its
phase lasts — not for as long as the clip runs. A take that reaches its end
holds its last frame under the words until the sequence moves on. The ranges
below were chosen for what is in frame, not for how long anything is on
screen. Nothing is looped, slowed or stretched to fill a phase.

| Output              | Range        | Crop                     | Scale     |
| ------------------- | ------------ | ------------------------ | --------- |
| `origin-wide.mp4`   | 13.6–18.6 s  | `1920:918:0:151`         | `1280:612` |
| `origin-tall.mp4`   | 13.6–18.6 s  | `500:1080:500:0`         | `414:896`  |
| `farm-wide.mp4`     | 12.85–16.04 s | `1080:1920:0:0`         | `720:1280`  |
| `farm-tall.mp4`     | 12.85–16.04 s | `886:1920:97:0`         | `414:896`   |

The farm take is 3.20 s. Earlier than 12.85 s a figure is cropped at the
shoulders and 16.04 s is the end of the clip, so the range cannot grow
further. It plays out in full and then holds its last frame under the words.
It is not looped, not slowed and not extended.

The farm source is HEVC Main 10 in Dolby Vision profile 8, stored 1920×1080
with a −90° display matrix — so it *plays* as 1080×1920 portrait, and the
stored dimensions describe nothing useful. It is tone-mapped from HLG to
Rec. 709 before grading:

```
zscale=t=linear:npl=100, format=gbrpf32le, zscale=p=bt709,
tonemap=hable:desat=0, zscale=t=bt709:m=bt709:r=tv, format=yuv420p
```

then `eq=contrast=1.00:saturation=0.88:gamma=1.02` and the shared grade above.

Both farm outputs stay portrait, because that is how it was shot. On a narrow
screen the portrait encode fills the frame exactly. On a wide one it is
carried full-bleed and centre-cropped like every other chapter — the subject
is a branch of cherries filling the frame, so a centre crop keeps all of it,
and the upscale is invisible at the scale it is shown. Nothing is stretched:
the aspect ratio is preserved and only the framing changes.

Codec, identical for all six:

```
-c:v libx264 -profile:v high -crf 32 -preset slow \
-pix_fmt yuv420p -movflags +faststart -an
```

H.264 in MP4 only. VP9 was measured on this material and came out larger than
H.264 at matched quality on clips this short, so there are no WebM duplicates
to keep in sync. Audio is stripped from every output.

Posters are the first frame of each encode, at `-q:v 6`.

## Satellite derivatives

Both are cropped to the exact patch of Earth the journey uses, so the bounds
recorded in `src/content/journey.ts` are the crop and nothing is inferred.

| Output | Crop from source | Scale | Covers | Size |
| --- | --- | --- | --- | --- |
| `pacific-wide.jpg` | `4533:5511:1333:2489` of 8000 × 8000 | `3000:3647` | lon −165.00375…−114.00750, lat 0…61.99875 | 401 kB |
| `pacific-mid.jpg` | same crop | `1500:1824` | same | 162 kB |
| `hawaii-wide.jpg` | `1200:750:0:84` of 1200 × 1000 | `1600:1000` | lon −156.9344…−154.0633, lat 18.7474…20.4336 | 76 kB |

**The Pacific derivative was re-cut, and the reason is a defect the old one
could not avoid.** It used to cover 50.0° of longitude by 31.25° of latitude.
Whether a map covers the stage is not a matter of framing: a window `span`
degrees wide on a viewport of aspect *A* implies `span / A` degrees of
latitude, so the tallest window the old crop could serve was 31.25 × *A*. At
1024 × 768 that is 41.7° against the 48° the crossing asks for, and at
390 × 844 it is 14.4° — which is why a black band appeared above and below the
map as the camera pulled back, and why it was worst on a phone. The new crop
carries 61.99875° of latitude, from the equator to Alaska, against 50.99625°
of longitude. Together with the camera's own coverage clamp — which narrows
the window until the latitude it implies fits inside the image, then slides it
until it sits wholly within it — the map cannot fail to cover the stage at any
viewport, at any moment. Nothing is overscaled to achieve that, and no vignette
or overlay hides anything: the image simply contains the ground the camera
asks for.

`hawaii-mid.jpg` has been **deleted**. The close view is 76 kB at full size and
it is the one image in the sequence a phone sees at close to its own pixel
scale, so the lighter 900 × 563 encode was the softest thing on screen at the
moment the screen was sharpest. Every viewport is now served the full file.

Grades, applied before the shared grade below:

```
pacific  eq=gamma=1.44:brightness=0.030:saturation=1.55:contrast=1.02,
         colorbalance=rs=-0.06:gs=-0.02:bs=0.10
hawaii   eq=gamma=1.42:brightness=0.012:saturation=1.34:contrast=1.00,
         colorbalance=rs=-0.05:bs=0.08
```

The lift is substantial and it is deliberate. Deep ocean in the Blue Marble
source measures RGB (2, 5, 20) — very nearly black — and at the wide framing
that is most of the frame, so ungraded it reads as an empty void rather than
as the Pacific. The two grades bring the two oceans to within a few points of
each other, RGB (34, 41, 65) and (28, 40, 58), so the close view dissolves
into the wide one without a change of water. Nothing is recoloured beyond a
lift, a saturation nudge and a shift back towards blue; no feature is moved,
added or removed.

Both are encoded `-q:v 3`, and both go through the same shared grade as the
footage so the satellite, the coastline and the farm read as one piece of
work.

## The route

Drawn by us, over NASA's photograph. It is the great circle between:

| | | |
| --- | --- | --- |
| Origin | Kona International Airport | 19.7388 N, 156.0456 W |
| Destination | San Francisco Bay | 37.6213 N, 122.3790 W |

Sampled at 64 points and projected into the wide image's own pixel space,
which places its ends at (645.1, 1728.8) and (3069.3, 441.3) of 3600 × 2250 —
on the Kona coast and in San Francisco Bay respectively, verified against the
imagery. The overlay carries the same transform as the satellite image, so the
line sits on the coastline by construction rather than by adjustment.

It bows north because a great circle does. There is no artificial arc, no
aircraft, no marker, no icon and no coffee bag: the whole overlay is two
`path` elements and one small moving highlight.

## What loads, and when

Only the Kona coastline — one poster and one take — is needed to paint the
first frame, and it is in the markup the server sends, which is what lets the
sequence start on a picture rather than on a wait. Everything after it is
fetched behind that picture while it plays.

The ground under the whole stage carries a 253-byte blur of the coastline,
inline in the stylesheet, so the fraction of a second between the first paint
and that poster's decode is a dark suggestion of the coast rather than an
empty screen.

Because nothing is clicked to start, readiness is enforced by the clock
instead of by a button. Three gates stand in the timeline — the farm take at
2.2 s, both satellite derivatives at 5.2 s, the two destination photographs at
15.2 s — and if what a gate needs has not arrived the clock holds there while
the coastline keeps playing, resuming the instant it lands. On any ordinary
connection nothing ever holds; what the gates guarantee is that a slow one
degrades into a longer coastline rather than into a blank screen or a jump.

Videos are muted, carry no audio track, have no controls, and are paused
whenever their phase is not on screen. The timeline stops when the browser tab
is hidden and resumes where it left off.

Measured payloads, from a real browser running the whole sequence:

| | First paint | Whole journey |
| --- | --- | --- |
| Mobile (390 px, portrait encodes) | 40 kB | 1357 kB |
| Desktop (1440 px, landscape encodes) | 95 kB | 3329 kB |

First paint is one poster — the Kona coastline — and nothing else. Everything
else is fetched behind it while it plays.

A reduced-motion visitor and a visitor without JavaScript fetch no video at
all: the linear story is told in posters, the satellite still and the two
photographs.
