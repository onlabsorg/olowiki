#!/usr/bin/env bash

echo ">>> WEBPACK"
#webpack --mode production --display-modules

echo ">>> COMMIT"
git add --all 
git commit -a -m $2

echo ">>> INCREASE VERSION"
npm version $1
git commit -a -m "Packed!" 

echo ">>> DONE"
