#!/usr/bin/env bash

# Set Default-Port to 8001, if PORT is not 
: "${PORT:=8001}"

uvicorn main:app --host 0.0.0.0 --port "$PORT" --reload
