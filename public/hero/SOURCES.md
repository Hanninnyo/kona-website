# Kona Island Latte commercial — sources

## The master

`kona-island-latte-commercial-review-compatible.mp4`, supplied by the owner
and approved as the homepage opening visual.

- H.264, 1920×1080, 24 fps, 10.375 s, no audio track.
- **Owner-approved AI-assisted product visualization**, built from authentic
  owner-supplied Kona Island Coffee references: the real cup, the real
  printed logo, and the real drink colors. It is not documentary footage of a
  drink being prepared, and nothing on the site describes it as such.
- The cup is intentionally left open through the whole film so the espresso
  pour and the macadamia garnish stay visible. Real iced service at Kona
  Island Coffee uses a flat lid; the open cup here is a deliberate exception
  for this one visualization, not a claim about how the drink is served.
- No lid was added to the video at any point in this project.
- No Runway, Veo, Firefly, or other paid generation service was called during
  the website implementation. The video arrived as a finished file; only
  local `ffmpeg` processing (crop, encode, frame extraction) was applied to
  it here.

## Derivatives, all produced locally with ffmpeg — no upscaling

| File | From | How |
|---|---|---|
| `latte-hero-desktop.mp4` | the master, full frame | `libx264 -profile high -preset veryslow -crf 24`, faststart; no crop, no stretch |
| `latte-hero-mobile.mp4` | the master | `crop=810:1080:885:0`, same encode settings — a fixed, deliberate portrait crop centred on the cup, never a stretch of the desktop frame |
| `latte-hero-desktop.jpg` | the master @ 9.5 s | a single settled frame — no motion blur, garnish fully at rest |
| `latte-hero-mobile.jpg` | the master @ 9.5 s | the same frame, the same mobile crop as the mobile video |

9.5 s was chosen because it is a still frame — comparison against 9.0 s and
10.1 s showed no measurable further settling, and 9.5 s reads cleanest.

The mobile crop's x-offset (885) was measured directly from the source: the
cup consistently occupies roughly x=770–1810 of the 1920 px frame, so a
810 px-wide window centred on the cup's midpoint keeps it, the logo, the
pour and the macadamia garnish fully in frame across the whole clip.

### Compression pass (second review round)

The first encode used `-preset slow -crf 20`: 3,346,231 B desktop / 2,576,703 B
mobile. Asked to bring the transfer down, exactly one further candidate was
made per viewport — `-preset veryslow -crf 24` — and measured against the
`-crf 20` file before being adopted, rather than iterating blindly:

| | desktop | mobile |
|---|---:|---:|
| Size | 1,875,809 B (was 3,346,231 B) | 1,363,893 B (was 2,576,703 B) |
| Bitrate | 1.45 Mbps (was 2.58 Mbps) | 1.05 Mbps (was 1.99 Mbps) |
| SSIM vs. the `crf 20` file | 0.9900 | 0.9845 |
| PSNR vs. the `crf 20` file | 47.17 dB | 44.10 dB |

Both comfortably clear the usual visually-lossless thresholds (SSIM > 0.95,
PSNR > 40 dB). Checked directly at the four moments that matter most — the
espresso pour, the internal marbling, the falling macadamia garnish, and the
final logo hold — side by side with the `crf 20` file: no visible banding, no
softening of the logo's letterforms or tapa pattern, marbling stays smooth.
The desktop file landed under its 2.0–2.8 MB target band rather than inside
it; since quality held at that size, it was kept rather than re-encoded
upward just to land inside the band. No further candidates were produced.
