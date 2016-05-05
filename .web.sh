#!/usr/bin/env bash
set -e
(
  sleep 1
  touch /tmp/app-initialized
)&
PORT=3000 node --optimize_for_size --max_old_space_size=128 bin/www
