#!/usr/bin/env bash

#webpack --mode production --display-modules

echo 1
git add --all 
git commit -a -m $2

echo 2
npm version $1
echo 3
git commit -a -m "Packed!" 
echo 4
