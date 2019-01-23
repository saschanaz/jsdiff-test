This repository contains a repro for an issue that jsdiff fails when GNU patch succeeds.

It uses [a patch from Snyk](https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20140806-1/qs_20140806-1_0_0_snyk.patch) for an old package [`qs@0.6.6`](https://www.npmjs.com/package/qs/v/0.6.6).

The failure occurs on the second hunk where jsdiff can't find a match for its first line.
