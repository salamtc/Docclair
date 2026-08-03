#!/bin/bash
export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"
exec node "$(dirname "$0")/../node_modules/next/dist/bin/next" dev "$(dirname "$0")/.."
