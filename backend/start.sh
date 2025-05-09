#!/usr/bin/env bash

# Set Default-Port to 8000, if PORT is not 
: "${PORT:=8000}"

uvicorn main:app --host 0.0.0.0 --port "$PORT"

