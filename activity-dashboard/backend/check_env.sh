#!/usr/bin/env bash
# Simple environment validator for development

set -e

REQUIRED=(DATABASE_URL FLASK_APP)

missing=0
for var in "${REQUIRED[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Missing env var: $var"
    missing=1
  fi
done

if [ $missing -eq 1 ]; then
  echo "Please set the missing environment variables (or copy .env.example to .env)"
  exit 2
fi

echo "All required env vars are set"
