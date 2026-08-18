#!/bin/bash
# =====================================================
# Düğün blogu görselleri — 3:2 oranında, yüksek çözünürlük.
# Çalıştır:  bash scripts/download-wedding-images.sh
#
# Fotoğrafı değiştirmek istersen: pexels.com'da beğendiğine tıkla,
# adres çubuğundaki son sayıyı ilgili ID satırına yaz, betiği tekrar çalıştır.
# =====================================================
set -e
cd "$(dirname "$0")/.."
mkdir -p public/images

COVER_ID="13394290"   # kapak — yazinin en ustu + liste karti
IMG1_ID="32655704"    # 1. gorsel — giristen sonra
IMG2_ID="34584808"    # 2. gorsel — orta bolum
IMG3_ID="14517840"    # 3. gorsel — finalden once

download () {
  local id="$1" name="$2"
  if curl -sSfL -o "public/images/$name" \
    "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop"; then
    echo "✓ $name  (id: $id)"
  else
    echo "✗ $name indirilemedi — id $id dogru mu?"
  fi
}

download "$COVER_ID" "wedding-cover-1200x800.jpg"
download "$IMG1_ID"  "wedding-celebration-1200x800.jpg"
download "$IMG2_ID"  "wedding-feast-1200x800.jpg"
download "$IMG3_ID"  "wedding-dance-1200x800.jpg"

echo ""
echo "Bitti. Kontrol icin:  open public/images"
