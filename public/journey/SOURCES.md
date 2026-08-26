# Arrival journey footage

Three licensed clips, one owner-supplied take and two owner-supplied
photographs, re-encoded for the opening chapter. This file is the record of
where each came from and exactly how it was cut.

## What this footage is, and is not

The three licensed clips are atmospheric travel imagery. They are **not** a
record of our farm, our aircraft, our shipment or any particular flight, and
no copy anywhere on the site may describe them that way. The farm footage is
different in kind: it is our own, and it shows the farm.

What it does **not** show is roasting. There is no roasting equipment and no
roasting activity in any frame of it. The claim that the coffee is roasted on
the farm is owner-verified and carried by the words; the picture is never
asked to prove it, and no copy may say the footage depicts roasting.

The verified story is narrow and stated in words, not implied by pictures:
the coffee is grown in Kona on Hawaiʻi Island
and roasted on the farm; it travels through Kona International Airport and
across the Pacific to the Bay Area; the same farm-roasted beans are served
at the Mountain View café and from the Kona coffee truck.

The coastline establishes where Kona is. It does not depict the farm property.

## Sources

### Licensed stock

| Scene    | Title                    | Credit         | Source                                              | Licence          | Downloaded |
| -------- | ------------------------ | -------------- | --------------------------------------------------- | ---------------- | ---------- |
| origin   | Kona coast (aerial)      | Roger Holzberg | Pexels                                              | Pexels free use  | 2026-08-24 |
| crossing | Sea of Clouds            | Pixabay        | https://www.pexels.com/video/sea-of-clouds-855679/  | CC0 / free use   | 2026-08-24 |
| arrival  | San Francisco at dawn    | Tyler Francis  | Pexels                                              | Pexels free use  | 2026-08-24 |

### Owner-supplied

| Production file | Original filename | Source         | Ownership          | Supplied   | Intended use |
| --------------- | ----------------- | -------------- | ------------------ | ---------- | ------------ |
| `farm-wide.mp4`, `farm-tall.mp4`, `farm-wide.jpg`, `farm-tall.jpg` | `IMG_1202.mov` | Owner-supplied | Kona Island Coffee | 2026-08-25 | The farm moment: the second beat of the arrival journey |

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

**No AI-generated imagery is used anywhere in the arrival journey.** Every
frame is either licensed stock photography of real places or owner-supplied
footage of the farm. Several AI-generated truck and café images exist
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
served. The crop pushes that panel into the corner of frame and leaves the
A-frame board out entirely, and the composition leads with the truck, the
round Kona logo, the open service window and a real customer at it. The dog,
the parked car and the figure at the right edge fall outside the crop for the
same reason.

**Nothing in either photograph was erased, replaced, extended or repainted.**
No generative image editing of any kind was used. The only operations applied
were cropping, scaling, positioning and the shared colour grade, exactly as
for the footage — both originals arrive soft and slightly milky, and the grade
brings them onto the same curve as the film so the close does not look like a
different piece of work.

| Output | Crop | Scale |
| --- | --- | --- |
| `cafe-wide.jpg` | `1360:1700:88:180` | `720:900` |
| `cafe-tall.jpg` | `1104:1380:216:280` | `480:600` |
| `truck-wide.jpg` | `945:1181:0:380` | `720:900` |
| `truck-tall.jpg` | `945:1181:0:380` | `480:600` |

Photograph grade, applied before the shared grade:
`eq=contrast=1.16:saturation=1.06:gamma=0.95:brightness=-0.012`

Two further clips were evaluated and **rejected**: a Kīlauea eruption clip
(it would imply the farm sits at an active volcano, which it does not) and an
earlier in-flight clip (a recognisable airline livery, and carbonate banks
that read as the Caribbean rather than the Pacific). Neither is used, and
neither source file is in this repository.

Full-resolution source files are never committed. Only the encodes below are.

## Encodes

Shared grade, applied to all three so the sequence cuts together — a small
warm shift and a highlight roll-off, nothing that would count as a look:

