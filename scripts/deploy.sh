#!/usr/bin/env bash
set -euo pipefail

# Port0 deployment script
# Builds the Docker image and deploys to Jennifer VPS
#
# Usage:
#   ./scripts/deploy.sh               # Build and deploy
#   ./scripts/deploy.sh --skip-build  # Deploy existing build
#   ./scripts/deploy.sh --help        # Show help

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_TAR="/tmp/port0-deploy.tar.gz"
JENNIFER_HOST="jennifer@100.71.192.70"
JENNIFER_PATH="/docker/port0-deploy.tar.gz"
IMAGE_NAME="port0:latest"
GINGER_HOST="ginger@ginger.kitty-city.ts.net"

show_help() {
  sed -n '2,11p' "$0"
  exit 0
}

[ "${1:-}" = "--help" ] && show_help

echo "=== Step 1: Building Next.js ==="
cd "$REPO_DIR"
npm run build

echo "=== Step 2: Creating deployment tarball ==="
tar czf "$DEPLOY_TAR" \
  .next/standalone \
  .next/static \
  public \
  Dockerfile \
  package.json \
  next.config.js

echo "   Tarball: $(ls -lh "$DEPLOY_TAR" | awk '{print $5}')"

echo "=== Step 3: Copying to Ginger ==="
scp "$DEPLOY_TAR" "$GINGER_HOST:/tmp/port0-deploy.tar.gz"

echo "=== Step 4: Forwarding to Jennifer ==="
ssh "$GINGER_HOST" "scp /tmp/port0-deploy.tar.gz $JENNIFER_HOST:$JENNIFER_PATH"

echo "=== Step 5: Building Docker image on Jennifer ==="
ssh "$GINGER_HOST" \
  "ssh $JENNIFER_HOST '
    cd /docker &&
    rm -rf port0-deploy &&
    mkdir port0-deploy &&
    cd port0-deploy &&
    tar xzf $JENNIFER_PATH &&
    docker build -t $IMAGE_NAME . 2>&1 | tail -5
  '"

echo "=== Step 6: Restarting container ==="
ssh "$GINGER_HOST" \
  "ssh $JENNIFER_HOST '
    cd /docker &&
    docker compose up -d --no-deps port0 2>&1
  '"

echo "=== Step 7: Verifying ==="
sleep 3
ssh "$GINGER_HOST" \
  "ssh $JENNIFER_HOST '
    docker ps --filter name=port0 --format \"table {{.Names}}\t{{.Status}}\t{{.Ports}}\"
  '"

echo ""
echo "=== Done ==="