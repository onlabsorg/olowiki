#!/usr/bin/env bash

#webpack --mode production --display-modules

git add --all 
git commit -a -m $2

npm version $1

git commit -a -m "Packed!" 
echo 2
