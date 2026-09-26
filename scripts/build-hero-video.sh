#!/bin/bash
# =====================================================
# Ana sayfa hero videosu — Pexels stok kliplerinden sinematik döngü.
# Gündüzden geceye: Sultanahmet → Galata → Kapadokya gün doğumu (2) →
# Haliç gün batımı → gece Boğaz. Her klip ~4,5 sn, yumuşak geçişlerle.
#
# Çıktılar:
#   public/videos/hero-turkiye-720p.mp4   (masaüstü, 1280x720)
#   public/videos/hero-turkiye-480p.mp4   (mobil / yavaş bağlantı, 854x480)
#   public/videos/hero-turkiye-{720p,480p}.webm (VP9 eşdeğerleri)
#   public/images/hero-poster-1280x720.jpg (video yüklenene kadar görünen kare)
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
  filters+="[$i:v]setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,"
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
  public/videos/hero-turkiye-720p.mp4

"$FF" -y -loglevel error -i public/videos/hero-turkiye-720p.mp4 -vf scale=854:480:flags=lanczos \
  -c:v libx264 -preset slow -crf 28 -profile:v main -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-480p.mp4

# WebM (VP9): H.264 çözemeyen tarayıcılar için. <video> önce MP4'ü dener.
for r in 720 480; do
  w=1280; [ "$r" = 480 ] && w=854
  "$FF" -y -loglevel error -i public/videos/hero-turkiye-720p.mp4 -vf scale=$w:$r:flags=lanczos \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an \
    public/videos/hero-turkiye-${r}p.webm
done

"$FF" -y -loglevel error -ss 1.5 -i public/videos/hero-turkiye-720p.mp4 -frames:v 1 -q:v 4 \
  public/images/hero-poster-1280x720.jpg

ls -lh public/videos/ public/images/hero-poster-1280x720.jpg
