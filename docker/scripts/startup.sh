#!/bin/bash

node /app/tools/create-session-table.js
node /app/tools/create-tables-from-schema.js
node /app/tools/add-test-data.js

exec "$@"
