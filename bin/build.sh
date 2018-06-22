#!/usr/bin/env bash
git add --all 
git commit -a -m $2
npm version $1
#webpack --mode production --display-modules
