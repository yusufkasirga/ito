#!/bin/bash
# =====================================================
# Türk düğünü blogu için 4 görseli indirir.
# Çalıştır:  bash scripts/download-wedding-images.sh
#
# Yanlış yere düşen görsel olursa: Finder'da public/images klasöründe
# dosya adlarını birbiriyle değiştirmen yeterli. Kod değişikliği gerekmez.
# =====================================================
set -e
cd "$(dirname "$0")/.."
mkdir -p public/images

COVER_ID="13394290"   # kapak — blog listesinde + yazinin en ustunde
IMG1_ID="32655704"    # 1. gorsel — giristen sonra ("kutlama")
IMG2_ID="34584808"    # 2. gorsel — "neden davet ederler" oncesi ("sofra")
IMG3_ID="14517840"    # 3. gorsel — finalden once ("dans")

download () {
  local id="$1" name="$2"
  if curl -sSfL -o "public/images/$name" \
    "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"; then
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
