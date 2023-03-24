// credit: https://github.com/chriszarate/bookmarkleter/blob/master/bookmarkleter.js

// import babelMinify from "https://cdn.jsdelivr.net/npm/babel-minify@0.5.2/+esm";
// import babelMinify from "https://unpkg.com/babel-minify@0.5.2/lib/index.js";
// import babel from 'https://unpkg.com/@babel/standalone/babel.min.js';

// babel.transformSync = babel.transform;

import { minify } from "https://cdn.skypack.dev/terser@5.16.6";

// URI-encode only a subset of characters. Most user agents are permissive with
// non-reserved characters, so don't obfuscate more than we have to.
const specialCharacters = ["%", '"', "<", ">", "#", "@", " ", "\\&", "\\?"];

const iife = (code) => `void function () {${code}\n}();`;
// const minify = (code, mangle) =>  babelMinify(code, { mangle, deadcode: mangle }, { babel, comments: false }).code;
const prefix = (code) => `javascript:${code}`;

const urlencode = (code) =>
  code.replace(
    new RegExp(specialCharacters.join("|"), "g"),
    encodeURIComponent
  );

// Create a bookmarklet.
export default async (code) => {
  let result = code;

  result = iife(result);

  // Minify by default
  const mini = await minify(result);
  result = mini.code;
  
  // If code minifies down to nothing, stop processing.
  if (
    "" ===
    result
      .replace(/^"use strict";/, "")
      .replace(/^void function\(\){}\(\);$/, "")
  ) {
    return null;
  }

  // URL-encode by default.
  result = urlencode(result);

  // Add javascript prefix.
  return prefix(result);
};
