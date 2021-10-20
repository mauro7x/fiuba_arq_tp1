#!/bin/sh
npm run artillery -- run $1.yaml -v '{"endpoint": "'${2}'"}'
