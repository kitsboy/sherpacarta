#!/bin/zsh
set -e
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")"
if [[ -z "$SHERPA_NSEC" ]]; then
  echo "Paste your nsec when prompted (input hidden). It is NOT saved to disk by this script."
  echo -n "SHERPA_NSEC: "
  read -s SHERPA_NSEC
  echo
  export SHERPA_NSEC
fi
if [[ -z "$SHERPA_NSEC" ]]; then
  echo "No nsec provided. Abort."
  exit 1
fi
npm run seed
unset SHERPA_NSEC
echo "Done. nsec cleared from this shell variable."
