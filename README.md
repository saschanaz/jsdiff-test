This repository contains a repro for an issue that jsdiff fails when GNU patch succeeds.

It uses a patch from Snyk for an old package [`qs@0.6.6`](https://www.npmjs.com/package/qs/v/0.6.6).

* [The patch](https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20140806-1/qs_20140806-1_0_0_snyk.patch)
* [The target file of the patch](https://unpkg.com/qs@0.6.6/index.js)

The failure occurs from the second hunk where jsdiff can't find a match for its first line.
