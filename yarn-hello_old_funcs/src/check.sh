#!/bin/bash

set -e

MODULE=$1

FILE=`(node -e "console.log(require.resolve('$MODULE'+'/package.json'))" 2>/dev/null || true) | perl -pe 's/\/package\.json$/$1/'`
if [ "$FILE" == "" ]; then
	FILE=`node -e "console.log(require.resolve('$MODULE'))"|perl -pe 's/(nodejs\/(?:\@[^\/]*\/)?[^\@][^\/]*)(\/.*)?$/$1/'`
	if [ "$FILE" == "" ]; then
		exit 1
	fi
fi

echo $FILE
