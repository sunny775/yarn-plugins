#!/bin/bash

set -e

VERSION=0.2

function usage()
{
cat <<EOF
Usage: nodepath <option> module

nodepath shows the file or the package that corresponds to the node given module.

Options:
 -p: print package
 -o: print only package (implies -p)

Copyright (C) 2019 Xavier Guimard <yadd@debian.org>

Licensed under GPL-2+ (see /usr/share/common-licenses/GPL-2)
EOF
}

if test "$1" = "--version"; then
	echo $VERSION
	exit
fi
PACKAGE=0
PACKAGEONLY=0
while getopts 'hpo' opt; do
	case $opt in
		h)
			usage
			exit
			;;
		p)
			PACKAGE=1
			;;
		o)
			PACKAGE=1
			PACKAGEONLY=1
			;;
		*)
			echo "Unknown option $opt" >&2
			exit 1
			;;
	esac
done
shift $((OPTIND-1))
MODULE=$1

FILE=`(node -e "console.log(require.resolve('$MODULE'+'/package.json'))" 2>/dev/null || true) | perl -pe 's/\/package\.json$/$1/'`
if [ "$FILE" == "" ]; then
	FILE=`node -e "console.log(require.resolve('$MODULE'))"|perl -pe 's/(nodejs\/(?:\@[^\/]*\/)?[^\@][^\/]*)(\/.*)?$/$1/'`
	if [ "$FILE" == "" ]; then
		exit 1
	fi
fi
if test "$PACKAGE" = "1"; then
	if test $PACKAGEONLY = 1; then
		dpkg -S $FILE|sed -e 's/:.*//'
	else
		dpkg -S $FILE
	fi
else
	echo $FILE
fi
