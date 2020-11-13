#!/bin/bash

mkdir dist-linux dist-mac dist-win > /dev/null 2>&1

mv packages/latest-linux.yml packages/*.AppImage packages/*.tar.gz packages/*.snap dist-linux > /dev/null 2>&1
mv packages/latest-mac.yml packages/*.dmg packages/*.dmg.blockmap dist-mac > /dev/null 2>&1
mv packages/latest.yml packages/*.exe packages/*.exe.blockmap dist-win > /dev/null 2>&1

exit 0