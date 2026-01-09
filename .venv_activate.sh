#!/bin/bash
# Auto-activate virtual environment for Cursor terminals
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi
