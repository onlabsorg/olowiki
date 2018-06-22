#!/usr/bin/env bash


echo
echo ">>> WEBPACK"
#webpack --mode production --display-modules

echo
echo ">>> COMMIT"
git add --all 
git commit -a -m $2

echo
echo ">>> INCREASE VERSION"
npm version $1
git commit -a -m "Packed!" 

echo
