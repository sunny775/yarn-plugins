#!/bin/bash
echo "  Operating System:\t"`hostnamectl | grep "Operating System" | cut -d ' ' -f5-`
echo "  Active User:\t\t"`w | cut -d ' ' -f1 | grep -v USER | xargs -n1`
echo "  Hostname:\t\t"`hostname`

echo "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
echo "  x                              x"
echo "    HELLO:  $1                    "
echo "  x                              x"
echo "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"