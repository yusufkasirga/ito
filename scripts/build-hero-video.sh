#!/bin/bash
# =====================================================
# Ana sayfa hero videosu — Pexels stok kliplerinden sinematik döngü.
# Gündüzden geceye: Sultanahmet → Galata → Kapadokya gün doğumu (2) →
# Haliç gün batımı → gece Boğaz. Her klip ~4,5 sn, yumuşak geçişlerle.
#
# Çıktılar:
#   public/videos/hero-turkiye-1080p.mp4  (geniş/retina ekranlar, 1920x1080)
#   public/videos/hero-turkiye-720p.mp4   (masaüstü, 1280x720)
#   public/videos/hero-turkiye-{1080p,720p}.webm (VP9 eşdeğerleri)
#   public/videos/hero-turkiye-portrait.{mp4,webm} (telefon, dikey 1080x1920)
#   public/images/hero-poster-1920x1080.jpg (video yüklenene kadar görünen kare)
#   public/images/hero-poster-portrait.jpg  (telefonda görünen dikey kare)
#
# Kullanım:
#   PEXELS_API_KEY=... FFMPEG=/yol/ffmpeg bash scripts/build-hero-video.sh
# (ffmpeg yoksa: npx --yes ffmpeg-static yolunu verir)
# Anahtar ASLA depoya yazılmaz. Klipler .cache/hero-clips/ altına iner (gitignore).
#
# Lisans: Pexels License — ticari kullanım serbest, atıf zorunlu değil.
# Kaynaklar docs/launch/image-credits.md içinde listelidir.
# Klipler değişirse EN/DE/RU ana sayfalardaki `chapters` etiketlerini güncelleyin.
# =====================================================
set -e
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
CACHE=.cache/hero-clips
mkdir -p public/videos "$CACHE"

DUR=4.5     # her klibin süresi (sn)
FADE=0.8    # geçiş süresi (sn)
FPS=25

# pexels_id | başlangıç saniyesi
CLIPS=(
  "19163327|2"   # Sultanahmet, havadan (Volkan Yılmaz)
  "33703982|1"   # Galata Kulesi, havadan (Kenan Turguç)
  "27436406|6"   # Kapadokya, gün doğumunda balonlar (Okan Demiray)
  "34889372|3"   # Kapadokya balonları (Cihan Çimen)
  "32099813|5"   # Haliç'te gün batımı (Yaşar Başkurt)
  "34433049|4"   # Gece Boğaz Köprüsü (K)
)

# Eksik klipleri Pexels API'den indir (≤1920 px genişlikteki en iyi MP4)
for c in "${CLIPS[@]}"; do
  id="${c%%|*}"
  [ -s "$CACHE/$id.mp4" ] && continue
  : "${PEXELS_API_KEY:?PEXELS_API_KEY gerekli (klip önbellekte yok: $id)}"
  url=$(curl -sf -H "Authorization: $PEXELS_API_KEY" "https://api.pexels.com/videos/videos/$id" | python3 -c '
import json,sys
v=json.load(sys.stdin)
f=[x for x in v["video_files"] if x.get("file_type")=="video/mp4" and x.get("width") and x["width"]<=1920]
print(max(f,key=lambda x:x["width"])["link"])')
  curl -sfL -A "Mozilla/5.0" -o "$CACHE/$id.mp4" "$url"
done

inputs=()
filters=""
i=0
for c in "${CLIPS[@]}"; do
  IFS='|' read -r id start <<< "$c"
  inputs+=(-ss "$start" -t "$DUR" -i "$CACHE/$id.mp4")
  filters+="[$i:v]setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,"
  filters+="eq=contrast=1.03:saturation=1.06,setsar=1,format=yuv420p,fps=$FPS[v$i];"
  i=$((i + 1))
done

# Crossfade zinciri
prev="v0"
offset=$(python3 -c "print($DUR-$FADE)")
for ((k = 1; k < i; k++)); do
  filters+="[$prev][v$k]xfade=transition=fade:duration=$FADE:offset=$offset[x$k];"
  prev="x$k"
  offset=$(python3 -c "print(round($offset+$DUR-$FADE,3))")
done
# Döngü dikişi: baş/son hafif karanlığa geçer, video başa sararken sert kesme görünmez
TOTAL=$(python3 -c "print($i*$DUR-($i-1)*$FADE)")
filters+="[$prev]fade=t=in:st=0:d=0.8,fade=t=out:st=$(python3 -c "print($TOTAL-1)"):d=1[final]"

"$FF" -y -loglevel error "${inputs[@]}" -filter_complex "$filters" -map "[final]" \
  -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-1080p.mp4

# Küçük sürümler 1080p ana kopyadan
"$FF" -y -loglevel error -i public/videos/hero-turkiye-1080p.mp4 -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-720p.mp4

# WebM (VP9): H.264 çözemeyen tarayıcılar için. <video> önce MP4'ü dener.
for r in 1080 720; do
  case $r in 1080) w=1920;; 720) w=1280;; esac
  "$FF" -y -loglevel error -i public/videos/hero-turkiye-1080p.mp4 -vf scale=$w:$r:flags=lanczos \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an \
    public/videos/hero-turkiye-${r}p.webm
