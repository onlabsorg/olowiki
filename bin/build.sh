#!/usr/bin/env bash


echo
echo ">>> WEBPACK"
webpack --mode production --display-modules

echo
echo ">>> INCREASE VERSION AND COMMIT"
npm version $1
git commit -a -m "Packed!" 

echo
