#!/usr/bin/env bash
set -euo pipefail

# GLTF Compression Pipeline
# Compresses a raw GLB house model using Draco encoding for web delivery.
# Target: output < 5 MB
#
# Usage:
#   npm run compress-model                           # Uses default paths
#   npm run compress-model -- input.glb output.glb   # Custom paths
#   bash scripts/compress-model.sh input.glb output.glb

INPUT="${1:-assets/house-raw.glb}"
OUTPUT="${2:-public/models/house.glb}"

echo ""
echo "========================================="
echo "  GLTF Compression Pipeline"
echo "========================================="
echo ""

# Check input file exists
if [ ! -f "$INPUT" ]; then
  echo "Input file not found: $INPUT"
  echo ""
  echo "Place your raw GLB model at: $INPUT"
  echo "Or specify a custom path:"
  echo "  npm run compress-model -- /path/to/model.glb"
  echo ""
  echo "No model to compress yet — this is expected before the user provides the GLB file."
  exit 0
fi

# Ensure output directory exists
mkdir -p "$(dirname "$OUTPUT")"

# Get input size
INPUT_SIZE=$(wc -c < "$INPUT" | tr -d ' ')
INPUT_MB=$(node -e "console.log(($INPUT_SIZE / 1048576).toFixed(2))")
echo "Input:  $INPUT (${INPUT_MB} MB)"

# Run gltf-transform optimize with Draco compression
echo "Compressing with Draco encoding..."
npx gltf-transform optimize "$INPUT" "$OUTPUT" \
  --compress draco \
  --texture-compress webp

# Validate output
if [ ! -f "$OUTPUT" ]; then
  echo "ERROR: Compression failed — output file not created"
  exit 1
fi

OUTPUT_SIZE=$(wc -c < "$OUTPUT" | tr -d ' ')
OUTPUT_MB=$(node -e "console.log(($OUTPUT_SIZE / 1048576).toFixed(2))")
REDUCTION=$(node -e "console.log(((1 - $OUTPUT_SIZE / $INPUT_SIZE) * 100).toFixed(1))")

echo "Output: $OUTPUT (${OUTPUT_MB} MB)"
echo "Reduction: ${REDUCTION}%"
echo ""

# Check 5 MB target
OVER_LIMIT=$(node -e "console.log($OUTPUT_SIZE > 5242880 ? 'true' : 'false')")

if [ "$OVER_LIMIT" = "true" ]; then
  echo "WARNING: Output exceeds 5 MB target!"
  echo "Consider:"
  echo "  - Simplifying the model geometry in Blender"
  echo "  - Reducing texture resolution"
  echo "  - Using meshopt compression instead: --compress meshopt"
  echo ""
  exit 1
fi

echo "Compression complete. Output is under 5 MB target."
echo ""