done

"$FF" -y -loglevel error -ss 1.5 -i public/videos/hero-turkiye-1080p.mp4 -frames:v 1 -q:v 3 \
  public/images/hero-poster-1920x1080.jpg

# Telefon: 16:9 kareyi dikey ekrana sığdırmak görüntüyü ~3 kat büyütüp yumuşatır.
# Dikey sürüm doğrudan kaynak kliplerden kesilir: varsa 4K orijinal (.cache/hero-clips-4k),
# yoksa 1080p. Her kareden ortadaki 9:16 kesit → 1080x1920.
CACHE4K=.cache/hero-clips-4k
mkdir -p "$CACHE4K"
for c in "${CLIPS[@]}"; do
  id="${c%%|*}"
  [ -s "$CACHE4K/$id.mp4" ] && continue
  [ -n "$PEXELS_API_KEY" ] || continue
  url=$(curl -sf -H "Authorization: $PEXELS_API_KEY" "https://api.pexels.com/videos/videos/$id" | python3 -c '
import json,sys
v=json.load(sys.stdin)
f=[x for x in v["video_files"] if x.get("file_type")=="video/mp4" and x.get("width") and 1920<x["width"]<=3840]
print(max(f,key=lambda x:x["width"])["link"] if f else "")')
  [ -n "$url" ] && curl -sfL -A "Mozilla/5.0" -o "$CACHE4K/$id.mp4" "$url"
done

pin=()
pf=""
j=0
for c in "${CLIPS[@]}"; do
  IFS='|' read -r id start <<< "$c"
  src="$CACHE/$id.mp4"; [ -s "$CACHE4K/$id.mp4" ] && src="$CACHE4K/$id.mp4"
  pin+=(-ss "$start" -t "$DUR" -i "$src")
  pf+="[$j:v]setpts=PTS-STARTPTS,crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,"
  pf+="eq=contrast=1.03:saturation=1.06,setsar=1,format=yuv420p,fps=$FPS[p$j];"
  j=$((j + 1))
done
pprev="p0"
offset=$(python3 -c "print($DUR-$FADE)")
for ((k = 1; k < j; k++)); do
  pf+="[$pprev][p$k]xfade=transition=fade:duration=$FADE:offset=$offset[q$k];"
  pprev="q$k"
  offset=$(python3 -c "print(round($offset+$DUR-$FADE,3))")
done
pf+="[$pprev]fade=t=in:st=0:d=0.8,fade=t=out:st=$(python3 -c "print($TOTAL-1)"):d=1[pfinal]"

"$FF" -y -loglevel error "${pin[@]}" -filter_complex "$pf" -map "[pfinal]" \
  -c:v libx264 -preset slow -crf 30 -tune film -profile:v high -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-portrait.mp4
"$FF" -y -loglevel error -i public/videos/hero-turkiye-portrait.mp4 \
  -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an \
  public/videos/hero-turkiye-portrait.webm
"$FF" -y -loglevel error -ss 1.5 -i public/videos/hero-turkiye-portrait.mp4 -frames:v 1 -q:v 3 \
  public/images/hero-poster-portrait.jpg

ls -lh public/videos/ public/images/hero-poster-1920x1080.jpg
