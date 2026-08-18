#!/bin/bash
# Pexels görsellerini public/images altına indirir (P-04).
# Kullanım: proje klasöründe  bash scripts/download-images.sh
set -e
cd "$(dirname "$0")/.."
mkdir -p public/images
curl -sSfL -o "public/images/pexels-2325446-1920x1080.jpg" "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
curl -sSfL -o "public/images/pexels-3889742-1920x1080.jpg" "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
curl -sSfL -o "public/images/pexels-1539581-1920x1080.jpg" "https://images.pexels.com/photos/1539581/pexels-photo-1539581.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
curl -sSfL -o "public/images/pexels-2678218-1920x1080.jpg" "https://images.pexels.com/photos/2678218/pexels-photo-2678218.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
curl -sSfL -o "public/images/pexels-2419278-800x1200.jpg" "https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop"
curl -sSfL -o "public/images/pexels-1268855-800x1200.jpg" "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop"
curl -sSfL -o "public/images/pexels-3338497-800x1200.jpg" "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop"
curl -sSfL -o "public/images/pexels-1549326-800x1200.jpg" "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop"
curl -sSfL -o "public/images/pexels-2076930-700x900.jpg" "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop"
curl -sSfL -o "public/images/pexels-3779709-700x900.jpg" "https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop"
curl -sSfL -o "public/images/pexels-3764013-700x900.jpg" "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop"
curl -sSfL -o "public/images/pexels-3889742-800x1000.jpg" "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
curl -sSfL -o "public/images/pexels-2076930-1200x800.jpg" "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
curl -sSfL -o "public/images/pexels-2467285-1200x800.jpg" "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
curl -sSfL -o "public/images/pexels-3889742-1200x800.jpg" "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
curl -sSfL -o "public/images/pexels-2456718-800x500.jpg" "https://images.pexels.com/photos/2456718/pexels-photo-2456718.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop"
curl -sSfL -o "public/images/pexels-3807517-800x500.jpg" "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop"
echo "✓ $(ls public/images/pexels-*.jpg | wc -l | tr -d ' ') görsel indirildi."
