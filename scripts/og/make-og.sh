#!/bin/sh
# Rasterize the OGP card sources (scripts/og/*.svg) into public/*.png (1200x630).
# Uses macOS Quick Look (qlmanage) so no npm dependency is needed — in line with
# the project's lean, self-contained tooling policy. Run after editing the SVGs:
#   sh scripts/og/make-og.sh
set -eu
cd "$(dirname "$0")"
tmp=$(mktemp -d)
# The SVG sources are 1200x1200 squares with the card content in the middle
# 630px band, because qlmanage renders to a square; sips then center-crops.
for name in og-ja og-en; do
  qlmanage -t -s 1200 -o "$tmp" "$name.svg" > /dev/null
  sips -c 630 1200 "$tmp/$name.svg.png" --out "../../public/$name.png" > /dev/null
  sips -g pixelWidth -g pixelHeight "../../public/$name.png" | tail -2
done
rm -rf "$tmp"
