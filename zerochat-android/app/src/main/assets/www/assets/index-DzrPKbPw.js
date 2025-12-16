var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function() {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = `/**
 * Theme system with CSS variables
 * Dark by default, supports light mode
 */

:root {
  /* Dark theme (default) */
  --bg: #0e1621;
  --bg-elev: #17212b;
  --bg-hover: #1e2732;
  --text: #e4e6eb;
  --text-muted: #8e9297;
  --text-secondary: #b9bbbe;
  --accent: #0084ff;
  --accent-hover: #0066cc;
  --bubble-me: #0084ff;
  --bubble-other: #2b2b2b;
  --border: #2f3136;
  --divider: #2f3136;
  --input-bg: #1e2732;
  --input-border: #2f3136;
  --error: #f04747;
  --success: #43b581;
  --warning: #faa61a;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

[data-theme="light"] {
  --bg: #ffffff;
  --bg-elev: #f7f8fa;
  --bg-hover: #e9ecef;
  --text: #1c1e21;
  --text-muted: #65676b;
  --text-secondary: #8a8d91;
  --accent: #0084ff;
  --accent-hover: #0066cc;
  --bubble-me: #0084ff;
  --bubble-other: #e4e6eb;
  --border: #ccd0d5;
  --divider: #e4e6eb;
  --input-bg: #f0f2f5;
  --input-border: #ccd0d5;
  --error: #f04747;
  --success: #43b581;
  --warning: #faa61a;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --bg: #ffffff;
    --bg-elev: #f7f8fa;
    --bg-hover: #e9ecef;
    --text: #1c1e21;
    --text-muted: #65676b;
    --text-secondary: #8a8d91;
    --bubble-me: #0084ff;
    --bubble-other: #e4e6eb;
    --border: #ccd0d5;
    --divider: #e4e6eb;
    --input-bg: #f0f2f5;
    --input-border: #ccd0d5;
    
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
}

/* Base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Container queries support */
@container (min-width: 600px) {
  .chat-list {
    width: 320px;
  }
}

@container (min-width: 900px) {
  .chat-list {
    width: 360px;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-elev);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Selection */
::selection {
  background-color: var(--accent);
  color: white;
}

:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #eaeaea;
  background-color: #0f172a;
}
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
}
main {
  width: 100%;
  max-width: 720px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
}
h1 {
  margin-top: 0;
}
section {
  margin-top: 1.5rem;
}
label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #93c5fd;
}
input, textarea {
  width: 100%;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 0.75rem;
  background: #0f172a;
  color: inherit;
}
button {
  margin-top: 0.75rem;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: white;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}
.status {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #a5f3fc;
}
/*$vite$:1*/`;
  document.head.appendChild(__vite_style__);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  var react = { exports: {} };
  var react_production_min = {};
  var hasRequiredReact_production_min;
  function requireReact_production_min() {
    if (hasRequiredReact_production_min) return react_production_min;
    hasRequiredReact_production_min = 1;
    var l = /* @__PURE__ */ Symbol.for("react.element"), n = /* @__PURE__ */ Symbol.for("react.portal"), p = /* @__PURE__ */ Symbol.for("react.fragment"), q = /* @__PURE__ */ Symbol.for("react.strict_mode"), r = /* @__PURE__ */ Symbol.for("react.profiler"), t = /* @__PURE__ */ Symbol.for("react.provider"), u = /* @__PURE__ */ Symbol.for("react.context"), v = /* @__PURE__ */ Symbol.for("react.forward_ref"), w = /* @__PURE__ */ Symbol.for("react.suspense"), x = /* @__PURE__ */ Symbol.for("react.memo"), y = /* @__PURE__ */ Symbol.for("react.lazy"), z = Symbol.iterator;
    function A(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z && a[z] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } }, C = Object.assign, D = {};
    function E(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    E.prototype.isReactComponent = {};
    E.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E.prototype;
    function G(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    var H = G.prototype = new F();
    H.constructor = G;
    C(H, E.prototype);
    H.isPureReactComponent = true;
    var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = { current: null }, L = { key: true, ref: true, __self: true, __source: true };
    function M(a, b, e) {
      var d, c = {}, k = null, h = null;
      if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        c.children = f;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
    }
    function N(a, b) {
      return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P = /\/+/g;
    function Q(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R(a, b, e, d, c) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h = false;
      if (null === a) h = true;
      else switch (k) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h = true;
          }
      }
      if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
      h = 0;
      d = "" === d ? "." : d + ":";
      if (I(a)) for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
      }
      else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
      else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h;
    }
    function S(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U = { current: null }, V = { transition: null }, W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    react_production_min.Children = { map: S, forEach: function(a, b, e) {
      S(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    react_production_min.Component = E;
    react_production_min.Fragment = p;
    react_production_min.Profiler = r;
    react_production_min.PureComponent = G;
    react_production_min.StrictMode = q;
    react_production_min.Suspense = w;
    react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    react_production_min.act = X;
    react_production_min.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k = b.ref, h = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
    };
    react_production_min.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    react_production_min.createElement = M;
    react_production_min.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    react_production_min.createRef = function() {
      return { current: null };
    };
    react_production_min.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    react_production_min.isValidElement = O;
    react_production_min.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    react_production_min.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    react_production_min.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    react_production_min.unstable_act = X;
    react_production_min.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    react_production_min.useContext = function(a) {
      return U.current.useContext(a);
    };
    react_production_min.useDebugValue = function() {
    };
    react_production_min.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    react_production_min.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    react_production_min.useId = function() {
      return U.current.useId();
    };
    react_production_min.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    react_production_min.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    react_production_min.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    react_production_min.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    react_production_min.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    react_production_min.useRef = function(a) {
      return U.current.useRef(a);
    };
    react_production_min.useState = function(a) {
      return U.current.useState(a);
    };
    react_production_min.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    react_production_min.useTransition = function() {
      return U.current.useTransition();
    };
    react_production_min.version = "18.3.1";
    return react_production_min;
  }
  var hasRequiredReact;
  function requireReact() {
    if (hasRequiredReact) return react.exports;
    hasRequiredReact = 1;
    {
      react.exports = requireReact_production_min();
    }
    return react.exports;
  }
  var hasRequiredReactJsxRuntime_production_min;
  function requireReactJsxRuntime_production_min() {
    if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
    hasRequiredReactJsxRuntime_production_min = 1;
    var f = requireReact(), k = /* @__PURE__ */ Symbol.for("react.element"), l = /* @__PURE__ */ Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    reactJsxRuntime_production_min.Fragment = l;
    reactJsxRuntime_production_min.jsx = q;
    reactJsxRuntime_production_min.jsxs = q;
    return reactJsxRuntime_production_min;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production_min();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  var reactExports = requireReact();
  const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
  var client = {};
  var reactDom = { exports: {} };
  var reactDom_production_min = {};
  var scheduler = { exports: {} };
  var scheduler_production_min = {};
  var hasRequiredScheduler_production_min;
  function requireScheduler_production_min() {
    if (hasRequiredScheduler_production_min) return scheduler_production_min;
    hasRequiredScheduler_production_min = 1;
    (function(exports$1) {
      function f(a, b) {
        var c = a.length;
        a.push(b);
        a: for (; 0 < c; ) {
          var d = c - 1 >>> 1, e = a[d];
          if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
          else break a;
        }
      }
      function h(a) {
        return 0 === a.length ? null : a[0];
      }
      function k(a) {
        if (0 === a.length) return null;
        var b = a[0], c = a.pop();
        if (c !== b) {
          a[0] = c;
          a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
            var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
            if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
            else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
            else break a;
          }
        }
        return b;
      }
      function g(a, b) {
        var c = a.sortIndex - b.sortIndex;
        return 0 !== c ? c : a.id - b.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        var l = performance;
        exports$1.unstable_now = function() {
          return l.now();
        };
      } else {
        var p = Date, q = p.now();
        exports$1.unstable_now = function() {
          return p.now() - q;
        };
      }
      var r = [], t = [], u = 1, v = null, y = 3, z = false, A = false, B = false, D = "function" === typeof setTimeout ? setTimeout : null, E = "function" === typeof clearTimeout ? clearTimeout : null, F = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G(a) {
        for (var b = h(t); null !== b; ) {
          if (null === b.callback) k(t);
          else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
          else break;
          b = h(t);
        }
      }
      function H(a) {
        B = false;
        G(a);
        if (!A) if (null !== h(r)) A = true, I(J);
        else {
          var b = h(t);
          null !== b && K(H, b.startTime - a);
        }
      }
      function J(a, b) {
        A = false;
        B && (B = false, E(L), L = -1);
        z = true;
        var c = y;
        try {
          G(b);
          for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
            var d = v.callback;
            if ("function" === typeof d) {
              v.callback = null;
              y = v.priorityLevel;
              var e = d(v.expirationTime <= b);
              b = exports$1.unstable_now();
              "function" === typeof e ? v.callback = e : v === h(r) && k(r);
              G(b);
            } else k(r);
            v = h(r);
          }
          if (null !== v) var w = true;
          else {
            var m = h(t);
            null !== m && K(H, m.startTime - b);
            w = false;
          }
          return w;
        } finally {
          v = null, y = c, z = false;
        }
      }
      var N = false, O = null, L = -1, P = 5, Q = -1;
      function M() {
        return exports$1.unstable_now() - Q < P ? false : true;
      }
      function R() {
        if (null !== O) {
          var a = exports$1.unstable_now();
          Q = a;
          var b = true;
          try {
            b = O(true, a);
          } finally {
            b ? S() : (N = false, O = null);
          }
        } else N = false;
      }
      var S;
      if ("function" === typeof F) S = function() {
        F(R);
      };
      else if ("undefined" !== typeof MessageChannel) {
        var T = new MessageChannel(), U = T.port2;
        T.port1.onmessage = R;
        S = function() {
          U.postMessage(null);
        };
      } else S = function() {
        D(R, 0);
      };
      function I(a) {
        O = a;
        N || (N = true, S());
      }
      function K(a, b) {
        L = D(function() {
          a(exports$1.unstable_now());
        }, b);
      }
      exports$1.unstable_IdlePriority = 5;
      exports$1.unstable_ImmediatePriority = 1;
      exports$1.unstable_LowPriority = 4;
      exports$1.unstable_NormalPriority = 3;
      exports$1.unstable_Profiling = null;
      exports$1.unstable_UserBlockingPriority = 2;
      exports$1.unstable_cancelCallback = function(a) {
        a.callback = null;
      };
      exports$1.unstable_continueExecution = function() {
        A || z || (A = true, I(J));
      };
      exports$1.unstable_forceFrameRate = function(a) {
        0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
      };
      exports$1.unstable_getCurrentPriorityLevel = function() {
        return y;
      };
      exports$1.unstable_getFirstCallbackNode = function() {
        return h(r);
      };
      exports$1.unstable_next = function(a) {
        switch (y) {
          case 1:
          case 2:
          case 3:
            var b = 3;
            break;
          default:
            b = y;
        }
        var c = y;
        y = b;
        try {
          return a();
        } finally {
          y = c;
        }
      };
      exports$1.unstable_pauseExecution = function() {
      };
      exports$1.unstable_requestPaint = function() {
      };
      exports$1.unstable_runWithPriority = function(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a = 3;
        }
        var c = y;
        y = a;
        try {
          return b();
        } finally {
          y = c;
        }
      };
      exports$1.unstable_scheduleCallback = function(a, b, c) {
        var d = exports$1.unstable_now();
        "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
        switch (a) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c + e;
        a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
        c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
        return a;
      };
      exports$1.unstable_shouldYield = M;
      exports$1.unstable_wrapCallback = function(a) {
        var b = y;
        return function() {
          var c = y;
          y = b;
          try {
            return a.apply(this, arguments);
          } finally {
            y = c;
          }
        };
      };
    })(scheduler_production_min);
    return scheduler_production_min;
  }
  var hasRequiredScheduler;
  function requireScheduler() {
    if (hasRequiredScheduler) return scheduler.exports;
    hasRequiredScheduler = 1;
    {
      scheduler.exports = requireScheduler_production_min();
    }
    return scheduler.exports;
  }
  var hasRequiredReactDom_production_min;
  function requireReactDom_production_min() {
    if (hasRequiredReactDom_production_min) return reactDom_production_min;
    hasRequiredReactDom_production_min = 1;
    var aa = requireReact(), ca = requireScheduler();
    function p(a) {
      for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
      return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var da = /* @__PURE__ */ new Set(), ea = {};
    function fa(a, b) {
      ha(a, b);
      ha(a + "Capture", b);
    }
    function ha(a, b) {
      ea[a] = b;
      for (a = 0; a < b.length; a++) da.add(b[a]);
    }
    var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
    function oa(a) {
      if (ja.call(ma, a)) return true;
      if (ja.call(la, a)) return false;
      if (ka.test(a)) return ma[a] = true;
      la[a] = true;
      return false;
    }
    function pa(a, b, c, d) {
      if (null !== c && 0 === c.type) return false;
      switch (typeof b) {
        case "function":
        case "symbol":
          return true;
        case "boolean":
          if (d) return false;
          if (null !== c) return !c.acceptsBooleans;
          a = a.toLowerCase().slice(0, 5);
          return "data-" !== a && "aria-" !== a;
        default:
          return false;
      }
    }
    function qa(a, b, c, d) {
      if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
      if (d) return false;
      if (null !== c) switch (c.type) {
        case 3:
          return !b;
        case 4:
          return false === b;
        case 5:
          return isNaN(b);
        case 6:
          return isNaN(b) || 1 > b;
      }
      return false;
    }
    function v(a, b, c, d, e, f, g) {
      this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
      this.attributeName = d;
      this.attributeNamespace = e;
      this.mustUseProperty = c;
      this.propertyName = a;
      this.type = b;
      this.sanitizeURL = f;
      this.removeEmptyString = g;
    }
    var z = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      z[a] = new v(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      z[b] = new v(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      z[a] = new v(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      z[a] = new v(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      z[a] = new v(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      z[a] = new v(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
    });
    var ra = /[\-:]([a-z])/g;
    function sa(a) {
      return a[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ra,
        sa
      );
      z[b] = new v(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
    });
    z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
    });
    function ta(a, b, c, d) {
      var e = z.hasOwnProperty(b) ? z[b] : null;
      if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
    }
    var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = /* @__PURE__ */ Symbol.for("react.element"), wa = /* @__PURE__ */ Symbol.for("react.portal"), ya = /* @__PURE__ */ Symbol.for("react.fragment"), za = /* @__PURE__ */ Symbol.for("react.strict_mode"), Aa = /* @__PURE__ */ Symbol.for("react.profiler"), Ba = /* @__PURE__ */ Symbol.for("react.provider"), Ca = /* @__PURE__ */ Symbol.for("react.context"), Da = /* @__PURE__ */ Symbol.for("react.forward_ref"), Ea = /* @__PURE__ */ Symbol.for("react.suspense"), Fa = /* @__PURE__ */ Symbol.for("react.suspense_list"), Ga = /* @__PURE__ */ Symbol.for("react.memo"), Ha = /* @__PURE__ */ Symbol.for("react.lazy");
    var Ia = /* @__PURE__ */ Symbol.for("react.offscreen");
    var Ja = Symbol.iterator;
    function Ka(a) {
      if (null === a || "object" !== typeof a) return null;
      a = Ja && a[Ja] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var A = Object.assign, La;
    function Ma(a) {
      if (void 0 === La) try {
        throw Error();
      } catch (c) {
        var b = c.stack.trim().match(/\n( *(at )?)/);
        La = b && b[1] || "";
      }
      return "\n" + La + a;
    }
    var Na = false;
    function Oa(a, b) {
      if (!a || Na) return "";
      Na = true;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        if (b) if (b = function() {
          throw Error();
        }, Object.defineProperty(b.prototype, "props", { set: function() {
          throw Error();
        } }), "object" === typeof Reflect && Reflect.construct) {
          try {
            Reflect.construct(b, []);
          } catch (l) {
            var d = l;
          }
          Reflect.construct(a, [], b);
        } else {
          try {
            b.call();
          } catch (l) {
            d = l;
          }
          a.call(b.prototype);
        }
        else {
          try {
            throw Error();
          } catch (l) {
            d = l;
          }
          a();
        }
      } catch (l) {
        if (l && d && "string" === typeof l.stack) {
          for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
          for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
            if (1 !== g || 1 !== h) {
              do
                if (g--, h--, 0 > h || e[g] !== f[h]) {
                  var k = "\n" + e[g].replace(" at new ", " at ");
                  a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                  return k;
                }
              while (1 <= g && 0 <= h);
            }
            break;
          }
        }
      } finally {
        Na = false, Error.prepareStackTrace = c;
      }
      return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
    }
    function Pa(a) {
      switch (a.tag) {
        case 5:
          return Ma(a.type);
        case 16:
          return Ma("Lazy");
        case 13:
          return Ma("Suspense");
        case 19:
          return Ma("SuspenseList");
        case 0:
        case 2:
        case 15:
          return a = Oa(a.type, false), a;
        case 11:
          return a = Oa(a.type.render, false), a;
        case 1:
          return a = Oa(a.type, true), a;
        default:
          return "";
      }
    }
    function Qa(a) {
      if (null == a) return null;
      if ("function" === typeof a) return a.displayName || a.name || null;
      if ("string" === typeof a) return a;
      switch (a) {
        case ya:
          return "Fragment";
        case wa:
          return "Portal";
        case Aa:
          return "Profiler";
        case za:
          return "StrictMode";
        case Ea:
          return "Suspense";
        case Fa:
          return "SuspenseList";
      }
      if ("object" === typeof a) switch (a.$$typeof) {
        case Ca:
          return (a.displayName || "Context") + ".Consumer";
        case Ba:
          return (a._context.displayName || "Context") + ".Provider";
        case Da:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case Ga:
          return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
        case Ha:
          b = a._payload;
          a = a._init;
          try {
            return Qa(a(b));
          } catch (c) {
          }
      }
      return null;
    }
    function Ra(a) {
      var b = a.type;
      switch (a.tag) {
        case 24:
          return "Cache";
        case 9:
          return (b.displayName || "Context") + ".Consumer";
        case 10:
          return (b._context.displayName || "Context") + ".Provider";
        case 18:
          return "DehydratedFragment";
        case 11:
          return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 5:
          return b;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return Qa(b);
        case 8:
          return b === za ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
          if ("function" === typeof b) return b.displayName || b.name || null;
          if ("string" === typeof b) return b;
      }
      return null;
    }
    function Sa(a) {
      switch (typeof a) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function Ta(a) {
      var b = a.type;
      return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
    }
    function Ua(a) {
      var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
      if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
        var e = c.get, f = c.set;
        Object.defineProperty(a, b, { configurable: true, get: function() {
          return e.call(this);
        }, set: function(a2) {
          d = "" + a2;
          f.call(this, a2);
        } });
        Object.defineProperty(a, b, { enumerable: c.enumerable });
        return { getValue: function() {
          return d;
        }, setValue: function(a2) {
          d = "" + a2;
        }, stopTracking: function() {
          a._valueTracker = null;
          delete a[b];
        } };
      }
    }
    function Va(a) {
      a._valueTracker || (a._valueTracker = Ua(a));
    }
    function Wa(a) {
      if (!a) return false;
      var b = a._valueTracker;
      if (!b) return true;
      var c = b.getValue();
      var d = "";
      a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
      a = d;
      return a !== c ? (b.setValue(a), true) : false;
    }
    function Xa(a) {
      a = a || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof a) return null;
      try {
        return a.activeElement || a.body;
      } catch (b) {
        return a.body;
      }
    }
    function Ya(a, b) {
      var c = b.checked;
      return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
    }
    function Za(a, b) {
      var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
      c = Sa(null != b.value ? b.value : c);
      a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
    }
    function ab(a, b) {
      b = b.checked;
      null != b && ta(a, "checked", b, false);
    }
    function bb(a, b) {
      ab(a, b);
      var c = Sa(b.value), d = b.type;
      if (null != c) if ("number" === d) {
        if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
      } else a.value !== "" + c && (a.value = "" + c);
      else if ("submit" === d || "reset" === d) {
        a.removeAttribute("value");
        return;
      }
      b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
      null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
    }
    function db2(a, b, c) {
      if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
        var d = b.type;
        if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
        b = "" + a._wrapperState.initialValue;
        c || b === a.value || (a.value = b);
        a.defaultValue = b;
      }
      c = a.name;
      "" !== c && (a.name = "");
      a.defaultChecked = !!a._wrapperState.initialChecked;
      "" !== c && (a.name = c);
    }
    function cb(a, b, c) {
      if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
    }
    var eb = Array.isArray;
    function fb(a, b, c, d) {
      a = a.options;
      if (b) {
        b = {};
        for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
        for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
      } else {
        c = "" + Sa(c);
        b = null;
        for (e = 0; e < a.length; e++) {
          if (a[e].value === c) {
            a[e].selected = true;
            d && (a[e].defaultSelected = true);
            return;
          }
          null !== b || a[e].disabled || (b = a[e]);
        }
        null !== b && (b.selected = true);
      }
    }
    function gb(a, b) {
      if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
      return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
    }
    function hb(a, b) {
      var c = b.value;
      if (null == c) {
        c = b.children;
        b = b.defaultValue;
        if (null != c) {
          if (null != b) throw Error(p(92));
          if (eb(c)) {
            if (1 < c.length) throw Error(p(93));
            c = c[0];
          }
          b = c;
        }
        null == b && (b = "");
        c = b;
      }
      a._wrapperState = { initialValue: Sa(c) };
    }
    function ib(a, b) {
      var c = Sa(b.value), d = Sa(b.defaultValue);
      null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
      null != d && (a.defaultValue = "" + d);
    }
    function jb(a) {
      var b = a.textContent;
      b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
    }
    function kb(a) {
      switch (a) {
        case "svg":
          return "http://www.w3.org/2000/svg";
        case "math":
          return "http://www.w3.org/1998/Math/MathML";
        default:
          return "http://www.w3.org/1999/xhtml";
      }
    }
    function lb(a, b) {
      return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
    }
    var mb, nb = (function(a) {
      return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
        MSApp.execUnsafeLocalFunction(function() {
          return a(b, c, d, e);
        });
      } : a;
    })(function(a, b) {
      if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
      else {
        mb = mb || document.createElement("div");
        mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
        for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
        for (; b.firstChild; ) a.appendChild(b.firstChild);
      }
    });
    function ob(a, b) {
      if (b) {
        var c = a.firstChild;
        if (c && c === a.lastChild && 3 === c.nodeType) {
          c.nodeValue = b;
          return;
        }
      }
      a.textContent = b;
    }
    var pb = {
      animationIterationCount: true,
      aspectRatio: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    }, qb = ["Webkit", "ms", "Moz", "O"];
    Object.keys(pb).forEach(function(a) {
      qb.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        pb[b] = pb[a];
      });
    });
    function rb(a, b, c) {
      return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
    }
    function sb(a, b) {
      a = a.style;
      for (var c in b) if (b.hasOwnProperty(c)) {
        var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
        "float" === c && (c = "cssFloat");
        d ? a.setProperty(c, e) : a[c] = e;
      }
    }
    var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
    function ub(a, b) {
      if (b) {
        if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
        if (null != b.dangerouslySetInnerHTML) {
          if (null != b.children) throw Error(p(60));
          if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
        }
        if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
      }
    }
    function vb(a, b) {
      if (-1 === a.indexOf("-")) return "string" === typeof b.is;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var wb = null;
    function xb(a) {
      a = a.target || a.srcElement || window;
      a.correspondingUseElement && (a = a.correspondingUseElement);
      return 3 === a.nodeType ? a.parentNode : a;
    }
    var yb = null, zb = null, Ab = null;
    function Bb(a) {
      if (a = Cb(a)) {
        if ("function" !== typeof yb) throw Error(p(280));
        var b = a.stateNode;
        b && (b = Db(b), yb(a.stateNode, a.type, b));
      }
    }
    function Eb(a) {
      zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
    }
    function Fb() {
      if (zb) {
        var a = zb, b = Ab;
        Ab = zb = null;
        Bb(a);
        if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
      }
    }
    function Gb(a, b) {
      return a(b);
    }
    function Hb() {
    }
    var Ib = false;
    function Jb(a, b, c) {
      if (Ib) return a(b, c);
      Ib = true;
      try {
        return Gb(a, b, c);
      } finally {
        if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
      }
    }
    function Kb(a, b) {
      var c = a.stateNode;
      if (null === c) return null;
      var d = Db(c);
      if (null === d) return null;
      c = d[b];
      a: switch (b) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
          a = !d;
          break a;
        default:
          a = false;
      }
      if (a) return null;
      if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
      return c;
    }
    var Lb = false;
    if (ia) try {
      var Mb = {};
      Object.defineProperty(Mb, "passive", { get: function() {
        Lb = true;
      } });
      window.addEventListener("test", Mb, Mb);
      window.removeEventListener("test", Mb, Mb);
    } catch (a) {
      Lb = false;
    }
    function Nb(a, b, c, d, e, f, g, h, k) {
      var l = Array.prototype.slice.call(arguments, 3);
      try {
        b.apply(c, l);
      } catch (m) {
        this.onError(m);
      }
    }
    var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
      Ob = true;
      Pb = a;
    } };
    function Tb(a, b, c, d, e, f, g, h, k) {
      Ob = false;
      Pb = null;
      Nb.apply(Sb, arguments);
    }
    function Ub(a, b, c, d, e, f, g, h, k) {
      Tb.apply(this, arguments);
      if (Ob) {
        if (Ob) {
          var l = Pb;
          Ob = false;
          Pb = null;
        } else throw Error(p(198));
        Qb || (Qb = true, Rb = l);
      }
    }
    function Vb(a) {
      var b = a, c = a;
      if (a.alternate) for (; b.return; ) b = b.return;
      else {
        a = b;
        do
          b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
        while (a);
      }
      return 3 === b.tag ? c : null;
    }
    function Wb(a) {
      if (13 === a.tag) {
        var b = a.memoizedState;
        null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
        if (null !== b) return b.dehydrated;
      }
      return null;
    }
    function Xb(a) {
      if (Vb(a) !== a) throw Error(p(188));
    }
    function Yb(a) {
      var b = a.alternate;
      if (!b) {
        b = Vb(a);
        if (null === b) throw Error(p(188));
        return b !== a ? null : a;
      }
      for (var c = a, d = b; ; ) {
        var e = c.return;
        if (null === e) break;
        var f = e.alternate;
        if (null === f) {
          d = e.return;
          if (null !== d) {
            c = d;
            continue;
          }
          break;
        }
        if (e.child === f.child) {
          for (f = e.child; f; ) {
            if (f === c) return Xb(e), a;
            if (f === d) return Xb(e), b;
            f = f.sibling;
          }
          throw Error(p(188));
        }
        if (c.return !== d.return) c = e, d = f;
        else {
          for (var g = false, h = e.child; h; ) {
            if (h === c) {
              g = true;
              c = e;
              d = f;
              break;
            }
            if (h === d) {
              g = true;
              d = e;
              c = f;
              break;
            }
            h = h.sibling;
          }
          if (!g) {
            for (h = f.child; h; ) {
              if (h === c) {
                g = true;
                c = f;
                d = e;
                break;
              }
              if (h === d) {
                g = true;
                d = f;
                c = e;
                break;
              }
              h = h.sibling;
            }
            if (!g) throw Error(p(189));
          }
        }
        if (c.alternate !== d) throw Error(p(190));
      }
      if (3 !== c.tag) throw Error(p(188));
      return c.stateNode.current === c ? a : b;
    }
    function Zb(a) {
      a = Yb(a);
      return null !== a ? $b(a) : null;
    }
    function $b(a) {
      if (5 === a.tag || 6 === a.tag) return a;
      for (a = a.child; null !== a; ) {
        var b = $b(a);
        if (null !== b) return b;
        a = a.sibling;
      }
      return null;
    }
    var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
    function mc(a) {
      if (lc && "function" === typeof lc.onCommitFiberRoot) try {
        lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
      } catch (b) {
      }
    }
    var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
    function nc(a) {
      a >>>= 0;
      return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
    }
    var rc = 64, sc = 4194304;
    function tc(a) {
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return a & 130023424;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 1073741824;
        default:
          return a;
      }
    }
    function uc(a, b) {
      var c = a.pendingLanes;
      if (0 === c) return 0;
      var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
      if (0 !== g) {
        var h = g & ~e;
        0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
      } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
      if (0 === d) return 0;
      if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
      0 !== (d & 4) && (d |= c & 16);
      b = a.entangledLanes;
      if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
      return d;
    }
    function vc(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 4:
          return b + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return b + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function wc(a, b) {
      for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
        var g = 31 - oc(f), h = 1 << g, k = e[g];
        if (-1 === k) {
          if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
        } else k <= b && (a.expiredLanes |= h);
        f &= ~h;
      }
    }
    function xc(a) {
      a = a.pendingLanes & -1073741825;
      return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
    }
    function yc() {
      var a = rc;
      rc <<= 1;
      0 === (rc & 4194240) && (rc = 64);
      return a;
    }
    function zc(a) {
      for (var b = [], c = 0; 31 > c; c++) b.push(a);
      return b;
    }
    function Ac(a, b, c) {
      a.pendingLanes |= b;
      536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
      a = a.eventTimes;
      b = 31 - oc(b);
      a[b] = c;
    }
    function Bc(a, b) {
      var c = a.pendingLanes & ~b;
      a.pendingLanes = b;
      a.suspendedLanes = 0;
      a.pingedLanes = 0;
      a.expiredLanes &= b;
      a.mutableReadLanes &= b;
      a.entangledLanes &= b;
      b = a.entanglements;
      var d = a.eventTimes;
      for (a = a.expirationTimes; 0 < c; ) {
        var e = 31 - oc(c), f = 1 << e;
        b[e] = 0;
        d[e] = -1;
        a[e] = -1;
        c &= ~f;
      }
    }
    function Cc(a, b) {
      var c = a.entangledLanes |= b;
      for (a = a.entanglements; c; ) {
        var d = 31 - oc(c), e = 1 << d;
        e & b | a[d] & b && (a[d] |= b);
        c &= ~e;
      }
    }
    var C = 0;
    function Dc(a) {
      a &= -a;
      return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
    }
    var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function Sc(a, b) {
      switch (a) {
        case "focusin":
        case "focusout":
          Lc = null;
          break;
        case "dragenter":
        case "dragleave":
          Mc = null;
          break;
        case "mouseover":
        case "mouseout":
          Nc = null;
          break;
        case "pointerover":
        case "pointerout":
          Oc.delete(b.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Pc.delete(b.pointerId);
      }
    }
    function Tc(a, b, c, d, e, f) {
      if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
      a.eventSystemFlags |= d;
      b = a.targetContainers;
      null !== e && -1 === b.indexOf(e) && b.push(e);
      return a;
    }
    function Uc(a, b, c, d, e) {
      switch (b) {
        case "focusin":
          return Lc = Tc(Lc, a, b, c, d, e), true;
        case "dragenter":
          return Mc = Tc(Mc, a, b, c, d, e), true;
        case "mouseover":
          return Nc = Tc(Nc, a, b, c, d, e), true;
        case "pointerover":
          var f = e.pointerId;
          Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
          return true;
        case "gotpointercapture":
          return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
      }
      return false;
    }
    function Vc(a) {
      var b = Wc(a.target);
      if (null !== b) {
        var c = Vb(b);
        if (null !== c) {
          if (b = c.tag, 13 === b) {
            if (b = Wb(c), null !== b) {
              a.blockedOn = b;
              Ic(a.priority, function() {
                Gc(c);
              });
              return;
            }
          } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
            a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function Xc(a) {
      if (null !== a.blockedOn) return false;
      for (var b = a.targetContainers; 0 < b.length; ) {
        var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
        if (null === c) {
          c = a.nativeEvent;
          var d = new c.constructor(c.type, c);
          wb = d;
          c.target.dispatchEvent(d);
          wb = null;
        } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
        b.shift();
      }
      return true;
    }
    function Zc(a, b, c) {
      Xc(a) && c.delete(b);
    }
    function $c() {
      Jc = false;
      null !== Lc && Xc(Lc) && (Lc = null);
      null !== Mc && Xc(Mc) && (Mc = null);
      null !== Nc && Xc(Nc) && (Nc = null);
      Oc.forEach(Zc);
      Pc.forEach(Zc);
    }
    function ad(a, b) {
      a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
    }
    function bd(a) {
      function b(b2) {
        return ad(b2, a);
      }
      if (0 < Kc.length) {
        ad(Kc[0], a);
        for (var c = 1; c < Kc.length; c++) {
          var d = Kc[c];
          d.blockedOn === a && (d.blockedOn = null);
        }
      }
      null !== Lc && ad(Lc, a);
      null !== Mc && ad(Mc, a);
      null !== Nc && ad(Nc, a);
      Oc.forEach(b);
      Pc.forEach(b);
      for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
      for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
    }
    var cd = ua.ReactCurrentBatchConfig, dd = true;
    function ed(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 1, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function gd(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 4, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function fd(a, b, c, d) {
      if (dd) {
        var e = Yc(a, b, c, d);
        if (null === e) hd(a, b, d, id, c), Sc(a, d);
        else if (Uc(e, a, b, c, d)) d.stopPropagation();
        else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
          for (; null !== e; ) {
            var f = Cb(e);
            null !== f && Ec(f);
            f = Yc(a, b, c, d);
            null === f && hd(a, b, d, id, c);
            if (f === e) break;
            e = f;
          }
          null !== e && d.stopPropagation();
        } else hd(a, b, d, null, c);
      }
    }
    var id = null;
    function Yc(a, b, c, d) {
      id = null;
      a = xb(d);
      a = Wc(a);
      if (null !== a) if (b = Vb(a), null === b) a = null;
      else if (c = b.tag, 13 === c) {
        a = Wb(b);
        if (null !== a) return a;
        a = null;
      } else if (3 === c) {
        if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
        a = null;
      } else b !== a && (a = null);
      id = a;
      return null;
    }
    function jd(a) {
      switch (a) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 4;
        case "message":
          switch (ec()) {
            case fc:
              return 1;
            case gc:
              return 4;
            case hc:
            case ic:
              return 16;
            case jc:
              return 536870912;
            default:
              return 16;
          }
        default:
          return 16;
      }
    }
    var kd = null, ld = null, md = null;
    function nd() {
      if (md) return md;
      var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
      for (a = 0; a < c && b[a] === e[a]; a++) ;
      var g = c - a;
      for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
      return md = e.slice(a, 1 < d ? 1 - d : void 0);
    }
    function od(a) {
      var b = a.keyCode;
      "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
      10 === a && (a = 13);
      return 32 <= a || 13 === a ? a : 0;
    }
    function pd() {
      return true;
    }
    function qd() {
      return false;
    }
    function rd(a) {
      function b(b2, d, e, f, g) {
        this._reactName = b2;
        this._targetInst = e;
        this.type = d;
        this.nativeEvent = f;
        this.target = g;
        this.currentTarget = null;
        for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
        this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
        this.isPropagationStopped = qd;
        return this;
      }
      A(b.prototype, { preventDefault: function() {
        this.defaultPrevented = true;
        var a2 = this.nativeEvent;
        a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
      }, stopPropagation: function() {
        var a2 = this.nativeEvent;
        a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
      }, persist: function() {
      }, isPersistent: pd });
      return b;
    }
    var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
      return a.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
      return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
    }, movementX: function(a) {
      if ("movementX" in a) return a.movementX;
      a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
      return wd;
    }, movementY: function(a) {
      return "movementY" in a ? a.movementY : xd;
    } }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
      return "clipboardData" in a ? a.clipboardData : window.clipboardData;
    } }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Nd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Pd(a) {
      var b = this.nativeEvent;
      return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
    }
    function zd() {
      return Pd;
    }
    var Qd = A({}, ud, { key: function(a) {
      if (a.key) {
        var b = Md[a.key] || a.key;
        if ("Unidentified" !== b) return b;
      }
      return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
      return "keypress" === a.type ? od(a) : 0;
    }, keyCode: function(a) {
      return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    }, which: function(a) {
      return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    } }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
      deltaX: function(a) {
        return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
      },
      deltaY: function(a) {
        return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
    ia && "documentMode" in document && (be = document.documentMode);
    var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
    function ge(a, b) {
      switch (a) {
        case "keyup":
          return -1 !== $d.indexOf(b.keyCode);
        case "keydown":
          return 229 !== b.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function he(a) {
      a = a.detail;
      return "object" === typeof a && "data" in a ? a.data : null;
    }
    var ie = false;
    function je(a, b) {
      switch (a) {
        case "compositionend":
          return he(b);
        case "keypress":
          if (32 !== b.which) return null;
          fe = true;
          return ee;
        case "textInput":
          return a = b.data, a === ee && fe ? null : a;
        default:
          return null;
      }
    }
    function ke(a, b) {
      if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
            if (b.char && 1 < b.char.length) return b.char;
            if (b.which) return String.fromCharCode(b.which);
          }
          return null;
        case "compositionend":
          return de && "ko" !== b.locale ? null : b.data;
        default:
          return null;
      }
    }
    var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
    function me(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
    }
    function ne(a, b, c, d) {
      Eb(d);
      b = oe(b, "onChange");
      0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
    }
    var pe = null, qe = null;
    function re(a) {
      se(a, 0);
    }
    function te(a) {
      var b = ue(a);
      if (Wa(b)) return a;
    }
    function ve(a, b) {
      if ("change" === a) return b;
    }
    var we = false;
    if (ia) {
      var xe;
      if (ia) {
        var ye = "oninput" in document;
        if (!ye) {
          var ze = document.createElement("div");
          ze.setAttribute("oninput", "return;");
          ye = "function" === typeof ze.oninput;
        }
        xe = ye;
      } else xe = false;
      we = xe && (!document.documentMode || 9 < document.documentMode);
    }
    function Ae() {
      pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
    }
    function Be(a) {
      if ("value" === a.propertyName && te(qe)) {
        var b = [];
        ne(b, qe, a, xb(a));
        Jb(re, b);
      }
    }
    function Ce(a, b, c) {
      "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
    }
    function De(a) {
      if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
    }
    function Ee(a, b) {
      if ("click" === a) return te(b);
    }
    function Fe(a, b) {
      if ("input" === a || "change" === a) return te(b);
    }
    function Ge(a, b) {
      return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
    }
    var He = "function" === typeof Object.is ? Object.is : Ge;
    function Ie(a, b) {
      if (He(a, b)) return true;
      if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
      var c = Object.keys(a), d = Object.keys(b);
      if (c.length !== d.length) return false;
      for (d = 0; d < c.length; d++) {
        var e = c[d];
        if (!ja.call(b, e) || !He(a[e], b[e])) return false;
      }
      return true;
    }
    function Je(a) {
      for (; a && a.firstChild; ) a = a.firstChild;
      return a;
    }
    function Ke(a, b) {
      var c = Je(a);
      a = 0;
      for (var d; c; ) {
        if (3 === c.nodeType) {
          d = a + c.textContent.length;
          if (a <= b && d >= b) return { node: c, offset: b - a };
          a = d;
        }
        a: {
          for (; c; ) {
            if (c.nextSibling) {
              c = c.nextSibling;
              break a;
            }
            c = c.parentNode;
          }
          c = void 0;
        }
        c = Je(c);
      }
    }
    function Le(a, b) {
      return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
    }
    function Me() {
      for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
        try {
          var c = "string" === typeof b.contentWindow.location.href;
        } catch (d) {
          c = false;
        }
        if (c) a = b.contentWindow;
        else break;
        b = Xa(a.document);
      }
      return b;
    }
    function Ne(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
    }
    function Oe(a) {
      var b = Me(), c = a.focusedElem, d = a.selectionRange;
      if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
        if (null !== d && Ne(c)) {
          if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
          else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
            a = a.getSelection();
            var e = c.textContent.length, f = Math.min(d.start, e);
            d = void 0 === d.end ? f : Math.min(d.end, e);
            !a.extend && f > d && (e = d, d = f, f = e);
            e = Ke(c, f);
            var g = Ke(
              c,
              d
            );
            e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
          }
        }
        b = [];
        for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
        "function" === typeof c.focus && c.focus();
        for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
      }
    }
    var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
    function Ue(a, b, c) {
      var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
      Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
    }
    function Ve(a, b) {
      var c = {};
      c[a.toLowerCase()] = b.toLowerCase();
      c["Webkit" + a] = "webkit" + b;
      c["Moz" + a] = "moz" + b;
      return c;
    }
    var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
    ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
    function Ze(a) {
      if (Xe[a]) return Xe[a];
      if (!We[a]) return a;
      var b = We[a], c;
      for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
      return a;
    }
    var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ff(a, b) {
      df.set(a, b);
      fa(b, [a]);
    }
    for (var gf = 0; gf < ef.length; gf++) {
      var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
      ff(jf, "on" + kf);
    }
    ff($e, "onAnimationEnd");
    ff(af, "onAnimationIteration");
    ff(bf, "onAnimationStart");
    ff("dblclick", "onDoubleClick");
    ff("focusin", "onFocus");
    ff("focusout", "onBlur");
    ff(cf, "onTransitionEnd");
    ha("onMouseEnter", ["mouseout", "mouseover"]);
    ha("onMouseLeave", ["mouseout", "mouseover"]);
    ha("onPointerEnter", ["pointerout", "pointerover"]);
    ha("onPointerLeave", ["pointerout", "pointerover"]);
    fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
    function nf(a, b, c) {
      var d = a.type || "unknown-event";
      a.currentTarget = c;
      Ub(d, b, void 0, a);
      a.currentTarget = null;
    }
    function se(a, b) {
      b = 0 !== (b & 4);
      for (var c = 0; c < a.length; c++) {
        var d = a[c], e = d.event;
        d = d.listeners;
        a: {
          var f = void 0;
          if (b) for (var g = d.length - 1; 0 <= g; g--) {
            var h = d[g], k = h.instance, l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
          else for (g = 0; g < d.length; g++) {
            h = d[g];
            k = h.instance;
            l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
        }
      }
      if (Qb) throw a = Rb, Qb = false, Rb = null, a;
    }
    function D(a, b) {
      var c = b[of];
      void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
      var d = a + "__bubble";
      c.has(d) || (pf(b, a, 2, false), c.add(d));
    }
    function qf(a, b, c) {
      var d = 0;
      b && (d |= 4);
      pf(c, a, d, b);
    }
    var rf = "_reactListening" + Math.random().toString(36).slice(2);
    function sf(a) {
      if (!a[rf]) {
        a[rf] = true;
        da.forEach(function(b2) {
          "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
        });
        var b = 9 === a.nodeType ? a : a.ownerDocument;
        null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
      }
    }
    function pf(a, b, c, d) {
      switch (jd(b)) {
        case 1:
          var e = ed;
          break;
        case 4:
          e = gd;
          break;
        default:
          e = fd;
      }
      c = e.bind(null, b, c, a);
      e = void 0;
      !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
      d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
    }
    function hd(a, b, c, d, e) {
      var f = d;
      if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
        if (null === d) return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h = d.stateNode.containerInfo;
          if (h === e || 8 === h.nodeType && h.parentNode === e) break;
          if (4 === g) for (g = d.return; null !== g; ) {
            var k = g.tag;
            if (3 === k || 4 === k) {
              if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
            }
            g = g.return;
          }
          for (; null !== h; ) {
            g = Wc(h);
            if (null === g) return;
            k = g.tag;
            if (5 === k || 6 === k) {
              d = f = g;
              continue a;
            }
            h = h.parentNode;
          }
        }
        d = d.return;
      }
      Jb(function() {
        var d2 = f, e2 = xb(c), g2 = [];
        a: {
          var h2 = df.get(a);
          if (void 0 !== h2) {
            var k2 = td, n = a;
            switch (a) {
              case "keypress":
                if (0 === od(c)) break a;
              case "keydown":
              case "keyup":
                k2 = Rd;
                break;
              case "focusin":
                n = "focus";
                k2 = Fd;
                break;
              case "focusout":
                n = "blur";
                k2 = Fd;
                break;
              case "beforeblur":
              case "afterblur":
                k2 = Fd;
                break;
              case "click":
                if (2 === c.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                k2 = Bd;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                k2 = Dd;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                k2 = Vd;
                break;
              case $e:
              case af:
              case bf:
                k2 = Hd;
                break;
              case cf:
                k2 = Xd;
                break;
              case "scroll":
                k2 = vd;
                break;
              case "wheel":
                k2 = Zd;
                break;
              case "copy":
              case "cut":
              case "paste":
                k2 = Jd;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                k2 = Td;
            }
            var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
            t = [];
            for (var w = d2, u; null !== w; ) {
              u = w;
              var F = u.stateNode;
              5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
              if (J) break;
              w = w.return;
            }
            0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
          }
        }
        if (0 === (b & 7)) {
          a: {
            h2 = "mouseover" === a || "pointerover" === a;
            k2 = "mouseout" === a || "pointerout" === a;
            if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
            if (k2 || h2) {
              h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
              if (k2) {
                if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
              } else k2 = null, n = d2;
              if (k2 !== n) {
                t = Bd;
                F = "onMouseLeave";
                x = "onMouseEnter";
                w = "mouse";
                if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
                J = null == k2 ? h2 : ue(k2);
                u = null == n ? h2 : ue(n);
                h2 = new t(F, w + "leave", k2, c, e2);
                h2.target = J;
                h2.relatedTarget = u;
                F = null;
                Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
                J = F;
                if (k2 && n) b: {
                  t = k2;
                  x = n;
                  w = 0;
                  for (u = t; u; u = vf(u)) w++;
                  u = 0;
                  for (F = x; F; F = vf(F)) u++;
                  for (; 0 < w - u; ) t = vf(t), w--;
                  for (; 0 < u - w; ) x = vf(x), u--;
                  for (; w--; ) {
                    if (t === x || null !== x && t === x.alternate) break b;
                    t = vf(t);
                    x = vf(x);
                  }
                  t = null;
                }
                else t = null;
                null !== k2 && wf(g2, h2, k2, t, false);
                null !== n && null !== J && wf(g2, J, n, t, true);
              }
            }
          }
          a: {
            h2 = d2 ? ue(d2) : window;
            k2 = h2.nodeName && h2.nodeName.toLowerCase();
            if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
            else if (me(h2)) if (we) na = Fe;
            else {
              na = De;
              var xa = Ce;
            }
            else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
            if (na && (na = na(a, d2))) {
              ne(g2, na, c, e2);
              break a;
            }
            xa && xa(a, h2, d2);
            "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
          }
          xa = d2 ? ue(d2) : window;
          switch (a) {
            case "focusin":
              if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
              break;
            case "focusout":
              Se = Re = Qe = null;
              break;
            case "mousedown":
              Te = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Te = false;
              Ue(g2, c, e2);
              break;
            case "selectionchange":
              if (Pe) break;
            case "keydown":
            case "keyup":
              Ue(g2, c, e2);
          }
          var $a;
          if (ae) b: {
            switch (a) {
              case "compositionstart":
                var ba = "onCompositionStart";
                break b;
              case "compositionend":
                ba = "onCompositionEnd";
                break b;
              case "compositionupdate":
                ba = "onCompositionUpdate";
                break b;
            }
            ba = void 0;
          }
          else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
          ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
          if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
        }
        se(g2, b);
      });
    }
    function tf(a, b, c) {
      return { instance: a, listener: b, currentTarget: c };
    }
    function oe(a, b) {
      for (var c = b + "Capture", d = []; null !== a; ) {
        var e = a, f = e.stateNode;
        5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
        a = a.return;
      }
      return d;
    }
    function vf(a) {
      if (null === a) return null;
      do
        a = a.return;
      while (a && 5 !== a.tag);
      return a ? a : null;
    }
    function wf(a, b, c, d, e) {
      for (var f = b._reactName, g = []; null !== c && c !== d; ) {
        var h = c, k = h.alternate, l = h.stateNode;
        if (null !== k && k === d) break;
        5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
        c = c.return;
      }
      0 !== g.length && a.push({ event: b, listeners: g });
    }
    var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
    function zf(a) {
      return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
    }
    function Af(a, b, c) {
      b = zf(b);
      if (zf(a) !== b && c) throw Error(p(425));
    }
    function Bf() {
    }
    var Cf = null, Df = null;
    function Ef(a, b) {
      return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
    }
    var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
      return Hf.resolve(null).then(a).catch(If);
    } : Ff;
    function If(a) {
      setTimeout(function() {
        throw a;
      });
    }
    function Kf(a, b) {
      var c = b, d = 0;
      do {
        var e = c.nextSibling;
        a.removeChild(c);
        if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
          if (0 === d) {
            a.removeChild(e);
            bd(b);
            return;
          }
          d--;
        } else "$" !== c && "$?" !== c && "$!" !== c || d++;
        c = e;
      } while (c);
      bd(b);
    }
    function Lf(a) {
      for (; null != a; a = a.nextSibling) {
        var b = a.nodeType;
        if (1 === b || 3 === b) break;
        if (8 === b) {
          b = a.data;
          if ("$" === b || "$!" === b || "$?" === b) break;
          if ("/$" === b) return null;
        }
      }
      return a;
    }
    function Mf(a) {
      a = a.previousSibling;
      for (var b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("$" === c || "$!" === c || "$?" === c) {
            if (0 === b) return a;
            b--;
          } else "/$" === c && b++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
    function Wc(a) {
      var b = a[Of];
      if (b) return b;
      for (var c = a.parentNode; c; ) {
        if (b = c[uf] || c[Of]) {
          c = b.alternate;
          if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
            if (c = a[Of]) return c;
            a = Mf(a);
          }
          return b;
        }
        a = c;
        c = a.parentNode;
      }
      return null;
    }
    function Cb(a) {
      a = a[Of] || a[uf];
      return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
    }
    function ue(a) {
      if (5 === a.tag || 6 === a.tag) return a.stateNode;
      throw Error(p(33));
    }
    function Db(a) {
      return a[Pf] || null;
    }
    var Sf = [], Tf = -1;
    function Uf(a) {
      return { current: a };
    }
    function E(a) {
      0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
    }
    function G(a, b) {
      Tf++;
      Sf[Tf] = a.current;
      a.current = b;
    }
    var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
    function Yf(a, b) {
      var c = a.type.contextTypes;
      if (!c) return Vf;
      var d = a.stateNode;
      if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
      var e = {}, f;
      for (f in c) e[f] = b[f];
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
      return e;
    }
    function Zf(a) {
      a = a.childContextTypes;
      return null !== a && void 0 !== a;
    }
    function $f() {
      E(Wf);
      E(H);
    }
    function ag(a, b, c) {
      if (H.current !== Vf) throw Error(p(168));
      G(H, b);
      G(Wf, c);
    }
    function bg(a, b, c) {
      var d = a.stateNode;
      b = b.childContextTypes;
      if ("function" !== typeof d.getChildContext) return c;
      d = d.getChildContext();
      for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
      return A({}, c, d);
    }
    function cg(a) {
      a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
      Xf = H.current;
      G(H, a);
      G(Wf, Wf.current);
      return true;
    }
    function dg(a, b, c) {
      var d = a.stateNode;
      if (!d) throw Error(p(169));
      c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
      G(Wf, c);
    }
    var eg = null, fg = false, gg = false;
    function hg(a) {
      null === eg ? eg = [a] : eg.push(a);
    }
    function ig(a) {
      fg = true;
      hg(a);
    }
    function jg() {
      if (!gg && null !== eg) {
        gg = true;
        var a = 0, b = C;
        try {
          var c = eg;
          for (C = 1; a < c.length; a++) {
            var d = c[a];
            do
              d = d(true);
            while (null !== d);
          }
          eg = null;
          fg = false;
        } catch (e) {
          throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
        } finally {
          C = b, gg = false;
        }
      }
      return null;
    }
    var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
    function tg(a, b) {
      kg[lg++] = ng;
      kg[lg++] = mg;
      mg = a;
      ng = b;
    }
    function ug(a, b, c) {
      og[pg++] = rg;
      og[pg++] = sg;
      og[pg++] = qg;
      qg = a;
      var d = rg;
      a = sg;
      var e = 32 - oc(d) - 1;
      d &= ~(1 << e);
      c += 1;
      var f = 32 - oc(b) + e;
      if (30 < f) {
        var g = e - e % 5;
        f = (d & (1 << g) - 1).toString(32);
        d >>= g;
        e -= g;
        rg = 1 << 32 - oc(b) + e | c << e | d;
        sg = f + a;
      } else rg = 1 << f | c << e | d, sg = a;
    }
    function vg(a) {
      null !== a.return && (tg(a, 1), ug(a, 1, 0));
    }
    function wg(a) {
      for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
      for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
    }
    var xg = null, yg = null, I = false, zg = null;
    function Ag(a, b) {
      var c = Bg(5, null, null, 0);
      c.elementType = "DELETED";
      c.stateNode = b;
      c.return = a;
      b = a.deletions;
      null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
    }
    function Cg(a, b) {
      switch (a.tag) {
        case 5:
          var c = a.type;
          b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
          return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
        case 6:
          return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
        case 13:
          return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
        default:
          return false;
      }
    }
    function Dg(a) {
      return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
    }
    function Eg(a) {
      if (I) {
        var b = yg;
        if (b) {
          var c = b;
          if (!Cg(a, b)) {
            if (Dg(a)) throw Error(p(418));
            b = Lf(c.nextSibling);
            var d = xg;
            b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
          }
        } else {
          if (Dg(a)) throw Error(p(418));
          a.flags = a.flags & -4097 | 2;
          I = false;
          xg = a;
        }
      }
    }
    function Fg(a) {
      for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
      xg = a;
    }
    function Gg(a) {
      if (a !== xg) return false;
      if (!I) return Fg(a), I = true, false;
      var b;
      (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
      if (b && (b = yg)) {
        if (Dg(a)) throw Hg(), Error(p(418));
        for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
      }
      Fg(a);
      if (13 === a.tag) {
        a = a.memoizedState;
        a = null !== a ? a.dehydrated : null;
        if (!a) throw Error(p(317));
        a: {
          a = a.nextSibling;
          for (b = 0; a; ) {
            if (8 === a.nodeType) {
              var c = a.data;
              if ("/$" === c) {
                if (0 === b) {
                  yg = Lf(a.nextSibling);
                  break a;
                }
                b--;
              } else "$" !== c && "$!" !== c && "$?" !== c || b++;
            }
            a = a.nextSibling;
          }
          yg = null;
        }
      } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
      return true;
    }
    function Hg() {
      for (var a = yg; a; ) a = Lf(a.nextSibling);
    }
    function Ig() {
      yg = xg = null;
      I = false;
    }
    function Jg(a) {
      null === zg ? zg = [a] : zg.push(a);
    }
    var Kg = ua.ReactCurrentBatchConfig;
    function Lg(a, b, c) {
      a = c.ref;
      if (null !== a && "function" !== typeof a && "object" !== typeof a) {
        if (c._owner) {
          c = c._owner;
          if (c) {
            if (1 !== c.tag) throw Error(p(309));
            var d = c.stateNode;
          }
          if (!d) throw Error(p(147, a));
          var e = d, f = "" + a;
          if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
          b = function(a2) {
            var b2 = e.refs;
            null === a2 ? delete b2[f] : b2[f] = a2;
          };
          b._stringRef = f;
          return b;
        }
        if ("string" !== typeof a) throw Error(p(284));
        if (!c._owner) throw Error(p(290, a));
      }
      return a;
    }
    function Mg(a, b) {
      a = Object.prototype.toString.call(b);
      throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
    }
    function Ng(a) {
      var b = a._init;
      return b(a._payload);
    }
    function Og(a) {
      function b(b2, c2) {
        if (a) {
          var d2 = b2.deletions;
          null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
        }
      }
      function c(c2, d2) {
        if (!a) return null;
        for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
        return null;
      }
      function d(a2, b2) {
        for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
        return a2;
      }
      function e(a2, b2) {
        a2 = Pg(a2, b2);
        a2.index = 0;
        a2.sibling = null;
        return a2;
      }
      function f(b2, c2, d2) {
        b2.index = d2;
        if (!a) return b2.flags |= 1048576, c2;
        d2 = b2.alternate;
        if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
        b2.flags |= 2;
        return c2;
      }
      function g(b2) {
        a && null === b2.alternate && (b2.flags |= 2);
        return b2;
      }
      function h(a2, b2, c2, d2) {
        if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function k(a2, b2, c2, d2) {
        var f2 = c2.type;
        if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
        if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
        d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
        d2.ref = Lg(a2, b2, c2);
        d2.return = a2;
        return d2;
      }
      function l(a2, b2, c2, d2) {
        if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2.children || []);
        b2.return = a2;
        return b2;
      }
      function m(a2, b2, c2, d2, f2) {
        if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function q(a2, b2, c2) {
        if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
        if ("object" === typeof b2 && null !== b2) {
          switch (b2.$$typeof) {
            case va:
              return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
            case wa:
              return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
            case Ha:
              var d2 = b2._init;
              return q(a2, d2(b2._payload), c2);
          }
          if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
          Mg(a2, b2);
        }
        return null;
      }
      function r(a2, b2, c2, d2) {
        var e2 = null !== b2 ? b2.key : null;
        if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
        if ("object" === typeof c2 && null !== c2) {
          switch (c2.$$typeof) {
            case va:
              return c2.key === e2 ? k(a2, b2, c2, d2) : null;
            case wa:
              return c2.key === e2 ? l(a2, b2, c2, d2) : null;
            case Ha:
              return e2 = c2._init, r(
                a2,
                b2,
                e2(c2._payload),
                d2
              );
          }
          if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
          Mg(a2, c2);
        }
        return null;
      }
      function y(a2, b2, c2, d2, e2) {
        if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
        if ("object" === typeof d2 && null !== d2) {
          switch (d2.$$typeof) {
            case va:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
            case wa:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
            case Ha:
              var f2 = d2._init;
              return y(a2, b2, c2, f2(d2._payload), e2);
          }
          if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
          Mg(b2, d2);
        }
        return null;
      }
      function n(e2, g2, h2, k2) {
        for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
          u.index > w ? (x = u, u = null) : x = u.sibling;
          var n2 = r(e2, u, h2[w], k2);
          if (null === n2) {
            null === u && (u = x);
            break;
          }
          a && u && null === n2.alternate && b(e2, u);
          g2 = f(n2, g2, w);
          null === m2 ? l2 = n2 : m2.sibling = n2;
          m2 = n2;
          u = x;
        }
        if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
        if (null === u) {
          for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
          I && tg(e2, w);
          return l2;
        }
        for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
        a && u.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function t(e2, g2, h2, k2) {
        var l2 = Ka(h2);
        if ("function" !== typeof l2) throw Error(p(150));
        h2 = l2.call(h2);
        if (null == h2) throw Error(p(151));
        for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
          m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
          var t2 = r(e2, m2, n2.value, k2);
          if (null === t2) {
            null === m2 && (m2 = x);
            break;
          }
          a && m2 && null === t2.alternate && b(e2, m2);
          g2 = f(t2, g2, w);
          null === u ? l2 = t2 : u.sibling = t2;
          u = t2;
          m2 = x;
        }
        if (n2.done) return c(
          e2,
          m2
        ), I && tg(e2, w), l2;
        if (null === m2) {
          for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
          I && tg(e2, w);
          return l2;
        }
        for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
        a && m2.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function J(a2, d2, f2, h2) {
        "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
        if ("object" === typeof f2 && null !== f2) {
          switch (f2.$$typeof) {
            case va:
              a: {
                for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                  if (l2.key === k2) {
                    k2 = f2.type;
                    if (k2 === ya) {
                      if (7 === l2.tag) {
                        c(a2, l2.sibling);
                        d2 = e(l2, f2.props.children);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                    } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                      c(a2, l2.sibling);
                      d2 = e(l2, f2.props);
                      d2.ref = Lg(a2, l2, f2);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                    c(a2, l2);
                    break;
                  } else b(a2, l2);
                  l2 = l2.sibling;
                }
                f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
              }
              return g(a2);
            case wa:
              a: {
                for (l2 = f2.key; null !== d2; ) {
                  if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                    c(a2, d2.sibling);
                    d2 = e(d2, f2.children || []);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  } else {
                    c(a2, d2);
                    break;
                  }
                  else b(a2, d2);
                  d2 = d2.sibling;
                }
                d2 = Sg(f2, a2.mode, h2);
                d2.return = a2;
                a2 = d2;
              }
              return g(a2);
            case Ha:
              return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
          }
          if (eb(f2)) return n(a2, d2, f2, h2);
          if (Ka(f2)) return t(a2, d2, f2, h2);
          Mg(a2, f2);
        }
        return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
      }
      return J;
    }
    var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
    function $g() {
      Zg = Yg = Xg = null;
    }
    function ah(a) {
      var b = Wg.current;
      E(Wg);
      a._currentValue = b;
    }
    function bh(a, b, c) {
      for (; null !== a; ) {
        var d = a.alternate;
        (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
        if (a === c) break;
        a = a.return;
      }
    }
    function ch(a, b) {
      Xg = a;
      Zg = Yg = null;
      a = a.dependencies;
      null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
    }
    function eh(a) {
      var b = a._currentValue;
      if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
        if (null === Xg) throw Error(p(308));
        Yg = a;
        Xg.dependencies = { lanes: 0, firstContext: a };
      } else Yg = Yg.next = a;
      return b;
    }
    var fh = null;
    function gh(a) {
      null === fh ? fh = [a] : fh.push(a);
    }
    function hh(a, b, c, d) {
      var e = b.interleaved;
      null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
      b.interleaved = c;
      return ih(a, d);
    }
    function ih(a, b) {
      a.lanes |= b;
      var c = a.alternate;
      null !== c && (c.lanes |= b);
      c = a;
      for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
      return 3 === c.tag ? c.stateNode : null;
    }
    var jh = false;
    function kh(a) {
      a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
    }
    function lh(a, b) {
      a = a.updateQueue;
      b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
    }
    function mh(a, b) {
      return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
    }
    function nh(a, b, c) {
      var d = a.updateQueue;
      if (null === d) return null;
      d = d.shared;
      if (0 !== (K & 2)) {
        var e = d.pending;
        null === e ? b.next = b : (b.next = e.next, e.next = b);
        d.pending = b;
        return ih(a, c);
      }
      e = d.interleaved;
      null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
      d.interleaved = b;
      return ih(a, c);
    }
    function oh(a, b, c) {
      b = b.updateQueue;
      if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    function ph(a, b) {
      var c = a.updateQueue, d = a.alternate;
      if (null !== d && (d = d.updateQueue, c === d)) {
        var e = null, f = null;
        c = c.firstBaseUpdate;
        if (null !== c) {
          do {
            var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
            null === f ? e = f = g : f = f.next = g;
            c = c.next;
          } while (null !== c);
          null === f ? e = f = b : f = f.next = b;
        } else e = f = b;
        c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
        a.updateQueue = c;
        return;
      }
      a = c.lastBaseUpdate;
      null === a ? c.firstBaseUpdate = b : a.next = b;
      c.lastBaseUpdate = b;
    }
    function qh(a, b, c, d) {
      var e = a.updateQueue;
      jh = false;
      var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
      if (null !== h) {
        e.shared.pending = null;
        var k = h, l = k.next;
        k.next = null;
        null === g ? f = l : g.next = l;
        g = k;
        var m = a.alternate;
        null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
      }
      if (null !== f) {
        var q = e.baseState;
        g = 0;
        m = l = k = null;
        h = f;
        do {
          var r = h.lane, y = h.eventTime;
          if ((d & r) === r) {
            null !== m && (m = m.next = {
              eventTime: y,
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            });
            a: {
              var n = a, t = h;
              r = b;
              y = c;
              switch (t.tag) {
                case 1:
                  n = t.payload;
                  if ("function" === typeof n) {
                    q = n.call(y, q, r);
                    break a;
                  }
                  q = n;
                  break a;
                case 3:
                  n.flags = n.flags & -65537 | 128;
                case 0:
                  n = t.payload;
                  r = "function" === typeof n ? n.call(y, q, r) : n;
                  if (null === r || void 0 === r) break a;
                  q = A({}, q, r);
                  break a;
                case 2:
                  jh = true;
              }
            }
            null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
          } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
          h = h.next;
          if (null === h) if (h = e.shared.pending, null === h) break;
          else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
        } while (1);
        null === m && (k = q);
        e.baseState = k;
        e.firstBaseUpdate = l;
        e.lastBaseUpdate = m;
        b = e.shared.interleaved;
        if (null !== b) {
          e = b;
          do
            g |= e.lane, e = e.next;
          while (e !== b);
        } else null === f && (e.shared.lanes = 0);
        rh |= g;
        a.lanes = g;
        a.memoizedState = q;
      }
    }
    function sh(a, b, c) {
      a = b.effects;
      b.effects = null;
      if (null !== a) for (b = 0; b < a.length; b++) {
        var d = a[b], e = d.callback;
        if (null !== e) {
          d.callback = null;
          d = c;
          if ("function" !== typeof e) throw Error(p(191, e));
          e.call(d);
        }
      }
    }
    var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
    function xh(a) {
      if (a === th) throw Error(p(174));
      return a;
    }
    function yh(a, b) {
      G(wh, b);
      G(vh, a);
      G(uh, th);
      a = b.nodeType;
      switch (a) {
        case 9:
        case 11:
          b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
          break;
        default:
          a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
      }
      E(uh);
      G(uh, b);
    }
    function zh() {
      E(uh);
      E(vh);
      E(wh);
    }
    function Ah(a) {
      xh(wh.current);
      var b = xh(uh.current);
      var c = lb(b, a.type);
      b !== c && (G(vh, a), G(uh, c));
    }
    function Bh(a) {
      vh.current === a && (E(uh), E(vh));
    }
    var L = Uf(0);
    function Ch(a) {
      for (var b = a; null !== b; ) {
        if (13 === b.tag) {
          var c = b.memoizedState;
          if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
        } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
          if (0 !== (b.flags & 128)) return b;
        } else if (null !== b.child) {
          b.child.return = b;
          b = b.child;
          continue;
        }
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return null;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
      return null;
    }
    var Dh = [];
    function Eh() {
      for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
      Dh.length = 0;
    }
    var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
    function P() {
      throw Error(p(321));
    }
    function Mh(a, b) {
      if (null === b) return false;
      for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
      return true;
    }
    function Nh(a, b, c, d, e, f) {
      Hh = f;
      M = b;
      b.memoizedState = null;
      b.updateQueue = null;
      b.lanes = 0;
      Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
      a = c(d, e);
      if (Jh) {
        f = 0;
        do {
          Jh = false;
          Kh = 0;
          if (25 <= f) throw Error(p(301));
          f += 1;
          O = N = null;
          b.updateQueue = null;
          Fh.current = Qh;
          a = c(d, e);
        } while (Jh);
      }
      Fh.current = Rh;
      b = null !== N && null !== N.next;
      Hh = 0;
      O = N = M = null;
      Ih = false;
      if (b) throw Error(p(300));
      return a;
    }
    function Sh() {
      var a = 0 !== Kh;
      Kh = 0;
      return a;
    }
    function Th() {
      var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
      return O;
    }
    function Uh() {
      if (null === N) {
        var a = M.alternate;
        a = null !== a ? a.memoizedState : null;
      } else a = N.next;
      var b = null === O ? M.memoizedState : O.next;
      if (null !== b) O = b, N = a;
      else {
        if (null === a) throw Error(p(310));
        N = a;
        a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
      }
      return O;
    }
    function Vh(a, b) {
      return "function" === typeof b ? b(a) : b;
    }
    function Wh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = N, e = d.baseQueue, f = c.pending;
      if (null !== f) {
        if (null !== e) {
          var g = e.next;
          e.next = f.next;
          f.next = g;
        }
        d.baseQueue = e = f;
        c.pending = null;
      }
      if (null !== e) {
        f = e.next;
        d = d.baseState;
        var h = g = null, k = null, l = f;
        do {
          var m = l.lane;
          if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
          else {
            var q = {
              lane: m,
              action: l.action,
              hasEagerState: l.hasEagerState,
              eagerState: l.eagerState,
              next: null
            };
            null === k ? (h = k = q, g = d) : k = k.next = q;
            M.lanes |= m;
            rh |= m;
          }
          l = l.next;
        } while (null !== l && l !== f);
        null === k ? g = d : k.next = h;
        He(d, b.memoizedState) || (dh = true);
        b.memoizedState = d;
        b.baseState = g;
        b.baseQueue = k;
        c.lastRenderedState = d;
      }
      a = c.interleaved;
      if (null !== a) {
        e = a;
        do
          f = e.lane, M.lanes |= f, rh |= f, e = e.next;
        while (e !== a);
      } else null === e && (c.lanes = 0);
      return [b.memoizedState, c.dispatch];
    }
    function Xh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = c.dispatch, e = c.pending, f = b.memoizedState;
      if (null !== e) {
        c.pending = null;
        var g = e = e.next;
        do
          f = a(f, g.action), g = g.next;
        while (g !== e);
        He(f, b.memoizedState) || (dh = true);
        b.memoizedState = f;
        null === b.baseQueue && (b.baseState = f);
        c.lastRenderedState = f;
      }
      return [f, d];
    }
    function Yh() {
    }
    function Zh(a, b) {
      var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
      f && (d.memoizedState = e, dh = true);
      d = d.queue;
      $h(ai.bind(null, c, d, a), [a]);
      if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
        c.flags |= 2048;
        bi(9, ci.bind(null, c, d, e, b), void 0, null);
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(c, b, e);
      }
      return e;
    }
    function di(a, b, c) {
      a.flags |= 16384;
      a = { getSnapshot: b, value: c };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
    }
    function ci(a, b, c, d) {
      b.value = c;
      b.getSnapshot = d;
      ei(b) && fi(a);
    }
    function ai(a, b, c) {
      return c(function() {
        ei(b) && fi(a);
      });
    }
    function ei(a) {
      var b = a.getSnapshot;
      a = a.value;
      try {
        var c = b();
        return !He(a, c);
      } catch (d) {
        return true;
      }
    }
    function fi(a) {
      var b = ih(a, 1);
      null !== b && gi(b, a, 1, -1);
    }
    function hi(a) {
      var b = Th();
      "function" === typeof a && (a = a());
      b.memoizedState = b.baseState = a;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
      b.queue = a;
      a = a.dispatch = ii.bind(null, M, a);
      return [b.memoizedState, a];
    }
    function bi(a, b, c, d) {
      a = { tag: a, create: b, destroy: c, deps: d, next: null };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
      return a;
    }
    function ji() {
      return Uh().memoizedState;
    }
    function ki(a, b, c, d) {
      var e = Th();
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
    }
    function li(a, b, c, d) {
      var e = Uh();
      d = void 0 === d ? null : d;
      var f = void 0;
      if (null !== N) {
        var g = N.memoizedState;
        f = g.destroy;
        if (null !== d && Mh(d, g.deps)) {
          e.memoizedState = bi(b, c, f, d);
          return;
        }
      }
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, f, d);
    }
    function mi(a, b) {
      return ki(8390656, 8, a, b);
    }
    function $h(a, b) {
      return li(2048, 8, a, b);
    }
    function ni(a, b) {
      return li(4, 2, a, b);
    }
    function oi(a, b) {
      return li(4, 4, a, b);
    }
    function pi(a, b) {
      if ("function" === typeof b) return a = a(), b(a), function() {
        b(null);
      };
      if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
        b.current = null;
      };
    }
    function qi(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return li(4, 4, pi.bind(null, b, a), c);
    }
    function ri() {
    }
    function si(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      c.memoizedState = [a, b];
      return a;
    }
    function ti(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      a = a();
      c.memoizedState = [a, b];
      return a;
    }
    function ui(a, b, c) {
      if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
      He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
      return b;
    }
    function vi(a, b) {
      var c = C;
      C = 0 !== c && 4 > c ? c : 4;
      a(true);
      var d = Gh.transition;
      Gh.transition = {};
      try {
        a(false), b();
      } finally {
        C = c, Gh.transition = d;
      }
    }
    function wi() {
      return Uh().memoizedState;
    }
    function xi(a, b, c) {
      var d = yi(a);
      c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, c);
      else if (c = hh(a, b, c, d), null !== c) {
        var e = R();
        gi(c, a, d, e);
        Bi(c, b, d);
      }
    }
    function ii(a, b, c) {
      var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, e);
      else {
        var f = a.alternate;
        if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
          var g = b.lastRenderedState, h = f(g, c);
          e.hasEagerState = true;
          e.eagerState = h;
          if (He(h, g)) {
            var k = b.interleaved;
            null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
            b.interleaved = e;
            return;
          }
        } catch (l) {
        } finally {
        }
        c = hh(a, b, e, d);
        null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
      }
    }
    function zi(a) {
      var b = a.alternate;
      return a === M || null !== b && b === M;
    }
    function Ai(a, b) {
      Jh = Ih = true;
      var c = a.pending;
      null === c ? b.next = b : (b.next = c.next, c.next = b);
      a.pending = b;
    }
    function Bi(a, b, c) {
      if (0 !== (c & 4194240)) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
      Th().memoizedState = [a, void 0 === b ? null : b];
      return a;
    }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return ki(
        4194308,
        4,
        pi.bind(null, b, a),
        c
      );
    }, useLayoutEffect: function(a, b) {
      return ki(4194308, 4, a, b);
    }, useInsertionEffect: function(a, b) {
      return ki(4, 2, a, b);
    }, useMemo: function(a, b) {
      var c = Th();
      b = void 0 === b ? null : b;
      a = a();
      c.memoizedState = [a, b];
      return a;
    }, useReducer: function(a, b, c) {
      var d = Th();
      b = void 0 !== c ? c(b) : b;
      d.memoizedState = d.baseState = b;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
      d.queue = a;
      a = a.dispatch = xi.bind(null, M, a);
      return [d.memoizedState, a];
    }, useRef: function(a) {
      var b = Th();
      a = { current: a };
      return b.memoizedState = a;
    }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
      return Th().memoizedState = a;
    }, useTransition: function() {
      var a = hi(false), b = a[0];
      a = vi.bind(null, a[1]);
      Th().memoizedState = a;
      return [b, a];
    }, useMutableSource: function() {
    }, useSyncExternalStore: function(a, b, c) {
      var d = M, e = Th();
      if (I) {
        if (void 0 === c) throw Error(p(407));
        c = c();
      } else {
        c = b();
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(d, b, c);
      }
      e.memoizedState = c;
      var f = { value: c, getSnapshot: b };
      e.queue = f;
      mi(ai.bind(
        null,
        d,
        f,
        a
      ), [a]);
      d.flags |= 2048;
      bi(9, ci.bind(null, d, f, c, b), void 0, null);
      return c;
    }, useId: function() {
      var a = Th(), b = Q.identifierPrefix;
      if (I) {
        var c = sg;
        var d = rg;
        c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
        b = ":" + b + "R" + c;
        c = Kh++;
        0 < c && (b += "H" + c.toString(32));
        b += ":";
      } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
      return a.memoizedState = b;
    }, unstable_isNewReconciler: false }, Ph = {
      readContext: eh,
      useCallback: si,
      useContext: eh,
      useEffect: $h,
      useImperativeHandle: qi,
      useInsertionEffect: ni,
      useLayoutEffect: oi,
      useMemo: ti,
      useReducer: Wh,
      useRef: ji,
      useState: function() {
        return Wh(Vh);
      },
      useDebugValue: ri,
      useDeferredValue: function(a) {
        var b = Uh();
        return ui(b, N.memoizedState, a);
      },
      useTransition: function() {
        var a = Wh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      },
      useMutableSource: Yh,
      useSyncExternalStore: Zh,
      useId: wi,
      unstable_isNewReconciler: false
    }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
      return Xh(Vh);
    }, useDebugValue: ri, useDeferredValue: function(a) {
      var b = Uh();
      return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
    }, useTransition: function() {
      var a = Xh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
    function Ci(a, b) {
      if (a && a.defaultProps) {
        b = A({}, b);
        a = a.defaultProps;
        for (var c in a) void 0 === b[c] && (b[c] = a[c]);
        return b;
      }
      return b;
    }
    function Di(a, b, c, d) {
      b = a.memoizedState;
      c = c(d, b);
      c = null === c || void 0 === c ? b : A({}, b, c);
      a.memoizedState = c;
      0 === a.lanes && (a.updateQueue.baseState = c);
    }
    var Ei = { isMounted: function(a) {
      return (a = a._reactInternals) ? Vb(a) === a : false;
    }, enqueueSetState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueReplaceState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.tag = 1;
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueForceUpdate: function(a, b) {
      a = a._reactInternals;
      var c = R(), d = yi(a), e = mh(c, d);
      e.tag = 2;
      void 0 !== b && null !== b && (e.callback = b);
      b = nh(a, e, d);
      null !== b && (gi(b, a, d, c), oh(b, a, d));
    } };
    function Fi(a, b, c, d, e, f, g) {
      a = a.stateNode;
      return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
    }
    function Gi(a, b, c) {
      var d = false, e = Vf;
      var f = b.contextType;
      "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
      b = new b(c, f);
      a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
      b.updater = Ei;
      a.stateNode = b;
      b._reactInternals = a;
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
      return b;
    }
    function Hi(a, b, c, d) {
      a = b.state;
      "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
      "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
      b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
    }
    function Ii(a, b, c, d) {
      var e = a.stateNode;
      e.props = c;
      e.state = a.memoizedState;
      e.refs = {};
      kh(a);
      var f = b.contextType;
      "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
      e.state = a.memoizedState;
      f = b.getDerivedStateFromProps;
      "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
      "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
      "function" === typeof e.componentDidMount && (a.flags |= 4194308);
    }
    function Ji(a, b) {
      try {
        var c = "", d = b;
        do
          c += Pa(d), d = d.return;
        while (d);
        var e = c;
      } catch (f) {
        e = "\nError generating stack: " + f.message + "\n" + f.stack;
      }
      return { value: a, source: b, stack: e, digest: null };
    }
    function Ki(a, b, c) {
      return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
    }
    function Li(a, b) {
      try {
        console.error(b.value);
      } catch (c) {
        setTimeout(function() {
          throw c;
        });
      }
    }
    var Mi = "function" === typeof WeakMap ? WeakMap : Map;
    function Ni(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      c.payload = { element: null };
      var d = b.value;
      c.callback = function() {
        Oi || (Oi = true, Pi = d);
        Li(a, b);
      };
      return c;
    }
    function Qi(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      var d = a.type.getDerivedStateFromError;
      if ("function" === typeof d) {
        var e = b.value;
        c.payload = function() {
          return d(e);
        };
        c.callback = function() {
          Li(a, b);
        };
      }
      var f = a.stateNode;
      null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
        Li(a, b);
        "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
        var c2 = b.stack;
        this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
      });
      return c;
    }
    function Si(a, b, c) {
      var d = a.pingCache;
      if (null === d) {
        d = a.pingCache = new Mi();
        var e = /* @__PURE__ */ new Set();
        d.set(b, e);
      } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
      e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
    }
    function Ui(a) {
      do {
        var b;
        if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
        if (b) return a;
        a = a.return;
      } while (null !== a);
      return null;
    }
    function Vi(a, b, c, d, e) {
      if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
      a.flags |= 65536;
      a.lanes = e;
      return a;
    }
    var Wi = ua.ReactCurrentOwner, dh = false;
    function Xi(a, b, c, d) {
      b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
    }
    function Yi(a, b, c, d, e) {
      c = c.render;
      var f = b.ref;
      ch(b, e);
      d = Nh(a, b, c, d, f, e);
      c = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && c && vg(b);
      b.flags |= 1;
      Xi(a, b, d, e);
      return b.child;
    }
    function $i(a, b, c, d, e) {
      if (null === a) {
        var f = c.type;
        if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
        a = Rg(c.type, null, d, b, b.mode, e);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      f = a.child;
      if (0 === (a.lanes & e)) {
        var g = f.memoizedProps;
        c = c.compare;
        c = null !== c ? c : Ie;
        if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
      }
      b.flags |= 1;
      a = Pg(f, d);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    function bj(a, b, c, d, e) {
      if (null !== a) {
        var f = a.memoizedProps;
        if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
        else return b.lanes = a.lanes, Zi(a, b, e);
      }
      return cj(a, b, c, d, e);
    }
    function dj(a, b, c) {
      var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
      if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
      else {
        if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
        b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        d = null !== f ? f.baseLanes : c;
        G(ej, fj);
        fj |= d;
      }
      else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
      Xi(a, b, e, c);
      return b.child;
    }
    function gj(a, b) {
      var c = b.ref;
      if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
    }
    function cj(a, b, c, d, e) {
      var f = Zf(c) ? Xf : H.current;
      f = Yf(b, f);
      ch(b, e);
      c = Nh(a, b, c, d, f, e);
      d = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && d && vg(b);
      b.flags |= 1;
      Xi(a, b, c, e);
      return b.child;
    }
    function hj(a, b, c, d, e) {
      if (Zf(c)) {
        var f = true;
        cg(b);
      } else f = false;
      ch(b, e);
      if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
      else if (null === a) {
        var g = b.stateNode, h = b.memoizedProps;
        g.props = h;
        var k = g.context, l = c.contextType;
        "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
        var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
        q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
        jh = false;
        var r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        k = b.memoizedState;
        h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
      } else {
        g = b.stateNode;
        lh(a, b);
        h = b.memoizedProps;
        l = b.type === b.elementType ? h : Ci(b.type, h);
        g.props = l;
        q = b.pendingProps;
        r = g.context;
        k = c.contextType;
        "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
        var y = c.getDerivedStateFromProps;
        (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
        jh = false;
        r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        var n = b.memoizedState;
        h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
      }
      return jj(a, b, c, d, f, e);
    }
    function jj(a, b, c, d, e, f) {
      gj(a, b);
      var g = 0 !== (b.flags & 128);
      if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
      d = b.stateNode;
      Wi.current = b;
      var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
      b.flags |= 1;
      null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
      b.memoizedState = d.state;
      e && dg(b, c, true);
      return b.child;
    }
    function kj(a) {
      var b = a.stateNode;
      b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
      yh(a, b.containerInfo);
    }
    function lj(a, b, c, d, e) {
      Ig();
      Jg(e);
      b.flags |= 256;
      Xi(a, b, c, d);
      return b.child;
    }
    var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
    function nj(a) {
      return { baseLanes: a, cachePool: null, transitions: null };
    }
    function oj(a, b, c) {
      var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
      (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
      if (h) f = true, b.flags &= -129;
      else if (null === a || null !== a.memoizedState) e |= 1;
      G(L, e & 1);
      if (null === a) {
        Eg(b);
        a = b.memoizedState;
        if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
        g = d.children;
        a = d.fallback;
        return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
      }
      e = a.memoizedState;
      if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
      if (f) {
        f = d.fallback;
        g = b.mode;
        e = a.child;
        h = e.sibling;
        var k = { mode: "hidden", children: d.children };
        0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
        null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
        f.return = b;
        d.return = b;
        d.sibling = f;
        b.child = d;
        d = f;
        f = b.child;
        g = a.child.memoizedState;
        g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
        f.memoizedState = g;
        f.childLanes = a.childLanes & ~c;
        b.memoizedState = mj;
        return d;
      }
      f = a.child;
      a = f.sibling;
      d = Pg(f, { mode: "visible", children: d.children });
      0 === (b.mode & 1) && (d.lanes = c);
      d.return = b;
      d.sibling = null;
      null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
      b.child = d;
      b.memoizedState = null;
      return d;
    }
    function qj(a, b) {
      b = pj({ mode: "visible", children: b }, a.mode, 0, null);
      b.return = a;
      return a.child = b;
    }
    function sj(a, b, c, d) {
      null !== d && Jg(d);
      Ug(b, a.child, null, c);
      a = qj(b, b.pendingProps.children);
      a.flags |= 2;
      b.memoizedState = null;
      return a;
    }
    function rj(a, b, c, d, e, f, g) {
      if (c) {
        if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
        if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
        f = d.fallback;
        e = b.mode;
        d = pj({ mode: "visible", children: d.children }, e, 0, null);
        f = Tg(f, e, g, null);
        f.flags |= 2;
        d.return = b;
        f.return = b;
        d.sibling = f;
        b.child = d;
        0 !== (b.mode & 1) && Ug(b, a.child, null, g);
        b.child.memoizedState = nj(g);
        b.memoizedState = mj;
        return f;
      }
      if (0 === (b.mode & 1)) return sj(a, b, g, null);
      if ("$!" === e.data) {
        d = e.nextSibling && e.nextSibling.dataset;
        if (d) var h = d.dgst;
        d = h;
        f = Error(p(419));
        d = Ki(f, d, void 0);
        return sj(a, b, g, d);
      }
      h = 0 !== (g & a.childLanes);
      if (dh || h) {
        d = Q;
        if (null !== d) {
          switch (g & -g) {
            case 4:
              e = 2;
              break;
            case 16:
              e = 8;
              break;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              e = 32;
              break;
            case 536870912:
              e = 268435456;
              break;
            default:
              e = 0;
          }
          e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
          0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
        }
        tj();
        d = Ki(Error(p(421)));
        return sj(a, b, g, d);
      }
      if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
      a = f.treeContext;
      yg = Lf(e.nextSibling);
      xg = b;
      I = true;
      zg = null;
      null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
      b = qj(b, d.children);
      b.flags |= 4096;
      return b;
    }
    function vj(a, b, c) {
      a.lanes |= b;
      var d = a.alternate;
      null !== d && (d.lanes |= b);
      bh(a.return, b, c);
    }
    function wj(a, b, c, d, e) {
      var f = a.memoizedState;
      null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
    }
    function xj(a, b, c) {
      var d = b.pendingProps, e = d.revealOrder, f = d.tail;
      Xi(a, b, d.children, c);
      d = L.current;
      if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
      else {
        if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
          if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
          else if (19 === a.tag) vj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b) break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b) break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
        d &= 1;
      }
      G(L, d);
      if (0 === (b.mode & 1)) b.memoizedState = null;
      else switch (e) {
        case "forwards":
          c = b.child;
          for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
          c = e;
          null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
          wj(b, false, e, c, f);
          break;
        case "backwards":
          c = null;
          e = b.child;
          for (b.child = null; null !== e; ) {
            a = e.alternate;
            if (null !== a && null === Ch(a)) {
              b.child = e;
              break;
            }
            a = e.sibling;
            e.sibling = c;
            c = e;
            e = a;
          }
          wj(b, true, c, null, f);
          break;
        case "together":
          wj(b, false, null, null, void 0);
          break;
        default:
          b.memoizedState = null;
      }
      return b.child;
    }
    function ij(a, b) {
      0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
    }
    function Zi(a, b, c) {
      null !== a && (b.dependencies = a.dependencies);
      rh |= b.lanes;
      if (0 === (c & b.childLanes)) return null;
      if (null !== a && b.child !== a.child) throw Error(p(153));
      if (null !== b.child) {
        a = b.child;
        c = Pg(a, a.pendingProps);
        b.child = c;
        for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
        c.sibling = null;
      }
      return b.child;
    }
    function yj(a, b, c) {
      switch (b.tag) {
        case 3:
          kj(b);
          Ig();
          break;
        case 5:
          Ah(b);
          break;
        case 1:
          Zf(b.type) && cg(b);
          break;
        case 4:
          yh(b, b.stateNode.containerInfo);
          break;
        case 10:
          var d = b.type._context, e = b.memoizedProps.value;
          G(Wg, d._currentValue);
          d._currentValue = e;
          break;
        case 13:
          d = b.memoizedState;
          if (null !== d) {
            if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
            if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
            G(L, L.current & 1);
            a = Zi(a, b, c);
            return null !== a ? a.sibling : null;
          }
          G(L, L.current & 1);
          break;
        case 19:
          d = 0 !== (c & b.childLanes);
          if (0 !== (a.flags & 128)) {
            if (d) return xj(a, b, c);
            b.flags |= 128;
          }
          e = b.memoizedState;
          null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
          G(L, L.current);
          if (d) break;
          else return null;
        case 22:
        case 23:
          return b.lanes = 0, dj(a, b, c);
      }
      return Zi(a, b, c);
    }
    var zj, Aj, Bj, Cj;
    zj = function(a, b) {
      for (var c = b.child; null !== c; ) {
        if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
        else if (4 !== c.tag && null !== c.child) {
          c.child.return = c;
          c = c.child;
          continue;
        }
        if (c === b) break;
        for (; null === c.sibling; ) {
          if (null === c.return || c.return === b) return;
          c = c.return;
        }
        c.sibling.return = c.return;
        c = c.sibling;
      }
    };
    Aj = function() {
    };
    Bj = function(a, b, c, d) {
      var e = a.memoizedProps;
      if (e !== d) {
        a = b.stateNode;
        xh(uh.current);
        var f = null;
        switch (c) {
          case "input":
            e = Ya(a, e);
            d = Ya(a, d);
            f = [];
            break;
          case "select":
            e = A({}, e, { value: void 0 });
            d = A({}, d, { value: void 0 });
            f = [];
            break;
          case "textarea":
            e = gb(a, e);
            d = gb(a, d);
            f = [];
            break;
          default:
            "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
        }
        ub(c, d);
        var g;
        c = null;
        for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
          var h = e[l];
          for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
        for (l in d) {
          var k = d[l];
          h = null != e ? e[l] : void 0;
          if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
            for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
          } else c || (f || (f = []), f.push(
            l,
            c
          )), c = k;
          else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
        }
        c && (f = f || []).push("style", c);
        var l = f;
        if (b.updateQueue = l) b.flags |= 4;
      }
    };
    Cj = function(a, b, c, d) {
      c !== d && (b.flags |= 4);
    };
    function Dj(a, b) {
      if (!I) switch (a.tailMode) {
        case "hidden":
          b = a.tail;
          for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
          null === c ? a.tail = null : c.sibling = null;
          break;
        case "collapsed":
          c = a.tail;
          for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
          null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
      }
    }
    function S(a) {
      var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
      if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
      else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
      a.subtreeFlags |= d;
      a.childLanes = c;
      return b;
    }
    function Ej(a, b, c) {
      var d = b.pendingProps;
      wg(b);
      switch (b.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return S(b), null;
        case 1:
          return Zf(b.type) && $f(), S(b), null;
        case 3:
          d = b.stateNode;
          zh();
          E(Wf);
          E(H);
          Eh();
          d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
          if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
          Aj(a, b);
          S(b);
          return null;
        case 5:
          Bh(b);
          var e = xh(wh.current);
          c = b.type;
          if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          else {
            if (!d) {
              if (null === b.stateNode) throw Error(p(166));
              S(b);
              return null;
            }
            a = xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.type;
              var f = b.memoizedProps;
              d[Of] = b;
              d[Pf] = f;
              a = 0 !== (b.mode & 1);
              switch (c) {
                case "dialog":
                  D("cancel", d);
                  D("close", d);
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", d);
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D(lf[e], d);
                  break;
                case "source":
                  D("error", d);
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    d
                  );
                  D("load", d);
                  break;
                case "details":
                  D("toggle", d);
                  break;
                case "input":
                  Za(d, f);
                  D("invalid", d);
                  break;
                case "select":
                  d._wrapperState = { wasMultiple: !!f.multiple };
                  D("invalid", d);
                  break;
                case "textarea":
                  hb(d, f), D("invalid", d);
              }
              ub(c, f);
              e = null;
              for (var g in f) if (f.hasOwnProperty(g)) {
                var h = f[g];
                "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                  d.textContent,
                  h,
                  a
                ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
              }
              switch (c) {
                case "input":
                  Va(d);
                  db2(d, f, true);
                  break;
                case "textarea":
                  Va(d);
                  jb(d);
                  break;
                case "select":
                case "option":
                  break;
                default:
                  "function" === typeof f.onClick && (d.onclick = Bf);
              }
              d = e;
              b.updateQueue = d;
              null !== d && (b.flags |= 4);
            } else {
              g = 9 === e.nodeType ? e : e.ownerDocument;
              "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
              "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
              a[Of] = b;
              a[Pf] = d;
              zj(a, b, false, false);
              b.stateNode = a;
              a: {
                g = vb(c, d);
                switch (c) {
                  case "dialog":
                    D("cancel", a);
                    D("close", a);
                    e = d;
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", a);
                    e = d;
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], a);
                    e = d;
                    break;
                  case "source":
                    D("error", a);
                    e = d;
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      a
                    );
                    D("load", a);
                    e = d;
                    break;
                  case "details":
                    D("toggle", a);
                    e = d;
                    break;
                  case "input":
                    Za(a, d);
                    e = Ya(a, d);
                    D("invalid", a);
                    break;
                  case "option":
                    e = d;
                    break;
                  case "select":
                    a._wrapperState = { wasMultiple: !!d.multiple };
                    e = A({}, d, { value: void 0 });
                    D("invalid", a);
                    break;
                  case "textarea":
                    hb(a, d);
                    e = gb(a, d);
                    D("invalid", a);
                    break;
                  default:
                    e = d;
                }
                ub(c, e);
                h = e;
                for (f in h) if (h.hasOwnProperty(f)) {
                  var k = h[f];
                  "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
                }
                switch (c) {
                  case "input":
                    Va(a);
                    db2(a, d, false);
                    break;
                  case "textarea":
                    Va(a);
                    jb(a);
                    break;
                  case "option":
                    null != d.value && a.setAttribute("value", "" + Sa(d.value));
                    break;
                  case "select":
                    a.multiple = !!d.multiple;
                    f = d.value;
                    null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                      a,
                      !!d.multiple,
                      d.defaultValue,
                      true
                    );
                    break;
                  default:
                    "function" === typeof e.onClick && (a.onclick = Bf);
                }
                switch (c) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d = !!d.autoFocus;
                    break a;
                  case "img":
                    d = true;
                    break a;
                  default:
                    d = false;
                }
              }
              d && (b.flags |= 4);
            }
            null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          }
          S(b);
          return null;
        case 6:
          if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
          else {
            if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
            c = xh(wh.current);
            xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.memoizedProps;
              d[Of] = b;
              if (f = d.nodeValue !== c) {
                if (a = xg, null !== a) switch (a.tag) {
                  case 3:
                    Af(d.nodeValue, c, 0 !== (a.mode & 1));
                    break;
                  case 5:
                    true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                }
              }
              f && (b.flags |= 4);
            } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
          }
          S(b);
          return null;
        case 13:
          E(L);
          d = b.memoizedState;
          if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
            if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
            else if (f = Gg(b), null !== d && null !== d.dehydrated) {
              if (null === a) {
                if (!f) throw Error(p(318));
                f = b.memoizedState;
                f = null !== f ? f.dehydrated : null;
                if (!f) throw Error(p(317));
                f[Of] = b;
              } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
              S(b);
              f = false;
            } else null !== zg && (Fj(zg), zg = null), f = true;
            if (!f) return b.flags & 65536 ? b : null;
          }
          if (0 !== (b.flags & 128)) return b.lanes = c, b;
          d = null !== d;
          d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
          null !== b.updateQueue && (b.flags |= 4);
          S(b);
          return null;
        case 4:
          return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
        case 10:
          return ah(b.type._context), S(b), null;
        case 17:
          return Zf(b.type) && $f(), S(b), null;
        case 19:
          E(L);
          f = b.memoizedState;
          if (null === f) return S(b), null;
          d = 0 !== (b.flags & 128);
          g = f.rendering;
          if (null === g) if (d) Dj(f, false);
          else {
            if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
              g = Ch(a);
              if (null !== g) {
                b.flags |= 128;
                Dj(f, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G(L, L.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
            null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
          }
          else {
            if (!d) if (a = Ch(g), null !== a) {
              if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
            } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
            f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
          }
          if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
          S(b);
          return null;
        case 22:
        case 23:
          return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
        case 24:
          return null;
        case 25:
          return null;
      }
      throw Error(p(156, b.tag));
    }
    function Ij(a, b) {
      wg(b);
      switch (b.tag) {
        case 1:
          return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 3:
          return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
        case 5:
          return Bh(b), null;
        case 13:
          E(L);
          a = b.memoizedState;
          if (null !== a && null !== a.dehydrated) {
            if (null === b.alternate) throw Error(p(340));
            Ig();
          }
          a = b.flags;
          return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 19:
          return E(L), null;
        case 4:
          return zh(), null;
        case 10:
          return ah(b.type._context), null;
        case 22:
        case 23:
          return Hj(), null;
        case 24:
          return null;
        default:
          return null;
      }
    }
    var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
    function Lj(a, b) {
      var c = a.ref;
      if (null !== c) if ("function" === typeof c) try {
        c(null);
      } catch (d) {
        W(a, b, d);
      }
      else c.current = null;
    }
    function Mj(a, b, c) {
      try {
        c();
      } catch (d) {
        W(a, b, d);
      }
    }
    var Nj = false;
    function Oj(a, b) {
      Cf = dd;
      a = Me();
      if (Ne(a)) {
        if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
        else a: {
          c = (c = a.ownerDocument) && c.defaultView || window;
          var d = c.getSelection && c.getSelection();
          if (d && 0 !== d.rangeCount) {
            c = d.anchorNode;
            var e = d.anchorOffset, f = d.focusNode;
            d = d.focusOffset;
            try {
              c.nodeType, f.nodeType;
            } catch (F) {
              c = null;
              break a;
            }
            var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
            b: for (; ; ) {
              for (var y; ; ) {
                q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
                q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
                3 === q.nodeType && (g += q.nodeValue.length);
                if (null === (y = q.firstChild)) break;
                r = q;
                q = y;
              }
              for (; ; ) {
                if (q === a) break b;
                r === c && ++l === e && (h = g);
                r === f && ++m === d && (k = g);
                if (null !== (y = q.nextSibling)) break;
                q = r;
                r = q.parentNode;
              }
              q = y;
            }
            c = -1 === h || -1 === k ? null : { start: h, end: k };
          } else c = null;
        }
        c = c || { start: 0, end: 0 };
      } else c = null;
      Df = { focusedElem: a, selectionRange: c };
      dd = false;
      for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
      else for (; null !== V; ) {
        b = V;
        try {
          var n = b.alternate;
          if (0 !== (b.flags & 1024)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              break;
            case 1:
              if (null !== n) {
                var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
                x.__reactInternalSnapshotBeforeUpdate = w;
              }
              break;
            case 3:
              var u = b.stateNode.containerInfo;
              1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
              break;
            case 5:
            case 6:
            case 4:
            case 17:
              break;
            default:
              throw Error(p(163));
          }
        } catch (F) {
          W(b, b.return, F);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V = a;
          break;
        }
        V = b.return;
      }
      n = Nj;
      Nj = false;
      return n;
    }
    function Pj(a, b, c) {
      var d = b.updateQueue;
      d = null !== d ? d.lastEffect : null;
      if (null !== d) {
        var e = d = d.next;
        do {
          if ((e.tag & a) === a) {
            var f = e.destroy;
            e.destroy = void 0;
            void 0 !== f && Mj(b, c, f);
          }
          e = e.next;
        } while (e !== d);
      }
    }
    function Qj(a, b) {
      b = b.updateQueue;
      b = null !== b ? b.lastEffect : null;
      if (null !== b) {
        var c = b = b.next;
        do {
          if ((c.tag & a) === a) {
            var d = c.create;
            c.destroy = d();
          }
          c = c.next;
        } while (c !== b);
      }
    }
    function Rj(a) {
      var b = a.ref;
      if (null !== b) {
        var c = a.stateNode;
        switch (a.tag) {
          case 5:
            a = c;
            break;
          default:
            a = c;
        }
        "function" === typeof b ? b(a) : b.current = a;
      }
    }
    function Sj(a) {
      var b = a.alternate;
      null !== b && (a.alternate = null, Sj(b));
      a.child = null;
      a.deletions = null;
      a.sibling = null;
      5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
      a.stateNode = null;
      a.return = null;
      a.dependencies = null;
      a.memoizedProps = null;
      a.memoizedState = null;
      a.pendingProps = null;
      a.stateNode = null;
      a.updateQueue = null;
    }
    function Tj(a) {
      return 5 === a.tag || 3 === a.tag || 4 === a.tag;
    }
    function Uj(a) {
      a: for (; ; ) {
        for (; null === a.sibling; ) {
          if (null === a.return || Tj(a.return)) return null;
          a = a.return;
        }
        a.sibling.return = a.return;
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
          if (a.flags & 2) continue a;
          if (null === a.child || 4 === a.tag) continue a;
          else a.child.return = a, a = a.child;
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function Vj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
      else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
    }
    function Wj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
      else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
    }
    var X = null, Xj = false;
    function Yj(a, b, c) {
      for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
    }
    function Zj(a, b, c) {
      if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
        lc.onCommitFiberUnmount(kc, c);
      } catch (h) {
      }
      switch (c.tag) {
        case 5:
          U || Lj(c, b);
        case 6:
          var d = X, e = Xj;
          X = null;
          Yj(a, b, c);
          X = d;
          Xj = e;
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
          break;
        case 18:
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
          break;
        case 4:
          d = X;
          e = Xj;
          X = c.stateNode.containerInfo;
          Xj = true;
          Yj(a, b, c);
          X = d;
          Xj = e;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
            e = d = d.next;
            do {
              var f = e, g = f.destroy;
              f = f.tag;
              void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
              e = e.next;
            } while (e !== d);
          }
          Yj(a, b, c);
          break;
        case 1:
          if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
            d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
          } catch (h) {
            W(c, b, h);
          }
          Yj(a, b, c);
          break;
        case 21:
          Yj(a, b, c);
          break;
        case 22:
          c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
          break;
        default:
          Yj(a, b, c);
      }
    }
    function ak(a) {
      var b = a.updateQueue;
      if (null !== b) {
        a.updateQueue = null;
        var c = a.stateNode;
        null === c && (c = a.stateNode = new Kj());
        b.forEach(function(b2) {
          var d = bk.bind(null, a, b2);
          c.has(b2) || (c.add(b2), b2.then(d, d));
        });
      }
    }
    function ck(a, b) {
      var c = b.deletions;
      if (null !== c) for (var d = 0; d < c.length; d++) {
        var e = c[d];
        try {
          var f = a, g = b, h = g;
          a: for (; null !== h; ) {
            switch (h.tag) {
              case 5:
                X = h.stateNode;
                Xj = false;
                break a;
              case 3:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
              case 4:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
            }
            h = h.return;
          }
          if (null === X) throw Error(p(160));
          Zj(f, g, e);
          X = null;
          Xj = false;
          var k = e.alternate;
          null !== k && (k.return = null);
          e.return = null;
        } catch (l) {
          W(e, b, l);
        }
      }
      if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
    }
    function dk(a, b) {
      var c = a.alternate, d = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ck(b, a);
          ek(a);
          if (d & 4) {
            try {
              Pj(3, a, a.return), Qj(3, a);
            } catch (t) {
              W(a, a.return, t);
            }
            try {
              Pj(5, a, a.return);
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 1:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          break;
        case 5:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          if (a.flags & 32) {
            var e = a.stateNode;
            try {
              ob(e, "");
            } catch (t) {
              W(a, a.return, t);
            }
          }
          if (d & 4 && (e = a.stateNode, null != e)) {
            var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
            a.updateQueue = null;
            if (null !== k) try {
              "input" === h && "radio" === f.type && null != f.name && ab(e, f);
              vb(h, g);
              var l = vb(h, f);
              for (g = 0; g < k.length; g += 2) {
                var m = k[g], q = k[g + 1];
                "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
              }
              switch (h) {
                case "input":
                  bb(e, f);
                  break;
                case "textarea":
                  ib(e, f);
                  break;
                case "select":
                  var r = e._wrapperState.wasMultiple;
                  e._wrapperState.wasMultiple = !!f.multiple;
                  var y = f.value;
                  null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                    e,
                    !!f.multiple,
                    f.defaultValue,
                    true
                  ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
              }
              e[Pf] = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 6:
          ck(b, a);
          ek(a);
          if (d & 4) {
            if (null === a.stateNode) throw Error(p(162));
            e = a.stateNode;
            f = a.memoizedProps;
            try {
              e.nodeValue = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 3:
          ck(b, a);
          ek(a);
          if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
            bd(b.containerInfo);
          } catch (t) {
            W(a, a.return, t);
          }
          break;
        case 4:
          ck(b, a);
          ek(a);
          break;
        case 13:
          ck(b, a);
          ek(a);
          e = a.child;
          e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
          d & 4 && ak(a);
          break;
        case 22:
          m = null !== c && null !== c.memoizedState;
          a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
          ek(a);
          if (d & 8192) {
            l = null !== a.memoizedState;
            if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
              for (q = V = m; null !== V; ) {
                r = V;
                y = r.child;
                switch (r.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    Pj(4, r, r.return);
                    break;
                  case 1:
                    Lj(r, r.return);
                    var n = r.stateNode;
                    if ("function" === typeof n.componentWillUnmount) {
                      d = r;
                      c = r.return;
                      try {
                        b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                      } catch (t) {
                        W(d, c, t);
                      }
                    }
                    break;
                  case 5:
                    Lj(r, r.return);
                    break;
                  case 22:
                    if (null !== r.memoizedState) {
                      gk(q);
                      continue;
                    }
                }
                null !== y ? (y.return = r, V = y) : gk(q);
              }
              m = m.sibling;
            }
            a: for (m = null, q = a; ; ) {
              if (5 === q.tag) {
                if (null === m) {
                  m = q;
                  try {
                    e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                  } catch (t) {
                    W(a, a.return, t);
                  }
                }
              } else if (6 === q.tag) {
                if (null === m) try {
                  q.stateNode.nodeValue = l ? "" : q.memoizedProps;
                } catch (t) {
                  W(a, a.return, t);
                }
              } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
                q.child.return = q;
                q = q.child;
                continue;
              }
              if (q === a) break a;
              for (; null === q.sibling; ) {
                if (null === q.return || q.return === a) break a;
                m === q && (m = null);
                q = q.return;
              }
              m === q && (m = null);
              q.sibling.return = q.return;
              q = q.sibling;
            }
          }
          break;
        case 19:
          ck(b, a);
          ek(a);
          d & 4 && ak(a);
          break;
        case 21:
          break;
        default:
          ck(
            b,
            a
          ), ek(a);
      }
    }
    function ek(a) {
      var b = a.flags;
      if (b & 2) {
        try {
          a: {
            for (var c = a.return; null !== c; ) {
              if (Tj(c)) {
                var d = c;
                break a;
              }
              c = c.return;
            }
            throw Error(p(160));
          }
          switch (d.tag) {
            case 5:
              var e = d.stateNode;
              d.flags & 32 && (ob(e, ""), d.flags &= -33);
              var f = Uj(a);
              Wj(a, f, e);
              break;
            case 3:
            case 4:
              var g = d.stateNode.containerInfo, h = Uj(a);
              Vj(a, h, g);
              break;
            default:
              throw Error(p(161));
          }
        } catch (k) {
          W(a, a.return, k);
        }
        a.flags &= -3;
      }
      b & 4096 && (a.flags &= -4097);
    }
    function hk(a, b, c) {
      V = a;
      ik(a);
    }
    function ik(a, b, c) {
      for (var d = 0 !== (a.mode & 1); null !== V; ) {
        var e = V, f = e.child;
        if (22 === e.tag && d) {
          var g = null !== e.memoizedState || Jj;
          if (!g) {
            var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
            h = Jj;
            var l = U;
            Jj = g;
            if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
            for (; null !== f; ) V = f, ik(f), f = f.sibling;
            V = e;
            Jj = h;
            U = l;
          }
          kk(a);
        } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a);
      }
    }
    function kk(a) {
      for (; null !== V; ) {
        var b = V;
        if (0 !== (b.flags & 8772)) {
          var c = b.alternate;
          try {
            if (0 !== (b.flags & 8772)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                U || Qj(5, b);
                break;
              case 1:
                var d = b.stateNode;
                if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                else {
                  var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                  d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
                var f = b.updateQueue;
                null !== f && sh(b, f, d);
                break;
              case 3:
                var g = b.updateQueue;
                if (null !== g) {
                  c = null;
                  if (null !== b.child) switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                  sh(b, g, c);
                }
                break;
              case 5:
                var h = b.stateNode;
                if (null === c && b.flags & 4) {
                  c = h;
                  var k = b.memoizedProps;
                  switch (b.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k.autoFocus && c.focus();
                      break;
                    case "img":
                      k.src && (c.src = k.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (null === b.memoizedState) {
                  var l = b.alternate;
                  if (null !== l) {
                    var m = l.memoizedState;
                    if (null !== m) {
                      var q = m.dehydrated;
                      null !== q && bd(q);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(p(163));
            }
            U || b.flags & 512 && Rj(b);
          } catch (r) {
            W(b, b.return, r);
          }
        }
        if (b === a) {
          V = null;
          break;
        }
        c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function gk(a) {
      for (; null !== V; ) {
        var b = V;
        if (b === a) {
          V = null;
          break;
        }
        var c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function jk(a) {
      for (; null !== V; ) {
        var b = V;
        try {
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              var c = b.return;
              try {
                Qj(4, b);
              } catch (k) {
                W(b, c, k);
              }
              break;
            case 1:
              var d = b.stateNode;
              if ("function" === typeof d.componentDidMount) {
                var e = b.return;
                try {
                  d.componentDidMount();
                } catch (k) {
                  W(b, e, k);
                }
              }
              var f = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, f, k);
              }
              break;
            case 5:
              var g = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, g, k);
              }
          }
        } catch (k) {
          W(b, b.return, k);
        }
        if (b === a) {
          V = null;
          break;
        }
        var h = b.sibling;
        if (null !== h) {
          h.return = b.return;
          V = h;
          break;
        }
        V = b.return;
      }
    }
    var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
    function R() {
      return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
    }
    function yi(a) {
      if (0 === (a.mode & 1)) return 1;
      if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
      if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
      a = C;
      if (0 !== a) return a;
      a = window.event;
      a = void 0 === a ? 16 : jd(a.type);
      return a;
    }
    function gi(a, b, c, d) {
      if (50 < yk) throw yk = 0, zk = null, Error(p(185));
      Ac(a, c, d);
      if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
    }
    function Dk(a, b) {
      var c = a.callbackNode;
      wc(a, b);
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
      else if (b = d & -d, a.callbackPriority !== b) {
        null != c && bc(c);
        if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
          0 === (K & 6) && jg();
        }), c = null;
        else {
          switch (Dc(d)) {
            case 1:
              c = fc;
              break;
            case 4:
              c = gc;
              break;
            case 16:
              c = hc;
              break;
            case 536870912:
              c = jc;
              break;
            default:
              c = hc;
          }
          c = Fk(c, Gk.bind(null, a));
        }
        a.callbackPriority = b;
        a.callbackNode = c;
      }
    }
    function Gk(a, b) {
      Ak = -1;
      Bk = 0;
      if (0 !== (K & 6)) throw Error(p(327));
      var c = a.callbackNode;
      if (Hk() && a.callbackNode !== c) return null;
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) return null;
      if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
      else {
        b = d;
        var e = K;
        K |= 2;
        var f = Jk();
        if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
        do
          try {
            Lk();
            break;
          } catch (h) {
            Mk(a, h);
          }
        while (1);
        $g();
        mk.current = f;
        K = e;
        null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
      }
      if (0 !== b) {
        2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
        if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
        if (6 === b) Ck(a, d);
        else {
          e = a.current.alternate;
          if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          a.finishedWork = e;
          a.finishedLanes = d;
          switch (b) {
            case 0:
            case 1:
              throw Error(p(345));
            case 2:
              Pk(a, tk, uk);
              break;
            case 3:
              Ck(a, d);
              if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                if (0 !== uc(a, 0)) break;
                e = a.suspendedLanes;
                if ((e & d) !== d) {
                  R();
                  a.pingedLanes |= a.suspendedLanes & e;
                  break;
                }
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 4:
              Ck(a, d);
              if ((d & 4194240) === d) break;
              b = a.eventTimes;
              for (e = -1; 0 < d; ) {
                var g = 31 - oc(d);
                f = 1 << g;
                g = b[g];
                g > e && (e = g);
                d &= ~f;
              }
              d = e;
              d = B() - d;
              d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
              if (10 < d) {
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 5:
              Pk(a, tk, uk);
              break;
            default:
              throw Error(p(329));
          }
        }
      }
      Dk(a, B());
      return a.callbackNode === c ? Gk.bind(null, a) : null;
    }
    function Nk(a, b) {
      var c = sk;
      a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
      a = Ik(a, b);
      2 !== a && (b = tk, tk = c, null !== b && Fj(b));
      return a;
    }
    function Fj(a) {
      null === tk ? tk = a : tk.push.apply(tk, a);
    }
    function Ok(a) {
      for (var b = a; ; ) {
        if (b.flags & 16384) {
          var c = b.updateQueue;
          if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
            var e = c[d], f = e.getSnapshot;
            e = e.value;
            try {
              if (!He(f(), e)) return false;
            } catch (g) {
              return false;
            }
          }
        }
        c = b.child;
        if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
        else {
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return true;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
      }
      return true;
    }
    function Ck(a, b) {
      b &= ~rk;
      b &= ~qk;
      a.suspendedLanes |= b;
      a.pingedLanes &= ~b;
      for (a = a.expirationTimes; 0 < b; ) {
        var c = 31 - oc(b), d = 1 << c;
        a[c] = -1;
        b &= ~d;
      }
    }
    function Ek(a) {
      if (0 !== (K & 6)) throw Error(p(327));
      Hk();
      var b = uc(a, 0);
      if (0 === (b & 1)) return Dk(a, B()), null;
      var c = Ik(a, b);
      if (0 !== a.tag && 2 === c) {
        var d = xc(a);
        0 !== d && (b = d, c = Nk(a, d));
      }
      if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
      if (6 === c) throw Error(p(345));
      a.finishedWork = a.current.alternate;
      a.finishedLanes = b;
      Pk(a, tk, uk);
      Dk(a, B());
      return null;
    }
    function Qk(a, b) {
      var c = K;
      K |= 1;
      try {
        return a(b);
      } finally {
        K = c, 0 === K && (Gj = B() + 500, fg && jg());
      }
    }
    function Rk(a) {
      null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
      var b = K;
      K |= 1;
      var c = ok.transition, d = C;
      try {
        if (ok.transition = null, C = 1, a) return a();
      } finally {
        C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
      }
    }
    function Hj() {
      fj = ej.current;
      E(ej);
    }
    function Kk(a, b) {
      a.finishedWork = null;
      a.finishedLanes = 0;
      var c = a.timeoutHandle;
      -1 !== c && (a.timeoutHandle = -1, Gf(c));
      if (null !== Y) for (c = Y.return; null !== c; ) {
        var d = c;
        wg(d);
        switch (d.tag) {
          case 1:
            d = d.type.childContextTypes;
            null !== d && void 0 !== d && $f();
            break;
          case 3:
            zh();
            E(Wf);
            E(H);
            Eh();
            break;
          case 5:
            Bh(d);
            break;
          case 4:
            zh();
            break;
          case 13:
            E(L);
            break;
          case 19:
            E(L);
            break;
          case 10:
            ah(d.type._context);
            break;
          case 22:
          case 23:
            Hj();
        }
        c = c.return;
      }
      Q = a;
      Y = a = Pg(a.current, null);
      Z = fj = b;
      T = 0;
      pk = null;
      rk = qk = rh = 0;
      tk = sk = null;
      if (null !== fh) {
        for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
          c.interleaved = null;
          var e = d.next, f = c.pending;
          if (null !== f) {
            var g = f.next;
            f.next = e;
            d.next = g;
          }
          c.pending = d;
        }
        fh = null;
      }
      return a;
    }
    function Mk(a, b) {
      do {
        var c = Y;
        try {
          $g();
          Fh.current = Rh;
          if (Ih) {
            for (var d = M.memoizedState; null !== d; ) {
              var e = d.queue;
              null !== e && (e.pending = null);
              d = d.next;
            }
            Ih = false;
          }
          Hh = 0;
          O = N = M = null;
          Jh = false;
          Kh = 0;
          nk.current = null;
          if (null === c || null === c.return) {
            T = 1;
            pk = b;
            Y = null;
            break;
          }
          a: {
            var f = a, g = c.return, h = c, k = b;
            b = Z;
            h.flags |= 32768;
            if (null !== k && "object" === typeof k && "function" === typeof k.then) {
              var l = k, m = h, q = m.tag;
              if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                var r = m.alternate;
                r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
              }
              var y = Ui(g);
              if (null !== y) {
                y.flags &= -257;
                Vi(y, g, h, f, b);
                y.mode & 1 && Si(f, l, b);
                b = y;
                k = l;
                var n = b.updateQueue;
                if (null === n) {
                  var t = /* @__PURE__ */ new Set();
                  t.add(k);
                  b.updateQueue = t;
                } else n.add(k);
                break a;
              } else {
                if (0 === (b & 1)) {
                  Si(f, l, b);
                  tj();
                  break a;
                }
                k = Error(p(426));
              }
            } else if (I && h.mode & 1) {
              var J = Ui(g);
              if (null !== J) {
                0 === (J.flags & 65536) && (J.flags |= 256);
                Vi(J, g, h, f, b);
                Jg(Ji(k, h));
                break a;
              }
            }
            f = k = Ji(k, h);
            4 !== T && (T = 2);
            null === sk ? sk = [f] : sk.push(f);
            f = g;
            do {
              switch (f.tag) {
                case 3:
                  f.flags |= 65536;
                  b &= -b;
                  f.lanes |= b;
                  var x = Ni(f, k, b);
                  ph(f, x);
                  break a;
                case 1:
                  h = k;
                  var w = f.type, u = f.stateNode;
                  if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                    f.flags |= 65536;
                    b &= -b;
                    f.lanes |= b;
                    var F = Qi(f, h, b);
                    ph(f, F);
                    break a;
                  }
              }
              f = f.return;
            } while (null !== f);
          }
          Sk(c);
        } catch (na) {
          b = na;
          Y === c && null !== c && (Y = c = c.return);
          continue;
        }
        break;
      } while (1);
    }
    function Jk() {
      var a = mk.current;
      mk.current = Rh;
      return null === a ? Rh : a;
    }
    function tj() {
      if (0 === T || 3 === T || 2 === T) T = 4;
      null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
    }
    function Ik(a, b) {
      var c = K;
      K |= 2;
      var d = Jk();
      if (Q !== a || Z !== b) uk = null, Kk(a, b);
      do
        try {
          Tk();
          break;
        } catch (e) {
          Mk(a, e);
        }
      while (1);
      $g();
      K = c;
      mk.current = d;
      if (null !== Y) throw Error(p(261));
      Q = null;
      Z = 0;
      return T;
    }
    function Tk() {
      for (; null !== Y; ) Uk(Y);
    }
    function Lk() {
      for (; null !== Y && !cc(); ) Uk(Y);
    }
    function Uk(a) {
      var b = Vk(a.alternate, a, fj);
      a.memoizedProps = a.pendingProps;
      null === b ? Sk(a) : Y = b;
      nk.current = null;
    }
    function Sk(a) {
      var b = a;
      do {
        var c = b.alternate;
        a = b.return;
        if (0 === (b.flags & 32768)) {
          if (c = Ej(c, b, fj), null !== c) {
            Y = c;
            return;
          }
        } else {
          c = Ij(c, b);
          if (null !== c) {
            c.flags &= 32767;
            Y = c;
            return;
          }
          if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
          else {
            T = 6;
            Y = null;
            return;
          }
        }
        b = b.sibling;
        if (null !== b) {
          Y = b;
          return;
        }
        Y = b = a;
      } while (null !== b);
      0 === T && (T = 5);
    }
    function Pk(a, b, c) {
      var d = C, e = ok.transition;
      try {
        ok.transition = null, C = 1, Wk(a, b, c, d);
      } finally {
        ok.transition = e, C = d;
      }
      return null;
    }
    function Wk(a, b, c, d) {
      do
        Hk();
      while (null !== wk);
      if (0 !== (K & 6)) throw Error(p(327));
      c = a.finishedWork;
      var e = a.finishedLanes;
      if (null === c) return null;
      a.finishedWork = null;
      a.finishedLanes = 0;
      if (c === a.current) throw Error(p(177));
      a.callbackNode = null;
      a.callbackPriority = 0;
      var f = c.lanes | c.childLanes;
      Bc(a, f);
      a === Q && (Y = Q = null, Z = 0);
      0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
        Hk();
        return null;
      }));
      f = 0 !== (c.flags & 15990);
      if (0 !== (c.subtreeFlags & 15990) || f) {
        f = ok.transition;
        ok.transition = null;
        var g = C;
        C = 1;
        var h = K;
        K |= 4;
        nk.current = null;
        Oj(a, c);
        dk(c, a);
        Oe(Df);
        dd = !!Cf;
        Df = Cf = null;
        a.current = c;
        hk(c);
        dc();
        K = h;
        C = g;
        ok.transition = f;
      } else a.current = c;
      vk && (vk = false, wk = a, xk = e);
      f = a.pendingLanes;
      0 === f && (Ri = null);
      mc(c.stateNode);
      Dk(a, B());
      if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
      if (Oi) throw Oi = false, a = Pi, Pi = null, a;
      0 !== (xk & 1) && 0 !== a.tag && Hk();
      f = a.pendingLanes;
      0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
      jg();
      return null;
    }
    function Hk() {
      if (null !== wk) {
        var a = Dc(xk), b = ok.transition, c = C;
        try {
          ok.transition = null;
          C = 16 > a ? 16 : a;
          if (null === wk) var d = false;
          else {
            a = wk;
            wk = null;
            xk = 0;
            if (0 !== (K & 6)) throw Error(p(331));
            var e = K;
            K |= 4;
            for (V = a.current; null !== V; ) {
              var f = V, g = f.child;
              if (0 !== (V.flags & 16)) {
                var h = f.deletions;
                if (null !== h) {
                  for (var k = 0; k < h.length; k++) {
                    var l = h[k];
                    for (V = l; null !== V; ) {
                      var m = V;
                      switch (m.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Pj(8, m, f);
                      }
                      var q = m.child;
                      if (null !== q) q.return = m, V = q;
                      else for (; null !== V; ) {
                        m = V;
                        var r = m.sibling, y = m.return;
                        Sj(m);
                        if (m === l) {
                          V = null;
                          break;
                        }
                        if (null !== r) {
                          r.return = y;
                          V = r;
                          break;
                        }
                        V = y;
                      }
                    }
                  }
                  var n = f.alternate;
                  if (null !== n) {
                    var t = n.child;
                    if (null !== t) {
                      n.child = null;
                      do {
                        var J = t.sibling;
                        t.sibling = null;
                        t = J;
                      } while (null !== t);
                    }
                  }
                  V = f;
                }
              }
              if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
              else b: for (; null !== V; ) {
                f = V;
                if (0 !== (f.flags & 2048)) switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pj(9, f, f.return);
                }
                var x = f.sibling;
                if (null !== x) {
                  x.return = f.return;
                  V = x;
                  break b;
                }
                V = f.return;
              }
            }
            var w = a.current;
            for (V = w; null !== V; ) {
              g = V;
              var u = g.child;
              if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
              else b: for (g = w; null !== V; ) {
                h = V;
                if (0 !== (h.flags & 2048)) try {
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, h);
                  }
                } catch (na) {
                  W(h, h.return, na);
                }
                if (h === g) {
                  V = null;
                  break b;
                }
                var F = h.sibling;
                if (null !== F) {
                  F.return = h.return;
                  V = F;
                  break b;
                }
                V = h.return;
              }
            }
            K = e;
            jg();
            if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
              lc.onPostCommitFiberRoot(kc, a);
            } catch (na) {
            }
            d = true;
          }
          return d;
        } finally {
          C = c, ok.transition = b;
        }
      }
      return false;
    }
    function Xk(a, b, c) {
      b = Ji(c, b);
      b = Ni(a, b, 1);
      a = nh(a, b, 1);
      b = R();
      null !== a && (Ac(a, 1, b), Dk(a, b));
    }
    function W(a, b, c) {
      if (3 === a.tag) Xk(a, a, c);
      else for (; null !== b; ) {
        if (3 === b.tag) {
          Xk(b, a, c);
          break;
        } else if (1 === b.tag) {
          var d = b.stateNode;
          if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
            a = Ji(c, a);
            a = Qi(b, a, 1);
            b = nh(b, a, 1);
            a = R();
            null !== b && (Ac(b, 1, a), Dk(b, a));
            break;
          }
        }
        b = b.return;
      }
    }
    function Ti(a, b, c) {
      var d = a.pingCache;
      null !== d && d.delete(b);
      b = R();
      a.pingedLanes |= a.suspendedLanes & c;
      Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
      Dk(a, b);
    }
    function Yk(a, b) {
      0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
      var c = R();
      a = ih(a, b);
      null !== a && (Ac(a, b, c), Dk(a, c));
    }
    function uj(a) {
      var b = a.memoizedState, c = 0;
      null !== b && (c = b.retryLane);
      Yk(a, c);
    }
    function bk(a, b) {
      var c = 0;
      switch (a.tag) {
        case 13:
          var d = a.stateNode;
          var e = a.memoizedState;
          null !== e && (c = e.retryLane);
          break;
        case 19:
          d = a.stateNode;
          break;
        default:
          throw Error(p(314));
      }
      null !== d && d.delete(b);
      Yk(a, c);
    }
    var Vk;
    Vk = function(a, b, c) {
      if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
      else {
        if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
        dh = 0 !== (a.flags & 131072) ? true : false;
      }
      else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
      b.lanes = 0;
      switch (b.tag) {
        case 2:
          var d = b.type;
          ij(a, b);
          a = b.pendingProps;
          var e = Yf(b, H.current);
          ch(b, c);
          e = Nh(null, b, d, a, e, c);
          var f = Sh();
          b.flags |= 1;
          "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
          return b;
        case 16:
          d = b.elementType;
          a: {
            ij(a, b);
            a = b.pendingProps;
            e = d._init;
            d = e(d._payload);
            b.type = d;
            e = b.tag = Zk(d);
            a = Ci(d, a);
            switch (e) {
              case 0:
                b = cj(null, b, d, a, c);
                break a;
              case 1:
                b = hj(null, b, d, a, c);
                break a;
              case 11:
                b = Yi(null, b, d, a, c);
                break a;
              case 14:
                b = $i(null, b, d, Ci(d.type, a), c);
                break a;
            }
            throw Error(p(
              306,
              d,
              ""
            ));
          }
          return b;
        case 0:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
        case 1:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
        case 3:
          a: {
            kj(b);
            if (null === a) throw Error(p(387));
            d = b.pendingProps;
            f = b.memoizedState;
            e = f.element;
            lh(a, b);
            qh(b, d, null, c);
            var g = b.memoizedState;
            d = g.element;
            if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
              e = Ji(Error(p(423)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else if (d !== e) {
              e = Ji(Error(p(424)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
            else {
              Ig();
              if (d === e) {
                b = Zi(a, b, c);
                break a;
              }
              Xi(a, b, d, c);
            }
            b = b.child;
          }
          return b;
        case 5:
          return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
        case 6:
          return null === a && Eg(b), null;
        case 13:
          return oj(a, b, c);
        case 4:
          return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
        case 11:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
        case 7:
          return Xi(a, b, b.pendingProps, c), b.child;
        case 8:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 12:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 10:
          a: {
            d = b.type._context;
            e = b.pendingProps;
            f = b.memoizedProps;
            g = e.value;
            G(Wg, d._currentValue);
            d._currentValue = g;
            if (null !== f) if (He(f.value, g)) {
              if (f.children === e.children && !Wf.current) {
                b = Zi(a, b, c);
                break a;
              }
            } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
              var h = f.dependencies;
              if (null !== h) {
                g = f.child;
                for (var k = h.firstContext; null !== k; ) {
                  if (k.context === d) {
                    if (1 === f.tag) {
                      k = mh(-1, c & -c);
                      k.tag = 2;
                      var l = f.updateQueue;
                      if (null !== l) {
                        l = l.shared;
                        var m = l.pending;
                        null === m ? k.next = k : (k.next = m.next, m.next = k);
                        l.pending = k;
                      }
                    }
                    f.lanes |= c;
                    k = f.alternate;
                    null !== k && (k.lanes |= c);
                    bh(
                      f.return,
                      c,
                      b
                    );
                    h.lanes |= c;
                    break;
                  }
                  k = k.next;
                }
              } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
              else if (18 === f.tag) {
                g = f.return;
                if (null === g) throw Error(p(341));
                g.lanes |= c;
                h = g.alternate;
                null !== h && (h.lanes |= c);
                bh(g, c, b);
                g = f.sibling;
              } else g = f.child;
              if (null !== g) g.return = f;
              else for (g = f; null !== g; ) {
                if (g === b) {
                  g = null;
                  break;
                }
                f = g.sibling;
                if (null !== f) {
                  f.return = g.return;
                  g = f;
                  break;
                }
                g = g.return;
              }
              f = g;
            }
            Xi(a, b, e.children, c);
            b = b.child;
          }
          return b;
        case 9:
          return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
        case 14:
          return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
        case 15:
          return bj(a, b, b.type, b.pendingProps, c);
        case 17:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
        case 19:
          return xj(a, b, c);
        case 22:
          return dj(a, b, c);
      }
      throw Error(p(156, b.tag));
    };
    function Fk(a, b) {
      return ac(a, b);
    }
    function $k(a, b, c, d) {
      this.tag = a;
      this.key = c;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.ref = null;
      this.pendingProps = b;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = d;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function Bg(a, b, c, d) {
      return new $k(a, b, c, d);
    }
    function aj(a) {
      a = a.prototype;
      return !(!a || !a.isReactComponent);
    }
    function Zk(a) {
      if ("function" === typeof a) return aj(a) ? 1 : 0;
      if (void 0 !== a && null !== a) {
        a = a.$$typeof;
        if (a === Da) return 11;
        if (a === Ga) return 14;
      }
      return 2;
    }
    function Pg(a, b) {
      var c = a.alternate;
      null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
      c.flags = a.flags & 14680064;
      c.childLanes = a.childLanes;
      c.lanes = a.lanes;
      c.child = a.child;
      c.memoizedProps = a.memoizedProps;
      c.memoizedState = a.memoizedState;
      c.updateQueue = a.updateQueue;
      b = a.dependencies;
      c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
      c.sibling = a.sibling;
      c.index = a.index;
      c.ref = a.ref;
      return c;
    }
    function Rg(a, b, c, d, e, f) {
      var g = 2;
      d = a;
      if ("function" === typeof a) aj(a) && (g = 1);
      else if ("string" === typeof a) g = 5;
      else a: switch (a) {
        case ya:
          return Tg(c.children, e, f, b);
        case za:
          g = 8;
          e |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
        case Ea:
          return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
        case Fa:
          return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
        case Ia:
          return pj(c, e, f, b);
        default:
          if ("object" === typeof a && null !== a) switch (a.$$typeof) {
            case Ba:
              g = 10;
              break a;
            case Ca:
              g = 9;
              break a;
            case Da:
              g = 11;
              break a;
            case Ga:
              g = 14;
              break a;
            case Ha:
              g = 16;
              d = null;
              break a;
          }
          throw Error(p(130, null == a ? a : typeof a, ""));
      }
      b = Bg(g, c, b, e);
      b.elementType = a;
      b.type = d;
      b.lanes = f;
      return b;
    }
    function Tg(a, b, c, d) {
      a = Bg(7, a, d, b);
      a.lanes = c;
      return a;
    }
    function pj(a, b, c, d) {
      a = Bg(22, a, d, b);
      a.elementType = Ia;
      a.lanes = c;
      a.stateNode = { isHidden: false };
      return a;
    }
    function Qg(a, b, c) {
      a = Bg(6, a, null, b);
      a.lanes = c;
      return a;
    }
    function Sg(a, b, c) {
      b = Bg(4, null !== a.children ? a.children : [], a.key, b);
      b.lanes = c;
      b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
      return b;
    }
    function al(a, b, c, d, e) {
      this.tag = b;
      this.containerInfo = a;
      this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.pendingContext = this.context = null;
      this.callbackPriority = 0;
      this.eventTimes = zc(0);
      this.expirationTimes = zc(-1);
      this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = zc(0);
      this.identifierPrefix = d;
      this.onRecoverableError = e;
      this.mutableSourceEagerHydrationData = null;
    }
    function bl(a, b, c, d, e, f, g, h, k) {
      a = new al(a, b, c, h, k);
      1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
      f = Bg(3, null, null, b);
      a.current = f;
      f.stateNode = a;
      f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
      kh(f);
      return a;
    }
    function cl(a, b, c) {
      var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
    }
    function dl(a) {
      if (!a) return Vf;
      a = a._reactInternals;
      a: {
        if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
        var b = a;
        do {
          switch (b.tag) {
            case 3:
              b = b.stateNode.context;
              break a;
            case 1:
              if (Zf(b.type)) {
                b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                break a;
              }
          }
          b = b.return;
        } while (null !== b);
        throw Error(p(171));
      }
      if (1 === a.tag) {
        var c = a.type;
        if (Zf(c)) return bg(a, c, b);
      }
      return b;
    }
    function el(a, b, c, d, e, f, g, h, k) {
      a = bl(c, d, true, a, e, f, g, h, k);
      a.context = dl(null);
      c = a.current;
      d = R();
      e = yi(c);
      f = mh(d, e);
      f.callback = void 0 !== b && null !== b ? b : null;
      nh(c, f, e);
      a.current.lanes = e;
      Ac(a, e, d);
      Dk(a, d);
      return a;
    }
    function fl(a, b, c, d) {
      var e = b.current, f = R(), g = yi(e);
      c = dl(c);
      null === b.context ? b.context = c : b.pendingContext = c;
      b = mh(f, g);
      b.payload = { element: a };
      d = void 0 === d ? null : d;
      null !== d && (b.callback = d);
      a = nh(e, b, g);
      null !== a && (gi(a, e, g, f), oh(a, e, g));
      return g;
    }
    function gl(a) {
      a = a.current;
      if (!a.child) return null;
      switch (a.child.tag) {
        case 5:
          return a.child.stateNode;
        default:
          return a.child.stateNode;
      }
    }
    function hl(a, b) {
      a = a.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        var c = a.retryLane;
        a.retryLane = 0 !== c && c < b ? c : b;
      }
    }
    function il(a, b) {
      hl(a, b);
      (a = a.alternate) && hl(a, b);
    }
    function jl() {
      return null;
    }
    var kl = "function" === typeof reportError ? reportError : function(a) {
      console.error(a);
    };
    function ll(a) {
      this._internalRoot = a;
    }
    ml.prototype.render = ll.prototype.render = function(a) {
      var b = this._internalRoot;
      if (null === b) throw Error(p(409));
      fl(a, b, null, null);
    };
    ml.prototype.unmount = ll.prototype.unmount = function() {
      var a = this._internalRoot;
      if (null !== a) {
        this._internalRoot = null;
        var b = a.containerInfo;
        Rk(function() {
          fl(null, a, null, null);
        });
        b[uf] = null;
      }
    };
    function ml(a) {
      this._internalRoot = a;
    }
    ml.prototype.unstable_scheduleHydration = function(a) {
      if (a) {
        var b = Hc();
        a = { blockedOn: null, target: a, priority: b };
        for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
        Qc.splice(c, 0, a);
        0 === c && Vc(a);
      }
    };
    function nl(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
    }
    function ol(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
    }
    function pl() {
    }
    function ql(a, b, c, d, e) {
      if (e) {
        if ("function" === typeof d) {
          var f = d;
          d = function() {
            var a2 = gl(g);
            f.call(a2);
          };
        }
        var g = el(b, d, a, 0, null, false, false, "", pl);
        a._reactRootContainer = g;
        a[uf] = g.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk();
        return g;
      }
      for (; e = a.lastChild; ) a.removeChild(e);
      if ("function" === typeof d) {
        var h = d;
        d = function() {
          var a2 = gl(k);
          h.call(a2);
        };
      }
      var k = bl(a, 0, false, null, null, false, false, "", pl);
      a._reactRootContainer = k;
      a[uf] = k.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk(function() {
        fl(b, k, c, d);
      });
      return k;
    }
    function rl(a, b, c, d, e) {
      var f = c._reactRootContainer;
      if (f) {
        var g = f;
        if ("function" === typeof e) {
          var h = e;
          e = function() {
            var a2 = gl(g);
            h.call(a2);
          };
        }
        fl(b, g, a, e);
      } else g = ql(c, b, a, e, d);
      return gl(g);
    }
    Ec = function(a) {
      switch (a.tag) {
        case 3:
          var b = a.stateNode;
          if (b.current.memoizedState.isDehydrated) {
            var c = tc(b.pendingLanes);
            0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
          }
          break;
        case 13:
          Rk(function() {
            var b2 = ih(a, 1);
            if (null !== b2) {
              var c2 = R();
              gi(b2, a, 1, c2);
            }
          }), il(a, 1);
      }
    };
    Fc = function(a) {
      if (13 === a.tag) {
        var b = ih(a, 134217728);
        if (null !== b) {
          var c = R();
          gi(b, a, 134217728, c);
        }
        il(a, 134217728);
      }
    };
    Gc = function(a) {
      if (13 === a.tag) {
        var b = yi(a), c = ih(a, b);
        if (null !== c) {
          var d = R();
          gi(c, a, b, d);
        }
        il(a, b);
      }
    };
    Hc = function() {
      return C;
    };
    Ic = function(a, b) {
      var c = C;
      try {
        return C = a, b();
      } finally {
        C = c;
      }
    };
    yb = function(a, b, c) {
      switch (b) {
        case "input":
          bb(a, c);
          b = c.name;
          if ("radio" === c.type && null != b) {
            for (c = a; c.parentNode; ) c = c.parentNode;
            c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
            for (b = 0; b < c.length; b++) {
              var d = c[b];
              if (d !== a && d.form === a.form) {
                var e = Db(d);
                if (!e) throw Error(p(90));
                Wa(d);
                bb(d, e);
              }
            }
          }
          break;
        case "textarea":
          ib(a, c);
          break;
        case "select":
          b = c.value, null != b && fb(a, !!c.multiple, b, false);
      }
    };
    Gb = Qk;
    Hb = Rk;
    var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
    var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
      a = Zb(a);
      return null === a ? null : a.stateNode;
    }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!vl.isDisabled && vl.supportsFiber) try {
        kc = vl.inject(ul), lc = vl;
      } catch (a) {
      }
    }
    reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
    reactDom_production_min.createPortal = function(a, b) {
      var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!nl(b)) throw Error(p(200));
      return cl(a, b, null, c);
    };
    reactDom_production_min.createRoot = function(a, b) {
      if (!nl(a)) throw Error(p(299));
      var c = false, d = "", e = kl;
      null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
      b = bl(a, 1, false, null, null, c, false, d, e);
      a[uf] = b.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      return new ll(b);
    };
    reactDom_production_min.findDOMNode = function(a) {
      if (null == a) return null;
      if (1 === a.nodeType) return a;
      var b = a._reactInternals;
      if (void 0 === b) {
        if ("function" === typeof a.render) throw Error(p(188));
        a = Object.keys(a).join(",");
        throw Error(p(268, a));
      }
      a = Zb(b);
      a = null === a ? null : a.stateNode;
      return a;
    };
    reactDom_production_min.flushSync = function(a) {
      return Rk(a);
    };
    reactDom_production_min.hydrate = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, true, c);
    };
    reactDom_production_min.hydrateRoot = function(a, b, c) {
      if (!nl(a)) throw Error(p(405));
      var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
      null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
      b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
      a[uf] = b.current;
      sf(a);
      if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
        c,
        e
      );
      return new ml(b);
    };
    reactDom_production_min.render = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, false, c);
    };
    reactDom_production_min.unmountComponentAtNode = function(a) {
      if (!ol(a)) throw Error(p(40));
      return a._reactRootContainer ? (Rk(function() {
        rl(null, null, a, false, function() {
          a._reactRootContainer = null;
          a[uf] = null;
        });
      }), true) : false;
    };
    reactDom_production_min.unstable_batchedUpdates = Qk;
    reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
      if (!ol(c)) throw Error(p(200));
      if (null == a || void 0 === a._reactInternals) throw Error(p(38));
      return rl(a, b, c, false, d);
    };
    reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
    return reactDom_production_min;
  }
  var hasRequiredReactDom;
  function requireReactDom() {
    if (hasRequiredReactDom) return reactDom.exports;
    hasRequiredReactDom = 1;
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      reactDom.exports = requireReactDom_production_min();
    }
    return reactDom.exports;
  }
  var hasRequiredClient;
  function requireClient() {
    if (hasRequiredClient) return client;
    hasRequiredClient = 1;
    var m = requireReactDom();
    {
      client.createRoot = m.createRoot;
      client.hydrateRoot = m.hydrateRoot;
    }
    return client;
  }
  var clientExports = requireClient();
  const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
  const scriptRel = "modulepreload";
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (false) {
      let allSettled = function(promises$2) {
        return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
          status: "fulfilled",
          value: value$1
        }), (reason) => ({
          status: "rejected",
          reason
        }))));
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = allSettled(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) link.as = "script";
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) link.setAttribute("nonce", cspNonce);
        document.head.appendChild(link);
        if (isCss) return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
        });
      }));
    }
    function handlePreloadError(err$2) {
      const e$1 = new Event("vite:preloadError", { cancelable: true });
      e$1.payload = err$2;
      window.dispatchEvent(e$1);
      if (!e$1.defaultPrevented) throw err$2;
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  const SERVER_BASE$1 = "http://127.0.0.1:8080";
  const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  const isAndroid = typeof window !== "undefined" && "ZeroChatBridge" in window;
  const WEB_STORAGE_KEY = "zerochat_web_creds";
  function getWebStorage() {
    try {
      const stored = localStorage.getItem(WEB_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }
  function setWebStorage(creds) {
    try {
      localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(creds));
    } catch (e) {
      console.warn("Failed to save credentials to localStorage:", e);
    }
  }
  function invoke$1(_0) {
    return __async(this, arguments, function* (cmd, args = {}) {
      if (isTauri) {
        const { invoke: tauriInvoke } = yield __vitePreload(() => __async(null, null, function* () {
          const { invoke: tauriInvoke2 } = yield Promise.resolve().then(() => tauri);
          return { invoke: tauriInvoke2 };
        }), false ? __VITE_PRELOAD__ : void 0);
        return tauriInvoke(cmd, args);
      } else if (isAndroid) {
        return new Promise((resolve, reject) => {
          try {
            const bridge2 = window.ZeroChatBridge;
            if (!bridge2) {
              reject(new Error("ZeroChatBridge not available"));
              return;
            }
            const argsJson = JSON.stringify(args);
            const result = bridge2.invoke(cmd, argsJson);
            if (typeof result === "string") {
              if (result.trim().startsWith('{"error":')) {
                try {
                  const errorObj = JSON.parse(result);
                  reject(new Error(errorObj.error));
                  return;
                } catch (e) {
                  reject(new Error(result));
                  return;
                }
              }
              try {
                resolve(JSON.parse(result));
                return;
              } catch (e) {
                if (result.startsWith('"') && result.endsWith('"')) {
                  resolve(result.slice(1, -1));
                } else {
                  resolve(result);
                }
                return;
              }
            }
            resolve(result);
          } catch (e) {
            reject(new Error(e.message || e.toString()));
          }
        });
      } else {
        const storage = getWebStorage();
        switch (cmd) {
          case "set_base":
            storage.base_url = args.base || "http://127.0.0.1:8080";
            setWebStorage(storage);
            return Promise.resolve("ok");
          case "load_creds":
            if (storage.device_id && storage.device_auth) {
              return Promise.resolve({
                device_id: storage.device_id,
                device_auth: storage.device_auth
              });
            }
            return Promise.resolve(null);
          case "signup":
          case "login": {
            return Promise.reject(new Error("Use API directly in web mode"));
          }
          case "get_me": {
            const creds = storage;
            if (!creds.device_id || !creds.device_auth) {
              return Promise.reject(new Error("Not authenticated"));
            }
            const baseUrl = creds.base_url || SERVER_BASE$1;
            return fetch(`${baseUrl}/api/me`, {
              method: "GET",
              headers: {
                "x-device-id": creds.device_id,
                "x-device-auth": creds.device_auth
              }
            }).then((response) => __async(null, null, function* () {
              if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              return response.json();
            }));
          }
          case "friends_list": {
            const creds = storage;
            if (!creds.device_id || !creds.device_auth) {
              return Promise.resolve({ friends: [] });
            }
            const baseUrl = creds.base_url || SERVER_BASE$1;
            return fetch(`${baseUrl}/api/friends/list`, {
              method: "GET",
              headers: {
                "x-device-id": creds.device_id,
                "x-device-auth": creds.device_auth
              }
            }).then((response) => __async(null, null, function* () {
              if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              return response.json();
            }));
          }
          case "create_invite": {
            const creds = storage;
            if (!creds.device_id || !creds.device_auth) {
              return Promise.reject(new Error("Not authenticated"));
            }
            const baseUrl = creds.base_url || SERVER_BASE$1;
            const friendHint = args.friend_hint || null;
            const ttlMinutes = args.ttl_minutes || 60;
            return fetch(`${baseUrl}/api/invite/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-device-id": creds.device_id,
                "x-device-auth": creds.device_auth
              },
              body: JSON.stringify({
                friend_hint: friendHint,
                ttl_minutes: ttlMinutes
              })
            }).then((response) => __async(null, null, function* () {
              if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              return response.json();
            }));
          }
          default:
            console.warn(`Web mode: command '${cmd}' not fully supported, using fallback`);
            return Promise.resolve(null);
        }
      }
    });
  }
  const platform = {
    isTauri,
    isAndroid,
    isWeb: !isTauri && !isAndroid
  };
  const bridge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    invoke: invoke$1,
    platform
  }, Symbol.toStringTag, { value: "Module" }));
  const SERVER_BASE = "http://127.0.0.1:8080";
  function getBaseUrl() {
    return __async(this, null, function* () {
      try {
        yield invoke$1("set_base", { base: SERVER_BASE });
        return SERVER_BASE;
      } catch (e) {
        return SERVER_BASE;
      }
    });
  }
  function getAuthHeaders() {
    return __async(this, null, function* () {
      const creds = yield invoke$1("load_creds");
      if (!creds || !creds.device_id || !creds.device_auth) {
        throw new Error("Not authenticated");
      }
      return {
        "x-device-id": creds.device_id,
        "x-device-auth": creds.device_auth
      };
    });
  }
  function apiRequest(method, path, body) {
    return __async(this, null, function* () {
      const baseUrl = yield getBaseUrl();
      const url = `${baseUrl}${path}`;
      const headers = {
        "Content-Type": "application/json"
      };
      try {
        const authHeaders = yield getAuthHeaders();
        Object.assign(headers, authHeaders);
      } catch (e) {
      }
      const options = {
        method,
        headers
      };
      const response = yield fetch(url, options);
      if (!response.ok) {
        const errorText = yield response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      const text = yield response.text();
      return text ? JSON.parse(text) : {};
    });
  }
  const friendsApi = {
    list() {
      return __async(this, null, function* () {
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        if (platform2.isWeb) {
          yield getBaseUrl();
          const response = yield apiRequest(
            "GET",
            "/api/friends/list"
          );
          if (response && typeof response === "object" && "friends" in response) {
            return response.friends || [];
          }
          if (Array.isArray(response)) {
            return response;
          }
          console.warn("[friendsApi] Invalid response format, returning empty array:", response);
          return [];
        }
        const result = yield invoke$1("friends_list");
        if (Array.isArray(result)) {
          return result;
        }
        if (result && typeof result === "object" && "friends" in result) {
          return result.friends || [];
        }
        console.warn("[friendsApi] Bridge returned invalid format, returning empty array:", result);
        return [];
      });
    },
    request(toUsername) {
      return __async(this, null, function* () {
        yield invoke$1("friend_request", { to_username: toUsername });
      });
    },
    respond(fromUsername, accept) {
      return __async(this, null, function* () {
        yield invoke$1("friend_respond", { from_username: fromUsername, accept });
      });
    }
  };
  const messagesApi = {
    // Pull messages (existing bridge method)
    pull() {
      return __async(this, null, function* () {
        return invoke$1("pull_and_decrypt");
      });
    },
    // Send message (existing bridge method)
    send(username, plaintext) {
      return __async(this, null, function* () {
        return invoke$1("send_to_username_hpke", { username, plaintext });
      });
    },
    // Get messages with pagination (if server supports it)
    getMessages(chatId, cursor) {
      return __async(this, null, function* () {
        yield getBaseUrl();
        const params = new URLSearchParams({ chatId });
        if (cursor) params.append("cursor", cursor);
        return apiRequest(
          "GET",
          `/api/messages?${params.toString()}`
        );
      });
    }
  };
  const userApi = {
    getMe() {
      return __async(this, null, function* () {
        return invoke$1("get_me");
      });
    },
    createInvite(friendHint, ttlMinutes = 60) {
      return __async(this, null, function* () {
        return invoke$1("create_invite", {
          friend_hint: friendHint,
          ttl_minutes: ttlMinutes
        });
      });
    }
  };
  const authApi = {
    signup(username, password, inviteToken, inviteBaseUrl) {
      return __async(this, null, function* () {
        console.log("[AUTH] ========== SIGNUP API CALL STARTED ==========");
        console.log("[AUTH] Username:", username);
        console.log("[AUTH] Has invite token:", !!inviteToken);
        console.log("[AUTH] Invite base URL:", inviteBaseUrl || "not provided");
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        if (platform2.isWeb) {
          const baseUrl = inviteBaseUrl || SERVER_BASE;
          console.log("[AUTH] Using base URL:", baseUrl);
          console.log("[AUTH] Calling /api/signup");
          const signupResponse = yield fetch(`${baseUrl}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          if (!signupResponse.ok) {
            const errorText = yield signupResponse.text();
            console.error("[AUTH] Signup failed:", signupResponse.status, errorText);
            throw new Error(`Signup failed: ${errorText}`);
          }
          const signupData = yield signupResponse.json();
          console.log("[AUTH] Signup response:", signupData);
          const signupProvisionToken = signupData.provision_token;
          if (!signupProvisionToken) {
            console.error("[AUTH] No provision token in signup response");
            throw new Error("No provision token received from signup");
          }
          console.log("[AUTH] Signup successful, got provision token");
          const tokenToUse = inviteToken || signupProvisionToken;
          console.log("[AUTH] Using token for provision:", inviteToken ? "invite token (links to inviter)" : "signup token (new user)");
          console.log("[AUTH] Redeeming provision token");
          const provisionResponse = yield fetch(`${baseUrl}/api/provision/redeem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: tokenToUse,
              platform: "web"
            })
          });
          if (!provisionResponse.ok) {
            const errorText = yield provisionResponse.text();
            console.error("[AUTH] Provision failed:", provisionResponse.status, errorText);
            throw new Error(`Provision failed: ${errorText}`);
          }
          const provisionData = yield provisionResponse.json();
          console.log("[AUTH] Provision response:", __spreadProps(__spreadValues({}, provisionData), {
            device_auth: provisionData.device_auth ? "***" : "missing"
          }));
          if (!provisionData.device_id || !provisionData.device_auth && !provisionData.device_token) {
            console.error("[AUTH] Invalid provision response:", provisionData);
            throw new Error("Invalid provision response: missing device credentials");
          }
          const creds = {
            device_id: provisionData.device_id,
            device_auth: provisionData.device_auth || provisionData.device_token,
            base_url: baseUrl
          };
          console.log("[AUTH] Storing credentials (device_id:", creds.device_id, ")");
          localStorage.setItem("zerochat_web_creds", JSON.stringify(creds));
          console.log("[AUTH] ========== SIGNUP API CALL COMPLETED ==========");
        } else {
          yield invoke$1("set_base", { base: inviteBaseUrl || SERVER_BASE });
          if (inviteToken) {
            console.log("[AUTH] Android: Signing up, then provisioning with invite token");
            yield invoke$1("signup", { username, password, base_url: inviteBaseUrl || SERVER_BASE });
          } else {
            yield invoke$1("signup", { username, password, base_url: SERVER_BASE });
          }
          yield invoke$1("upload_identity_and_keypackage");
        }
      });
    },
    login(username, password) {
      return __async(this, null, function* () {
        console.log("[AUTH] ========== LOGIN API CALL STARTED ==========");
        console.log("[AUTH] Username:", username);
        console.log("[AUTH] Password length:", password.length);
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        console.log("[AUTH] Platform detected:", platform2.isWeb ? "web" : platform2.isTauri ? "tauri" : "android");
        if (platform2.isWeb) {
          console.log("[AUTH] Using web mode login flow");
          const loginUrl = `${SERVER_BASE}/api/login`;
          console.log("[AUTH] Step 1: Calling login endpoint:", loginUrl);
          const loginResponse = yield fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          console.log("[AUTH] Login response status:", loginResponse.status, loginResponse.statusText);
          if (!loginResponse.ok) {
            const errorText = yield loginResponse.text();
            console.error("[AUTH] Login failed:", errorText);
            throw new Error(`HTTP ${loginResponse.status}: ${errorText}`);
          }
          const loginData = yield loginResponse.json();
          console.log("[AUTH] Login response data:", __spreadProps(__spreadValues({}, loginData), { provision_token: loginData.provision_token ? "***" : "missing" }));
          const provisionToken = loginData.provision_token;
          if (!provisionToken) {
            console.error("[AUTH] No provision token in login response");
            throw new Error("No provision token received from login");
          }
          console.log("[AUTH] Step 2: Redeeming provision token...");
          const provisionUrl = `${SERVER_BASE}/api/provision/redeem`;
          console.log("[AUTH] Calling provision endpoint:", provisionUrl);
          const provisionResponse = yield fetch(provisionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: provisionToken,
              platform: "web"
            })
          });
          console.log("[AUTH] Provision response status:", provisionResponse.status, provisionResponse.statusText);
          if (!provisionResponse.ok) {
            const errorText = yield provisionResponse.text();
            console.error("[AUTH] Provision failed:", errorText);
            throw new Error(`HTTP ${provisionResponse.status}: ${errorText}`);
          }
          const provisionData = yield provisionResponse.json();
          console.log("[AUTH] Provision response data:", __spreadProps(__spreadValues({}, provisionData), {
            device_auth: provisionData.device_auth ? "***" : "missing",
            device_token: provisionData.device_token ? "***" : "missing"
          }));
          const creds = {
            device_id: provisionData.device_id,
            device_auth: provisionData.device_auth || provisionData.device_token,
            // Use device_auth if available, fallback to device_token
            base_url: SERVER_BASE
          };
          console.log("[AUTH] Storing credentials:", {
            device_id: creds.device_id,
            device_auth: "***",
            base_url: creds.base_url
          });
          try {
            localStorage.setItem("zerochat_web_creds", JSON.stringify(creds));
            console.log("[AUTH] ✅ Credentials stored successfully");
          } catch (e) {
            console.error("[AUTH] ❌ Failed to store credentials:", e);
            throw new Error(`Failed to store credentials: ${e}`);
          }
          console.log("[AUTH] ========== LOGIN API CALL COMPLETED ==========");
        } else {
          console.log("[AUTH] Using native mode (Tauri/Android) login flow");
          try {
            console.log("[AUTH] Step 1: Setting base URL...");
            yield invoke$1("set_base", { base: SERVER_BASE });
            console.log("[AUTH] Step 2: Calling native login...");
            yield invoke$1("login", { username, password, base_url: SERVER_BASE });
            console.log("[AUTH] Step 3: Uploading identity and keypackage...");
            yield invoke$1("upload_identity_and_keypackage");
            console.log("[AUTH] ✅ Native login completed");
          } catch (e) {
            console.error("[AUTH] ❌ Native login failed:", e);
            throw e;
          }
        }
      });
    },
    provisionWithToken(token, baseUrl) {
      return __async(this, null, function* () {
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        if (platform2.isWeb) {
          const response = yield fetch(`${baseUrl || SERVER_BASE}/api/provision/redeem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              platform: "web"
            })
          });
          if (!response.ok) {
            const errorText = yield response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          const data = yield response.json();
          const creds = {
            device_id: data.device_id,
            device_auth: data.device_auth || data.device_token,
            base_url: baseUrl || SERVER_BASE
          };
          localStorage.setItem("zerochat_web_creds", JSON.stringify(creds));
        } else {
          yield invoke$1("provision_with_token", { token, base_url: baseUrl || SERVER_BASE });
          yield invoke$1("upload_identity_and_keypackage");
        }
      });
    },
    loadCreds() {
      return __async(this, null, function* () {
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        if (platform2.isWeb) {
          const stored = localStorage.getItem("zerochat_web_creds");
          return stored ? JSON.parse(stored) : null;
        }
        try {
          const result = yield invoke$1("load_creds");
          return result;
        } catch (error) {
          console.log("[AUTH] No credentials found (expected if not logged in):", error == null ? void 0 : error.message);
          return null;
        }
      });
    },
    setBase(base) {
      return __async(this, null, function* () {
        yield invoke$1("set_base", { base });
      });
    }
  };
  function useAuth() {
    const [authState, setAuthState] = reactExports.useState({
      isAuthenticated: false,
      isLoading: true,
      user: null
    });
    const checkAuth = reactExports.useCallback(() => __async(null, null, function* () {
      console.log("[checkAuth] ========== CHECK AUTH STARTED ==========");
      const startTime = Date.now();
      try {
        console.log("[checkAuth] Step 1: Loading credentials...");
        let creds;
        try {
          creds = yield authApi.loadCreds();
          console.log("[checkAuth] Step 1 result:", {
            hasCreds: !!creds,
            hasDeviceId: !!(creds == null ? void 0 : creds.device_id),
            hasDeviceAuth: !!(creds == null ? void 0 : creds.device_auth),
            deviceId: (creds == null ? void 0 : creds.device_id) ? `${creds.device_id.substring(0, 8)}...` : "none"
          });
        } catch (loadError) {
          console.log("[checkAuth] Step 1 failed (expected if not logged in):", loadError == null ? void 0 : loadError.message);
          console.log("[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null");
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          });
          console.log("[checkAuth] ========== CHECK AUTH COMPLETED (no creds) ==========");
          return;
        }
        if (!creds || !creds.device_id || !creds.device_auth) {
          console.log("[checkAuth] Step 2: No valid credentials found");
          console.log("[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null");
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          });
          console.log("[checkAuth] ========== CHECK AUTH COMPLETED (invalid creds) ==========");
          return;
        }
        console.log("[checkAuth] Step 2: Valid credentials found, fetching user info...");
        console.log("[checkAuth] Calling userApi.getMe()...");
        try {
          const user = yield userApi.getMe();
          console.log("[checkAuth] Step 2 result: Raw user response:", user);
          console.log("[checkAuth] Step 2 result: User info fetched:", {
            username: user == null ? void 0 : user.username,
            device_id: user == null ? void 0 : user.device_id,
            device_id_type: typeof (user == null ? void 0 : user.device_id),
            hasUser: !!user,
            userKeys: user ? Object.keys(user) : []
          });
          console.log("[checkAuth] About to set state: isAuthenticated=true, isLoading=false, user=", {
            username: user == null ? void 0 : user.username,
            device_id: user == null ? void 0 : user.device_id
          });
          setAuthState((prevState) => {
            var _a2;
            console.log("[checkAuth] setAuthState callback called, prevState:", {
              isAuthenticated: prevState.isAuthenticated,
              isLoading: prevState.isLoading,
              hasUser: !!prevState.user
            });
            const newState = {
              isAuthenticated: true,
              isLoading: false,
              user
            };
            console.log("[checkAuth] setAuthState returning new state:", {
              isAuthenticated: newState.isAuthenticated,
              isLoading: newState.isLoading,
              username: (_a2 = newState.user) == null ? void 0 : _a2.username
            });
            return newState;
          });
          console.log("[checkAuth] setAuthState called (state update is async)");
          const duration = Date.now() - startTime;
          console.log(`[checkAuth] ✅ State update initiated in ${duration}ms`);
          console.log("[checkAuth] Note: State will be updated on next render");
          console.log("[checkAuth] ========== CHECK AUTH COMPLETED (success) ==========");
        } catch (getMeError) {
          console.error("[checkAuth] Step 2 failed: get_me error:", getMeError);
          const errorMsg = (getMeError == null ? void 0 : getMeError.message) || (getMeError == null ? void 0 : getMeError.toString()) || "";
          console.log("[checkAuth] Error message:", errorMsg);
          if (errorMsg.includes("401") || errorMsg.includes("403") || errorMsg.includes("UNAUTHORIZED") || errorMsg.includes("invalid token") || errorMsg.includes("not provisioned")) {
            console.log("[checkAuth] Invalid credentials detected, clearing...");
            try {
              yield authApi.clearCreds();
              console.log("[checkAuth] Credentials cleared");
            } catch (e) {
              console.warn("[checkAuth] Failed to clear credentials:", e);
            }
          }
          console.log("[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null");
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          });
          console.log("[checkAuth] ========== CHECK AUTH COMPLETED (get_me failed) ==========");
        }
      } catch (error) {
        console.error("[checkAuth] Unexpected error:", error);
        console.log("[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null");
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
        console.log("[checkAuth] ========== CHECK AUTH COMPLETED (error) ==========");
      }
    }), []);
    reactExports.useEffect(() => {
      var _a2, _b2;
      console.log("[useAuth] 🔄 ========== STATE ACTUALLY CHANGED ==========");
      console.log("[useAuth] 🔄 New state values:", {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        hasUser: !!authState.user,
        username: (_a2 = authState.user) == null ? void 0 : _a2.username,
        device_id: (_b2 = authState.user) == null ? void 0 : _b2.device_id
      });
      console.log("[useAuth] 🔄 This means React detected the state change and re-rendered");
      console.log("[useAuth] 🔄 ============================================");
    }, [authState.isAuthenticated, authState.user, authState.isLoading]);
    reactExports.useEffect(() => {
      console.log("[useAuth] Initial mount - calling checkAuth()");
      checkAuth();
    }, [checkAuth]);
    const signup = reactExports.useCallback((username, password, inviteToken, inviteBaseUrl) => __async(null, null, function* () {
      console.log("[useAuth] Signup called for:", username);
      console.log("[useAuth] Has invite token:", !!inviteToken);
      try {
        yield authApi.signup(username, password, inviteToken, inviteBaseUrl);
        console.log("[useAuth] Signup API call succeeded, checking auth...");
        yield new Promise((resolve) => setTimeout(resolve, 100));
        yield checkAuth();
        console.log("[useAuth] Auth check completed");
      } catch (error) {
        console.error("[useAuth] Signup failed:", error);
        throw error;
      }
    }), [checkAuth]);
    const login = reactExports.useCallback((username, password) => __async(null, null, function* () {
      var _a2;
      console.log("[useAuth] ========== LOGIN HOOK CALLED ==========");
      console.log("[useAuth] Username:", username);
      console.log("[useAuth] Current state before login:", {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        hasUser: !!authState.user
      });
      const startTime = Date.now();
      try {
        console.log("[useAuth] Step 1: Calling authApi.login()...");
        yield authApi.login(username, password);
        const loginDuration = Date.now() - startTime;
        console.log(`[useAuth] ✅ Step 1 completed: authApi.login() finished in ${loginDuration}ms`);
        console.log("[useAuth] Step 2: Waiting 100ms for credentials to be stored...");
        yield new Promise((resolve) => setTimeout(resolve, 100));
        console.log("[useAuth] Step 3: Calling checkAuth() to verify credentials...");
        yield checkAuth();
        const totalDuration = Date.now() - startTime;
        console.log(`[useAuth] ✅ Step 3 completed: checkAuth() finished in ${totalDuration}ms`);
        console.log("[useAuth] Waiting for React to process state update...");
        yield new Promise((resolve) => setTimeout(resolve, 100));
        console.log("[useAuth] State from closure (may be stale):", {
          isAuthenticated: authState.isAuthenticated,
          isLoading: authState.isLoading,
          hasUser: !!authState.user,
          username: (_a2 = authState.user) == null ? void 0 : _a2.username
        });
        console.log("[useAuth] Note: Check the [useAuth] 🔄 State changed log above to see actual state");
        console.log(`[useAuth] ✅ Login hook completed successfully in ${totalDuration}ms`);
        console.log("[useAuth] ========== LOGIN HOOK ENDED ==========");
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[useAuth] ❌ Login hook failed after ${duration}ms:`, error);
        console.error("[useAuth] Error details:", {
          message: error == null ? void 0 : error.message,
          stack: error == null ? void 0 : error.stack,
          name: error == null ? void 0 : error.name
        });
        console.log("[useAuth] ========== LOGIN HOOK ENDED (ERROR) ==========");
        throw error;
      }
    }), [checkAuth, authState]);
    const provision = reactExports.useCallback((token, baseUrl) => __async(null, null, function* () {
      try {
        yield authApi.provisionWithToken(token, baseUrl);
        yield checkAuth();
      } catch (error) {
        throw error;
      }
    }), [checkAuth]);
    const logout = reactExports.useCallback(() => __async(null, null, function* () {
      console.log("[useAuth] Logout called");
      try {
        localStorage.removeItem("zerochat_web_creds");
        console.log("[useAuth] Cleared localStorage credentials");
      } catch (e) {
        console.warn("Failed to clear localStorage:", e);
      }
      try {
        const { platform: platform2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { platform: platform3 } = yield Promise.resolve().then(() => bridge);
          return { platform: platform3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        if (!platform2.isWeb) {
          const { invoke: invoke2 } = yield __vitePreload(() => __async(null, null, function* () {
            const { invoke: invoke3 } = yield Promise.resolve().then(() => bridge);
            return { invoke: invoke3 };
          }), false ? __VITE_PRELOAD__ : void 0);
          yield invoke2("clear_creds", {});
          console.log("[useAuth] Cleared Tauri credentials");
        }
      } catch (e) {
      }
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
      console.log("[useAuth] Reloading page to show logged-out state...");
      window.location.reload();
    }), []);
    return {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      user: authState.user,
      signup,
      login,
      provision,
      logout,
      refresh: checkAuth
    };
  }
  const __vite_import_meta_env__$1 = {};
  const createStoreImpl = (createState) => {
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        const previousState = state;
        state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
        listeners.forEach((listener) => listener(state, previousState));
      }
    };
    const getState = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const destroy = () => {
      if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
        console.warn(
          "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
        );
      }
      listeners.clear();
    };
    const api = { setState, getState, getInitialState, subscribe, destroy };
    const initialState = state = createState(setState, getState, api);
    return api;
  };
  const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
  var withSelector = { exports: {} };
  var withSelector_production = {};
  var shim = { exports: {} };
  var useSyncExternalStoreShim_production = {};
  var hasRequiredUseSyncExternalStoreShim_production;
  function requireUseSyncExternalStoreShim_production() {
    if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
    hasRequiredUseSyncExternalStoreShim_production = 1;
    var React2 = requireReact();
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React2.useState, useEffect = React2.useEffect, useLayoutEffect = React2.useLayoutEffect, useDebugValue2 = React2.useDebugValue;
    function useSyncExternalStore$2(subscribe, getSnapshot) {
      var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
      useLayoutEffect(
        function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe, value, getSnapshot]
      );
      useEffect(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe]
      );
      useDebugValue2(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
      return getSnapshot();
    }
    var shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim2;
    return useSyncExternalStoreShim_production;
  }
  var hasRequiredShim;
  function requireShim() {
    if (hasRequiredShim) return shim.exports;
    hasRequiredShim = 1;
    {
      shim.exports = requireUseSyncExternalStoreShim_production();
    }
    return shim.exports;
  }
  var hasRequiredWithSelector_production;
  function requireWithSelector_production() {
    if (hasRequiredWithSelector_production) return withSelector_production;
    hasRequiredWithSelector_production = 1;
    var React2 = requireReact(), shim2 = requireShim();
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef = React2.useRef, useEffect = React2.useEffect, useMemo = React2.useMemo, useDebugValue2 = React2.useDebugValue;
    withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
      var instRef = useRef(null);
      if (null === instRef.current) {
        var inst = { hasValue: false, value: null };
        instRef.current = inst;
      } else inst = instRef.current;
      instRef = useMemo(
        function() {
          function memoizedSelector(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = true;
              memoizedSnapshot = nextSnapshot;
              nextSnapshot = selector(nextSnapshot);
              if (void 0 !== isEqual && inst.hasValue) {
                var currentSelection = inst.value;
                if (isEqual(currentSelection, nextSnapshot))
                  return memoizedSelection = currentSelection;
              }
              return memoizedSelection = nextSnapshot;
            }
            currentSelection = memoizedSelection;
            if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
            var nextSelection = selector(nextSnapshot);
            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
              return memoizedSnapshot = nextSnapshot, currentSelection;
            memoizedSnapshot = nextSnapshot;
            return memoizedSelection = nextSelection;
          }
          var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
          return [
            function() {
              return memoizedSelector(getSnapshot());
            },
            null === maybeGetServerSnapshot ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            }
          ];
        },
        [getSnapshot, getServerSnapshot, selector, isEqual]
      );
      var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
      useEffect(
        function() {
          inst.hasValue = true;
          inst.value = value;
        },
        [value]
      );
      useDebugValue2(value);
      return value;
    };
    return withSelector_production;
  }
  var hasRequiredWithSelector;
  function requireWithSelector() {
    if (hasRequiredWithSelector) return withSelector.exports;
    hasRequiredWithSelector = 1;
    {
      withSelector.exports = requireWithSelector_production();
    }
    return withSelector.exports;
  }
  var withSelectorExports = requireWithSelector();
  const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
  const __vite_import_meta_env__ = {};
  const { useDebugValue } = React;
  const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
  let didWarnAboutEqualityFn = false;
  const identity = (arg) => arg;
  function useStore(api, selector = identity, equalityFn) {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
      console.warn(
        "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
      );
      didWarnAboutEqualityFn = true;
    }
    const slice = useSyncExternalStoreWithSelector(
      api.subscribe,
      api.getState,
      api.getServerState || api.getInitialState,
      selector,
      equalityFn
    );
    useDebugValue(slice);
    return slice;
  }
  const createImpl = (createState) => {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
      console.warn(
        "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
      );
    }
    const api = typeof createState === "function" ? createStore(createState) : createState;
    const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
    Object.assign(useBoundStore, api);
    return useBoundStore;
  };
  const create = (createState) => createState ? createImpl(createState) : createImpl;
  const useChatListStore = create((set, get) => ({
    chats: [],
    searchQuery: "",
    filteredChats: [],
    setChats: (chats) => {
      const sorted = [...chats].sort((a, b) => {
        var _a2, _b2;
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        const aTime = ((_a2 = a.lastMessage) == null ? void 0 : _a2.timestamp) || 0;
        const bTime = ((_b2 = b.lastMessage) == null ? void 0 : _b2.timestamp) || 0;
        return bTime - aTime;
      });
      set({ chats: sorted });
      get().setSearchQuery(get().searchQuery);
    },
    addChat: (chat) => {
      const chats = [...get().chats, chat];
      get().setChats(chats);
    },
    updateChat: (id, updates) => {
      const chats = get().chats.map(
        (chat) => chat.id === id ? __spreadValues(__spreadValues({}, chat), updates) : chat
      );
      get().setChats(chats);
    },
    removeChat: (id) => {
      const chats = get().chats.filter((chat) => chat.id !== id);
      get().setChats(chats);
    },
    setSearchQuery: (query) => {
      const { chats } = get();
      const lowerQuery = query.toLowerCase();
      const filtered = chats.filter((chat) => {
        var _a2;
        if (!query) return true;
        const nameMatch = chat.name.toLowerCase().includes(lowerQuery);
        const messageMatch = (_a2 = chat.lastMessage) == null ? void 0 : _a2.text.toLowerCase().includes(lowerQuery);
        return nameMatch || messageMatch;
      });
      set({ searchQuery: query, filteredChats: filtered });
    },
    togglePin: (id) => {
      const chat = get().chats.find((c) => c.id === id);
      if (chat) {
        get().updateChat(id, { pinned: !chat.pinned });
      }
    },
    toggleMute: (id) => {
      const chat = get().chats.find((c) => c.id === id);
      if (chat) {
        get().updateChat(id, { muted: !chat.muted });
      }
    },
    markAsRead: (id) => {
      get().updateChat(id, { unreadCount: 0 });
    },
    updateLastMessage: (id, message) => {
      get().updateChat(id, { lastMessage: message });
    },
    setOnlineStatus: (id, isOnline2, lastSeen) => {
      get().updateChat(id, { isOnline: isOnline2, lastSeen });
    }
  }));
  const DB_NAME = "zerochat_cache";
  const DB_VERSION = 1;
  const CHAT_LIST_KEY = "chat_list";
  const MESSAGE_PREFIX = "messages_";
  let db = null;
  function getDB() {
    return __async(this, null, function* () {
      if (db) return db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          db = request.result;
          resolve(db);
        };
        request.onupgradeneeded = (event) => {
          const database = event.target.result;
          if (!database.objectStoreNames.contains("chats")) {
            database.createObjectStore("chats", { keyPath: "id" });
          }
          if (!database.objectStoreNames.contains("messages")) {
            const messageStore = database.createObjectStore("messages", { keyPath: "id" });
            messageStore.createIndex("chatId", "chatId", { unique: false });
            messageStore.createIndex("timestamp", "timestamp", { unique: false });
          }
        };
      });
    });
  }
  function isIndexedDBAvailable() {
    return typeof indexedDB !== "undefined";
  }
  function cacheChatList(chats) {
    return __async(this, null, function* () {
      if (isIndexedDBAvailable()) {
        try {
          const database = yield getDB();
          const transaction = database.transaction(["chats"], "readwrite");
          const store = transaction.objectStore("chats");
          yield new Promise((resolve, reject) => {
            const clearReq = store.clear();
            clearReq.onsuccess = () => resolve();
            clearReq.onerror = () => reject(clearReq.error);
          });
          for (const chat of chats) {
            yield new Promise((resolve, reject) => {
              const addReq = store.add(chat);
              addReq.onsuccess = () => resolve();
              addReq.onerror = () => reject(addReq.error);
            });
          }
        } catch (error) {
          console.warn("IndexedDB cache failed, using localStorage:", error);
          localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chats));
        }
      } else {
        localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chats));
      }
    });
  }
  function getCachedChatList() {
    return __async(this, null, function* () {
      if (isIndexedDBAvailable()) {
        try {
          const database = yield getDB();
          const transaction = database.transaction(["chats"], "readonly");
          const store = transaction.objectStore("chats");
          return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });
        } catch (error) {
          console.warn("IndexedDB read failed, trying localStorage:", error);
          const cached = localStorage.getItem(CHAT_LIST_KEY);
          return cached ? JSON.parse(cached) : [];
        }
      } else {
        const cached = localStorage.getItem(CHAT_LIST_KEY);
        return cached ? JSON.parse(cached) : [];
      }
    });
  }
  function cacheMessages(chatId, messages) {
    return __async(this, null, function* () {
      const toCache = messages.slice(-100);
      if (isIndexedDBAvailable()) {
        try {
          const database = yield getDB();
          const transaction = database.transaction(["messages"], "readwrite");
          const store = transaction.objectStore("messages");
          const index = store.index("chatId");
          return new Promise((resolve, reject) => {
            const deleteReq = index.openCursor(IDBKeyRange.only(chatId));
            deleteReq.onsuccess = (event) => {
              const cursor = event.target.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              } else {
                Promise.all(
                  toCache.map(
                    (msg) => new Promise((resolve2, reject2) => {
                      const addReq = store.add(__spreadProps(__spreadValues({}, msg), { chatId }));
                      addReq.onsuccess = () => resolve2();
                      addReq.onerror = () => reject2(addReq.error);
                    })
                  )
                ).then(() => resolve()).catch(reject);
              }
            };
            deleteReq.onerror = () => reject(deleteReq.error);
          });
        } catch (error) {
          console.warn("IndexedDB message cache failed, using localStorage:", error);
          localStorage.setItem(`${MESSAGE_PREFIX}${chatId}`, JSON.stringify(toCache));
        }
      } else {
        localStorage.setItem(`${MESSAGE_PREFIX}${chatId}`, JSON.stringify(toCache));
      }
    });
  }
  function getCachedMessages(chatId) {
    return __async(this, null, function* () {
      if (isIndexedDBAvailable()) {
        try {
          const database = yield getDB();
          const transaction = database.transaction(["messages"], "readonly");
          const store = transaction.objectStore("messages");
          const index = store.index("chatId");
          return new Promise((resolve, reject) => {
            const request = index.getAll(chatId);
            request.onsuccess = () => {
              const messages = request.result || [];
              messages.sort((a, b) => a.timestamp - b.timestamp);
              resolve(messages);
            };
            request.onerror = () => reject(request.error);
          });
        } catch (error) {
          console.warn("IndexedDB message read failed, trying localStorage:", error);
          const cached = localStorage.getItem(`${MESSAGE_PREFIX}${chatId}`);
          return cached ? JSON.parse(cached) : [];
        }
      } else {
        const cached = localStorage.getItem(`${MESSAGE_PREFIX}${chatId}`);
        return cached ? JSON.parse(cached) : [];
      }
    });
  }
  function useChatList() {
    const {
      chats,
      filteredChats,
      searchQuery,
      setChats,
      updateChat,
      setSearchQuery,
      markAsRead,
      updateLastMessage
    } = useChatListStore();
    const loadChats = reactExports.useCallback(() => __async(null, null, function* () {
      try {
        const cached = yield getCachedChatList();
        if (cached.length > 0) {
          setChats(cached);
        }
      } catch (error) {
        console.warn("Failed to load cached chats:", error);
      }
      try {
        const friends = yield friendsApi.list();
        if (!Array.isArray(friends)) {
          console.warn("[useChatList] friendsApi.list() returned invalid data (not an array):", friends);
          return;
        }
        console.log(`[useChatList] Loaded ${friends.length} friends from API`);
        const acceptedFriends = friends.filter((f) => f && f.status === "accepted");
        console.log(`[useChatList] ${acceptedFriends.length} accepted friendships`);
        const newChats = acceptedFriends.map((friend) => ({
          id: friend.username,
          name: friend.username,
          unreadCount: 0,
          pinned: false,
          muted: false
        }));
        setChats(newChats);
        yield cacheChatList(newChats);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    }), [setChats]);
    reactExports.useEffect(() => {
      loadChats();
    }, [loadChats]);
    const refresh = reactExports.useCallback(() => {
      loadChats();
    }, [loadChats]);
    const updateLastMessageForChat = reactExports.useCallback((chatId, text, sender) => {
      updateLastMessage(chatId, {
        text,
        timestamp: Date.now(),
        sender
      });
    }, [updateLastMessage]);
    return {
      chats: searchQuery ? filteredChats : chats,
      searchQuery,
      setSearchQuery,
      refresh,
      updateChat,
      markAsRead,
      updateLastMessage: updateLastMessageForChat
    };
  }
  var reactDomExports = requireReactDom();
  function memo(getDeps, fn, opts) {
    var _a2;
    let deps = (_a2 = opts.initialDeps) != null ? _a2 : [];
    let result;
    function memoizedFunction() {
      var _a3, _b2, _c2, _d2;
      let depTime;
      if (opts.key && ((_a3 = opts.debug) == null ? void 0 : _a3.call(opts))) depTime = Date.now();
      const newDeps = getDeps();
      const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
      if (!depsChanged) {
        return result;
      }
      deps = newDeps;
      let resultTime;
      if (opts.key && ((_b2 = opts.debug) == null ? void 0 : _b2.call(opts))) resultTime = Date.now();
      result = fn(...newDeps);
      if (opts.key && ((_c2 = opts.debug) == null ? void 0 : _c2.call(opts))) {
        const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
        const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
        const resultFpsPercentage = resultEndTime / 16;
        const pad = (str, num) => {
          str = String(str);
          while (str.length < num) {
            str = " " + str;
          }
          return str;
        };
        console.info(
          `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
          `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
            0,
            Math.min(120 - 120 * resultFpsPercentage, 120)
          )}deg 100% 31%);`,
          opts == null ? void 0 : opts.key
        );
      }
      (_d2 = opts == null ? void 0 : opts.onChange) == null ? void 0 : _d2.call(opts, result);
      return result;
    }
    memoizedFunction.updateDeps = (newDeps) => {
      deps = newDeps;
    };
    return memoizedFunction;
  }
  function notUndefined(value, msg) {
    if (value === void 0) {
      throw new Error(`Unexpected undefined${""}`);
    } else {
      return value;
    }
  }
  const approxEqual = (a, b) => Math.abs(a - b) < 1.01;
  const debounce = (targetWindow, fn, ms) => {
    let timeoutId;
    return function(...args) {
      targetWindow.clearTimeout(timeoutId);
      timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
    };
  };
  const getRect = (element) => {
    const { offsetWidth, offsetHeight } = element;
    return { width: offsetWidth, height: offsetHeight };
  };
  const defaultKeyExtractor = (index) => index;
  const defaultRangeExtractor = (range) => {
    const start = Math.max(range.startIndex - range.overscan, 0);
    const end = Math.min(range.endIndex + range.overscan, range.count - 1);
    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  };
  const observeElementRect = (instance, cb) => {
    const element = instance.scrollElement;
    if (!element) {
      return;
    }
    const targetWindow = instance.targetWindow;
    if (!targetWindow) {
      return;
    }
    const handler = (rect) => {
      const { width, height } = rect;
      cb({ width: Math.round(width), height: Math.round(height) });
    };
    handler(getRect(element));
    if (!targetWindow.ResizeObserver) {
      return () => {
      };
    }
    const observer = new targetWindow.ResizeObserver((entries) => {
      const run = () => {
        const entry = entries[0];
        if (entry == null ? void 0 : entry.borderBoxSize) {
          const box = entry.borderBoxSize[0];
          if (box) {
            handler({ width: box.inlineSize, height: box.blockSize });
            return;
          }
        }
        handler(getRect(element));
      };
      instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
    });
    observer.observe(element, { box: "border-box" });
    return () => {
      observer.unobserve(element);
    };
  };
  const addEventListenerOptions = {
    passive: true
  };
  const supportsScrollend = typeof window == "undefined" ? true : "onscrollend" in window;
  const observeElementOffset = (instance, cb) => {
    const element = instance.scrollElement;
    if (!element) {
      return;
    }
    const targetWindow = instance.targetWindow;
    if (!targetWindow) {
      return;
    }
    let offset = 0;
    const fallback = instance.options.useScrollendEvent && supportsScrollend ? () => void 0 : debounce(
      targetWindow,
      () => {
        cb(offset, false);
      },
      instance.options.isScrollingResetDelay
    );
    const createHandler = (isScrolling) => () => {
      const { horizontal, isRtl } = instance.options;
      offset = horizontal ? element["scrollLeft"] * (isRtl && -1 || 1) : element["scrollTop"];
      fallback();
      cb(offset, isScrolling);
    };
    const handler = createHandler(true);
    const endHandler = createHandler(false);
    endHandler();
    element.addEventListener("scroll", handler, addEventListenerOptions);
    const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
    if (registerScrollendEvent) {
      element.addEventListener("scrollend", endHandler, addEventListenerOptions);
    }
    return () => {
      element.removeEventListener("scroll", handler);
      if (registerScrollendEvent) {
        element.removeEventListener("scrollend", endHandler);
      }
    };
  };
  const measureElement = (element, entry, instance) => {
    if (entry == null ? void 0 : entry.borderBoxSize) {
      const box = entry.borderBoxSize[0];
      if (box) {
        const size = Math.round(
          box[instance.options.horizontal ? "inlineSize" : "blockSize"]
        );
        return size;
      }
    }
    return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
  };
  const elementScroll = (offset, {
    adjustments = 0,
    behavior
  }, instance) => {
    var _a2, _b2;
    const toOffset = offset + adjustments;
    (_b2 = (_a2 = instance.scrollElement) == null ? void 0 : _a2.scrollTo) == null ? void 0 : _b2.call(_a2, {
      [instance.options.horizontal ? "left" : "top"]: toOffset,
      behavior
    });
  };
  class Virtualizer {
    constructor(opts) {
      this.unsubs = [];
      this.scrollElement = null;
      this.targetWindow = null;
      this.isScrolling = false;
      this.measurementsCache = [];
      this.itemSizeCache = /* @__PURE__ */ new Map();
      this.pendingMeasuredCacheIndexes = [];
      this.scrollRect = null;
      this.scrollOffset = null;
      this.scrollDirection = null;
      this.scrollAdjustments = 0;
      this.elementsCache = /* @__PURE__ */ new Map();
      this.observer = /* @__PURE__ */ (() => {
        let _ro = null;
        const get = () => {
          if (_ro) {
            return _ro;
          }
          if (!this.targetWindow || !this.targetWindow.ResizeObserver) {
            return null;
          }
          return _ro = new this.targetWindow.ResizeObserver((entries) => {
            entries.forEach((entry) => {
              const run = () => {
                this._measureElement(entry.target, entry);
              };
              this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
            });
          });
        };
        return {
          disconnect: () => {
            var _a2;
            (_a2 = get()) == null ? void 0 : _a2.disconnect();
            _ro = null;
          },
          observe: (target) => {
            var _a2;
            return (_a2 = get()) == null ? void 0 : _a2.observe(target, { box: "border-box" });
          },
          unobserve: (target) => {
            var _a2;
            return (_a2 = get()) == null ? void 0 : _a2.unobserve(target);
          }
        };
      })();
      this.range = null;
      this.setOptions = (opts2) => {
        Object.entries(opts2).forEach(([key, value]) => {
          if (typeof value === "undefined") delete opts2[key];
        });
        this.options = __spreadValues({
          debug: false,
          initialOffset: 0,
          overscan: 1,
          paddingStart: 0,
          paddingEnd: 0,
          scrollPaddingStart: 0,
          scrollPaddingEnd: 0,
          horizontal: false,
          getItemKey: defaultKeyExtractor,
          rangeExtractor: defaultRangeExtractor,
          onChange: () => {
          },
          measureElement,
          initialRect: { width: 0, height: 0 },
          scrollMargin: 0,
          gap: 0,
          indexAttribute: "data-index",
          initialMeasurementsCache: [],
          lanes: 1,
          isScrollingResetDelay: 150,
          enabled: true,
          isRtl: false,
          useScrollendEvent: false,
          useAnimationFrameWithResizeObserver: false
        }, opts2);
      };
      this.notify = (sync) => {
        var _a2, _b2;
        (_b2 = (_a2 = this.options).onChange) == null ? void 0 : _b2.call(_a2, this, sync);
      };
      this.maybeNotify = memo(
        () => {
          this.calculateRange();
          return [
            this.isScrolling,
            this.range ? this.range.startIndex : null,
            this.range ? this.range.endIndex : null
          ];
        },
        (isScrolling) => {
          this.notify(isScrolling);
        },
        {
          key: false,
          debug: () => this.options.debug,
          initialDeps: [
            this.isScrolling,
            this.range ? this.range.startIndex : null,
            this.range ? this.range.endIndex : null
          ]
        }
      );
      this.cleanup = () => {
        this.unsubs.filter(Boolean).forEach((d) => d());
        this.unsubs = [];
        this.observer.disconnect();
        this.scrollElement = null;
        this.targetWindow = null;
      };
      this._didMount = () => {
        return () => {
          this.cleanup();
        };
      };
      this._willUpdate = () => {
        var _a3;
        var _a2;
        const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
        if (this.scrollElement !== scrollElement) {
          this.cleanup();
          if (!scrollElement) {
            this.maybeNotify();
            return;
          }
          this.scrollElement = scrollElement;
          if (this.scrollElement && "ownerDocument" in this.scrollElement) {
            this.targetWindow = this.scrollElement.ownerDocument.defaultView;
          } else {
            this.targetWindow = (_a3 = (_a2 = this.scrollElement) == null ? void 0 : _a2.window) != null ? _a3 : null;
          }
          this.elementsCache.forEach((cached) => {
            this.observer.observe(cached);
          });
          this._scrollToOffset(this.getScrollOffset(), {
            adjustments: void 0,
            behavior: void 0
          });
          this.unsubs.push(
            this.options.observeElementRect(this, (rect) => {
              this.scrollRect = rect;
              this.maybeNotify();
            })
          );
          this.unsubs.push(
            this.options.observeElementOffset(this, (offset, isScrolling) => {
              this.scrollAdjustments = 0;
              this.scrollDirection = isScrolling ? this.getScrollOffset() < offset ? "forward" : "backward" : null;
              this.scrollOffset = offset;
              this.isScrolling = isScrolling;
              this.maybeNotify();
            })
          );
        }
      };
      this.getSize = () => {
        var _a2;
        if (!this.options.enabled) {
          this.scrollRect = null;
          return 0;
        }
        this.scrollRect = (_a2 = this.scrollRect) != null ? _a2 : this.options.initialRect;
        return this.scrollRect[this.options.horizontal ? "width" : "height"];
      };
      this.getScrollOffset = () => {
        var _a2;
        if (!this.options.enabled) {
          this.scrollOffset = null;
          return 0;
        }
        this.scrollOffset = (_a2 = this.scrollOffset) != null ? _a2 : typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset;
        return this.scrollOffset;
      };
      this.getFurthestMeasurement = (measurements, index) => {
        const furthestMeasurementsFound = /* @__PURE__ */ new Map();
        const furthestMeasurements = /* @__PURE__ */ new Map();
        for (let m = index - 1; m >= 0; m--) {
          const measurement = measurements[m];
          if (furthestMeasurementsFound.has(measurement.lane)) {
            continue;
          }
          const previousFurthestMeasurement = furthestMeasurements.get(
            measurement.lane
          );
          if (previousFurthestMeasurement == null || measurement.end > previousFurthestMeasurement.end) {
            furthestMeasurements.set(measurement.lane, measurement);
          } else if (measurement.end < previousFurthestMeasurement.end) {
            furthestMeasurementsFound.set(measurement.lane, true);
          }
          if (furthestMeasurementsFound.size === this.options.lanes) {
            break;
          }
        }
        return furthestMeasurements.size === this.options.lanes ? Array.from(furthestMeasurements.values()).sort((a, b) => {
          if (a.end === b.end) {
            return a.index - b.index;
          }
          return a.end - b.end;
        })[0] : void 0;
      };
      this.getMeasurementOptions = memo(
        () => [
          this.options.count,
          this.options.paddingStart,
          this.options.scrollMargin,
          this.options.getItemKey,
          this.options.enabled
        ],
        (count, paddingStart, scrollMargin, getItemKey, enabled) => {
          this.pendingMeasuredCacheIndexes = [];
          return {
            count,
            paddingStart,
            scrollMargin,
            getItemKey,
            enabled
          };
        },
        {
          key: false
        }
      );
      this.getMeasurements = memo(
        () => [this.getMeasurementOptions(), this.itemSizeCache],
        ({ count, paddingStart, scrollMargin, getItemKey, enabled }, itemSizeCache) => {
          if (!enabled) {
            this.measurementsCache = [];
            this.itemSizeCache.clear();
            return [];
          }
          if (this.measurementsCache.length === 0) {
            this.measurementsCache = this.options.initialMeasurementsCache;
            this.measurementsCache.forEach((item) => {
              this.itemSizeCache.set(item.key, item.size);
            });
          }
          const min = this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
          this.pendingMeasuredCacheIndexes = [];
          const measurements = this.measurementsCache.slice(0, min);
          for (let i = min; i < count; i++) {
            const key = getItemKey(i);
            const furthestMeasurement = this.options.lanes === 1 ? measurements[i - 1] : this.getFurthestMeasurement(measurements, i);
            const start = furthestMeasurement ? furthestMeasurement.end + this.options.gap : paddingStart + scrollMargin;
            const measuredSize = itemSizeCache.get(key);
            const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
            const end = start + size;
            const lane = furthestMeasurement ? furthestMeasurement.lane : i % this.options.lanes;
            measurements[i] = {
              index: i,
              start,
              size,
              end,
              key,
              lane
            };
          }
          this.measurementsCache = measurements;
          return measurements;
        },
        {
          key: false,
          debug: () => this.options.debug
        }
      );
      this.calculateRange = memo(
        () => [
          this.getMeasurements(),
          this.getSize(),
          this.getScrollOffset(),
          this.options.lanes
        ],
        (measurements, outerSize, scrollOffset, lanes) => {
          return this.range = measurements.length > 0 && outerSize > 0 ? calculateRange({
            measurements,
            outerSize,
            scrollOffset,
            lanes
          }) : null;
        },
        {
          key: false,
          debug: () => this.options.debug
        }
      );
      this.getVirtualIndexes = memo(
        () => {
          let startIndex = null;
          let endIndex = null;
          const range = this.calculateRange();
          if (range) {
            startIndex = range.startIndex;
            endIndex = range.endIndex;
          }
          this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
          return [
            this.options.rangeExtractor,
            this.options.overscan,
            this.options.count,
            startIndex,
            endIndex
          ];
        },
        (rangeExtractor, overscan, count, startIndex, endIndex) => {
          return startIndex === null || endIndex === null ? [] : rangeExtractor({
            startIndex,
            endIndex,
            overscan,
            count
          });
        },
        {
          key: false,
          debug: () => this.options.debug
        }
      );
      this.indexFromElement = (node) => {
        const attributeName = this.options.indexAttribute;
        const indexStr = node.getAttribute(attributeName);
        if (!indexStr) {
          console.warn(
            `Missing attribute name '${attributeName}={index}' on measured element.`
          );
          return -1;
        }
        return parseInt(indexStr, 10);
      };
      this._measureElement = (node, entry) => {
        const index = this.indexFromElement(node);
        const item = this.measurementsCache[index];
        if (!item) {
          return;
        }
        const key = item.key;
        const prevNode = this.elementsCache.get(key);
        if (prevNode !== node) {
          if (prevNode) {
            this.observer.unobserve(prevNode);
          }
          this.observer.observe(node);
          this.elementsCache.set(key, node);
        }
        if (node.isConnected) {
          this.resizeItem(index, this.options.measureElement(node, entry, this));
        }
      };
      this.resizeItem = (index, size) => {
        var _a2;
        const item = this.measurementsCache[index];
        if (!item) {
          return;
        }
        const itemSize = (_a2 = this.itemSizeCache.get(item.key)) != null ? _a2 : item.size;
        const delta = size - itemSize;
        if (delta !== 0) {
          if (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(item, delta, this) : item.start < this.getScrollOffset() + this.scrollAdjustments) {
            this._scrollToOffset(this.getScrollOffset(), {
              adjustments: this.scrollAdjustments += delta,
              behavior: void 0
            });
          }
          this.pendingMeasuredCacheIndexes.push(item.index);
          this.itemSizeCache = new Map(this.itemSizeCache.set(item.key, size));
          this.notify(false);
        }
      };
      this.measureElement = (node) => {
        if (!node) {
          this.elementsCache.forEach((cached, key) => {
            if (!cached.isConnected) {
              this.observer.unobserve(cached);
              this.elementsCache.delete(key);
            }
          });
          return;
        }
        this._measureElement(node, void 0);
      };
      this.getVirtualItems = memo(
        () => [this.getVirtualIndexes(), this.getMeasurements()],
        (indexes, measurements) => {
          const virtualItems = [];
          for (let k = 0, len = indexes.length; k < len; k++) {
            const i = indexes[k];
            const measurement = measurements[i];
            virtualItems.push(measurement);
          }
          return virtualItems;
        },
        {
          key: false,
          debug: () => this.options.debug
        }
      );
      this.getVirtualItemForOffset = (offset) => {
        const measurements = this.getMeasurements();
        if (measurements.length === 0) {
          return void 0;
        }
        return notUndefined(
          measurements[findNearestBinarySearch(
            0,
            measurements.length - 1,
            (index) => notUndefined(measurements[index]).start,
            offset
          )]
        );
      };
      this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
        const size = this.getSize();
        const scrollOffset = this.getScrollOffset();
        if (align === "auto") {
          align = toOffset >= scrollOffset + size ? "end" : "start";
        }
        if (align === "center") {
          toOffset += (itemSize - size) / 2;
        } else if (align === "end") {
          toOffset -= size;
        }
        const maxOffset = this.getTotalSize() + this.options.scrollMargin - size;
        return Math.max(Math.min(maxOffset, toOffset), 0);
      };
      this.getOffsetForIndex = (index, align = "auto") => {
        index = Math.max(0, Math.min(index, this.options.count - 1));
        const item = this.measurementsCache[index];
        if (!item) {
          return void 0;
        }
        const size = this.getSize();
        const scrollOffset = this.getScrollOffset();
        if (align === "auto") {
          if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
            align = "end";
          } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
            align = "start";
          } else {
            return [scrollOffset, align];
          }
        }
        const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
        return [
          this.getOffsetForAlignment(toOffset, align, item.size),
          align
        ];
      };
      this.isDynamicMode = () => this.elementsCache.size > 0;
      this.scrollToOffset = (toOffset, { align = "start", behavior } = {}) => {
        if (behavior === "smooth" && this.isDynamicMode()) {
          console.warn(
            "The `smooth` scroll behavior is not fully supported with dynamic size."
          );
        }
        this._scrollToOffset(this.getOffsetForAlignment(toOffset, align), {
          adjustments: void 0,
          behavior
        });
      };
      this.scrollToIndex = (index, { align: initialAlign = "auto", behavior } = {}) => {
        if (behavior === "smooth" && this.isDynamicMode()) {
          console.warn(
            "The `smooth` scroll behavior is not fully supported with dynamic size."
          );
        }
        index = Math.max(0, Math.min(index, this.options.count - 1));
        let attempts = 0;
        const maxAttempts = 10;
        const tryScroll = (currentAlign) => {
          if (!this.targetWindow) return;
          const offsetInfo = this.getOffsetForIndex(index, currentAlign);
          if (!offsetInfo) {
            console.warn("Failed to get offset for index:", index);
            return;
          }
          const [offset, align] = offsetInfo;
          this._scrollToOffset(offset, { adjustments: void 0, behavior });
          this.targetWindow.requestAnimationFrame(() => {
            const currentOffset = this.getScrollOffset();
            const afterInfo = this.getOffsetForIndex(index, align);
            if (!afterInfo) {
              console.warn("Failed to get offset for index:", index);
              return;
            }
            if (!approxEqual(afterInfo[0], currentOffset)) {
              scheduleRetry(align);
            }
          });
        };
        const scheduleRetry = (align) => {
          if (!this.targetWindow) return;
          attempts++;
          if (attempts < maxAttempts) {
            this.targetWindow.requestAnimationFrame(() => tryScroll(align));
          } else {
            console.warn(
              `Failed to scroll to index ${index} after ${maxAttempts} attempts.`
            );
          }
        };
        tryScroll(initialAlign);
      };
      this.scrollBy = (delta, { behavior } = {}) => {
        if (behavior === "smooth" && this.isDynamicMode()) {
          console.warn(
            "The `smooth` scroll behavior is not fully supported with dynamic size."
          );
        }
        this._scrollToOffset(this.getScrollOffset() + delta, {
          adjustments: void 0,
          behavior
        });
      };
      this.getTotalSize = () => {
        var _a3;
        var _a2;
        const measurements = this.getMeasurements();
        let end;
        if (measurements.length === 0) {
          end = this.options.paddingStart;
        } else if (this.options.lanes === 1) {
          end = (_a3 = (_a2 = measurements[measurements.length - 1]) == null ? void 0 : _a2.end) != null ? _a3 : 0;
        } else {
          const endByLane = Array(this.options.lanes).fill(null);
          let endIndex = measurements.length - 1;
          while (endIndex >= 0 && endByLane.some((val) => val === null)) {
            const item = measurements[endIndex];
            if (endByLane[item.lane] === null) {
              endByLane[item.lane] = item.end;
            }
            endIndex--;
          }
          end = Math.max(...endByLane.filter((val) => val !== null));
        }
        return Math.max(
          end - this.options.scrollMargin + this.options.paddingEnd,
          0
        );
      };
      this._scrollToOffset = (offset, {
        adjustments,
        behavior
      }) => {
        this.options.scrollToFn(offset, { behavior, adjustments }, this);
      };
      this.measure = () => {
        this.itemSizeCache = /* @__PURE__ */ new Map();
        this.notify(false);
      };
      this.setOptions(opts);
    }
  }
  const findNearestBinarySearch = (low, high, getCurrentValue, value) => {
    while (low <= high) {
      const middle = (low + high) / 2 | 0;
      const currentValue = getCurrentValue(middle);
      if (currentValue < value) {
        low = middle + 1;
      } else if (currentValue > value) {
        high = middle - 1;
      } else {
        return middle;
      }
    }
    if (low > 0) {
      return low - 1;
    } else {
      return 0;
    }
  };
  function calculateRange({
    measurements,
    outerSize,
    scrollOffset,
    lanes
  }) {
    const lastIndex = measurements.length - 1;
    const getOffset = (index) => measurements[index].start;
    if (measurements.length <= lanes) {
      return {
        startIndex: 0,
        endIndex: lastIndex
      };
    }
    let startIndex = findNearestBinarySearch(
      0,
      lastIndex,
      getOffset,
      scrollOffset
    );
    let endIndex = startIndex;
    if (lanes === 1) {
      while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
        endIndex++;
      }
    } else if (lanes > 1) {
      const endPerLane = Array(lanes).fill(0);
      while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
        const item = measurements[endIndex];
        endPerLane[item.lane] = item.end;
        endIndex++;
      }
      const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
      while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
        const item = measurements[startIndex];
        startPerLane[item.lane] = item.start;
        startIndex--;
      }
      startIndex = Math.max(0, startIndex - startIndex % lanes);
      endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
    }
    return { startIndex, endIndex };
  }
  const useIsomorphicLayoutEffect = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
  function useVirtualizerBase(options) {
    const rerender = reactExports.useReducer(() => ({}), {})[1];
    const resolvedOptions = __spreadProps(__spreadValues({}, options), {
      onChange: (instance2, sync) => {
        var _a2;
        if (sync) {
          reactDomExports.flushSync(rerender);
        } else {
          rerender();
        }
        (_a2 = options.onChange) == null ? void 0 : _a2.call(options, instance2, sync);
      }
    });
    const [instance] = reactExports.useState(
      () => new Virtualizer(resolvedOptions)
    );
    instance.setOptions(resolvedOptions);
    useIsomorphicLayoutEffect(() => {
      return instance._didMount();
    }, []);
    useIsomorphicLayoutEffect(() => {
      return instance._willUpdate();
    });
    return instance;
  }
  function useVirtualizer(options) {
    return useVirtualizerBase(__spreadValues({
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll
    }, options));
  }
  var dayjs_min$1 = { exports: {} };
  var dayjs_min = dayjs_min$1.exports;
  var hasRequiredDayjs_min;
  function requireDayjs_min() {
    if (hasRequiredDayjs_min) return dayjs_min$1.exports;
    hasRequiredDayjs_min = 1;
    (function(module, exports$1) {
      !(function(t, e) {
        module.exports = e();
      })(dayjs_min, (function() {
        var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
          var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
          return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
        } }, m = function(t2, e2, n2) {
          var r2 = String(t2);
          return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
        }, v = { s: m, z: function(t2) {
          var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
          return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
        }, m: function t2(e2, n2) {
          if (e2.date() < n2.date()) return -t2(n2, e2);
          var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
          return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
        }, a: function(t2) {
          return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
        }, p: function(t2) {
          return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
        }, u: function(t2) {
          return void 0 === t2;
        } }, g = "en", D = {};
        D[g] = M;
        var p = "$isDayjsObject", S = function(t2) {
          return t2 instanceof _ || !(!t2 || !t2[p]);
        }, w = function t2(e2, n2, r2) {
          var i2;
          if (!e2) return g;
          if ("string" == typeof e2) {
            var s2 = e2.toLowerCase();
            D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
            var u2 = e2.split("-");
            if (!i2 && u2.length > 1) return t2(u2[0]);
          } else {
            var a2 = e2.name;
            D[a2] = e2, i2 = a2;
          }
          return !r2 && i2 && (g = i2), i2 || !r2 && g;
        }, O = function(t2, e2) {
          if (S(t2)) return t2.clone();
          var n2 = "object" == typeof e2 ? e2 : {};
          return n2.date = t2, n2.args = arguments, new _(n2);
        }, b = v;
        b.l = w, b.i = S, b.w = function(t2, e2) {
          return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
        };
        var _ = (function() {
          function M2(t2) {
            this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
          }
          var m2 = M2.prototype;
          return m2.parse = function(t2) {
            this.$d = (function(t3) {
              var e2 = t3.date, n2 = t3.utc;
              if (null === e2) return /* @__PURE__ */ new Date(NaN);
              if (b.u(e2)) return /* @__PURE__ */ new Date();
              if (e2 instanceof Date) return new Date(e2);
              if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                var r2 = e2.match($);
                if (r2) {
                  var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                  return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                }
              }
              return new Date(e2);
            })(t2), this.init();
          }, m2.init = function() {
            var t2 = this.$d;
            this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
          }, m2.$utils = function() {
            return b;
          }, m2.isValid = function() {
            return !(this.$d.toString() === l);
          }, m2.isSame = function(t2, e2) {
            var n2 = O(t2);
            return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
          }, m2.isAfter = function(t2, e2) {
            return O(t2) < this.startOf(e2);
          }, m2.isBefore = function(t2, e2) {
            return this.endOf(e2) < O(t2);
          }, m2.$g = function(t2, e2, n2) {
            return b.u(t2) ? this[e2] : this.set(n2, t2);
          }, m2.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
          }, m2.valueOf = function() {
            return this.$d.getTime();
          }, m2.startOf = function(t2, e2) {
            var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
              var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
              return r2 ? i2 : i2.endOf(a);
            }, $2 = function(t3, e3) {
              return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
            }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
            switch (f2) {
              case h:
                return r2 ? l2(1, 0) : l2(31, 11);
              case c:
                return r2 ? l2(1, M3) : l2(0, M3 + 1);
              case o:
                var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
              case a:
              case d:
                return $2(v2 + "Hours", 0);
              case u:
                return $2(v2 + "Minutes", 1);
              case s:
                return $2(v2 + "Seconds", 2);
              case i:
                return $2(v2 + "Milliseconds", 3);
              default:
                return this.clone();
            }
          }, m2.endOf = function(t2) {
            return this.startOf(t2, false);
          }, m2.$set = function(t2, e2) {
            var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
            if (o2 === c || o2 === h) {
              var y2 = this.clone().set(d, 1);
              y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
            } else l2 && this.$d[l2]($2);
            return this.init(), this;
          }, m2.set = function(t2, e2) {
            return this.clone().$set(t2, e2);
          }, m2.get = function(t2) {
            return this[b.p(t2)]();
          }, m2.add = function(r2, f2) {
            var d2, l2 = this;
            r2 = Number(r2);
            var $2 = b.p(f2), y2 = function(t2) {
              var e2 = O(l2);
              return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
            };
            if ($2 === c) return this.set(c, this.$M + r2);
            if ($2 === h) return this.set(h, this.$y + r2);
            if ($2 === a) return y2(1);
            if ($2 === o) return y2(7);
            var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
            return b.w(m3, this);
          }, m2.subtract = function(t2, e2) {
            return this.add(-1 * t2, e2);
          }, m2.format = function(t2) {
            var e2 = this, n2 = this.$locale();
            if (!this.isValid()) return n2.invalidDate || l;
            var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
              return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
            }, d2 = function(t3) {
              return b.s(s2 % 12 || 12, t3, "0");
            }, $2 = f2 || function(t3, e3, n3) {
              var r3 = t3 < 12 ? "AM" : "PM";
              return n3 ? r3.toLowerCase() : r3;
            };
            return r2.replace(y, (function(t3, r3) {
              return r3 || (function(t4) {
                switch (t4) {
                  case "YY":
                    return String(e2.$y).slice(-2);
                  case "YYYY":
                    return b.s(e2.$y, 4, "0");
                  case "M":
                    return a2 + 1;
                  case "MM":
                    return b.s(a2 + 1, 2, "0");
                  case "MMM":
                    return h2(n2.monthsShort, a2, c2, 3);
                  case "MMMM":
                    return h2(c2, a2);
                  case "D":
                    return e2.$D;
                  case "DD":
                    return b.s(e2.$D, 2, "0");
                  case "d":
                    return String(e2.$W);
                  case "dd":
                    return h2(n2.weekdaysMin, e2.$W, o2, 2);
                  case "ddd":
                    return h2(n2.weekdaysShort, e2.$W, o2, 3);
                  case "dddd":
                    return o2[e2.$W];
                  case "H":
                    return String(s2);
                  case "HH":
                    return b.s(s2, 2, "0");
                  case "h":
                    return d2(1);
                  case "hh":
                    return d2(2);
                  case "a":
                    return $2(s2, u2, true);
                  case "A":
                    return $2(s2, u2, false);
                  case "m":
                    return String(u2);
                  case "mm":
                    return b.s(u2, 2, "0");
                  case "s":
                    return String(e2.$s);
                  case "ss":
                    return b.s(e2.$s, 2, "0");
                  case "SSS":
                    return b.s(e2.$ms, 3, "0");
                  case "Z":
                    return i2;
                }
                return null;
              })(t3) || i2.replace(":", "");
            }));
          }, m2.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }, m2.diff = function(r2, d2, l2) {
            var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
              return b.m(y2, m3);
            };
            switch (M3) {
              case h:
                $2 = D2() / 12;
                break;
              case c:
                $2 = D2();
                break;
              case f:
                $2 = D2() / 3;
                break;
              case o:
                $2 = (g2 - v2) / 6048e5;
                break;
              case a:
                $2 = (g2 - v2) / 864e5;
                break;
              case u:
                $2 = g2 / n;
                break;
              case s:
                $2 = g2 / e;
                break;
              case i:
                $2 = g2 / t;
                break;
              default:
                $2 = g2;
            }
            return l2 ? $2 : b.a($2);
          }, m2.daysInMonth = function() {
            return this.endOf(c).$D;
          }, m2.$locale = function() {
            return D[this.$L];
          }, m2.locale = function(t2, e2) {
            if (!t2) return this.$L;
            var n2 = this.clone(), r2 = w(t2, e2, true);
            return r2 && (n2.$L = r2), n2;
          }, m2.clone = function() {
            return b.w(this.$d, this);
          }, m2.toDate = function() {
            return new Date(this.valueOf());
          }, m2.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
          }, m2.toISOString = function() {
            return this.$d.toISOString();
          }, m2.toString = function() {
            return this.$d.toUTCString();
          }, M2;
        })(), k = _.prototype;
        return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function(t2) {
          k[t2[1]] = function(e2) {
            return this.$g(e2, t2[0], t2[1]);
          };
        })), O.extend = function(t2, e2) {
          return t2.$i || (t2(e2, _, O), t2.$i = true), O;
        }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
          return O(1e3 * t2);
        }, O.en = D[g], O.Ls = D, O.p = {}, O;
      }));
    })(dayjs_min$1);
    return dayjs_min$1.exports;
  }
  var dayjs_minExports = requireDayjs_min();
  const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
  var relativeTime$2 = { exports: {} };
  var relativeTime$1 = relativeTime$2.exports;
  var hasRequiredRelativeTime;
  function requireRelativeTime() {
    if (hasRequiredRelativeTime) return relativeTime$2.exports;
    hasRequiredRelativeTime = 1;
    (function(module, exports$1) {
      !(function(r, e) {
        module.exports = e();
      })(relativeTime$1, (function() {
        return function(r, e, t) {
          r = r || {};
          var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
          function i(r2, e2, t2, o2) {
            return n.fromToBase(r2, e2, t2, o2);
          }
          t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
            for (var f, a, s, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
              var y = h[c];
              y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
              var p = (r.rounding || Math.round)(Math.abs(f));
              if (s = f > 0, p <= y.r || !y.r) {
                p <= 1 && c > 0 && (y = h[c - 1]);
                var v = l[y.l];
                u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
                break;
              }
            }
            if (n2) return a;
            var M = s ? l.future : l.past;
            return "function" == typeof M ? M(a) : M.replace("%s", a);
          }, n.to = function(r2, e2) {
            return i(r2, e2, this, true);
          }, n.from = function(r2, e2) {
            return i(r2, e2, this);
          };
          var d = function(r2) {
            return r2.$u ? t.utc() : t();
          };
          n.toNow = function(r2) {
            return this.to(d(this), r2);
          }, n.fromNow = function(r2) {
            return this.from(d(this), r2);
          };
        };
      }));
    })(relativeTime$2);
    return relativeTime$2.exports;
  }
  var relativeTimeExports = requireRelativeTime();
  const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
  var localizedFormat$2 = { exports: {} };
  var localizedFormat$1 = localizedFormat$2.exports;
  var hasRequiredLocalizedFormat;
  function requireLocalizedFormat() {
    if (hasRequiredLocalizedFormat) return localizedFormat$2.exports;
    hasRequiredLocalizedFormat = 1;
    (function(module, exports$1) {
      !(function(e, t) {
        module.exports = t();
      })(localizedFormat$1, (function() {
        var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
        return function(t, o, n) {
          var r = o.prototype, i = r.format;
          n.en.formats = e, r.format = function(t2) {
            void 0 === t2 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
            var o2 = this.$locale().formats, n2 = (function(t3, o3) {
              return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(t4, n3, r2) {
                var i2 = r2 && r2.toUpperCase();
                return n3 || o3[r2] || e[r2] || o3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(e2, t5, o4) {
                  return t5 || o4.slice(1);
                }));
              }));
            })(t2, void 0 === o2 ? {} : o2);
            return i.call(this, n2);
          };
        };
      }));
    })(localizedFormat$2);
    return localizedFormat$2.exports;
  }
  var localizedFormatExports = requireLocalizedFormat();
  const localizedFormat = /* @__PURE__ */ getDefaultExportFromCjs(localizedFormatExports);
  dayjs.extend(relativeTime);
  dayjs.extend(localizedFormat);
  const formatMessageTime = (timestamp) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, "day");
    if (diffDays === 0) {
      return date.format("HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.format("dddd");
    } else if (date.year() === now.year()) {
      return date.format("MMM D");
    } else {
      return date.format("MMM D, YYYY");
    }
  };
  const formatChatListTime = (timestamp) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, "day");
    if (diffDays === 0) {
      return date.format("HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.format("ddd");
    } else if (date.year() === now.year()) {
      return date.format("MMM D");
    } else {
      return date.format("MM/DD/YY");
    }
  };
  const formatDayHeader = (dateString) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffDays = now.diff(date, "day");
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.format("dddd");
    } else if (date.year() === now.year()) {
      return date.format("MMMM D");
    } else {
      return date.format("MMMM D, YYYY");
    }
  };
  function ChatRow({ chat, isSelected, onClick }) {
    var _a2, _b2, _c2, _d2;
    const getInitials = (name) => {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };
    const lastMessageText = ((_a2 = chat.lastMessage) == null ? void 0 : _a2.text) || "No messages yet";
    const lastMessageTime = ((_b2 = chat.lastMessage) == null ? void 0 : _b2.timestamp) ? formatChatListTime(chat.lastMessage.timestamp) : "";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick,
        className: `
        flex items-center gap-3 p-3 cursor-pointer transition-colors
        ${isSelected ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--bg-hover)]"}
      `,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `
          w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
          ${isSelected ? "bg-white/20" : "bg-[var(--accent)]"}
        `, children: chat.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chat.avatar, alt: chat.name, className: "w-full h-full rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isSelected ? "text-white" : "text-white", children: getInitials(chat.name) }) }),
            chat.isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-[var(--success)] border-2 border-[var(--bg-elev)] rounded-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `
            font-semibold truncate
            ${isSelected ? "text-white" : "text-[var(--text)]"}
          `, children: chat.name }),
              chat.lastMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `
              text-xs flex-shrink-0 ml-2
              ${isSelected ? "text-white/80" : "text-[var(--text-muted)]"}
            `, children: lastMessageTime })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `
            text-sm truncate flex-1
            ${isSelected ? "text-white/90" : "text-[var(--text-muted)]"}
          `, children: [
                ((_c2 = chat.lastMessage) == null ? void 0 : _c2.sender) === chat.id ? "" : `${(_d2 = chat.lastMessage) == null ? void 0 : _d2.sender}: `,
                lastMessageText
              ] }),
              chat.unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `
              flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold
              ${isSelected ? "bg-white/20 text-white" : "bg-[var(--accent)] text-white"}
            `, children: chat.unreadCount > 99 ? "99+" : chat.unreadCount }),
              chat.muted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `
              flex-shrink-0 text-lg
              ${isSelected ? "text-white/60" : "text-[var(--text-muted)]"}
            `, children: "🔇" })
            ] })
          ] })
        ]
      }
    );
  }
  function ChatListVirtualized({
    chats,
    pinnedChats,
    unpinnedChats,
    selectedChatId,
    onSelectChat
  }) {
    const parentRef = reactExports.useRef(null);
    const virtualItems = [];
    pinnedChats.forEach((chat) => {
      virtualItems.push({ type: "chat", chat });
    });
    if (pinnedChats.length > 0 && unpinnedChats.length > 0) {
      virtualItems.push({ type: "divider" });
    }
    unpinnedChats.forEach((chat) => {
      virtualItems.push({ type: "chat", chat });
    });
    const virtualizer = useVirtualizer({
      count: virtualItems.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 72,
      // Chat row height
      overscan: 10
      // Render 10 extra items off-screen
    });
    if (chats.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No chats yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Start a conversation to see it here" })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: parentRef, className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative"
        },
        children: virtualizer.getVirtualItems().map((virtualItem) => {
          const item = virtualItems[virtualItem.index];
          if (item.type === "divider") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-[var(--divider)] mx-4 my-2" })
              },
              `divider-${virtualItem.index}`
            );
          }
          if (!item.chat) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChatRow,
                {
                  chat: item.chat,
                  isSelected: selectedChatId === item.chat.id,
                  onClick: () => onSelectChat(item.chat.id)
                }
              )
            },
            item.chat.id
          );
        })
      }
    ) });
  }
  function ChatList({ selectedChatId, onSelectChat, searchInputRef: externalSearchRef, onOpenSettings }) {
    const {
      chats,
      setSearchQuery,
      refresh
    } = useChatList();
    const internalSearchRef = reactExports.useRef(null);
    const searchInputRef = externalSearchRef || internalSearchRef;
    const searchTimeoutRef = reactExports.useRef();
    const handleSearchChange = (value) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 250);
    };
    reactExports.useEffect(() => {
      refresh();
    }, [refresh]);
    const pinnedChats = chats.filter((chat) => chat.pinned);
    const unpinnedChats = chats.filter((chat) => !chat.pinned);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-[var(--bg-elev)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-[var(--border)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[var(--text)]", children: "Chats" }),
          onOpenSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onOpenSettings,
              className: "p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]",
              title: "Settings",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: searchInputRef,
            type: "text",
            placeholder: "Search chats...",
            onChange: (e) => handleSearchChange(e.target.value),
            className: "w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)] placeholder-[var(--text-muted)]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChatListVirtualized,
        {
          chats,
          pinnedChats,
          unpinnedChats,
          selectedChatId,
          onSelectChat
        }
      )
    ] });
  }
  const groupMessagesByDay = (messages) => {
    const groups = /* @__PURE__ */ new Map();
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(msg);
    });
    return Array.from(groups.entries()).map(([date, msgs]) => ({
      date,
      messages: msgs.sort((a, b) => a.timestamp - b.timestamp)
    })).sort((a, b) => a.date.localeCompare(b.date));
  };
  const useMessagesStore = create((set, get) => ({
    messages: /* @__PURE__ */ new Map(),
    dayGroups: /* @__PURE__ */ new Map(),
    typingUsers: /* @__PURE__ */ new Map(),
    paginationCursors: /* @__PURE__ */ new Map(),
    isLoading: /* @__PURE__ */ new Map(),
    addMessage: (chatId, message) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const updated = [...chatMessages, message].sort((a, b) => a.timestamp - b.timestamp);
      messages.set(chatId, updated);
      get().dayGroups.set(chatId, groupMessagesByDay(updated));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    addMessages: (chatId, newMessages) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const combined = [...chatMessages, ...newMessages];
      const unique = Array.from(
        new Map(combined.map((m) => [m.id, m])).values()
      ).sort((a, b) => a.timestamp - b.timestamp);
      messages.set(chatId, unique);
      get().dayGroups.set(chatId, groupMessagesByDay(unique));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    updateMessage: (chatId, messageId, updates) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const updated = chatMessages.map(
        (m) => m.id === messageId ? __spreadValues(__spreadValues({}, m), updates) : m
      );
      messages.set(chatId, updated);
      get().dayGroups.set(chatId, groupMessagesByDay(updated));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    deleteMessage: (chatId, messageId) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const updated = chatMessages.filter((m) => m.id !== messageId);
      messages.set(chatId, updated);
      get().dayGroups.set(chatId, groupMessagesByDay(updated));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    addReaction: (chatId, messageId, emoji, userId) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const updated = chatMessages.map((m) => {
        if (m.id === messageId) {
          const reactions = m.reactions || [];
          const reactionIndex = reactions.findIndex((r) => r.emoji === emoji);
          if (reactionIndex >= 0) {
            const reaction = reactions[reactionIndex];
            if (!reaction.users.includes(userId)) {
              reaction.users.push(userId);
            }
          } else {
            reactions.push({ emoji, users: [userId] });
          }
          return __spreadProps(__spreadValues({}, m), { reactions: [...reactions] });
        }
        return m;
      });
      messages.set(chatId, updated);
      get().dayGroups.set(chatId, groupMessagesByDay(updated));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    removeReaction: (chatId, messageId, emoji, userId) => {
      const messages = get().messages;
      const chatMessages = messages.get(chatId) || [];
      const updated = chatMessages.map((m) => {
        if (m.id === messageId && m.reactions) {
          const reactions = m.reactions.map((r) => {
            if (r.emoji === emoji) {
              return __spreadProps(__spreadValues({}, r), { users: r.users.filter((u) => u !== userId) });
            }
            return r;
          }).filter((r) => r.users.length > 0);
          return __spreadProps(__spreadValues({}, m), { reactions: reactions.length > 0 ? reactions : void 0 });
        }
        return m;
      });
      messages.set(chatId, updated);
      get().dayGroups.set(chatId, groupMessagesByDay(updated));
      set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
    },
    setTyping: (chatId, username, isTyping) => {
      const typingUsers = get().typingUsers;
      const users = typingUsers.get(chatId) || /* @__PURE__ */ new Set();
      if (isTyping) {
        users.add(username);
      } else {
        users.delete(username);
      }
      if (users.size > 0) {
        typingUsers.set(chatId, users);
      } else {
        typingUsers.delete(chatId);
      }
      set({ typingUsers: new Map(typingUsers) });
    },
    setPaginationCursor: (chatId, cursor) => {
      const cursors = get().paginationCursors;
      if (cursor) {
        cursors.set(chatId, cursor);
      } else {
        cursors.delete(chatId);
      }
      set({ paginationCursors: new Map(cursors) });
    },
    setIsLoading: (chatId, loading) => {
      const isLoading = get().isLoading;
      if (loading) {
        isLoading.set(chatId, true);
      } else {
        isLoading.delete(chatId);
      }
      set({ isLoading: new Map(isLoading) });
    },
    getMessages: (chatId) => {
      return get().messages.get(chatId) || [];
    },
    getDayGroups: (chatId) => {
      return get().dayGroups.get(chatId) || [];
    },
    clearChat: (chatId) => {
      const messages = get().messages;
      messages.delete(chatId);
      get().dayGroups.delete(chatId);
      get().typingUsers.delete(chatId);
      get().paginationCursors.delete(chatId);
      get().isLoading.delete(chatId);
      set({
        messages: new Map(messages),
        dayGroups: new Map(get().dayGroups),
        typingUsers: new Map(get().typingUsers),
        paginationCursors: new Map(get().paginationCursors),
        isLoading: new Map(get().isLoading)
      });
    }
  }));
  const QUEUE_KEY = "zerochat_message_queue";
  const MAX_RETRIES = 3;
  function queueMessage(message) {
    const queue = getQueue();
    queue.push(message);
    saveQueue(queue);
  }
  function getQueue() {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  function saveQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
  function removeFromQueue(messageId) {
    const queue = getQueue();
    const filtered = queue.filter((m) => m.id !== messageId);
    saveQueue(filtered);
  }
  function getMessagesToRetry() {
    const queue = getQueue();
    return queue.filter((m) => m.retries < MAX_RETRIES);
  }
  function isOnline() {
    return navigator.onLine;
  }
  function onOnlineStatusChange(callback) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }
  function useMessages({ chatId, myUsername, enablePolling = true, pollingInterval = 3e3 }) {
    const store = useMessagesStore();
    const {
      getMessages,
      getDayGroups,
      addMessage,
      addMessages,
      updateMessage,
      setTyping,
      typingUsers,
      paginationCursors,
      isLoading,
      setIsLoading,
      setPaginationCursor
    } = store;
    const pollingRef = reactExports.useRef(null);
    const wsRef = reactExports.useRef(null);
    const processIncomingMessage = reactExports.useCallback((plaintext, sender, timestamp) => {
      const message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        chatId,
        sender,
        text: plaintext,
        timestamp: timestamp || Date.now(),
        isRead: sender === myUsername,
        // Our own messages are "read"
        isDelivered: false
      };
      addMessage(chatId, message);
      if (chatId === sender || chatId === myUsername) {
        setTimeout(() => {
          updateMessage(chatId, message.id, { isDelivered: true });
        }, 100);
      }
    }, [chatId, myUsername, addMessage, updateMessage]);
    const pollMessages = reactExports.useCallback(() => __async(null, null, function* () {
      try {
        const messages = yield messagesApi.pull();
        messages.forEach((msg) => {
          processIncomingMessage(msg, chatId, Date.now());
        });
      } catch (error) {
        console.error("Failed to poll messages:", error);
      }
    }), [chatId, processIncomingMessage]);
    const setupWebSocket = reactExports.useCallback(() => {
      const wsUrl = `ws://127.0.0.1:8080/ws`;
      try {
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          console.log("WebSocket connected");
        };
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "message" && data.chatId === chatId) {
              processIncomingMessage(data.text, data.sender, data.timestamp);
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          if (enablePolling) {
            pollingRef.current = setInterval(pollMessages, pollingInterval);
          }
        };
        ws.onclose = () => {
          console.log("WebSocket closed, falling back to polling");
          if (enablePolling) {
            pollingRef.current = setInterval(pollMessages, pollingInterval);
          }
        };
        wsRef.current = ws;
      } catch (error) {
        console.error("WebSocket not available, using polling:", error);
        if (enablePolling) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      }
    }, [chatId, processIncomingMessage, enablePolling, pollingInterval, pollMessages]);
    reactExports.useEffect(() => {
      setupWebSocket();
      if (enablePolling && !wsRef.current) {
        pollingRef.current = setInterval(pollMessages, pollingInterval);
      }
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
      };
    }, [chatId, setupWebSocket, enablePolling, pollingInterval, pollMessages]);
    const sendMessage = reactExports.useCallback((text) => __async(null, null, function* () {
      if (!text.trim()) return;
      const messageId = `msg-${Date.now()}-${Math.random()}`;
      const timestamp = Date.now();
      const message = {
        id: messageId,
        chatId,
        sender: myUsername,
        text: text.trim(),
        timestamp,
        isRead: false,
        isDelivered: false,
        isOffline: !isOnline()
        // Mark as offline if not connected
      };
      addMessage(chatId, message);
      if (isOnline()) {
        try {
          yield messagesApi.send(chatId, text);
          updateMessage(chatId, messageId, { isDelivered: true, isOffline: false });
        } catch (error) {
          console.error("Failed to send message:", error);
          queueMessage({
            id: messageId,
            chatId,
            text: text.trim(),
            timestamp,
            retries: 0
          });
          updateMessage(chatId, messageId, { isOffline: true });
        }
      } else {
        queueMessage({
          id: messageId,
          chatId,
          text: text.trim(),
          timestamp,
          retries: 0
        });
        updateMessage(chatId, messageId, { isOffline: true });
      }
    }), [chatId, myUsername, addMessage, updateMessage]);
    reactExports.useEffect(() => {
      const unsubscribe = onOnlineStatusChange((online) => __async(null, null, function* () {
        if (online) {
          const queued = getMessagesToRetry();
          for (const queuedMsg of queued) {
            if (queuedMsg.chatId === chatId) {
              try {
                yield messagesApi.send(queuedMsg.chatId, queuedMsg.text);
                removeFromQueue(queuedMsg.id);
                updateMessage(chatId, queuedMsg.id, { isDelivered: true, isOffline: false });
              } catch (error) {
                console.error("Failed to retry message:", error);
              }
            }
          }
        }
      }));
      return unsubscribe;
    }, [chatId, updateMessage]);
    reactExports.useEffect(() => {
      const hydrate = () => __async(null, null, function* () {
        try {
          const cached = yield getCachedMessages(chatId);
          if (cached.length > 0) {
            addMessages(chatId, cached);
          }
        } catch (error) {
          console.warn("Failed to hydrate messages from cache:", error);
        }
      });
      hydrate();
    }, [chatId, addMessages]);
    reactExports.useEffect(() => {
      const messages = getMessages(chatId);
      if (messages.length > 0) {
        cacheMessages(chatId, messages).catch((err) => {
          console.warn("Failed to cache messages:", err);
        });
      }
    }, [chatId, getMessages, dayGroups]);
    const loadOlder = reactExports.useCallback(() => __async(null, null, function* () {
      const cursors = store.getState().paginationCursors;
      const loading = store.getState().isLoading;
      const cursor = cursors.get(chatId);
      if (loading.get(chatId) || !cursor) return;
      setIsLoading(chatId, true);
      try {
        const result = yield messagesApi.getMessages(chatId, cursor);
        const messages = result.messages.map((msg, idx) => ({
          id: msg.id || `msg-${msg.created_at}-${idx}`,
          chatId,
          sender: msg.from_username || "unknown",
          text: msg.ciphertext_b64,
          // Would need decryption in real implementation
          timestamp: new Date(msg.created_at).getTime(),
          isRead: true,
          isDelivered: true
        }));
        addMessages(chatId, messages);
        if (result.nextCursor) {
          setPaginationCursor(chatId, result.nextCursor);
        } else {
          setPaginationCursor(chatId, null);
        }
      } catch (error) {
        console.error("Failed to load older messages:", error);
      } finally {
        setIsLoading(chatId, false);
      }
    }), [chatId, store, setIsLoading, setPaginationCursor, addMessages]);
    const setTypingIndicator = reactExports.useCallback((isTyping) => {
      setTyping(chatId, myUsername, isTyping);
    }, [chatId, myUsername, setTyping]);
    const currentTypingUsers = store.getState().typingUsers.get(chatId) || /* @__PURE__ */ new Set();
    const currentIsLoading = store.getState().isLoading.get(chatId) || false;
    const currentCursors = store.getState().paginationCursors;
    return {
      messages: getMessages(chatId),
      dayGroups: getDayGroups(chatId),
      typingUsers: Array.from(currentTypingUsers),
      isLoading: currentIsLoading,
      sendMessage,
      loadOlder,
      setTypingIndicator,
      hasMore: currentCursors.has(chatId)
    };
  }
  const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
  function Reactions({ messageId, chatId, onClose }) {
    const { addReaction, removeReaction } = useMessagesStore();
    const myUsername = "current_user";
    const handleReaction = (emoji) => {
      const messages = useMessagesStore.getState().getMessages(chatId);
      const message = messages.find((m) => m.id === messageId);
      if (message == null ? void 0 : message.reactions) {
        const existingReaction = message.reactions.find((r) => r.emoji === emoji);
        if (existingReaction == null ? void 0 : existingReaction.users.includes(myUsername)) {
          removeReaction(chatId, messageId, emoji, myUsername);
        } else {
          addReaction(chatId, messageId, emoji, myUsername);
        }
      } else {
        addReaction(chatId, messageId, emoji, myUsername);
      }
      onClose();
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full left-0 mb-2 bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg shadow-lg p-2 flex gap-1 z-10", children: QUICK_REACTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => handleReaction(emoji),
        className: "w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors text-lg",
        children: emoji
      },
      emoji
    )) });
  }
  function pickFile(options) {
    return __async(this, null, function* () {
      if (platform.isTauri) {
        const { open: open2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { open: open3 } = yield Promise.resolve().then(() => dialog);
          return { open: open3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        const { readBinaryFile: readBinaryFile2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { readBinaryFile: readBinaryFile3 } = yield Promise.resolve().then(() => fs);
          return { readBinaryFile: readBinaryFile3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        const selected = yield open2({
          multiple: (options == null ? void 0 : options.multiple) || false,
          filters: (options == null ? void 0 : options.accept) ? [{ name: "Files", extensions: options.accept.split(",").map((e) => e.trim()) }] : void 0
        });
        if (!selected) {
          throw new Error("No file selected");
        }
        if (Array.isArray(selected)) {
          const results = yield Promise.all(
            selected.map((path) => __async(null, null, function* () {
              const data = yield readBinaryFile2(path);
              return {
                path,
                name: path.split("/").pop() || "unknown",
                size: data.length,
                type: "application/octet-stream",
                data
              };
            }))
          );
          return results;
        } else {
          const data = yield readBinaryFile2(selected);
          return {
            path: selected,
            name: selected.split("/").pop() || "unknown",
            size: data.length,
            type: "application/octet-stream",
            data
          };
        }
      } else if (platform.isAndroid) {
        const result = yield invoke$1("pickFile", options || {});
        return result;
      } else {
        return new Promise((resolve, reject) => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = (options == null ? void 0 : options.multiple) || false;
          if (options == null ? void 0 : options.accept) {
            input.accept = options.accept;
          }
          input.onchange = (e) => __async(null, null, function* () {
            const files = e.target.files;
            if (!files || files.length === 0) {
              reject(new Error("No file selected"));
              return;
            }
            const results = yield Promise.all(
              Array.from(files).map((file) => __async(null, null, function* () {
                const arrayBuffer = yield file.arrayBuffer();
                return {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: arrayBuffer
                };
              }))
            );
            resolve((options == null ? void 0 : options.multiple) ? results : results[0]);
          });
          input.oncancel = () => {
            reject(new Error("File picker cancelled"));
          };
          input.click();
        });
      }
    });
  }
  function getFileExtension(filename) {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }
  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  function isImageFile(filename) {
    const ext = getFileExtension(filename);
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  }
  function openLink(url) {
    return __async(this, null, function* () {
      if (platform.isTauri) {
        const { open: open2 } = yield __vitePreload(() => __async(null, null, function* () {
          const { open: open3 } = yield Promise.resolve().then(() => shell);
          return { open: open3 };
        }), false ? __VITE_PRELOAD__ : void 0);
        yield open2(url);
      } else if (platform.isAndroid) {
        yield invoke$1("openLink", { url });
      } else {
        window.open(url, "_blank");
      }
    });
  }
  function AttachmentTile({ attachment }) {
    const handleClick = () => {
      openLink(attachment.url);
    };
    const isImage = attachment.type === "image" || attachment.name && isImageFile(attachment.name);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: handleClick,
        className: "cursor-pointer hover:opacity-90 transition-opacity",
        children: isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: attachment.thumbnail || attachment.url,
            alt: attachment.name || "Image",
            className: "max-w-full max-h-64 rounded-lg object-cover",
            onError: (e) => {
              const target = e.target;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="p-4 bg-[var(--bg-elev)] rounded-lg border border-[var(--border)]">
                    <div class="text-sm text-[var(--text-muted)]">Failed to load image</div>
                  </div>
                `;
              }
            }
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[var(--bg-elev)] rounded-lg border border-[var(--border)] flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white text-xl", children: "📎" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: attachment.name || "File" }),
            attachment.size && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--text-muted)]", children: formatFileSize(attachment.size) })
          ] })
        ] })
      }
    );
  }
  function LinkPreview({ preview }) {
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLink(preview.url);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: handleClick,
        className: "mt-2 mb-2 border border-[var(--border)] rounded-lg overflow-hidden cursor-pointer hover:bg-[var(--bg-hover)] transition-colors",
        children: [
          preview.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-48 bg-[var(--bg-elev)] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: preview.image,
              alt: preview.title,
              className: "w-full h-full object-cover",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            preview.favicon && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: preview.favicon,
                alt: "",
                className: "w-4 h-4 mt-1 flex-shrink-0",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: preview.title }),
              preview.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--text-muted)] line-clamp-2 mt-1", children: preview.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--text-muted)] truncate mt-1", children: new URL(preview.url).hostname })
            ] })
          ] }) })
        ]
      }
    );
  }
  function Message({ message, isMe }) {
    const [showReactions, setShowReactions] = reactExports.useState(false);
    const [longPressTimer, setLongPressTimer] = reactExports.useState(null);
    const handleMouseDown = () => {
      const timer = setTimeout(() => {
        setShowReactions(true);
      }, 500);
      setLongPressTimer(timer);
    };
    const handleMouseUp = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      setShowReactions(true);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `flex ${isMe ? "justify-end" : "justify-start"} group`,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onContextMenu: handleContextMenu,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
        max-w-[70%] rounded-2xl px-4 py-2 relative
        ${isMe ? "bg-[var(--bubble-me)] text-white rounded-br-sm" : "bg-[var(--bubble-other)] text-[var(--text)] rounded-bl-sm"}
      `, children: [
          message.replyTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
            mb-2 pl-3 border-l-2 ${isMe ? "border-white/30" : "border-[var(--accent)]"}
          `, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold opacity-80", children: message.replyTo.sender }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-70 truncate", children: message.replyTo.text })
          ] }),
          message.linkPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(LinkPreview, { preview: message.linkPreview }),
          message.attachments && message.attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 space-y-2", children: message.attachments.map((att, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentTile, { attachment: att }, idx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap break-words", children: message.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
          flex items-center gap-1 mt-1 text-xs
          ${isMe ? "text-white/70" : "text-[var(--text-muted)]"}
        `, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatMessageTime(message.timestamp) }),
            isMe && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: message.isOffline ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Sending...", children: "🕐" }) : message.isRead ? "✓✓" : message.isDelivered ? "✓" : "○" })
          ] }),
          message.reactions && message.reactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: message.reactions.map((reaction, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `
                  px-2 py-0.5 rounded-full text-xs
                  ${isMe ? "bg-white/20" : "bg-[var(--bg-elev)]"}
                `,
              children: [
                reaction.emoji,
                " ",
                reaction.users.length > 1 && reaction.users.length
              ]
            },
            idx
          )) }),
          showReactions && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Reactions,
            {
              messageId: message.id,
              chatId: message.chatId,
              onClose: () => setShowReactions(false)
            }
          )
        ] })
      }
    );
  }
  const MAX_CHARS = 4e3;
  const WARN_CHARS = 2e3;
  function Composer({ onSend }) {
    const [text, setText] = reactExports.useState("");
    const [isSending, setIsSending] = reactExports.useState(false);
    const textareaRef = reactExports.useRef(null);
    const handleSend = () => __async(null, null, function* () {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;
      setIsSending(true);
      try {
        yield onSend(trimmed);
        setText("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        console.error("Failed to send:", error);
      } finally {
        setIsSending(false);
      }
    });
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    const handleInput = (e) => {
      const value = e.target.value;
      if (value.length <= MAX_CHARS) {
        setText(value);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
      }
    };
    const handleAttach = () => __async(null, null, function* () {
      try {
        const file = yield pickFile({ multiple: false });
        console.log("File selected:", file);
      } catch (error) {
        console.error("Failed to pick file:", error);
      }
    });
    const charCount = text.length;
    const showCharCount = charCount > WARN_CHARS;
    const isOverLimit = charCount >= MAX_CHARS;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAttach,
          className: "p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]",
          title: "Attach file",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: textareaRef,
            value: text,
            onChange: handleInput,
            onKeyDown: handleKeyDown,
            placeholder: "Type a message...",
            rows: 1,
            className: `
              w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              resize-none overflow-y-auto
              text-[var(--text)] placeholder-[var(--text-muted)]
              max-h-[200px]
            `,
            style: { minHeight: "44px" }
          }
        ),
        showCharCount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
              absolute bottom-2 right-2 text-xs
              ${isOverLimit ? "text-[var(--error)]" : "text-[var(--text-muted)]"}
            `, children: [
          charCount,
          " / ",
          MAX_CHARS
        ] })
      ] }),
      text.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSend,
          disabled: isSending || isOverLimit,
          className: `
              p-2 rounded-lg font-semibold transition-colors
              ${isSending || isOverLimit ? "bg-[var(--text-muted)] text-[var(--text)] opacity-50 cursor-not-allowed" : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"}
            `,
          children: isSending ? "..." : "Send"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAttach,
          className: "p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]",
          title: "Attach file",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) })
        }
      )
    ] }) });
  }
  function Typing({ users }) {
    if (users.length === 0) return null;
    const text = users.length === 1 ? `${users[0]} is typing...` : `${users.length} people are typing...`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-[var(--text-muted)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce", style: { animationDelay: "150ms" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce", style: { animationDelay: "300ms" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text })
    ] });
  }
  function ChatView({ chatId, myUsername, onBack }) {
    const {
      dayGroups: dayGroups2,
      typingUsers,
      sendMessage,
      loadOlder,
      hasMore,
      isLoading
    } = useMessages({ chatId, myUsername });
    const messagesEndRef = reactExports.useRef(null);
    reactExports.useRef(null);
    const parentRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [dayGroups2]);
    const virtualItems = [];
    dayGroups2.forEach((group) => {
      virtualItems.push({ type: "day", date: group.date });
      group.messages.forEach((msg) => {
        virtualItems.push({ type: "message", message: msg });
      });
    });
    const virtualizer = useVirtualizer({
      count: virtualItems.length,
      getScrollElement: () => parentRef.current,
      estimateSize: (index) => {
        const item = virtualItems[index];
        return item.type === "day" ? 40 : 60;
      },
      overscan: 25
      // Keep ~50 DOM nodes (25 above + 25 below viewport)
    });
    const handleSend = (text) => __async(null, null, function* () {
      try {
        yield sendMessage(text);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-[var(--bg)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elev)] flex items-center gap-3", children: [
        onBack && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onBack,
            className: "p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors",
            children: "←"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-[var(--text)]", children: chatId }),
          typingUsers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Typing, { users: typingUsers })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: parentRef,
          className: "flex-1 overflow-y-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
                padding: "1rem"
              },
              children: [
                hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: loadOlder,
                    disabled: isLoading,
                    className: "px-4 py-2 bg-[var(--bg-elev)] text-[var(--text-muted)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-50",
                    children: isLoading ? "Loading..." : "Load older messages"
                  }
                ) }),
                virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = virtualItems[virtualItem.index];
                  if (item.type === "day" && item.date) {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`
                        },
                        className: "flex items-center justify-center",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-[var(--bg-elev)] text-[var(--text-muted)] text-xs rounded-full", children: formatDayHeader(item.date) })
                      },
                      `day-${item.date}`
                    );
                  }
                  if (item.type === "message" && item.message) {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Message,
                          {
                            message: item.message,
                            isMe: item.message.sender === myUsername
                          }
                        )
                      },
                      item.message.id
                    );
                  }
                  return null;
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    ref: messagesEndRef,
                    style: {
                      position: "absolute",
                      bottom: 0,
                      height: "1px"
                    }
                  }
                )
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-[var(--border)] bg-[var(--bg-elev)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Composer, { onSend: handleSend }) })
    ] });
  }
  const INVITE_TOKEN_KEY = "zerochat_invite_token";
  const INVITE_BASE_URL_KEY = "zerochat_invite_base_url";
  function useInviteToken() {
    const [inviteToken, setInviteToken] = reactExports.useState(null);
    const [inviteBaseUrl, setInviteBaseUrl] = reactExports.useState(null);
    reactExports.useEffect(() => {
      try {
        const storedToken = localStorage.getItem(INVITE_TOKEN_KEY);
        const storedBaseUrl = localStorage.getItem(INVITE_BASE_URL_KEY);
        if (storedToken) {
          setInviteToken(storedToken);
          console.log("[useInviteToken] Loaded invite token from localStorage");
        }
        if (storedBaseUrl) {
          setInviteBaseUrl(storedBaseUrl);
          console.log("[useInviteToken] Loaded invite base URL from localStorage");
        }
      } catch (e) {
        console.warn("[useInviteToken] Failed to load from localStorage:", e);
      }
    }, []);
    reactExports.useEffect(() => {
      window.__zerochatProvision = (token) => {
        console.log("[useInviteToken] Received invite token from Android:", token ? `${token.substring(0, 8)}...` : "empty");
        if (!token || typeof token !== "string") {
          console.warn("[useInviteToken] Invalid token received");
          return;
        }
        try {
          const pendingBase = localStorage.getItem("zerochat_pending_invite_base");
          if (pendingBase) {
            setInviteBaseUrl(pendingBase);
            localStorage.setItem(INVITE_BASE_URL_KEY, pendingBase);
            localStorage.removeItem("zerochat_pending_invite_base");
            console.log("[useInviteToken] Loaded pending base URL:", pendingBase);
          }
        } catch (e) {
          console.warn("[useInviteToken] Failed to check pending base URL:", e);
        }
        setInviteToken(token);
        try {
          localStorage.setItem(INVITE_TOKEN_KEY, token);
          console.log("[useInviteToken] Stored invite token");
        } catch (e) {
          console.warn("[useInviteToken] Failed to store token:", e);
        }
      };
      console.log("[useInviteToken] Set up window.__zerochatProvision handler");
      try {
        const pendingToken = localStorage.getItem("zerochat_pending_invite_token");
        if (pendingToken) {
          console.log("[useInviteToken] Found pending token, processing...");
          window.__zerochatProvision(pendingToken);
          localStorage.removeItem("zerochat_pending_invite_token");
        }
      } catch (e) {
        console.warn("[useInviteToken] Failed to check pending token:", e);
      }
      return () => {
      };
    }, []);
    const clearToken = reactExports.useCallback(() => {
      console.log("[useInviteToken] Clearing invite token");
      setInviteToken(null);
      setInviteBaseUrl(null);
      try {
        localStorage.removeItem(INVITE_TOKEN_KEY);
        localStorage.removeItem(INVITE_BASE_URL_KEY);
      } catch (e) {
        console.warn("[useInviteToken] Failed to clear token:", e);
      }
    }, []);
    return {
      inviteToken,
      inviteBaseUrl,
      clearToken,
      hasInviteToken: inviteToken !== null
    };
  }
  function OnboardingScreen() {
    const { signup, login } = useAuth();
    const { inviteToken, inviteBaseUrl, clearToken, hasInviteToken } = useInviteToken();
    const [username, setUsername] = reactExports.useState("");
    const [password, setPassword] = reactExports.useState("");
    const [error, setError] = reactExports.useState("");
    const [isLoading, setIsLoading] = reactExports.useState(false);
    reactExports.useEffect(() => {
      if (hasInviteToken) {
        console.log("[UI] Invite token detected - user should sign up to use it");
      }
    }, [hasInviteToken]);
    const handleSignup = () => __async(null, null, function* () {
      setError("");
      if (!username || !password) {
        setError("Please enter username and password");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("token")) {
          url.searchParams.delete("token");
          url.searchParams.delete("base");
          url.searchParams.delete("inviter");
          window.history.replaceState({}, "", url.pathname);
          console.log("[UI] Cleared invite token from URL");
        }
      }
      try {
        localStorage.removeItem("zerochat_web_creds");
      } catch (e) {
      }
      setIsLoading(true);
      try {
        console.log("[UI] Starting signup for:", username);
        console.log("[UI] Has invite token:", hasInviteToken);
        yield signup(username, password, inviteToken || void 0, inviteBaseUrl || void 0);
        console.log("[UI] Signup completed successfully");
        if (hasInviteToken) {
          clearToken();
          console.log("[UI] Cleared invite token after successful signup");
        }
        console.log("[UI] Reloading page to show logged-in state...");
        window.location.reload();
      } catch (e) {
        console.error("[UI] Signup error:", e);
        const errorMsg = (e == null ? void 0 : e.message) || (e == null ? void 0 : e.toString()) || "Unknown error";
        setError(errorMsg);
        try {
          localStorage.removeItem("zerochat_web_creds");
        } catch (err) {
        }
      } finally {
        setIsLoading(false);
      }
    });
    const handleLogin = () => __async(null, null, function* () {
      console.log("[UI] ========== LOGIN FLOW STARTED ==========");
      console.log("[UI] Username:", username ? `${username.substring(0, 3)}***` : "empty");
      console.log("[UI] Password length:", password.length);
      setError("");
      if (!username || !password) {
        console.warn("[UI] Validation failed: missing username or password");
        setError("Please enter username and password");
        return;
      }
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("token")) {
          url.searchParams.delete("token");
          url.searchParams.delete("base");
          url.searchParams.delete("inviter");
          window.history.replaceState({}, "", url.pathname);
          console.log("[UI] Cleared invite token from URL");
        }
      }
      try {
        localStorage.removeItem("zerochat_web_creds");
        console.log("[UI] Cleared existing credentials from localStorage");
      } catch (e) {
        console.warn("[UI] Failed to clear localStorage:", e);
      }
      setIsLoading(true);
      const startTime = Date.now();
      try {
        console.log("[UI] Calling login() function...");
        yield login(username, password);
        const duration = Date.now() - startTime;
        console.log(`[UI] ✅ Login completed successfully in ${duration}ms`);
        console.log("[UI] Reloading page to show logged-in state...");
        window.location.reload();
      } catch (e) {
        const duration = Date.now() - startTime;
        console.error(`[UI] ❌ Login failed after ${duration}ms:`, e);
        console.error("[UI] Error details:", {
          message: e == null ? void 0 : e.message,
          stack: e == null ? void 0 : e.stack,
          name: e == null ? void 0 : e.name,
          toString: e == null ? void 0 : e.toString()
        });
        const errorMsg = (e == null ? void 0 : e.message) || (e == null ? void 0 : e.toString()) || "Unknown error";
        setError(errorMsg);
        try {
          localStorage.removeItem("zerochat_web_creds");
          console.log("[UI] Cleared partial credentials after error");
        } catch (err) {
          console.warn("[UI] Failed to clear credentials after error:", err);
        }
      } finally {
        setIsLoading(false);
        console.log("[UI] ========== LOGIN FLOW ENDED ==========");
      }
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[var(--bg)] z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-8 text-center text-[var(--text)]", children: "Welcome to ZeroChat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2 text-[var(--text)]", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Enter username",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              className: "w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2 text-[var(--text)]", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "Enter password (min 8 characters)",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              onKeyPress: (e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              },
              className: "w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            }
          )
        ] }),
        hasInviteToken && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--accent)] text-sm text-center mb-2", children: "📨 You have an invite link! Sign up to join." }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--error)] text-sm text-center", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSignup,
              disabled: isLoading,
              className: "flex-1 bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50",
              children: "Sign Up"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleLogin,
              disabled: isLoading,
              className: "flex-1 bg-[var(--success)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50",
              children: "Log In"
            }
          )
        ] })
      ] })
    ] }) });
  }
  function SettingsMenu({ onClose }) {
    var _a2;
    const { user, logout, isAuthenticated } = useAuth();
    const [inviteLink, setInviteLink] = reactExports.useState(null);
    const [isGenerating, setIsGenerating] = reactExports.useState(false);
    const [error, setError] = reactExports.useState("");
    const [deviceId, setDeviceId] = reactExports.useState(null);
    reactExports.useEffect(() => {
      console.log("[SettingsMenu] ========== SETTINGS MENU OPENED ==========");
      console.log("[SettingsMenu] Full user object:", JSON.stringify(user, null, 2));
      console.log("[SettingsMenu] User object keys:", user ? Object.keys(user) : "null");
      console.log("[SettingsMenu] Auth state:", {
        isAuthenticated,
        hasUser: !!user,
        username: user == null ? void 0 : user.username,
        device_id: user == null ? void 0 : user.device_id,
        userType: typeof user,
        userString: String(user)
      });
      authApi.loadCreds().then((creds) => {
        if (creds == null ? void 0 : creds.device_id) {
          console.log("[SettingsMenu] Loaded device_id from credentials:", creds.device_id);
          setDeviceId(creds.device_id);
        } else {
          console.warn("[SettingsMenu] No device_id in credentials");
        }
      }).catch((e) => {
        console.warn("[SettingsMenu] Failed to load device_id from credentials:", e);
      });
      if (user == null ? void 0 : user.device_id) {
        console.log("[SettingsMenu] Found device_id in user object:", user.device_id);
        setDeviceId(user.device_id);
      }
    }, [isAuthenticated, user]);
    const handleCreateInvite = () => __async(null, null, function* () {
      console.log("[SettingsMenu] Create invite link clicked");
      console.log("[SettingsMenu] Auth state:", {
        isAuthenticated,
        hasUser: !!user,
        username: user == null ? void 0 : user.username
      });
      if (!isAuthenticated) {
        console.error("[SettingsMenu] Not authenticated, cannot create invite");
        setError("Not authenticated. Please log in again.");
        return;
      }
      setIsGenerating(true);
      setError("");
      try {
        console.log("[SettingsMenu] Calling userApi.createInvite()...");
        const result = yield userApi.createInvite(null, 60);
        console.log("[SettingsMenu] Invite link created:", result.invite_link ? "success" : "failed");
        setInviteLink(result.invite_link);
      } catch (e) {
        console.error("[SettingsMenu] Failed to create invite:", e);
        setError((e == null ? void 0 : e.message) || "Failed to create invite link");
      } finally {
        setIsGenerating(false);
      }
    });
    const copyInviteLink = () => {
      if (inviteLink) {
        navigator.clipboard.writeText(inviteLink);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-[var(--bg-elev)] rounded-lg shadow-lg w-full max-w-md p-6",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[var(--text)]", children: "Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "text-[var(--text-muted)] hover:text-[var(--text)]",
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-[var(--border)] pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-[var(--text-muted)] mb-2", children: "Profile" }),
              isAuthenticated && user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-semibold text-lg", children: ((_a2 = (user.username || "U")[0]) == null ? void 0 : _a2.toUpperCase()) || "U" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-[var(--text)] truncate", children: user.username || "Unknown User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-[var(--text-muted)] truncate", children: [
                    "Device ID: ",
                    (() => {
                      const did = deviceId || (user == null ? void 0 : user.device_id) || "";
                      if (!did) {
                        console.warn("[SettingsMenu] No device_id available");
                        return "loading...";
                      }
                      const didStr = typeof did === "string" ? did : String(did);
                      return didStr.length > 8 ? `${didStr.substring(0, 8)}...` : didStr;
                    })()
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--text-muted)] text-sm", children: "Not authenticated" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-[var(--border)] pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-[var(--text-muted)] mb-2", children: "Invite Friends" }),
              !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-[var(--text-muted)]", children: "Not authenticated" }) : !inviteLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleCreateInvite,
                  disabled: isGenerating,
                  className: "w-full px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50",
                  children: isGenerating ? "Generating..." : "Create Invite Link"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-[var(--input-bg)] rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: inviteLink,
                      readOnly: true,
                      className: "flex-1 bg-transparent text-[var(--text)] text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: copyInviteLink,
                      className: "px-3 py-1 bg-[var(--accent)] text-white text-sm rounded hover:bg-[var(--accent-hover)]",
                      children: "Copy"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setInviteLink(null),
                    className: "text-sm text-[var(--text-muted)] hover:text-[var(--text)]",
                    children: "Generate new link"
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-[var(--error)]", children: error })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  logout();
                  onClose();
                },
                className: "w-full px-4 py-2 bg-[var(--error)] text-white rounded-lg hover:opacity-90",
                children: "Log Out"
              }
            ) })
          ] })
        ]
      }
    ) });
  }
  function useKeyboardShortcuts({
    onSearch,
    onInChatSearch,
    onBack,
    enabled = true
  }) {
    reactExports.useEffect(() => {
      if (!enabled) return;
      const handleKeyDown = (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        const modifier = isMac ? e.metaKey : e.ctrlKey;
        if (modifier && e.key === "k" && onSearch) {
          e.preventDefault();
          onSearch();
          return;
        }
        if (modifier && e.key === "f" && onInChatSearch) {
          const target = e.target;
          if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
            e.preventDefault();
            onInChatSearch();
          }
          return;
        }
        if (e.key === "Escape" && onBack) {
          e.preventDefault();
          onBack();
          return;
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [enabled, onSearch, onInChatSearch, onBack]);
  }
  function AppShell() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [selectedChatId, setSelectedChatId] = reactExports.useState(null);
    const [showSettings, setShowSettings] = reactExports.useState(false);
    const searchInputRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      console.log("[AppShell] ========== AUTH STATE RECEIVED ==========");
      console.log("[AppShell] Current values:", {
        isAuthenticated,
        isLoading,
        hasUser: !!user,
        username: user == null ? void 0 : user.username,
        device_id: user == null ? void 0 : user.device_id
      });
      console.log("[AppShell] Will render:", {
        showLoading: isLoading,
        showOnboarding: !isLoading && !isAuthenticated,
        showMainApp: !isLoading && isAuthenticated
      });
      console.log("[AppShell] =========================================");
    }, [isAuthenticated, isLoading, user]);
    useKeyboardShortcuts({
      onSearch: () => {
        var _a2;
        (_a2 = searchInputRef.current) == null ? void 0 : _a2.focus();
      },
      onBack: () => {
        if (selectedChatId) {
          setSelectedChatId(null);
        }
      },
      enabled: isAuthenticated
    });
    console.log("[AppShell] Render decision:", {
      isLoading,
      isAuthenticated,
      willShowLoading: isLoading,
      willShowOnboarding: !isLoading && !isAuthenticated,
      willShowMainApp: !isLoading && isAuthenticated
    });
    if (isLoading) {
      console.log("[AppShell] Rendering: Loading screen");
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen bg-[var(--bg)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--text-muted)]", children: "Loading..." }) });
    }
    if (!isAuthenticated) {
      console.log("[AppShell] Rendering: OnboardingScreen");
      return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingScreen, {});
    }
    console.log("[AppShell] Rendering: Main app (ChatList + ChatView)");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-[var(--bg)] text-[var(--text)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 border-r border-[var(--border)] flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChatList,
          {
            selectedChatId,
            onSelectChat: setSelectedChatId,
            searchInputRef,
            onOpenSettings: () => setShowSettings(true)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col", children: selectedChatId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChatView,
          {
            chatId: selectedChatId,
            myUsername: (user == null ? void 0 : user.username) || "",
            onBack: () => setSelectedChatId(null)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg mb-2", children: "Select a chat to start messaging" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Choose a conversation from the list" })
        ] }) }) })
      ] }),
      showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsMenu, { onClose: () => setShowSettings(false) })
    ] });
  }
  function App() {
    const { inviteToken } = useInviteToken();
    reactExports.useEffect(() => {
      if (inviteToken) {
        console.log("[App] Invite token is available:", inviteToken.substring(0, 8) + "...");
      }
    }, [inviteToken]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, {});
  }
  if (typeof window !== "undefined" && "ZeroChatBridge" in window && !("__TAURI_INTERNALS__" in window)) {
    window.invoke = function(_0) {
      return __async(this, arguments, function* (cmd, args = {}) {
        const bridge2 = window.ZeroChatBridge;
        if (!bridge2) {
          throw new Error("ZeroChatBridge not available");
        }
        const argsJson = JSON.stringify(args);
        const result = bridge2.invoke(cmd, argsJson);
        if (typeof result === "string") {
          if (result.trim().startsWith('{"error":')) {
            const errorObj = JSON.parse(result);
            throw new Error(errorObj.error);
          }
          try {
            return JSON.parse(result);
          } catch (e) {
            if (result.startsWith('"') && result.endsWith('"')) {
              return result.slice(1, -1);
            }
            return result;
          }
        }
        return result;
      });
    };
    console.log("Android bridge polyfill initialized");
  }
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
  function uid() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  function transformCallback(callback, once = false) {
    const identifier = uid();
    const prop = `_${identifier}`;
    Object.defineProperty(window, prop, {
      value: (result) => {
        if (once) {
          Reflect.deleteProperty(window, prop);
        }
        return callback === null || callback === void 0 ? void 0 : callback(result);
      },
      writable: false,
      configurable: true
    });
    return identifier;
  }
  function invoke(_0) {
    return __async(this, arguments, function* (cmd, args = {}) {
      return new Promise((resolve, reject) => {
        const callback = transformCallback((e) => {
          resolve(e);
          Reflect.deleteProperty(window, `_${error}`);
        }, true);
        const error = transformCallback((e) => {
          reject(e);
          Reflect.deleteProperty(window, `_${callback}`);
        }, true);
        window.__TAURI_IPC__(__spreadValues({
          cmd,
          callback,
          error
        }, args));
      });
    });
  }
  const tauri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    invoke,
    transformCallback
  }, Symbol.toStringTag, { value: "Module" }));
  function invokeTauriCommand(command) {
    return __async(this, null, function* () {
      return invoke("tauri", command);
    });
  }
  function open$1() {
    return __async(this, arguments, function* (options = {}) {
      if (typeof options === "object") {
        Object.freeze(options);
      }
      return invokeTauriCommand({
        __tauriModule: "Dialog",
        message: {
          cmd: "openDialog",
          options
        }
      });
    });
  }
  const dialog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    open: open$1
  }, Symbol.toStringTag, { value: "Module" }));
  var BaseDirectory;
  (function(BaseDirectory2) {
    BaseDirectory2[BaseDirectory2["Audio"] = 1] = "Audio";
    BaseDirectory2[BaseDirectory2["Cache"] = 2] = "Cache";
    BaseDirectory2[BaseDirectory2["Config"] = 3] = "Config";
    BaseDirectory2[BaseDirectory2["Data"] = 4] = "Data";
    BaseDirectory2[BaseDirectory2["LocalData"] = 5] = "LocalData";
    BaseDirectory2[BaseDirectory2["Desktop"] = 6] = "Desktop";
    BaseDirectory2[BaseDirectory2["Document"] = 7] = "Document";
    BaseDirectory2[BaseDirectory2["Download"] = 8] = "Download";
    BaseDirectory2[BaseDirectory2["Executable"] = 9] = "Executable";
    BaseDirectory2[BaseDirectory2["Font"] = 10] = "Font";
    BaseDirectory2[BaseDirectory2["Home"] = 11] = "Home";
    BaseDirectory2[BaseDirectory2["Picture"] = 12] = "Picture";
    BaseDirectory2[BaseDirectory2["Public"] = 13] = "Public";
    BaseDirectory2[BaseDirectory2["Runtime"] = 14] = "Runtime";
    BaseDirectory2[BaseDirectory2["Template"] = 15] = "Template";
    BaseDirectory2[BaseDirectory2["Video"] = 16] = "Video";
    BaseDirectory2[BaseDirectory2["Resource"] = 17] = "Resource";
    BaseDirectory2[BaseDirectory2["App"] = 18] = "App";
    BaseDirectory2[BaseDirectory2["Log"] = 19] = "Log";
    BaseDirectory2[BaseDirectory2["Temp"] = 20] = "Temp";
    BaseDirectory2[BaseDirectory2["AppConfig"] = 21] = "AppConfig";
    BaseDirectory2[BaseDirectory2["AppData"] = 22] = "AppData";
    BaseDirectory2[BaseDirectory2["AppLocalData"] = 23] = "AppLocalData";
    BaseDirectory2[BaseDirectory2["AppCache"] = 24] = "AppCache";
    BaseDirectory2[BaseDirectory2["AppLog"] = 25] = "AppLog";
  })(BaseDirectory || (BaseDirectory = {}));
  function readBinaryFile(_0) {
    return __async(this, arguments, function* (filePath, options = {}) {
      const arr = yield invokeTauriCommand({
        __tauriModule: "Fs",
        message: {
          cmd: "readFile",
          path: filePath,
          options
        }
      });
      return Uint8Array.from(arr);
    });
  }
  const fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    get BaseDirectory() {
      return BaseDirectory;
    },
    get Dir() {
      return BaseDirectory;
    },
    readBinaryFile
  }, Symbol.toStringTag, { value: "Module" }));
  function open(path, openWith) {
    return __async(this, null, function* () {
      return invokeTauriCommand({
        __tauriModule: "Shell",
        message: {
          cmd: "open",
          path,
          with: openWith
        }
      });
    });
  }
  const shell = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    open
  }, Symbol.toStringTag, { value: "Module" }));
})();
//# sourceMappingURL=index-DzrPKbPw.js.map
