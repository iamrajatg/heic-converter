/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./browser.js":
/*!********************!*\
  !*** ./browser.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const decode = __webpack_require__(/*! heic-decode */ \"./node_modules/heic-decode/index.js\");\nconst formats = __webpack_require__(/*! ./formats-browser.js */ \"./formats-browser.js\");\nconst { one, all } = __webpack_require__(/*! ./lib.js */ \"./lib.js\")(decode, formats);\n\nmodule.exports = one;\nmodule.exports.all = all;\nwindow.heicConverter =  module.exports\n\n\n//# sourceURL=webpack://heic-convert/./browser.js?");

/***/ }),

/***/ "./formats-browser.js":
/*!****************************!*\
  !*** ./formats-browser.js ***!
  \****************************/
/***/ ((module) => {

eval("const initializeCanvas = ({ width, height }) => {\n  const canvas = document.createElement('canvas');\n  canvas.width = width;\n  canvas.height = height;\n\n  return canvas;\n};\n\nconst convert = async ({ data, width, height }, ...blobArgs) => {\n  const canvas = initializeCanvas({ width, height });\n\n  const ctx = canvas.getContext('2d');\n  ctx.putImageData(new ImageData(data, width, height), 0, 0);\n\n  const blob = await new Promise((resolve, reject) => {\n    canvas.toBlob(blob => {\n      if (blob) {\n        return resolve(blob);\n      }\n\n      return reject(new Error('failed to convert the image'));\n    }, ...blobArgs);\n  });\n\n  const arrayBuffer = await blob.arrayBuffer();\n\n  return new Uint8Array(arrayBuffer);\n};\n\nmodule.exports = {\n  JPEG: async ({ data, width, height, quality }) => await convert({ data, width, height }, 'image/jpeg', quality),\n  PNG: async ({ data, width, height }) => await convert({ data, width, height }, 'image/png')\n};\n\n\n//# sourceURL=webpack://heic-convert/./formats-browser.js?");

/***/ }),

/***/ "./lib.js":
/*!****************!*\
  !*** ./lib.js ***!
  \****************/
/***/ ((module) => {

eval("module.exports = (decode, encode) => {\n  const convertImage = async ({ image, format, quality }) => {\n    return await encode[format]({\n      width: image.width,\n      height: image.height,\n      data: image.data,\n      quality\n    });\n  };\n\n  const convert = async ({ buffer, format, quality, all }) => {\n    if (!encode[format]) {\n      throw new Error(`output format needs to be one of [${Object.keys(encode)}]`);\n    }\n\n    if (!all) {\n      const image = await decode({ buffer });\n      return await convertImage({ image, format, quality });\n    }\n\n    const images = await decode.all({ buffer });\n\n    return images.map(image => {\n      return {\n        convert: async () => await convertImage({\n          image: await image.decode(),\n          format,\n          quality\n        })\n      };\n    });\n  };\n\n  return {\n    one: async ({ buffer, format, quality = 0.92 }) => await convert({ buffer, format, quality, all: false }),\n    all: async ({ buffer, format, quality = 0.92 }) => await convert({ buffer, format, quality, all: true })\n  };\n};\n\n\n//# sourceURL=webpack://heic-convert/./lib.js?");

/***/ }),

/***/ "./node_modules/heic-decode/index.js":
/*!*******************************************!*\
  !*** ./node_modules/heic-decode/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const libheif = __webpack_require__(/*! libheif-js/wasm-bundle */ \"./node_modules/libheif-js/wasm-bundle.js\");\n\nconst { one, all } = __webpack_require__(/*! ./lib.js */ \"./node_modules/heic-decode/lib.js\")(libheif);\n\nmodule.exports = one;\nmodule.exports.all = all;\n\n\n//# sourceURL=webpack://heic-convert/./node_modules/heic-decode/index.js?");

/***/ }),

/***/ "./node_modules/heic-decode/lib.js":
/*!*****************************************!*\
  !*** ./node_modules/heic-decode/lib.js ***!
  \*****************************************/
