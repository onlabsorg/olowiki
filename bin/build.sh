#!/usr/bin/env bash


echo
echo ">>> INCREASE VERSION"
npm version $1

echo
echo ">>> WEBPACK"
webpack --mode production --display-modules

echo
echo ">>> COMMIT"
git commit -a -m "Packed!" 

echo
