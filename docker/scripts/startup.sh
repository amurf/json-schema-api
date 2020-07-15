#!/bin/bash

node /app/tools/create-tables-from-schema.js
node /app/tools/add-test-data.js

exec "$@"
