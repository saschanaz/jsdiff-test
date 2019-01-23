const path = require("path");
const fs = require("fs");

const fetch = require("node-fetch").default;
const diff = require("diff");

const patch = "https://s3.amazonaws.com/snyk-rules-pre-repository/snapshots/master/patches/npm/qs/20140806-1/qs_20140806-1_0_0_snyk.patch";
const target = "https://unpkg.com/qs@0.6.6/index.js";

(async () => {
  const [patchFile, targetFile] = await Promise.all(
    [patch, target].map(url => fetch(url).then(res => res.text()))
  );
  await jsDiff(patchFile, { 
    "index.js": targetFile
  });
})().catch(err => {
  console.error(err);
  process.exit(1);
});

/**
 * @param {string} patchContent,
 * @param {Record<string, string>} files
 * @return {Promise<void>}
 */
function jsDiff(patchContent, files) {
  return new Promise(function (resolve, reject) {
    diff.applyPatches(patchContent, {
      loadFile: function (index, callback) {
        try {
          const fileName = stripFirstSlash(index.oldFileName);
          if (fileName in files) {
            callback(null, files[fileName]);
          } else {
            throw new Error(index.oldFileName + '\n' + fileName);
          }
        } catch (err) {
          callback(err);
        }
      },
      patched: function (index, content, callback) {
        try {
          if (content === false) {
            throw new Error('Found a mismatching patch');
          }
          const newFileName = stripFirstSlash(index.newFileName);
          const oldFileName = stripFirstSlash(index.oldFileName);
          if (newFileName !== oldFileName) {
            delete files[oldFileName];
          }
          files[newFileName] = content;
          callback();
        } catch (err) {
          callback(err);
        }
      },
      complete: function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    });
  });
}

/**
 * @param {string} fileName 
 */
function stripFirstSlash(fileName) {
  return fileName.replace(/^[^\/]+\//, '');
}