```
colorbalance=rs=0.012:gs=0.004:bs=-0.014:rm=0.010:bm=-0.010,
curves=all='0/0 0.5/0.5 0.85/0.835 1/0.965'
```

Per-scene correction, applied before the shared grade:

| Scene    | Correction                                                  |
| -------- | ----------------------------------------------------------- |
| origin   | `eq=brightness=0.010:contrast=1.00:saturation=0.92:gamma=1.038` |
| crossing | `eq=contrast=0.97:saturation=0.94:gamma=1.02`                |
| arrival  | `eq=brightness=0.015:contrast=0.97:saturation=0.88:gamma=1.04` |

Crops and ranges. Every output keeps its source's native frame rate; nothing
is slowed, stretched or frame-doubled.

The ranges are set by the film, not the other way round: each take has to
outlast the beat it plays under *plus* the dissolve out of it, or the picture
freezes while the words are still being read. The island and the crossing were
therefore extended from their first cuts, and the farm was extended backwards
to just after the point where a figure is cropped at the shoulders. The
arrival is the whole clip and cannot be extended, so its last frames play out
under the outgoing fade — which is what that fade is for.

| Output              | Range        | Crop                     | Scale     |
| ------------------- | ------------ | ------------------------ | --------- |
| `origin-wide.mp4`   | 13.6–18.6 s  | `1920:918:0:151`         | `1280:612` |
| `origin-tall.mp4`   | 13.6–18.6 s  | `500:1080:500:0`         | `414:896`  |
| `crossing-wide.mp4` | 6.0–10.6 s   | `1280:612:0:54`          | native     |
| `crossing-tall.mp4` | 6.0–10.6 s   | `332:720:474:0`          | `414:896`  |
| `arrival-wide.mp4`  | 0.0–2.5 s\*  | `1920:918:0:61`          | `1280:612` |
| `arrival-tall.mp4`  | 0.0–2.5 s\*  | `500:1080:460:0`         | `414:896`  |
| `farm-wide.mp4`     | 12.85–16.04 s | `1080:1920:0:0`         | `720:1280`  |
| `farm-tall.mp4`     | 12.85–16.04 s | `886:1920:97:0`         | `414:896`   |

The farm take is 3.20 s and its beat is 4.4 s, because that beat carries the
sentence the whole roasting claim rests on. Earlier than 12.85 s a figure is
cropped at the shoulders and 16.04 s is the end of the clip, so the range
cannot grow further. The take plays out in full and its last frame then
settles under the words — a three per cent push across the beat, imperceptible
while the footage runs — rather than stopping dead. It is not looped and it is
not slowed.

\* the complete clip, at its native 23.976 fps.

The farm source is HEVC Main 10 in Dolby Vision profile 8, stored 1920×1080
with a −90° display matrix — so it *plays* as 1080×1920 portrait, and the
stored dimensions describe nothing useful. It is tone-mapped from HLG to
Rec. 709 before grading:

```
zscale=t=linear:npl=100, format=gbrpf32le, zscale=p=bt709,
tonemap=hable:desat=0, zscale=t=bt709:m=bt709:r=tv, format=yuv420p
```

then `eq=contrast=1.00:saturation=0.88:gamma=1.02` and the shared grade above.

Both farm outputs stay portrait. On a narrow screen that fills the frame; on
a wide one the take is held at its own proportions in a tall aperture against
deep espresso, because stretching a phone-held portrait to full width or
centre-cropping it to a strip would waste the only thing worth showing.

Codec, identical for all six:

```
-c:v libx264 -profile:v high -crf 32 -preset slow \
-pix_fmt yuv420p -movflags +faststart -an
```

H.264 in MP4 only. VP9 was measured on this material and came out larger than
H.264 at matched quality on clips this short, so there are no WebM duplicates
to keep in sync. Audio is stripped from every output.

Posters are the first frame of each encode, at `-q:v 6`.
