# Arrival journey footage

Three licensed clips, re-encoded for the opening chapter. This file is the
record of where each one came from and exactly how it was cut.

## What this footage is, and is not

It is atmospheric travel imagery. It is **not** a record of our farm, our
aircraft, our shipment or any particular flight, and no copy anywhere on the
site may describe it that way. The verified story is narrow and stated in
words, not implied by pictures: the coffee is grown in Kona on Hawaiʻi Island
and roasted on the farm; it travels through Kona International Airport and
across the Pacific to the Bay Area; the same farm-roasted beans are served at
the Mountain View café and from the Kona coffee truck.

The coastline establishes where Kona is. It does not depict the farm property.

## Sources

| Scene    | Title                    | Credit         | Source                                              | Licence          | Downloaded |
| -------- | ------------------------ | -------------- | --------------------------------------------------- | ---------------- | ---------- |
| origin   | Kona coast (aerial)      | Roger Holzberg | Pexels                                              | Pexels free use  | 2026-08-24 |
| crossing | Sea of Clouds            | Pixabay        | https://www.pexels.com/video/sea-of-clouds-855679/  | CC0 / free use   | 2026-08-24 |
| arrival  | San Francisco at dawn    | Tyler Francis  | Pexels                                              | Pexels free use  | 2026-08-24 |

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
is slowed, stretched or frame-doubled:

| Output              | Range        | Crop                     | Scale     |
| ------------------- | ------------ | ------------------------ | --------- |
| `origin-wide.mp4`   | 13.6–17.6 s  | `1920:918:0:151`         | `1280:612` |
| `origin-tall.mp4`   | 13.6–17.6 s  | `500:1080:500:0`         | `414:896`  |
| `crossing-wide.mp4` | 6.0–10.0 s   | `1280:612:0:54`          | native     |
| `crossing-tall.mp4` | 6.0–10.0 s   | `332:720:474:0`          | `414:896`  |
| `arrival-wide.mp4`  | 0.0–2.5 s\*  | `1920:918:0:61`          | `1280:612` |
| `arrival-tall.mp4`  | 0.0–2.5 s\*  | `500:1080:460:0`         | `414:896`  |

\* the complete clip, at its native 23.976 fps.

Codec, identical for all six:

```
-c:v libx264 -profile:v high -crf 32 -preset slow \
-pix_fmt yuv420p -movflags +faststart -an
```

H.264 in MP4 only. VP9 was measured on this material and came out larger than
H.264 at matched quality on clips this short, so there are no WebM duplicates
to keep in sync. Audio is stripped from every output.

Posters are the first frame of each encode, at `-q:v 6`.
