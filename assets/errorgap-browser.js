/*!
 * @errorgap/browser 0.5.0, bundled unminified for the Errorgap WordPress plugin.
 * Source: https://github.com/errorgaphq/errorgap-js (MIT). Includes web-vitals (Apache-2.0).
 * Built with: tsup src/index.ts --format iife --global-name Errorgap --target es2020
 */
"use strict";
var Errorgap = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@jridgewell/resolve-uri/dist/resolve-uri.umd.js
  var require_resolve_uri_umd = __commonJS({
    "node_modules/@jridgewell/resolve-uri/dist/resolve-uri.umd.js"(exports, module) {
      "use strict";
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.resolveURI = factory());
      })(exports, (function() {
        "use strict";
        const schemeRegex = /^[\w+.-]+:\/\//;
        const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
        const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
        function isAbsoluteUrl(input) {
          return schemeRegex.test(input);
        }
        function isSchemeRelativeUrl(input) {
          return input.startsWith("//");
        }
        function isAbsolutePath(input) {
          return input.startsWith("/");
        }
        function isFileUrl(input) {
          return input.startsWith("file:");
        }
        function isRelative(input) {
          return /^[.?#]/.test(input);
        }
        function parseAbsoluteUrl(input) {
          const match = urlRegex.exec(input);
          return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
        }
        function parseFileUrl(input) {
          const match = fileRegex.exec(input);
          const path = match[2];
          return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path) ? path : "/" + path, match[3] || "", match[4] || "");
        }
        function makeUrl(scheme, user, host, port, path, query, hash) {
          return {
            scheme,
            user,
            host,
            port,
            path,
            query,
            hash,
            type: 7
          };
        }
        function parseUrl(input) {
          if (isSchemeRelativeUrl(input)) {
            const url2 = parseAbsoluteUrl("http:" + input);
            url2.scheme = "";
            url2.type = 6;
            return url2;
          }
          if (isAbsolutePath(input)) {
            const url2 = parseAbsoluteUrl("http://foo.com" + input);
            url2.scheme = "";
            url2.host = "";
            url2.type = 5;
            return url2;
          }
          if (isFileUrl(input))
            return parseFileUrl(input);
          if (isAbsoluteUrl(input))
            return parseAbsoluteUrl(input);
          const url = parseAbsoluteUrl("http://foo.com/" + input);
          url.scheme = "";
          url.host = "";
          url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
          return url;
        }
        function stripPathFilename(path) {
          if (path.endsWith("/.."))
            return path;
          const index = path.lastIndexOf("/");
          return path.slice(0, index + 1);
        }
        function mergePaths(url, base) {
          normalizePath(base, base.type);
          if (url.path === "/") {
            url.path = base.path;
          } else {
            url.path = stripPathFilename(base.path) + url.path;
          }
        }
        function normalizePath(url, type) {
          const rel = type <= 4;
          const pieces = url.path.split("/");
          let pointer = 1;
          let positive = 0;
          let addTrailingSlash = false;
          for (let i2 = 1; i2 < pieces.length; i2++) {
            const piece = pieces[i2];
            if (!piece) {
              addTrailingSlash = true;
              continue;
            }
            addTrailingSlash = false;
            if (piece === ".")
              continue;
            if (piece === "..") {
              if (positive) {
                addTrailingSlash = true;
                positive--;
                pointer--;
              } else if (rel) {
                pieces[pointer++] = piece;
              }
              continue;
            }
            pieces[pointer++] = piece;
            positive++;
          }
          let path = "";
          for (let i2 = 1; i2 < pointer; i2++) {
            path += "/" + pieces[i2];
          }
          if (!path || addTrailingSlash && !path.endsWith("/..")) {
            path += "/";
          }
          url.path = path;
        }
        function resolve(input, base) {
          if (!input && !base)
            return "";
          const url = parseUrl(input);
          let inputType = url.type;
          if (base && inputType !== 7) {
            const baseUrl = parseUrl(base);
            const baseType = baseUrl.type;
            switch (inputType) {
              case 1:
                url.hash = baseUrl.hash;
              // fall through
              case 2:
                url.query = baseUrl.query;
              // fall through
              case 3:
              case 4:
                mergePaths(url, baseUrl);
              // fall through
              case 5:
                url.user = baseUrl.user;
                url.host = baseUrl.host;
                url.port = baseUrl.port;
              // fall through
              case 6:
                url.scheme = baseUrl.scheme;
            }
            if (baseType > inputType)
              inputType = baseType;
          }
          normalizePath(url, inputType);
          const queryHash = url.query + url.hash;
          switch (inputType) {
            // This is impossible, because of the empty checks at the start of the function.
            // case UrlType.Empty:
            case 2:
            case 3:
              return queryHash;
            case 4: {
              const path = url.path.slice(1);
              if (!path)
                return queryHash || ".";
              if (isRelative(base || input) && !isRelative(path)) {
                return "./" + path + queryHash;
              }
              return path + queryHash;
            }
            case 5:
              return url.path + queryHash;
            default:
              return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
          }
        }
        return resolve;
      }));
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Client: () => Client,
    Configuration: () => Configuration,
    Errorgap: () => Errorgap,
    VERSION: () => VERSION,
    captureSnapshot: () => captureSnapshot,
    flush: () => flush,
    init: () => init,
    notify: () => notify
  });

  // src/configuration.ts
  var DEFAULT_FILTER_KEYS = [
    "password",
    "password_confirmation",
    "token",
    "secret",
    "api_key",
    "authorization",
    "cookie"
  ];
  var Configuration = class {
    constructor(input = {}) {
      this.endpoint = input.endpoint ?? "";
      this.projectSlug = input.projectSlug;
      this.projectId = input.projectId;
      this.apiKey = input.apiKey;
      this.environment = input.environment ?? "production";
      this.release = input.release;
      this.async = input.async ?? true;
      this.logger = input.logger === void 0 ? safeConsole() : input.logger;
      this.filterKeys = input.filterKeys ?? [...DEFAULT_FILTER_KEYS];
      this.sampleRate = clampRate(input.sampleRate);
      this.sourceMaps = input.sourceMaps ?? true;
      this.ignoreOrigins = input.ignoreOrigins ?? [];
    }
    validate() {
      if (!this.endpoint || this.endpoint.trim().length === 0) {
        throw new Error("Errorgap endpoint is required");
      }
      if (!this.projectSlug || this.projectSlug.trim().length === 0) {
        throw new Error("Errorgap projectSlug is required");
      }
    }
  };
  function safeConsole() {
    if (typeof console !== "undefined" && typeof console.warn === "function") {
      return console;
    }
    return null;
  }
  function clampRate(rate) {
    if (rate === void 0 || Number.isNaN(rate)) return 1;
    if (rate < 0) return 0;
    if (rate > 1) return 1;
    return rate;
  }

  // src/handlers.ts
  var HANDLERS_KEY = /* @__PURE__ */ Symbol.for("@errorgap/browser/global-handlers");
  function handlerState() {
    const root = globalThis;
    if (!root[HANDLERS_KEY]) {
      root[HANDLERS_KEY] = {
        installed: false,
        errorHandler: null,
        rejectionHandler: null
      };
    }
    return root[HANDLERS_KEY];
  }
  function installGlobalHandlers(client) {
    const state = handlerState();
    if (state.installed) return;
    if (typeof window === "undefined") return;
    state.installed = true;
    state.errorHandler = (event) => {
      const err = event.error instanceof Error ? event.error : new Error(event.message);
      void client.notify(err, {
        context: { source: "window.onerror" }
      });
    };
    state.rejectionHandler = (event) => {
      const reason = event.reason;
      void client.notify(reason, {
        context: { source: "unhandledrejection" }
      });
    };
    window.addEventListener("error", state.errorHandler);
    window.addEventListener("unhandledrejection", state.rejectionHandler);
  }
  function uninstallGlobalHandlers() {
    const state = handlerState();
    if (!state.installed || typeof window === "undefined") return;
    if (state.errorHandler) window.removeEventListener("error", state.errorHandler);
    if (state.rejectionHandler) {
      window.removeEventListener("unhandledrejection", state.rejectionHandler);
    }
    state.errorHandler = null;
    state.rejectionHandler = null;
    state.installed = false;
  }

  // src/backtrace.ts
  var V8_AT = /^\s*at\s+(?:(.*?)\s+\()?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;
  var SAFARI_AT = /^(?:(.*?)@)?(.+?)(?::(\d+))?(?::(\d+))?$/;
  function parseBacktrace(error) {
    const stack = typeof error.stack === "string" ? error.stack : "";
    if (!stack) return [];
    const origin = typeof location !== "undefined" ? location.origin : "";
    const lines = stack.split("\n");
    const frames = [];
    let index = 0;
    for (const raw of lines) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("Error") || trimmed.endsWith(":")) continue;
      const match = parseLine(trimmed);
      if (!match) continue;
      const [fnName, location2, lineNumber, columnNumber] = match;
      frames.push({
        file: stripOrigin(location2, origin),
        line: lineNumber,
        column: columnNumber,
        function: fnName,
        in_app: isInApp(location2, origin),
        index: index++
      });
    }
    return frames;
  }
  function parseLine(line) {
    if (line.startsWith("at ")) {
      const m3 = line.match(V8_AT);
      if (!m3) return null;
      return [
        m3[1] || void 0,
        m3[2] ?? "",
        m3[3] ? Number(m3[3]) : void 0,
        m3[4] ? Number(m3[4]) : void 0
      ];
    }
    const m2 = line.match(SAFARI_AT);
    if (!m2) return null;
    return [
      m2[1] || void 0,
      m2[2] ?? "",
      m2[3] ? Number(m2[3]) : void 0,
      m2[4] ? Number(m2[4]) : void 0
    ];
  }
  function stripOrigin(file, origin) {
    if (!origin) return file;
    if (file.startsWith(origin)) {
      const stripped = file.slice(origin.length);
      return stripped.startsWith("/") ? stripped.slice(1) : stripped;
    }
    return file;
  }
  function isInApp(file, origin) {
    if (!file) return false;
    if (file.includes("node_modules")) return false;
    if (!origin) return true;
    return file.startsWith(origin);
  }

  // src/filter.ts
  var FILTERED = "[FILTERED]";
  function filterParams(params, filterKeys) {
    const lowered = filterKeys.map((k2) => k2.toLowerCase());
    return walk(params, lowered);
  }
  function walk(value, loweredKeys) {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (isSensitive(key, loweredKeys)) {
        out[key] = FILTERED;
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        out[key] = walk(val, loweredKeys);
      } else {
        out[key] = val;
      }
    }
    return out;
  }
  function isSensitive(key, loweredKeys) {
    const k2 = key.toLowerCase();
    return loweredKeys.some((needle) => k2.includes(needle));
  }

  // src/version.ts
  var VERSION = "0.5.0";

  // src/notice.ts
  function buildNotice(error, configuration, options = {}) {
    return {
      project_id: configuration.projectId,
      received_at: (/* @__PURE__ */ new Date()).toISOString(),
      errors: [
        {
          type: errorType(error),
          message: String(error.message ?? ""),
          backtrace: parseBacktrace(error)
        }
      ],
      context: {
        notifier: "errorgap-browser",
        notifier_version: VERSION,
        environment: configuration.environment,
        release: configuration.release,
        ...browserContext(),
        ...options.context ?? {}
      },
      environment: {
        ...browserEnvironment(),
        ...options.environment ?? {}
      },
      session: options.session ?? {},
      params: filterParams(options.params ?? {}, configuration.filterKeys)
    };
  }
  function browserContext() {
    const out = {};
    if (typeof document !== "undefined" && document.URL) {
      out.url = document.URL;
    }
    if (typeof location !== "undefined") {
      out.action = location.pathname;
    }
    return out;
  }
  function browserEnvironment() {
    const out = {};
    if (typeof navigator !== "undefined") {
      if (navigator.userAgent) out.user_agent = navigator.userAgent;
      if (navigator.language) out.language = navigator.language;
    }
    if (typeof location !== "undefined") {
      out.path = location.pathname;
      out.referrer = typeof document !== "undefined" ? document.referrer : void 0;
    }
    if (typeof screen !== "undefined") {
      out.screen = `${screen.width}x${screen.height}`;
    }
    return out;
  }
  function errorType(error) {
    if (typeof error.name === "string" && error.name.length > 0) {
      return error.name;
    }
    return error.constructor?.name ?? "Error";
  }

  // node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
  var comma = ",".charCodeAt(0);
  var semicolon = ";".charCodeAt(0);
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var intToChar = new Uint8Array(64);
  var charToInt = new Uint8Array(128);
  for (let i2 = 0; i2 < chars.length; i2++) {
    const c2 = chars.charCodeAt(i2);
    intToChar[i2] = c2;
    charToInt[c2] = i2;
  }
  function decodeInteger(reader, relative) {
    let value = 0;
    let shift = 0;
    let integer = 0;
    do {
      const c2 = reader.next();
      integer = charToInt[c2];
      value |= (integer & 31) << shift;
      shift += 5;
    } while (integer & 32);
    const shouldNegate = value & 1;
    value >>>= 1;
    if (shouldNegate) {
      value = -2147483648 | -value;
    }
    return relative + value;
  }
  function hasMoreVlq(reader, max) {
    if (reader.pos >= max) return false;
    return reader.peek() !== comma;
  }
  var bufLength = 1024 * 16;
  var StringReader = class {
    constructor(buffer) {
      this.pos = 0;
      this.buffer = buffer;
    }
    next() {
      return this.buffer.charCodeAt(this.pos++);
    }
    peek() {
      return this.buffer.charCodeAt(this.pos);
    }
    indexOf(char) {
      const { buffer, pos } = this;
      const idx = buffer.indexOf(char, pos);
      return idx === -1 ? buffer.length : idx;
    }
  };
  function decode(mappings) {
    const { length } = mappings;
    const reader = new StringReader(mappings);
    const decoded = [];
    let genColumn = 0;
    let sourcesIndex = 0;
    let sourceLine = 0;
    let sourceColumn = 0;
    let namesIndex = 0;
    do {
      const semi = reader.indexOf(";");
      const line = [];
      let sorted = true;
      let lastCol = 0;
      genColumn = 0;
      while (reader.pos < semi) {
        let seg;
        genColumn = decodeInteger(reader, genColumn);
        if (genColumn < lastCol) sorted = false;
        lastCol = genColumn;
        if (hasMoreVlq(reader, semi)) {
          sourcesIndex = decodeInteger(reader, sourcesIndex);
          sourceLine = decodeInteger(reader, sourceLine);
          sourceColumn = decodeInteger(reader, sourceColumn);
          if (hasMoreVlq(reader, semi)) {
            namesIndex = decodeInteger(reader, namesIndex);
            seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
          } else {
            seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
          }
        } else {
          seg = [genColumn];
        }
        line.push(seg);
        reader.pos++;
      }
      if (!sorted) sort(line);
      decoded.push(line);
      reader.pos = semi + 1;
    } while (reader.pos <= length);
    return decoded;
  }
  function sort(line) {
    line.sort(sortComparator);
  }
  function sortComparator(a2, b2) {
    return a2[0] - b2[0];
  }

  // node_modules/@jridgewell/trace-mapping/dist/trace-mapping.mjs
  var import_resolve_uri = __toESM(require_resolve_uri_umd(), 1);
  function stripFilename(path) {
    if (!path) return "";
    const index = path.lastIndexOf("/");
    return path.slice(0, index + 1);
  }
  function resolver(mapUrl, sourceRoot) {
    const from = stripFilename(mapUrl);
    const prefix = sourceRoot ? sourceRoot + "/" : "";
    return (source) => (0, import_resolve_uri.default)(prefix + (source || ""), from);
  }
  var COLUMN = 0;
  var SOURCES_INDEX = 1;
  var SOURCE_LINE = 2;
  var SOURCE_COLUMN = 3;
  var NAMES_INDEX = 4;
  function maybeSort(mappings, owned) {
    const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
    if (unsortedIndex === mappings.length) return mappings;
    if (!owned) mappings = mappings.slice();
    for (let i2 = unsortedIndex; i2 < mappings.length; i2 = nextUnsortedSegmentLine(mappings, i2 + 1)) {
      mappings[i2] = sortSegments(mappings[i2], owned);
    }
    return mappings;
  }
  function nextUnsortedSegmentLine(mappings, start) {
    for (let i2 = start; i2 < mappings.length; i2++) {
      if (!isSorted(mappings[i2])) return i2;
    }
    return mappings.length;
  }
  function isSorted(line) {
    for (let j = 1; j < line.length; j++) {
      if (line[j][COLUMN] < line[j - 1][COLUMN]) {
        return false;
      }
    }
    return true;
  }
  function sortSegments(line, owned) {
    if (!owned) line = line.slice();
    return line.sort(sortComparator2);
  }
  function sortComparator2(a2, b2) {
    return a2[COLUMN] - b2[COLUMN];
  }
  var found = false;
  function binarySearch(haystack, needle, low, high) {
    while (low <= high) {
      const mid = low + (high - low >> 1);
      const cmp = haystack[mid][COLUMN] - needle;
      if (cmp === 0) {
        found = true;
        return mid;
      }
      if (cmp < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    found = false;
    return low - 1;
  }
  function upperBound(haystack, needle, index) {
    for (let i2 = index + 1; i2 < haystack.length; index = i2++) {
      if (haystack[i2][COLUMN] !== needle) break;
    }
    return index;
  }
  function lowerBound(haystack, needle, index) {
    for (let i2 = index - 1; i2 >= 0; index = i2--) {
      if (haystack[i2][COLUMN] !== needle) break;
    }
    return index;
  }
  function memoizedState() {
    return {
      lastKey: -1,
      lastNeedle: -1,
      lastIndex: -1
    };
  }
  function memoizedBinarySearch(haystack, needle, state, key) {
    const { lastKey, lastNeedle, lastIndex } = state;
    let low = 0;
    let high = haystack.length - 1;
    if (key === lastKey) {
      if (needle === lastNeedle) {
        found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
        return lastIndex;
      }
      if (needle >= lastNeedle) {
        low = lastIndex === -1 ? 0 : lastIndex;
      } else {
        high = lastIndex;
      }
    }
    state.lastKey = key;
    state.lastNeedle = needle;
    return state.lastIndex = binarySearch(haystack, needle, low, high);
  }
  function parse(map) {
    return typeof map === "string" ? JSON.parse(map) : map;
  }
  var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
  var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
  var LEAST_UPPER_BOUND = -1;
  var GREATEST_LOWER_BOUND = 1;
  var TraceMap = class {
    constructor(map, mapUrl) {
      const isString = typeof map === "string";
      if (!isString && map._decodedMemo) return map;
      const parsed = parse(map);
      const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
      this.version = version;
      this.file = file;
      this.names = names || [];
      this.sourceRoot = sourceRoot;
      this.sources = sources;
      this.sourcesContent = sourcesContent;
      this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
      const resolve = resolver(mapUrl, sourceRoot);
      this.resolvedSources = sources.map(resolve);
      const { mappings } = parsed;
      if (typeof mappings === "string") {
        this._encoded = mappings;
        this._decoded = void 0;
      } else if (Array.isArray(mappings)) {
        this._encoded = void 0;
        this._decoded = maybeSort(mappings, isString);
      } else if (parsed.sections) {
        throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
      } else {
        throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
      }
      this._decodedMemo = memoizedState();
      this._bySources = void 0;
      this._bySourceMemos = void 0;
    }
  };
  function cast(map) {
    return map;
  }
  function decodedMappings(map) {
    var _a;
    return (_a = cast(map))._decoded || (_a._decoded = decode(cast(map)._encoded));
  }
  function originalPositionFor(map, needle) {
    let { line, column, bias } = needle;
    line--;
    if (line < 0) throw new Error(LINE_GTR_ZERO);
    if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
    const decoded = decodedMappings(map);
    if (line >= decoded.length) return OMapping(null, null, null, null);
    const segments = decoded[line];
    const index = traceSegmentInternal(
      segments,
      cast(map)._decodedMemo,
      line,
      column,
      bias || GREATEST_LOWER_BOUND
    );
    if (index === -1) return OMapping(null, null, null, null);
    const segment = segments[index];
    if (segment.length === 1) return OMapping(null, null, null, null);
    const { names, resolvedSources } = map;
    return OMapping(
      resolvedSources[segment[SOURCES_INDEX]],
      segment[SOURCE_LINE] + 1,
      segment[SOURCE_COLUMN],
      segment.length === 5 ? names[segment[NAMES_INDEX]] : null
    );
  }
  function sourceIndex(map, source) {
    const { sources, resolvedSources } = map;
    let index = sources.indexOf(source);
    if (index === -1) index = resolvedSources.indexOf(source);
    return index;
  }
  function sourceContentFor(map, source) {
    const { sourcesContent } = map;
    if (sourcesContent == null) return null;
    const index = sourceIndex(map, source);
    return index === -1 ? null : sourcesContent[index];
  }
  function OMapping(source, line, column, name) {
    return { source, line, column, name };
  }
  function traceSegmentInternal(segments, memo, line, column, bias) {
    let index = memoizedBinarySearch(segments, column, memo, line);
    if (found) {
      index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
    } else if (bias === LEAST_UPPER_BOUND) index++;
    if (index === -1 || index === segments.length) return -1;
    return index;
  }

  // src/source-maps.ts
  var SOURCE_CONTEXT_RADIUS = 6;
  var MAX_SOURCE_LINE_CHARS = 400;
  var MAX_SOURCE_FILE_BYTES = 2 * 1024 * 1024;
  var MAX_GENERATED_FILE_BYTES = 5 * 1024 * 1024;
  var MAX_SOURCE_MAP_BYTES = 5 * 1024 * 1024;
  var SOURCE_MAP_FETCH_TIMEOUT_MS = 2e3;
  var maps = /* @__PURE__ */ new Map();
  async function enrichBacktrace(backtrace) {
    return Promise.all(backtrace.map((frame) => enrichFrame(frame)));
  }
  async function enrichFrame(frame) {
    if (!frame.in_app) return frame;
    const generatedUrl = generatedFileUrl(frame.file);
    if (!generatedUrl || !frame.line || frame.line < 1) return frame;
    try {
      const map = await sourceMapFor(generatedUrl);
      if (!map) return frame;
      const original = originalPositionFor(map, {
        line: frame.line,
        column: Math.max(0, (frame.column ?? 1) - 1),
        bias: GREATEST_LOWER_BOUND
      });
      if (!original.source || !original.line) return frame;
      const content = sourceContentFor(map, original.source);
      const source = sourceExcerpt(content, original.line);
      const file = normalizeSourcePath(original.source);
      return {
        ...frame,
        file,
        line: original.line,
        column: original.column === null ? void 0 : original.column + 1,
        function: original.name ?? frame.function,
        in_app: isOriginalInApp(file),
        ...source ? { source } : {}
      };
    } catch {
      return frame;
    }
  }
  function sourceMapFor(generatedUrl) {
    let pending = maps.get(generatedUrl);
    if (!pending) {
      pending = loadSourceMap(generatedUrl);
      maps.set(generatedUrl, pending);
    }
    return pending;
  }
  async function loadSourceMap(generatedUrl) {
    const generated = await fetchText(generatedUrl, MAX_GENERATED_FILE_BYTES);
    if (!generated) return null;
    const reference = lastSourceMapReference(generated);
    if (!reference) return null;
    if (reference.startsWith("data:")) {
      const decoded = decodeInlineSourceMap(reference);
      return decoded ? new TraceMap(decoded, generatedUrl) : null;
    }
    const mapUrl = new URL(reference, generatedUrl).href;
    const encodedMap = await fetchText(mapUrl, MAX_SOURCE_MAP_BYTES);
    if (!encodedMap) return null;
    return new TraceMap(encodedMap, mapUrl);
  }
  async function fetchText(url, maxBytes) {
    const controller = typeof AbortController === "undefined" ? null : new AbortController();
    const timeout = controller ? setTimeout(() => controller.abort(), SOURCE_MAP_FETCH_TIMEOUT_MS) : null;
    try {
      const response = await fetch(url, {
        credentials: "omit",
        ...controller ? { signal: controller.signal } : {}
      });
      if (!response.ok) return null;
      const declaredLength = Number(response.headers.get("content-length"));
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return null;
      const text = await response.text();
      return text.length <= maxBytes ? text : null;
    } finally {
      if (timeout !== null) clearTimeout(timeout);
    }
  }
  function lastSourceMapReference(source) {
    const pattern = /(?:\/\/[#@]|\/\*[#@])\s*sourceMappingURL=([^\s*]+)[^\n]*?/g;
    let reference = null;
    for (const match of source.matchAll(pattern)) {
      reference = match[1] ?? null;
    }
    return reference;
  }
  function decodeInlineSourceMap(reference) {
    const comma2 = reference.indexOf(",");
    if (comma2 < 0) return null;
    const metadata = reference.slice(0, comma2);
    const value = reference.slice(comma2 + 1);
    try {
      if (metadata.endsWith(";base64")) {
        if (typeof atob !== "function") return null;
        const binary = atob(value);
        if (typeof TextDecoder === "undefined") return binary;
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }
  function generatedFileUrl(file) {
    if (!file || file.startsWith("<") || file === "native") return null;
    try {
      const base = typeof document !== "undefined" && document.baseURI ? document.baseURI : typeof location !== "undefined" ? location.href : void 0;
      if (!base) return null;
      const url = new URL(file, base);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.href;
    } catch {
      return null;
    }
  }
  function normalizeSourcePath(source) {
    try {
      const url = new URL(source);
      return decodeURIComponent(url.pathname).replace(/^\/+/, "");
    } catch {
      return source.replace(/^(?:webpack|vite):\/\/+/, "").replace(/^(?:\.\.\/)+/, "").replace(/^\.\//, "").replace(/^\/+/, "");
    }
  }
  function isOriginalInApp(file) {
    return !file.includes("node_modules/") && !file.startsWith("node:");
  }
  function sourceExcerpt(content, line) {
    if (!content || content.length > MAX_SOURCE_FILE_BYTES) return void 0;
    const lines = content.split(/\r?\n/);
    if (line < 1 || line > lines.length) return void 0;
    const startLine = Math.max(1, line - SOURCE_CONTEXT_RADIUS);
    const endLine = Math.min(lines.length, line + SOURCE_CONTEXT_RADIUS);
    return {
      start_line: startLine,
      lines: lines.slice(startLine - 1, endLine).map((sourceLine) => sourceLine.slice(0, MAX_SOURCE_LINE_CHARS))
    };
  }

  // node_modules/web-vitals/dist/web-vitals.js
  var t = -1;
  var n = () => t;
  var e = (n2) => {
    addEventListener("pageshow", (e2) => {
      e2.persisted && (t = e2.timeStamp, n2(e2));
    }, true);
  };
  var i = (t2, n2, e2, i2) => {
    let o2, s2;
    return (a2) => {
      n2.value >= 0 && (a2 || i2) && (s2 = n2.value - (o2 ?? 0), (s2 || void 0 === o2) && (o2 = n2.value, n2.delta = s2, n2.rating = ((t3, n3) => t3 > n3[1] ? "poor" : t3 > n3[0] ? "needs-improvement" : "good")(n2.value, e2), t2(n2)));
    };
  };
  var o = (t2) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t2()));
  };
  var s = () => {
    const t2 = performance.getEntriesByType("navigation")[0];
    if (t2 && t2.responseStart > 0 && t2.responseStart < performance.now()) return t2;
  };
  var a = () => s()?.activationStart ?? 0;
  var r = -1;
  var c = /* @__PURE__ */ new Set();
  var f = () => "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
  var h = (t2) => {
    if ("hidden" === document.visibilityState) {
      if ("visibilitychange" === t2.type) for (const t3 of c) t3();
      isFinite(r) || (r = "visibilitychange" === t2.type ? t2.timeStamp : 0, removeEventListener("prerenderingchange", h, true));
    }
  };
  var d = (t2 = false) => {
    if (t2 && (r = 1 / 0), r < 0) {
      const t3 = a(), n2 = document.prerendering ? void 0 : globalThis.performance.getEntriesByType("visibility-state").find((n3) => "hidden" === n3.name && n3.startTime >= t3)?.startTime;
      r = n2 ?? f(), addEventListener("visibilitychange", h, true), addEventListener("prerenderingchange", h, true), e(() => {
        setTimeout(() => {
          r = f();
        });
      });
    }
    return { get firstHiddenTime() {
      return r;
    }, onHidden(t3) {
      c.add(t3);
    } };
  };
  var l = (t2, e2 = -1, i2, o2 = 0, r2, c2, f2) => {
    const h2 = s(), d2 = h2?.navigationId || 0;
    let l2 = "navigate";
    i2 ? l2 = i2 : n() >= 0 ? l2 = "back-forward-cache" : h2 && (document.prerendering || a() > 0 ? l2 = "prerender" : document.wasDiscarded ? l2 = "restore" : h2.type && (l2 = h2.type.replace(/_/g, "-")));
    return { name: t2, value: e2, rating: "good", delta: 0, entries: [], id: `v6-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 1e12}`, navigationType: l2, navigationId: o2 || d2, navigationInteractionId: r2, navigationURL: c2 || h2?.name, navigationStartTime: f2 || 0 };
  };
  var g = /* @__PURE__ */ new WeakMap();
  function u(t2, n2) {
    let e2 = g.get(n2);
    return e2 || (e2 = /* @__PURE__ */ new WeakMap(), g.set(n2, e2)), e2.get(t2) || e2.set(t2, new n2()), e2.get(t2);
  }
  var v = class {
    constructor() {
      __publicField(this, "t");
      __publicField(this, "i", 0);
      __publicField(this, "o", []);
    }
    h(t2) {
      if (t2.hadRecentInput) return;
      const n2 = this.o[0], e2 = this.o.at(-1);
      this.i && n2 && e2 && t2.startTime - e2.startTime < 1e3 && t2.startTime - n2.startTime < 5e3 ? (this.i += t2.value, this.o.push(t2)) : (this.i = t2.value, this.o = [t2]), this.t?.(t2);
    }
  };
  var m = (t2, n2, e2 = {}) => {
    try {
      const i2 = t2.filter((t3) => PerformanceObserver.supportedEntryTypes.includes(t3));
      if (i2.length > 0) {
        const t3 = new PerformanceObserver((t4) => {
          queueMicrotask(() => {
            const e3 = t4.getEntries();
            i2.length > 1 && e3.sort((t5, n3) => t5.startTime + t5.duration - (n3.startTime + n3.duration)), n2(e3);
          });
        });
        for (const n3 of i2) t3.observe({ type: n3, buffered: true, ...e2 });
        return t3;
      }
    } catch {
    }
  };
  var p = (t2) => globalThis.PerformanceObserver?.supportedEntryTypes?.includes("soft-navigation") && "function" == typeof globalThis.PerformanceSoftNavigation?.prototype?.getLargestInteractionContentfulPaint && t2 && t2.reportSoftNavs;
  var b = (t2, n2) => {
    if (t2.set(n2.navigationId, n2), t2.size > 2) {
      const n3 = t2.keys().next().value;
      void 0 !== n3 && t2.delete(n3);
    }
  };
  var T = (t2) => {
    let n2 = false;
    return () => {
      n2 || (t2(), n2 = true);
    };
  };
  var y = class {
    constructor() {
      __publicField(this, "l");
    }
  };
  var _ = (t2) => {
    document.prerendering ? addEventListener("prerenderingchange", t2, true) : t2();
  };
  var E = [1800, 3e3];
  var M = (t2, s2 = {}) => {
    const r2 = p(s2);
    _(() => {
      const c2 = u(s2, y), f2 = d();
      let h2, g2 = l("FCP");
      const v2 = m(["paint"], (t3) => {
        for (const n2 of t3) "first-contentful-paint" === n2.name && (v2.disconnect(), n2.startTime < f2.firstHiddenTime && (g2.value = Math.max(n2.startTime - a(), 0), g2.entries.push(n2), g2.navigationId = n2.navigationId || g2.navigationId, h2(true)));
      });
      if (v2 && (h2 = i(t2, g2, E, s2.reportAllChanges), e((e2) => {
        g2 = l("FCP", -1, "back-forward-cache", g2.navigationId, g2.navigationInteractionId, g2.navigationURL, n()), h2 = i(t2, g2, E, s2.reportAllChanges), o(() => {
          g2.value = performance.now() - e2.timeStamp, h2(true);
        });
      })), r2) {
        m(["soft-navigation"], (n2) => {
          n2.forEach((n3) => {
            c2.l && n3.navigationId && b(c2.l, n3);
            const e2 = Math.max((n3.presentationTime || n3.paintTime || 0) - n3.startTime, 0);
            g2 = l("FCP", e2, "soft-navigation", n3.navigationId, n3.interactionId, n3.name, n3.startTime), h2 = i(t2, g2, E, s2.reportAllChanges), h2(true);
          });
        }, s2);
      }
    });
  };
  var L = [0.1, 0.25];
  var P = (t2, s2 = {}) => {
    const a2 = d();
    M(T(() => {
      let r2, c2 = l("CLS", 0);
      const f2 = u(s2, v), h2 = (n2, e2, o2, a3, h3) => {
        c2 = l("CLS", 0, n2, e2, o2, a3, h3), f2.i = 0, r2 = i(t2, c2, L, s2.reportAllChanges);
      }, d2 = (t3 = false) => {
        f2.i > c2.value && (c2.value = f2.i, c2.entries = f2.o), r2(t3);
      }, g2 = (t3) => {
        d2(true), h2("soft-navigation", t3.navigationId, t3.interactionId, t3.name, t3.startTime);
      }, b2 = (t3) => {
        for (const n2 of t3) "soft-navigation" !== n2.entryType ? f2.h(n2) : g2(n2);
        d2();
      }, T2 = ["layout-shift"];
      p(s2) && T2.push("soft-navigation");
      const y2 = m(T2, b2);
      y2 && (r2 = i(t2, c2, L, s2.reportAllChanges), a2.onHidden(() => {
        b2(y2.takeRecords()), r2(true);
      }), e(() => {
        h2("back-forward-cache", c2.navigationId, c2.navigationInteractionId, c2.navigationURL, n()), o(r2);
      }), setTimeout(r2));
    }));
  };
  var w = 0;
  var I = 1 / 0;
  var k = 0;
  var C = (t2) => {
    for (const n2 of t2) n2.interactionId && (I = Math.min(I, n2.interactionId), k = Math.max(k, n2.interactionId), w = k ? (k - I) / 7 + 1 : 0);
  };
  var F;
  var N = () => F ? w : performance.interactionCount ?? 0;
  var B = () => {
    "interactionCount" in performance || F || (F = m(["event"], C, { durationThreshold: 0 }));
  };
  var S = class {
    constructor() {
      __publicField(this, "u", 0);
      __publicField(this, "v", []);
      __publicField(this, "m", /* @__PURE__ */ new Map());
      __publicField(this, "p");
      __publicField(this, "T");
    }
    _() {
      return N() - this.u;
    }
    M() {
      this.u = N(), this.v.length = 0, this.m.clear();
    }
    L(t2) {
      const n2 = this._(), e2 = Math.min(this.v.length - 1, Math.floor(n2 / 50));
      return !n2 || -1 !== e2 || "soft-navigation" !== t2 && "back-forward-cache" !== t2 ? this.v[e2] : { P: 8, id: -1, entries: [] };
    }
    h(t2) {
      if (this.p?.(t2), !t2.interactionId) return;
      const n2 = this.v.at(-1);
      let e2 = this.m.get(t2.interactionId);
      if (e2 || this.v.length < 10 || t2.duration > n2.P) {
        if (e2 ? t2.duration > e2.P ? (e2.entries = [t2], e2.P = t2.duration) : t2.duration === e2.P && t2.startTime === e2.entries[0].startTime && e2.entries.push(t2) : (e2 = { id: t2.interactionId, entries: [t2], P: t2.duration }, this.m.set(e2.id, e2), this.v.push(e2)), this.v.sort((t3, n3) => n3.P - t3.P), this.v.length > 10) {
          const t3 = this.v.splice(10);
          for (const n3 of t3) this.m.delete(n3.id);
        }
        this.T?.(e2);
      }
    }
  };
  var q = (t2) => {
    const n2 = "requestIdleCallback" in globalThis ? 1e3 : 0, e2 = globalThis.requestIdleCallback || setTimeout, i2 = globalThis.cancelIdleCallback || clearTimeout;
    if ("hidden" === document.visibilityState) t2();
    else {
      const o2 = T(t2);
      let s2 = -1;
      const a2 = () => {
        i2(s2), o2();
      };
      addEventListener("visibilitychange", a2, { once: true, capture: true }), s2 = e2(() => {
        removeEventListener("visibilitychange", a2, { capture: true }), o2();
      }, { timeout: n2 });
    }
  };
  var A = [200, 500];
  var x = (t2, o2 = {}) => {
    if (!globalThis.PerformanceEventTiming || !("interactionId" in PerformanceEventTiming.prototype)) return;
    const s2 = d();
    _(() => {
      B();
      let a2, r2 = l("INP");
      const c2 = u(o2, S), f2 = (n2, e2, s3, f3, h3) => {
        c2.M(), r2 = l("INP", -1, n2, e2, s3, f3, h3), a2 = i(t2, r2, A, o2.reportAllChanges);
      }, h2 = () => {
        const t3 = c2.L(r2.navigationType);
        t3 && t3.P !== r2.value && (r2.value = t3.P, r2.entries = t3.entries, a2());
      }, d2 = (t3) => {
        h2(), a2(true), f2("soft-navigation", t3.navigationId, t3.interactionId, t3.name, t3.startTime);
      }, g2 = (t3, n2 = false) => {
        q(() => {
          for (const n3 of t3) "soft-navigation" !== n3.entryType ? c2.h(n3) : d2(n3);
          h2(), n2 && a2(true);
        });
      }, v2 = ["event", "first-input"];
      p(o2) && v2.push("soft-navigation");
      const b2 = m(v2, g2, { ...o2, durationThreshold: o2.durationThreshold ?? 40 });
      a2 = i(t2, r2, A, o2.reportAllChanges), b2 && (s2.onHidden(() => {
        g2(b2.takeRecords(), true);
      }), e(() => {
        f2("back-forward-cache", r2.navigationId, r2.navigationInteractionId, r2.navigationURL, n());
      }));
    });
  };
  var H = class {
    constructor() {
      __publicField(this, "p");
      __publicField(this, "l");
    }
    h(t2) {
      this.p?.(t2);
    }
  };
  var O = [2500, 4e3];
  var U = (t2, s2 = {}) => {
    let r2 = false;
    const c2 = p(s2);
    _(() => {
      let f2, h2 = d(), g2 = l("LCP");
      const v2 = u(s2, H), p2 = (n2, e2, o2, a2, c3) => {
        g2 = l("LCP", -1, n2, e2, o2, a2, c3), f2 = i(t2, g2, O, s2.reportAllChanges), r2 = false, "soft-navigation" === n2 && (h2 = d(true));
      }, T2 = (t3) => {
        v2.l && t3.navigationId && b(v2.l, t3), r2 || f2(true), p2("soft-navigation", t3.navigationId, t3.interactionId, t3.name, t3.startTime);
        const n2 = t3.getLargestInteractionContentfulPaint?.();
        n2 && y2([n2]);
      }, y2 = (t3) => {
        s2.reportAllChanges || c2 || (t3 = t3.slice(-1));
        for (const n2 of t3) {
          if (!n2) continue;
          if ("soft-navigation" === n2.entryType) {
            T2(n2);
            continue;
          }
          let t4 = 0, e2 = [], i2 = n2.startTime;
          if ("largest-contentful-paint" === n2.entryType) t4 = Math.max(n2.startTime - a(), 0), v2.h(n2), e2 = [n2];
          else if ("interaction-contentful-paint" === n2.entryType) {
            const o2 = n2;
            if (!g2.navigationId) continue;
            if ("interactionId" in o2 && o2.interactionId != g2.navigationInteractionId) continue;
            i2 = o2.largestContentfulPaint?.renderTime || 0, t4 = Math.max(i2 - n2.startTime, 0), o2.largestContentfulPaint && (v2.h(o2.largestContentfulPaint), e2 = [o2.largestContentfulPaint]);
          }
          i2 < h2.firstHiddenTime && (g2.value = t4, g2.entries = e2, f2());
        }
      }, _2 = ["largest-contentful-paint"];
      c2 && _2.push("interaction-contentful-paint", "soft-navigation");
      const E2 = m(_2, y2);
      if (E2) {
        f2 = i(t2, g2, O, s2.reportAllChanges);
        const a2 = ["keydown", "click", "visibilitychange"], h3 = (t3) => {
          if (t3.isTrusted && !r2) {
            const t4 = g2.id;
            q(() => {
              if (!r2) {
                if (!c2) {
                  E2.disconnect();
                  for (const t5 of a2) removeEventListener(t5, h3, { capture: true });
                }
                t4 === g2.id && (r2 = true, f2(true));
              }
            });
          }
        };
        for (const t3 of a2) addEventListener(t3, h3, { capture: true });
        e((e2) => {
          p2("back-forward-cache", g2.navigationId, g2.navigationInteractionId, g2.navigationURL, n()), f2 = i(t2, g2, O, s2.reportAllChanges), o(() => {
            g2.value = performance.now() - e2.timeStamp, r2 = true, f2(true);
          });
        });
      }
    });
  };

  // src/performance.ts
  var TRACE_HEADER = "x-errorgap-trace";
  var MAX_VIEWS = 200;
  var MAX_REQUESTS = 500;
  var EARLY_FLUSH_REQUESTS = 100;
  var SETTLE_QUIET_MS = 100;
  var SETTLE_MAX_MS = 1e4;
  var SETTLE_POLL_MS = 50;
  var MONITOR_KEY = /* @__PURE__ */ Symbol.for("@errorgap/browser/performance");
  function startPerformance(configuration, options) {
    stopPerformance();
    if (typeof window === "undefined" || typeof performance === "undefined") return null;
    const rate = options.sampleRate ?? 1;
    if (!(Math.random() < rate)) return null;
    const monitor = new PerformanceMonitor(configuration, options);
    monitor.start();
    globalThis[MONITOR_KEY] = monitor;
    return monitor;
  }
  function stopPerformance() {
    const root = globalThis;
    root[MONITOR_KEY]?.stop();
    delete root[MONITOR_KEY];
  }
  var PerformanceMonitor = class {
    constructor(configuration, options) {
      this.configuration = configuration;
      this.options = options;
      this.views = [];
      this.requests = [];
      this.load = { kind: "load", loaded: false };
      this.inFlight = 0;
      this.lastActivity = 0;
      this.lastPath = "";
      this.navToken = 0;
      this.restore = [];
      this.originalFetch = typeof fetch === "function" ? fetch.bind(globalThis) : void 0;
      const base = (absolute(configuration.endpoint) ?? configuration.endpoint).replace(/\/+$/, "");
      this.ingestPrefix = `${base}/api/projects/${configuration.projectSlug}/`;
    }
    start() {
      this.lastPath = location.pathname;
      this.watchLoad();
      this.watchVitals();
      this.watchNavigations();
      if (this.options.trackRequests !== false) {
        this.patchFetch();
        this.patchXhr();
      }
      this.timer = setInterval(() => this.flush(false), this.options.flushIntervalMs ?? 1e4);
      const onHidden = () => {
        if (document.visibilityState === "hidden") this.flush(true);
      };
      const onPageHide = () => this.flush(true);
      document.addEventListener("visibilitychange", onHidden);
      window.addEventListener("pagehide", onPageHide);
      this.restore.push(() => {
        document.removeEventListener("visibilitychange", onHidden);
        window.removeEventListener("pagehide", onPageHide);
      });
    }
    stop() {
      if (this.timer) clearInterval(this.timer);
      this.timer = void 0;
      for (const undo of this.restore.splice(0).reverse()) undo();
      this.navToken++;
    }
    /** Send what is buffered. `final` is the page going away: use a beacon. */
    flush(final) {
      if (final && this.load.loaded) {
        const { loaded: _loaded, ...view } = this.load;
        this.push(this.views, view, MAX_VIEWS);
        this.load = { kind: "load", loaded: false };
      }
      if (this.views.length === 0 && this.requests.length === 0) return;
      const config = this.configuration;
      const body = JSON.stringify({
        environment: config.environment,
        release: config.release,
        page_views: this.views.splice(0),
        requests: this.requests.splice(0)
      });
      const url = `${this.ingestPrefix}browser`;
      try {
        if (final && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const key = config.apiKey ? `?api_key=${encodeURIComponent(config.apiKey)}` : "";
          if (navigator.sendBeacon(url + key, new Blob([body], { type: "text/plain" }))) return;
        }
        const headers = { "content-type": "application/json" };
        if (config.apiKey) headers["x-errorgap-project-key"] = config.apiKey;
        void this.originalFetch?.(url, {
          method: "POST",
          headers,
          body,
          keepalive: true,
          credentials: "omit"
        }).catch(() => void 0);
      } catch {
      }
    }
    // ── Page load ──────────────────────────────────────────────────────────────
    watchLoad() {
      const finish = () => (
        // loadEventEnd is only set once the load handlers have returned.
        setTimeout(() => {
          const nav = performance.getEntriesByType?.("navigation")[0];
          this.resolveLoadRoute();
          Object.assign(this.load, {
            duration_ms: nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : performance.now(),
            ttfb_ms: nav && nav.responseStart > 0 ? nav.responseStart : void 0,
            dom_ready_ms: nav && nav.domContentLoadedEventEnd > 0 ? nav.domContentLoadedEventEnd : void 0,
            device: device(),
            occurred_at: new Date(performance.timeOrigin || Date.now()).toISOString(),
            loaded: true
          });
        }, 0)
      );
      if (document.readyState === "complete") {
        finish();
      } else {
        window.addEventListener("load", finish, { once: true });
        this.restore.push(() => window.removeEventListener("load", finish));
      }
    }
    /**
     * The load's route. A router often matches only after the load event (its
     * route code is still loading), so while `routeName` has no answer yet ask
     * again for a few seconds, and fall back to the path.
     */
    resolveLoadRoute() {
      const path = location.pathname;
      this.load.route = path;
      if (!this.options.routeName) return;
      let tries = 0;
      const attempt = () => {
        const name = this.namedRoute();
        if (name) {
          if (location.pathname === path) this.load.route = name;
          return;
        }
        if (++tries < 30 && location.pathname === path) setTimeout(attempt, 100);
      };
      attempt();
    }
    watchVitals() {
      const set = (field) => (metric) => {
        if (metric.navigationType === "back-forward-cache") return;
        this.load[field] = metric.value;
      };
      U(set("lcp_ms"));
      x(set("inp_ms"));
      P(set("cls"));
      M(set("fcp_ms"));
    }
    // ── In-app navigations ─────────────────────────────────────────────────────
    watchNavigations() {
      const check = (path) => {
        if (path === this.lastPath) return;
        this.lastPath = path;
        this.startNavigation();
      };
      for (const method of ["pushState", "replaceState"]) {
        const original = history[method];
        history[method] = function(...args) {
          const result = original.apply(this, args);
          check(pathOf(args[2]));
          return result;
        };
        this.restore.push(() => {
          history[method] = original;
        });
      }
      const onPop = () => check(location.pathname);
      window.addEventListener("popstate", onPop);
      this.restore.push(() => window.removeEventListener("popstate", onPop));
    }
    /**
     * Time from the route change until the page settles: the next painted
     * frame, and no request in flight for `SETTLE_QUIET_MS` (whatever the new
     * route fetches). A newer navigation abandons this one.
     */
    startNavigation() {
      const token = ++this.navToken;
      const start = performance.now();
      this.lastActivity = start;
      let painted;
      const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(() => cb(performance.now()), 16);
      raf(() => raf(() => painted = performance.now()));
      const poll = () => {
        if (token !== this.navToken) return;
        const now = performance.now();
        const quiet = this.inFlight === 0 && now - this.lastActivity >= SETTLE_QUIET_MS;
        if (painted !== void 0 && quiet || now - start >= SETTLE_MAX_MS) {
          const end = Math.max(painted ?? now, this.inFlight === 0 ? this.lastActivity : now);
          this.push(
            this.views,
            {
              kind: "navigation",
              route: this.route(),
              duration_ms: Math.max(0, end - start),
              device: device(),
              occurred_at: (/* @__PURE__ */ new Date()).toISOString()
            },
            MAX_VIEWS
          );
          return;
        }
        setTimeout(poll, SETTLE_POLL_MS);
      };
      setTimeout(poll, SETTLE_POLL_MS);
    }
    // ── Requests ───────────────────────────────────────────────────────────────
    patchFetch() {
      if (typeof window.fetch !== "function") return;
      const original = window.fetch;
      const monitor = this;
      window.fetch = function(input, init2) {
        const url = requestUrl(input);
        if (!url || monitor.ignored(url)) return original.call(this, input, init2);
        const method = (init2?.method ?? (typeof Request !== "undefined" && input instanceof Request ? input.method : "GET")).toUpperCase();
        const traceId = monitor.propagates(url) ? newTraceId() : void 0;
        const done = monitor.begin(method, url, traceId);
        const traced = traceId ? withTraceHeader(input, init2, traceId) : init2;
        return original.call(this, input, traced).then(
          (response) => {
            done(response.status);
            return response;
          },
          (error) => {
            done(0);
            throw error;
          }
        );
      };
      this.restore.push(() => {
        window.fetch = original;
      });
    }
    patchXhr() {
      if (typeof XMLHttpRequest === "undefined") return;
      const proto = XMLHttpRequest.prototype;
      const originalOpen = proto.open;
      const originalSend = proto.send;
      const monitor = this;
      const meta = /* @__PURE__ */ new WeakMap();
      proto.open = function(method, url, ...rest) {
        const resolved = requestUrl(url);
        if (resolved && !monitor.ignored(resolved)) {
          meta.set(this, { method: String(method).toUpperCase(), url: resolved });
        } else {
          meta.delete(this);
        }
        return originalOpen.call(this, method, url, ...rest);
      };
      proto.send = function(body) {
        const info = meta.get(this);
        if (info) {
          const traceId = monitor.propagates(info.url) ? newTraceId() : void 0;
          if (traceId) {
            try {
              this.setRequestHeader(TRACE_HEADER, traceId);
            } catch {
            }
          }
          const done = monitor.begin(info.method, info.url, traceId);
          this.addEventListener("loadend", () => done(this.status), { once: true });
        }
        return originalSend.call(this, body);
      };
      this.restore.push(() => {
        proto.open = originalOpen;
        proto.send = originalSend;
      });
    }
    /** Track one request; the returned function records its end. */
    begin(method, absoluteUrl, traceId) {
      const url = absoluteUrl.startsWith(`${location.origin}/`) ? absoluteUrl.slice(location.origin.length) : absoluteUrl;
      const start = performance.now();
      const page = this.route();
      this.inFlight++;
      this.lastActivity = start;
      let ended = false;
      return (status) => {
        if (ended) return;
        ended = true;
        this.inFlight = Math.max(0, this.inFlight - 1);
        const end = performance.now();
        this.lastActivity = end;
        this.push(
          this.requests,
          {
            ...traceId ? { trace_id: traceId } : {},
            page_route: page,
            method,
            url,
            status,
            duration_ms: end - start,
            occurred_at: (/* @__PURE__ */ new Date()).toISOString()
          },
          MAX_REQUESTS
        );
        if (this.requests.length >= EARLY_FLUSH_REQUESTS) this.flush(false);
      };
    }
    /** Send the trace header to this URL? Same-origin, or a listed target. */
    propagates(url) {
      if (url.startsWith(`${location.origin}/`)) return true;
      return (this.options.tracePropagationTargets ?? []).some(
        (target) => typeof target === "string" ? url.startsWith(target) : target.test(url)
      );
    }
    ignored(url) {
      return url.startsWith(this.ingestPrefix) || this.configuration.ignoreOrigins.some((prefix) => url.startsWith(prefix));
    }
    route() {
      return this.namedRoute() ?? location.pathname;
    }
    namedRoute() {
      try {
        return this.options.routeName?.() || void 0;
      } catch {
        return void 0;
      }
    }
    push(buffer, item, max) {
      if (buffer.length < max) buffer.push(item);
    }
  };
  function newTraceId() {
    const c2 = globalThis.crypto;
    if (typeof c2?.randomUUID === "function") return c2.randomUUID();
    const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16));
    hex[12] = "4";
    hex[16] = (parseInt(hex[16], 16) & 3 | 8).toString(16);
    const s2 = hex.join("");
    return `${s2.slice(0, 8)}-${s2.slice(8, 12)}-${s2.slice(12, 16)}-${s2.slice(16, 20)}-${s2.slice(20)}`;
  }
  function withTraceHeader(input, init2, traceId) {
    const base = init2?.headers ?? (typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
    const headers = new Headers(base);
    if (!headers.has(TRACE_HEADER)) headers.set(TRACE_HEADER, traceId);
    return { ...init2, headers };
  }
  function requestUrl(input) {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : typeof Request !== "undefined" && input instanceof Request ? input.url : String(input);
    return absolute(raw);
  }
  function absolute(raw) {
    try {
      const url = new URL(raw, location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
      return `${url.origin}${url.pathname}`;
    } catch {
      return void 0;
    }
  }
  function pathOf(url) {
    if (url == null) return location.pathname;
    try {
      return new URL(String(url), location.href).pathname;
    } catch {
      return location.pathname;
    }
  }
  function device() {
    const uaData = navigator.userAgentData;
    if (typeof uaData?.mobile === "boolean") return uaData.mobile ? "mobile" : "desktop";
    return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
  }

  // src/replay/agent.ts
  function describeAgent(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
    return { browser: browserOf(ua), os: osOf(ua), device: deviceOf(ua) };
  }
  function browserOf(ua) {
    const rules = [
      [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
      [/(?:OPR|Opera)\/(\d+)/, "Opera"],
      [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
      [/FxiOS\/(\d+)/, "Firefox"],
      [/Firefox\/(\d+)/, "Firefox"],
      [/CriOS\/(\d+)/, "Chrome"],
      [/Chrome\/(\d+)/, "Chrome"],
      [/Version\/(\d+)[\d.]* .*Safari\//, "Safari"]
    ];
    for (const [pattern, name] of rules) {
      const match = pattern.exec(ua);
      if (match) return `${name} ${match[1]}`;
    }
    return "Unknown browser";
  }
  function osOf(ua) {
    let m2;
    if (m2 = /Windows NT (\d+\.\d+)/.exec(ua)) return m2[1] === "10.0" ? "Windows" : `Windows NT ${m2[1]}`;
    if (m2 = /(?:iPhone|iPad|iPod).*? OS (\d+)/.exec(ua)) return `iOS ${m2[1]}`;
    if (m2 = /Android (\d+)/.exec(ua)) return `Android ${m2[1]}`;
    if (m2 = /Mac OS X (\d+)[_.](\d+)/.exec(ua)) return `macOS ${m2[1]}.${m2[2]}`;
    if (/CrOS/.test(ua)) return "ChromeOS";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown OS";
  }
  function deviceOf(ua) {
    if (/iPad|Tablet/.test(ua) || /Android/.test(ua) && !/Mobile/.test(ua)) return "Tablet";
    if (/Mobi|iPhone|iPod/.test(ua)) return "Mobile";
    return "Desktop";
  }

  // src/replay/session.ts
  var IDLE_TIMEOUT_MS = 30 * 60 * 1e3;
  var STORAGE_KEY = "errorgap:replay-session";
  var BUFFER_KEY = "errorgap:replay-buffer";
  function currentSession(now = Date.now()) {
    const stored = read();
    if (stored && now - stored.lastActivity < IDLE_TIMEOUT_MS) {
      stored.lastActivity = now;
      save(stored);
      return stored;
    }
    const session = { id: uuid(), startedAt: now, lastActivity: now, hadError: false };
    save(session);
    clearBuffer();
    return session;
  }
  function saveBuffer(sessionId, events) {
    try {
      sessionStorage.setItem(BUFFER_KEY, JSON.stringify({ id: sessionId, events }));
    } catch {
    }
  }
  function takeBuffer(sessionId) {
    try {
      const raw = sessionStorage.getItem(BUFFER_KEY);
      sessionStorage.removeItem(BUFFER_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.id === sessionId && Array.isArray(parsed.events) ? parsed.events : [];
    } catch {
      return [];
    }
  }
  function clearBuffer() {
    try {
      sessionStorage.removeItem(BUFFER_KEY);
    } catch {
    }
  }
  function save(session) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
    }
  }
  function read() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return void 0;
      const parsed = JSON.parse(raw);
      if (typeof parsed.id !== "string" || typeof parsed.startedAt !== "number") return void 0;
      return {
        id: parsed.id,
        startedAt: parsed.startedAt,
        lastActivity: typeof parsed.lastActivity === "number" ? parsed.lastActivity : parsed.startedAt,
        decision: parsed.decision,
        hadError: parsed.hadError === true
      };
    } catch {
      return void 0;
    }
  }
  function uuid() {
    const c2 = globalThis.crypto;
    if (typeof c2?.randomUUID === "function") return c2.randomUUID();
    const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16));
    hex[12] = "4";
    hex[16] = (parseInt(hex[16], 16) & 3 | 8).toString(16);
    const s2 = hex.join("");
    return `${s2.slice(0, 8)}-${s2.slice(8, 12)}-${s2.slice(12, 16)}-${s2.slice(16, 20)}-${s2.slice(20)}`;
  }

  // src/replay/snapshot.ts
  var MAX_SNAPSHOT_BYTES = 1024 * 1024;
  var REMOVED_TAGS = ["script", "noscript", "iframe", "frame", "object", "embed", "template"];
  var URL_ATTRIBUTES = ["href", "src", "action", "formaction", "xlink:href"];
  function serializeSnapshot(doc = document) {
    const root = doc.documentElement;
    if (!root) return null;
    const clone = root.cloneNode(true);
    for (const el of Array.from(clone.querySelectorAll("[data-errorgap-block]"))) el.remove();
    for (const el of Array.from(clone.querySelectorAll(REMOVED_TAGS.join(",")))) el.remove();
    for (const el of Array.from(clone.querySelectorAll("*"))) {
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
        } else if (URL_ATTRIBUTES.includes(name) && /^\s*javascript:/i.test(attr.value)) {
          el.removeAttribute(attr.name);
        }
      }
    }
    for (const input of Array.from(clone.querySelectorAll("input"))) {
      input.removeAttribute("value");
      input.removeAttribute("checked");
    }
    for (const area of Array.from(clone.querySelectorAll("textarea"))) area.textContent = "";
    for (const option of Array.from(clone.querySelectorAll("option"))) option.removeAttribute("selected");
    for (const masked of Array.from(clone.querySelectorAll("[data-errorgap-mask]"))) maskText(masked);
    addBase(clone, doc);
    const html = `<!doctype html>${clone.outerHTML}`;
    return byteLength(html) <= MAX_SNAPSHOT_BYTES ? html : null;
  }
  function maskText(el) {
    const doc = el.ownerDocument;
    const walker = doc.createTreeWalker(
      el,
      4
      /* NodeFilter.SHOW_TEXT */
    );
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      node.data = node.data.replace(/\S/g, "\u2022");
    }
  }
  function addBase(clone, doc) {
    const origin = doc.location?.origin;
    if (!origin || origin === "null") return;
    const head = clone.querySelector("head");
    if (!head || head.querySelector("base")) return;
    const base = doc.createElement("base");
    base.setAttribute("href", `${origin}/`);
    head.insertBefore(base, head.firstChild);
  }
  function byteLength(text) {
    return typeof TextEncoder === "function" ? new TextEncoder().encode(text).length : text.length * 3;
  }

  // src/replay/recorder.ts
  var MAX_BATCH_EVENTS = 200;
  var MAX_BUFFERED_EVENTS = 1e3;
  var MAX_PENDING_EVENTS = 300;
  var MAX_LABEL = 200;
  var RAGE_CLICKS = 5;
  var RAGE_WINDOW_MS = 2e3;
  var DEAD_CLICK_MS = 1e3;
  var KEEPALIVE_MAX_BYTES = 60 * 1024;
  var INTERACTIVE = "a[href],button,input,select,textarea,label,summary,option,[role=button],[role=link],[role=tab],[role=menuitem],[role=checkbox],[contenteditable=''],[contenteditable=true]";
  var ReplayRecorder = class {
    constructor(configuration, options = {}) {
      this.configuration = configuration;
      this.options = options;
      this.state = "pending";
      this.events = [];
      this.snapshots = [];
      this.restore = [];
      this.lastPath = "";
      this.clickTarget = null;
      this.clickTimes = [];
      this.rageReported = false;
      this.originalFetch = typeof fetch === "function" ? fetch.bind(globalThis) : void 0;
      const endpoint = configuration.endpoint.replace(/\/+$/, "");
      this.base = `${endpoint}/api/projects/${configuration.projectSlug}`;
    }
    get recording() {
      return this.state === "recording";
    }
    start() {
      this.session = currentSession();
      this.agent = describeAgent();
      this.lastPath = location.pathname;
      if (!this.session.hadError) this.events = takeBuffer(this.session.id);
      this.push({ type: "page_load", label: `Loaded ${location.pathname}` });
      this.watchNavigations();
      this.watchRequests();
      this.watchClicks();
      this.watchPageHide();
      if (this.session.decision) {
        this.apply(this.session.decision);
      } else {
        void this.decide();
      }
    }
    stop() {
      if (this.timer) clearInterval(this.timer);
      this.timer = void 0;
      this.deadWatch?.();
      for (const undo of this.restore.splice(0).reverse()) undo();
      this.state = "off";
    }
    /**
     * An error is being reported. Returns the function the client calls once
     * the server has answered, with the error group's id when it has one.
     */
    errorStarted(label) {
      if (this.state === "off") return () => void 0;
      const t2 = this.offset();
      this.session.hadError = true;
      save(this.session);
      const snapshot = this.wantsSnapshot("on_error") ? this.takeSnapshot(t2) : void 0;
      let done = false;
      return (groupId) => {
        if (done || this.state === "off") return;
        done = true;
        this.push({ t: t2, type: "error", label: trim(label), ...groupId ? { group_id: groupId } : {} });
        if (snapshot) this.attachSnapshot(t2, snapshot, "on error");
        if (this.state === "recording") this.flush(false);
      };
    }
    /** `Errorgap.captureSnapshot()`: a snapshot now, when the project captures them. */
    captureSnapshot() {
      if (!this.wantsSnapshot("manual")) return false;
      const t2 = this.offset();
      const html = this.takeSnapshot(t2);
      if (!html) return false;
      this.attachSnapshot(t2, html, "manual");
      this.flush(false);
      return true;
    }
    /** Send what is recorded. `final` is the page going away: use a beacon. */
    flush(final) {
      if (this.state !== "recording") return;
      if (!this.session.hadError) {
        saveBuffer(this.session.id, this.events);
        return;
      }
      clearBuffer();
      do {
        const events = this.events.splice(0, MAX_BATCH_EVENTS);
        const sentOffsets = new Set(events.map((e2) => e2.t));
        const snapshots = this.snapshots.filter((s2) => sentOffsets.has(s2.t));
        this.snapshots = this.snapshots.filter((s2) => !sentOffsets.has(s2.t));
        if (events.length === 0 && !final) return;
        this.send(this.batch(events, snapshots, final), final);
        final = false;
      } while (this.events.length > 0);
    }
    // ── Recording decision ─────────────────────────────────────────────────────
    async decide() {
      const key = this.configuration.apiKey ? `?api_key=${encodeURIComponent(this.configuration.apiKey)}` : "";
      try {
        const res = await this.originalFetch?.(`${this.base}/sessions/config${key}`, { credentials: "omit" });
        if (!res || !res.ok) throw new Error(`replay config: HTTP ${res?.status ?? "?"}`);
        const config = await res.json();
        const rate = typeof config.sample_rate === "number" ? config.sample_rate : 0;
        const decision = {
          record: config.enabled === true && Math.random() < rate,
          captureSnaps: config.capture_snaps === true,
          snapTrigger: config.snap_trigger ?? "on_error"
        };
        this.session.decision = decision;
        save(this.session);
        this.apply(decision);
      } catch {
        this.stop();
      }
    }
    apply(decision) {
      if (this.state === "off") return;
      if (!decision.record) {
        this.stop();
        this.events = [];
        this.snapshots = [];
        clearBuffer();
        return;
      }
      if (!decision.captureSnaps) {
        this.snapshots = [];
        this.events = this.events.filter((e2) => e2.type !== "snapshot");
        for (const e2 of this.events) delete e2.has_snap;
      }
      this.state = "recording";
      this.timer = setInterval(() => this.flush(false), this.options.flushIntervalMs ?? 1e4);
      this.flush(false);
    }
    wantsSnapshot(trigger) {
      if (this.state === "off") return false;
      const decision = this.session.decision;
      if (!decision) return trigger !== "manual";
      return decision.captureSnaps && (trigger === "manual" || decision.snapTrigger === trigger);
    }
    // ── Events ─────────────────────────────────────────────────────────────────
    push(event) {
      if (this.state === "off") return;
      if (!this.session.hadError && this.events.length >= MAX_PENDING_EVENTS) {
        const dropped = this.events.shift();
        if (dropped.has_snap) this.snapshots = this.snapshots.filter((s2) => s2.t !== dropped.t);
      }
      if (this.events.length >= MAX_BUFFERED_EVENTS) return;
      this.events.push({ ...event, t: event.t ?? this.offset(), label: trim(event.label) });
      this.session.lastActivity = Date.now();
      save(this.session);
    }
    takeSnapshot(_t) {
      try {
        return serializeSnapshot() ?? void 0;
      } catch {
        return void 0;
      }
    }
    attachSnapshot(t2, html, why) {
      this.snapshots.push({ t: t2, html, size_bytes: byteLength2(html) });
      this.push({ t: t2, type: "snapshot", label: `DOM snapshot captured (${why})`, has_snap: true });
    }
    watchNavigations() {
      const check = (path) => {
        if (path === this.lastPath) return;
        this.lastPath = path;
        this.push({ type: "navigation", label: `Navigated to ${path}` });
      };
      for (const method of ["pushState", "replaceState"]) {
        const original = history[method];
        history[method] = function(...args) {
          const result = original.apply(this, args);
          check(pathOf(args[2]));
          return result;
        };
        this.restore.push(() => {
          history[method] = original;
        });
      }
      const onPop = () => check(location.pathname);
      window.addEventListener("popstate", onPop);
      this.restore.push(() => window.removeEventListener("popstate", onPop));
    }
    watchRequests() {
      const recorder = this;
      const failed = (method, url, status) => {
        if (status !== 0 && status < 500) return;
        const shown = url.startsWith(`${location.origin}/`) ? url.slice(location.origin.length) : url;
        recorder.push({
          type: "api_error",
          label: `${method} ${shown} \u2192 ${status === 0 ? "failed" : status}`
        });
      };
      if (typeof window.fetch === "function") {
        const original = window.fetch;
        window.fetch = function(input, init2) {
          const url = requestUrl(input);
          if (!url || recorder.ignored(url)) return original.call(this, input, init2);
          const method = (init2?.method ?? (typeof Request !== "undefined" && input instanceof Request ? input.method : "GET")).toUpperCase();
          return original.call(this, input, init2).then(
            (response) => {
              failed(method, url, response.status);
              return response;
            },
            (error) => {
              failed(method, url, 0);
              throw error;
            }
          );
        };
        this.restore.push(() => {
          window.fetch = original;
        });
      }
      if (typeof XMLHttpRequest !== "undefined") {
        const proto = XMLHttpRequest.prototype;
        const originalOpen = proto.open;
        const originalSend = proto.send;
        const meta = /* @__PURE__ */ new WeakMap();
        proto.open = function(method, url, ...rest) {
          const resolved = requestUrl(url);
          if (resolved && !recorder.ignored(resolved)) {
            meta.set(this, { method: String(method).toUpperCase(), url: resolved });
          } else {
            meta.delete(this);
          }
          return originalOpen.call(this, method, url, ...rest);
        };
        proto.send = function(body) {
          const info = meta.get(this);
          if (info) {
            this.addEventListener("loadend", () => failed(info.method, info.url, this.status), { once: true });
          }
          return originalSend.call(this, body);
        };
        this.restore.push(() => {
          proto.open = originalOpen;
          proto.send = originalSend;
        });
      }
    }
    watchClicks() {
      const onClick = (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        this.trackRage(target);
        this.trackDead(target);
      };
      document.addEventListener("click", onClick, true);
      this.restore.push(() => document.removeEventListener("click", onClick, true));
    }
    trackRage(target) {
      const now = Date.now();
      if (target !== this.clickTarget) {
        this.clickTarget = target;
        this.clickTimes = [];
        this.rageReported = false;
      }
      this.clickTimes = this.clickTimes.filter((at) => now - at <= RAGE_WINDOW_MS);
      this.clickTimes.push(now);
      if (this.clickTimes.length >= RAGE_CLICKS && !this.rageReported) {
        this.rageReported = true;
        const secs = ((now - this.clickTimes[0]) / 1e3).toFixed(1);
        const t2 = this.offset();
        this.push({
          t: t2,
          type: "rage_click",
          label: `${describe(target)} clicked ${this.clickTimes.length}\xD7 in ${secs}s`
        });
        if (this.wantsSnapshot("on_rage_click")) {
          const html = this.takeSnapshot(t2);
          if (html) this.attachSnapshot(t2, html, "on rage click");
        }
      }
      if (this.clickTimes.length === 1) this.rageReported = false;
    }
    /**
     * A click on something that looks clickable (pointer cursor, not a real
     * control) that changes nothing on the page within a second.
     */
    trackDead(target) {
      if (this.deadWatch || target.closest(INTERACTIVE)) return;
      let pointer = false;
      try {
        pointer = getComputedStyle(target).cursor === "pointer";
      } catch {
        pointer = false;
      }
      if (!pointer || typeof MutationObserver === "undefined") return;
      const path = location.pathname;
      let changed = false;
      const observer = new MutationObserver(() => {
        changed = true;
      });
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      const timer = setTimeout(() => {
        finish();
        if (!changed && location.pathname === path) {
          this.push({ type: "dead_click", label: `Click on ${describe(target)} did nothing` });
        }
      }, DEAD_CLICK_MS);
      const finish = () => {
        clearTimeout(timer);
        observer.disconnect();
        this.deadWatch = void 0;
      };
      this.deadWatch = finish;
    }
    watchPageHide() {
      const onHidden = () => {
        if (document.visibilityState === "hidden") this.flush(true);
      };
      const onPageHide = () => {
        this.push({ type: "exit", label: `Left ${location.pathname}` });
        this.flush(true);
      };
      document.addEventListener("visibilitychange", onHidden);
      window.addEventListener("pagehide", onPageHide);
      this.restore.push(() => {
        document.removeEventListener("visibilitychange", onHidden);
        window.removeEventListener("pagehide", onPageHide);
      });
    }
    // ── Sending ────────────────────────────────────────────────────────────────
    batch(events, snapshots, final) {
      const now = Date.now();
      return JSON.stringify({
        session: {
          id: this.session.id,
          handle: null,
          browser: this.agent.browser,
          os: this.agent.os,
          device: this.agent.device,
          started_at: new Date(this.session.startedAt).toISOString(),
          ended_at: new Date(now).toISOString(),
          duration_sec: this.offset(now),
          outcome: this.session.hadError ? "error" : final ? "completed" : "abandoned"
        },
        events,
        snapshots
      });
    }
    send(body, final) {
      const url = `${this.base}/sessions`;
      const small = byteLength2(body) <= KEEPALIVE_MAX_BYTES;
      try {
        if (final && small && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const key = this.configuration.apiKey ? `?api_key=${encodeURIComponent(this.configuration.apiKey)}` : "";
          if (navigator.sendBeacon(url + key, new Blob([body], { type: "text/plain" }))) return;
        }
        const headers = { "content-type": "application/json" };
        if (this.configuration.apiKey) headers["x-errorgap-project-key"] = this.configuration.apiKey;
        void this.originalFetch?.(url, {
          method: "POST",
          headers,
          body,
          keepalive: small,
          credentials: "omit"
        }).then((res) => {
          if (res.status === 204 || res.status === 401 || res.status === 404 || res.status === 409) {
            if (this.session.decision) {
              this.session.decision = { ...this.session.decision, record: false };
              save(this.session);
            }
            this.stop();
          }
        }).catch(() => void 0);
      } catch {
      }
    }
    ignored(url) {
      return url.startsWith(`${this.base}/`) || this.configuration.ignoreOrigins.some((prefix) => url.startsWith(prefix));
    }
    offset(now = Date.now()) {
      return Math.max(0, Math.round((now - this.session.startedAt) / 1e3));
    }
  };
  function describe(el) {
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text) return `"${text.slice(0, 40)}${text.length > 40 ? "\u2026" : ""}"`;
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/)[0]}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  }
  function trim(label) {
    return label.length > MAX_LABEL ? `${label.slice(0, MAX_LABEL - 1)}\u2026` : label;
  }
  function byteLength2(text) {
    return typeof TextEncoder === "function" ? new TextEncoder().encode(text).length : text.length * 3;
  }

  // src/replay/index.ts
  var RECORDER_KEY = /* @__PURE__ */ Symbol.for("@errorgap/browser/replay");
  function startReplay(configuration, options = {}) {
    stopReplay();
    if (typeof window === "undefined" || typeof document === "undefined" || typeof location === "undefined") {
      return;
    }
    const recorder = new ReplayRecorder(configuration, options);
    globalThis[RECORDER_KEY] = recorder;
    recorder.start();
  }
  function stopReplay() {
    const root = globalThis;
    root[RECORDER_KEY]?.stop();
    delete root[RECORDER_KEY];
  }
  function replayErrorStarted(label) {
    const recorder = globalThis[RECORDER_KEY];
    if (!recorder) return () => void 0;
    try {
      return recorder.errorStarted(label);
    } catch {
      return () => void 0;
    }
  }
  function captureReplaySnapshot() {
    const recorder = globalThis[RECORDER_KEY];
    try {
      return recorder?.captureSnapshot() ?? false;
    } catch {
      return false;
    }
  }

  // src/client.ts
  var Client = class {
    constructor(configuration) {
      this.configuration = configuration;
      this.pending = /* @__PURE__ */ new Set();
    }
    configure(configuration) {
      this.configuration = configuration;
    }
    async notify(error, options = {}) {
      try {
        this.configuration.validate();
        const err = coerceError(error);
        const replayDone = replayErrorStarted(`${err.name || "Error"}: ${err.message}`);
        if (!shouldSample(this.configuration.sampleRate)) {
          replayDone();
          return { sampled: true };
        }
        const notice = buildNotice(err, this.configuration, options);
        const configuration = this.configuration;
        const operation = this.prepareAndDeliver(notice, configuration).then((result) => {
          replayDone(groupIdOf(result));
          return result;
        });
        this.track(operation);
        if (options.sync || !this.configuration.async) {
          return await operation;
        }
        return { queued: true, status: 202 };
      } catch (exception) {
        this.log(exception);
        return { error: exception };
      }
    }
    async deliver(notice, configuration = this.configuration) {
      const url = noticesUrl(configuration);
      const headers = {
        "content-type": "application/json",
        "user-agent": `errorgap-browser/${VERSION}`
      };
      if (configuration.apiKey) {
        headers["x-errorgap-project-key"] = configuration.apiKey;
      }
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(notice),
          // Browsers strip Origin → server CORS must allow it; SDK assumes endpoint
          // accepts cross-origin requests with these headers.
          keepalive: true,
          credentials: "omit"
        });
        const body = await safeBody(response);
        return { status: response.status, body };
      } catch (exception) {
        this.log(exception);
        return { error: exception };
      }
    }
    async flush() {
      while (this.pending.size > 0) {
        await Promise.all(Array.from(this.pending));
      }
    }
    async prepareAndDeliver(notice, configuration) {
      if (configuration.sourceMaps) {
        for (const error of notice.errors) {
          error.backtrace = await enrichBacktrace(error.backtrace);
        }
      }
      return this.deliver(notice, configuration);
    }
    track(promise) {
      const wrapped = promise.catch(() => void 0);
      this.pending.add(wrapped);
      void wrapped.finally(() => this.pending.delete(wrapped));
    }
    log(exception) {
      const logger = this.configuration.logger;
      if (!logger) return;
      const message = exception instanceof Error ? `${exception.name}: ${exception.message}` : String(exception);
      logger.warn(`[errorgap] ${message}`);
    }
  };
  function groupIdOf(result) {
    if (!result.body) return void 0;
    try {
      const parsed = JSON.parse(result.body);
      return typeof parsed.group_id === "string" ? parsed.group_id : void 0;
    } catch {
      return void 0;
    }
  }
  function noticesUrl(configuration) {
    const base = configuration.endpoint.endsWith("/") ? configuration.endpoint.slice(0, -1) : configuration.endpoint;
    return `${base}/api/projects/${configuration.projectSlug}/notices`;
  }
  async function safeBody(response) {
    try {
      return await response.text();
    } catch {
      return "";
    }
  }
  function shouldSample(rate) {
    if (rate >= 1) return true;
    if (rate <= 0) return false;
    return Math.random() < rate;
  }
  function coerceError(error) {
    if (error instanceof Error) return error;
    if (typeof error === "string") return new Error(error);
    if (error && typeof error === "object") {
      const obj = error;
      const err = new Error(
        typeof obj.message === "string" ? obj.message : JSON.stringify(error)
      );
      if (typeof obj.name === "string") err.name = obj.name;
      return err;
    }
    return new Error(String(error));
  }

  // src/runtime.ts
  var RUNTIME_KEY = /* @__PURE__ */ Symbol.for("@errorgap/browser/runtime-state");
  function runtimeState() {
    const root = globalThis;
    if (!root[RUNTIME_KEY]) {
      const configuration = new Configuration();
      root[RUNTIME_KEY] = {
        configuration,
        client: new Client(configuration)
      };
    }
    return root[RUNTIME_KEY];
  }
  function configureRuntime(configuration) {
    const state = runtimeState();
    state.configuration = configuration;
    state.client.configure(configuration);
    return state;
  }

  // src/index.ts
  function init(options = {}) {
    const { captureGlobals = true, performance: performance2 = false, replay = true, ...rest } = options;
    const { client, configuration } = configureRuntime(new Configuration(rest));
    if (captureGlobals) {
      installGlobalHandlers(client);
    } else {
      uninstallGlobalHandlers();
    }
    if (performance2) {
      try {
        configuration.validate();
        startPerformance(configuration, performance2 === true ? {} : performance2);
      } catch (error) {
        configuration.logger?.warn(
          `[errorgap] performance not started: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    } else {
      stopPerformance();
    }
    if (replay) {
      try {
        configuration.validate();
        startReplay(configuration, replay === true ? {} : replay);
      } catch (error) {
        configuration.logger?.warn(
          `[errorgap] session replay not started: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    } else {
      stopReplay();
    }
  }
  function captureSnapshot() {
    return captureReplaySnapshot();
  }
  function notify(error, options = {}) {
    return runtimeState().client.notify(error, options);
  }
  function flush() {
    return runtimeState().client.flush();
  }
  function getConfiguration() {
    return runtimeState().configuration;
  }
  function getClient() {
    return runtimeState().client;
  }
  var Errorgap = {
    init,
    notify,
    flush,
    configuration: getConfiguration,
    client: getClient,
    captureSnapshot,
    VERSION
  };
  return __toCommonJS(index_exports);
})();
