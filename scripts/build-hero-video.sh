#!/bin/bash
# =====================================================
# Ana sayfa hero videosu — lisanslı/kendi fotoğraflarımızdan sinematik döngü.
# Her sahne yavaş kamera hareketi (zoom/pan) + yumuşak geçiş (crossfade).
#
# Çıktılar:
#   public/videos/hero-turkiye-720p.mp4   (masaüstü, 1280x720)
#   public/videos/hero-turkiye-480p.mp4   (mobil / yavaş bağlantı, 854x480)
#   public/videos/hero-turkiye-{720p,480p}.webm (VP9 eşdeğerleri)
#   public/images/hero-poster-1280x720.jpg (video yüklenene kadar görünen kare)
#
# Kullanım:  FFMPEG=/yol/ffmpeg bash scripts/build-hero-video.sh
# (ffmpeg yoksa:  npx --yes ffmpeg-static  yolunu verir)
#
# Gerçek drone/çekim videosu geldiğinde bu betiğe gerek kalmaz: dosyayı
# aynı adla public/videos/ altına koymak yeterli, kod değişmez.
# =====================================================
set -e
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
mkdir -p public/videos

FPS=25
DUR=5        # sahne süresi (sn)
FADE=1       # geçiş süresi (sn)
FR=$((FPS * DUR))

# sahne: dosya | kırpma (16:9, girdi pikseli) | hareket
#   in   = yavaş yakınlaşma   out = yavaş uzaklaşma
#   up   = aşağıdan yukarı kayma   right = soldan sağa kayma
SCENES=(
  "public/images/pexels-2325446-1920x1080.jpg|1920:1080:0:0|in"
  "public/images/about-bluemosque-1200x1040.jpg|1200:675:0:120|right"
  "public/images/hero-galata-1000x1250.jpg|1000:562:0:230|up"
  "public/images/pexels-3889742-1920x1080.jpg|1920:1080:0:0|out"
  "public/images/hero-tram-1000x1250.jpg|1000:562:0:420|in"
)

motion() {
  case "$1" in
    in)    echo "z='min(1+0.0011*on,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" ;;
    out)   echo "z='max(1.14-0.0011*on,1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" ;;
    up)    echo "z=1.12:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/$FR)'" ;;
    right) echo "z=1.12:x='(iw-iw/zoom)*on/$FR':y='ih/2-(ih/zoom/2)'" ;;
  esac
}

inputs=()
filters=""
i=0
for s in "${SCENES[@]}"; do
  IFS='|' read -r file crop mv <<< "$s"
  inputs+=(-i "$file")  # tek kare; zoompan d=FR kareye açar
  # Önce 16:9 kırp, sonra büyüt (zoompan titremesini önler), sonra hareket
  filters+="[$i:v]crop=$crop,scale=2560:1440:flags=lanczos,zoompan=$(motion "$mv"):d=$FR:s=1280x720:fps=$FPS,"
  # Marka tonlaması: hafif sıcak/altın grade, sitenin lacivert-altın diliyle uyumlu
  filters+="eq=contrast=1.04:saturation=1.08,colorbalance=rs=.03:bs=-.03:rh=.02:bh=-.02,setsar=1,format=yuv420p[v$i];"
  i=$((i + 1))
done

# Crossfade zinciri
prev="v0"
offset=$((DUR - FADE))
for ((k = 1; k < i; k++)); do
  out="x$k"
  filters+="[$prev][v$k]xfade=transition=fade:duration=$FADE:offset=$offset[$out];"
  prev="$out"
  offset=$((offset + DUR - FADE))
done
# Döngü dikişi: baş/son hafif karanlığa geçer, video başa sararken sert kesme görünmez
TOTAL=$((i * DUR - (i - 1) * FADE))
filters+="[$prev]fade=t=in:st=0:d=0.8,fade=t=out:st=$((TOTAL - 1)):d=1[final]"
prev="final"

"$FF" -y -loglevel error "${inputs[@]}" -filter_complex "$filters" -map "[$prev]" \
  -c:v libx264 -preset slow -crf 27 -profile:v high -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-720p.mp4

"$FF" -y -loglevel error -i public/videos/hero-turkiye-720p.mp4 -vf scale=854:480:flags=lanczos \
  -c:v libx264 -preset slow -crf 29 -profile:v main -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/hero-turkiye-480p.mp4

# WebM (VP9): H.264 çözemeyen tarayıcılar (ör. bazı Linux/Chromium derlemeleri) için,
# ayrıca aynı kalitede daha küçük. <video> önce WebM'i dener.
for r in 720 480; do
  w=1280; [ "$r" = 480 ] && w=854
  "$FF" -y -loglevel error -i public/videos/hero-turkiye-720p.mp4 -vf scale=$w:$r:flags=lanczos \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an \
    public/videos/hero-turkiye-${r}p.webm
done

"$FF" -y -loglevel error -ss 1.5 -i public/videos/hero-turkiye-720p.mp4 -frames:v 1 -q:v 4 \
  public/images/hero-poster-1280x720.jpg

ls -lh public/videos/ public/images/hero-poster-1280x720.jpg