/***/ ((module) => {

eval("const uint8ArrayUtf8ByteString = (array, start, end) => {\n  return String.fromCharCode(...array.slice(start, end));\n};\n\n// brands explained: https://github.com/strukturag/libheif/issues/83\n// code adapted from: https://github.com/sindresorhus/file-type/blob/6f901bd82b849a85ca4ddba9c9a4baacece63d31/core.js#L428-L438\nconst isHeic = (buffer) => {\n  const brandMajor = uint8ArrayUtf8ByteString(buffer, 8, 12).replace('\\0', ' ').trim();\n\n  switch (brandMajor) {\n    case 'mif1':\n      return true; // {ext: 'heic', mime: 'image/heif'};\n    case 'msf1':\n      return true; // {ext: 'heic', mime: 'image/heif-sequence'};\n    case 'heic':\n    case 'heix':\n      return true; // {ext: 'heic', mime: 'image/heic'};\n    case 'hevc':\n    case 'hevx':\n      return true; // {ext: 'heic', mime: 'image/heic-sequence'};\n  }\n\n  return false;\n};\n\nconst decodeImage = async (image) => {\n  const width = image.get_width();\n  const height = image.get_height();\n\n  const { data } = await new Promise((resolve, reject) => {\n    image.display({ data: new Uint8ClampedArray(width*height*4), width, height }, (displayData) => {\n      if (!displayData) {\n        return reject(new Error('HEIF processing error'));\n      }\n\n      resolve(displayData);\n    });\n  });\n\n  return { width, height, data };\n};\n\nmodule.exports = libheif => {\n  const decodeBuffer = async ({ buffer, all }) => {\n    if (!isHeic(buffer)) {\n      throw new TypeError('input buffer is not a HEIC image');\n    }\n\n    // wait for module to be initialized\n    // currently it is synchronous but it might be async in the future\n    await libheif.ready;\n\n    const decoder = new libheif.HeifDecoder();\n    const data = decoder.decode(buffer);\n\n    if (!data.length) {\n      throw new Error('HEIF image not found');\n    }\n\n    if (!all) {\n      return await decodeImage(data[0]);\n    }\n\n    return data.map(image => {\n      return {\n        width: image.get_width(),\n        height: image.get_height(),\n        decode: async () => await decodeImage(image)\n      };\n    });\n  };\n\n  return {\n    one: async ({ buffer }) => await decodeBuffer({ buffer, all: false }),\n    all: async ({ buffer }) => await decodeBuffer({ buffer, all: true })\n  };\n};\n\n\n//# sourceURL=webpack://heic-convert/./node_modules/heic-decode/lib.js?");

/***/ }),

/***/ "./node_modules/libheif-js/libheif-wasm/libheif-bundle.js":
/*!****************************************************************!*\
  !*** ./node_modules/libheif-js/libheif-wasm/libheif-bundle.js ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {


/***/ }),

/***/ "./node_modules/libheif-js/libheif-wasm sync recursive":
/*!****************************************************!*\
  !*** ./node_modules/libheif-js/libheif-wasm/ sync ***!
  \****************************************************/
/***/ ((module) => {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = () => ([]);\nwebpackEmptyContext.resolve = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/libheif-js/libheif-wasm sync recursive\";\nmodule.exports = webpackEmptyContext;\n\n//# sourceURL=webpack://heic-convert/./node_modules/libheif-js/libheif-wasm/_sync?");

/***/ }),

/***/ "./node_modules/libheif-js/wasm-bundle.js":
/*!************************************************!*\
  !*** ./node_modules/libheif-js/wasm-bundle.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__(/*! ./libheif-wasm/libheif-bundle.js */ \"./node_modules/libheif-js/libheif-wasm/libheif-bundle.js\")();\n\n\n//# sourceURL=webpack://heic-convert/./node_modules/libheif-js/wasm-bundle.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./browser.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});