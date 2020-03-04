#!/bin/bash

SCRIPT=$(realpath "$0")
CURRENT_DIRECTORY=$(dirname "$SCRIPT")
CREDENTIALS="$CURRENT_DIRECTORY/font-in-thumbnail-poc-232de2416d27.json"
echo "Run <export GOOGLE_APPLICATION_CREDENTIALS=\"${CREDENTIALS}\">"

