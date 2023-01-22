import MarkdownIt from "markdown-it";
import * as fs from "fs/promises";
const rControl = /[\u0000-\u001f]/g, rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, rCombining = /[\u0300-\u036F]/g, slugify = (e) => e.normalize("NFKD").replace(rCombining, "").replace(rControl, "").replace(rSpecial, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").replace(/^(\d)/, "_$1").toLowerCase(), { readdir, readFile } = fs;
let rootPath = "";
const replaceMdSyntax = (e) => e.replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gm, "$3"), getFileList = async (e) => {
  let i = [];
  const n = await readdir(e, { withFileTypes: !0 });
  for (const s of n)
    s.isDirectory() && s.name != "node_modules" ? i = [...i, ...await getFileList(`${e}/${s.name}`)] : s.name.endsWith(".md") && i.push(`${e}/${s.name}`);
  return i;
}, removeScriptTag = (e) => e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim(), removeStyleTag = (e) => e.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").trim(), processMdFiles = async (e) => {
  rootPath = e;
  let i = await getFileList(e), n = [];
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    let o = await readFile(r, { encoding: "utf8" }), l = removeStyleTag(removeScriptTag(replaceMdSyntax(o)));
    n.push({ content: l, path: r });
  }
  return Promise.resolve(n);
}, parseMdContent = (e, i) => e.split(/(^|\s)#{2}\s/gi).filter((o) => o != "" && o != `
`).map((o) => {
  let l = o.split(`
`);
  return { anchor: (l == null ? void 0 : l.shift()) || "", content: l.join(`
`), path: i };
}), buildDoc = (e, i) => {
  let n, s, r = e.anchor;
  (n = /\{(.*?)\}/m.exec(e.anchor)) !== null && (r = n[0], s = e.anchor.replace(/\{(.*?)\}/m, "")), r = slugify(r), r[0] == "#" && (r = r.replace("#", ""));
  let o = e.path.replace(rootPath + "/", "").replace("md", "html");
  return i.includes(".0") || (o += `#${slugify(r)}`), s ? {
    id: i,
    link: o,
    b: e.content,
    a: r,
    t: s
  } : {
    id: i,
    link: o,
    b: e.content,
    a: r
  };
}, buildDocs = async (e, i) => {
  const n = await processMdFiles(e), s = [];
  if (n !== void 0)
    for (let r = 0; r < n.length; r++) {
      const o = n[r];
      let l = parseMdContent(o.content, o.path);
      for (let h = 0; h < l.length; h++) {
        const f = l[h];
        s.push(buildDoc(f, r + "." + h));
      }
    }
  return s;
};
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, flexsearch_bundle = { exports: {} };
(function(module) {
  (function _f(self) {
    try {
      module && (self = module);
    } catch (e) {
    }
    self._factory = _f;
    var t;
    function u(e) {
      return typeof e < "u" ? e : !0;
    }
    function aa(e) {
      const i = Array(e);
      for (let n = 0; n < e; n++)
        i[n] = v();
      return i;
    }
    function v() {
      return /* @__PURE__ */ Object.create(null);
    }
    function ba(e, i) {
      return i.length - e.length;
    }
    function x(e) {
      return typeof e == "string";
    }
    function C(e) {
      return typeof e == "object";
    }
    function D(e) {
      return typeof e == "function";
    }
    function ca(e, i) {
      var n = da;
      if (e && (i && (e = E(e, i)), this.H && (e = E(e, this.H)), this.J && 1 < e.length && (e = E(e, this.J)), n || n === "")) {
        if (e = e.split(n), this.filter) {
          i = this.filter, n = e.length;
          const s = [];
          for (let r = 0, o = 0; r < n; r++) {
            const l = e[r];
            l && !i[l] && (s[o++] = l);
          }
          e = s;
        }
        return e;
      }
      return e;
    }
    const da = /[\p{Z}\p{S}\p{P}\p{C}]+/u, ea = /[\u0300-\u036f]/g;
    function fa(e, i) {
      const n = Object.keys(e), s = n.length, r = [];
      let o = "", l = 0;
      for (let h = 0, f, p; h < s; h++)
        f = n[h], (p = e[f]) ? (r[l++] = F(i ? "(?!\\b)" + f + "(\\b|_)" : f), r[l++] = p) : o += (o ? "|" : "") + f;
      return o && (r[l++] = F(i ? "(?!\\b)(" + o + ")(\\b|_)" : "(" + o + ")"), r[l] = ""), r;
    }
    function E(e, i) {
      for (let n = 0, s = i.length; n < s && (e = e.replace(i[n], i[n + 1]), e); n += 2)
        ;
      return e;
    }
    function F(e) {
      return new RegExp(e, "g");
    }
    function ha(e) {
      let i = "", n = "";
      for (let s = 0, r = e.length, o; s < r; s++)
        (o = e[s]) !== n && (i += n = o);
      return i;
    }
    var ja = { encode: ia, F: !1, G: "" };
    function ia(e) {
      return ca.call(this, ("" + e).toLowerCase(), !1);
    }
    const ka = {}, G = {};
    function la(e) {
      I(e, "add"), I(e, "append"), I(e, "search"), I(e, "update"), I(e, "remove");
    }
    function I(e, i) {
      e[i + "Async"] = function() {
        const n = this, s = arguments;
        var r = s[s.length - 1];
        let o;
        return D(r) && (o = r, delete s[s.length - 1]), r = new Promise(function(l) {
          setTimeout(function() {
            n.async = !0;
            const h = n[i].apply(n, s);
            n.async = !1, l(h);
          });
        }), o ? (r.then(o), this) : r;
      };
    }
    function ma(e, i, n, s) {
      const r = e.length;
      let o = [], l, h, f = 0;
      s && (s = []);
      for (let p = r - 1; 0 <= p; p--) {
        const m = e[p], A = m.length, w = v();
        let k = !l;
        for (let g = 0; g < A; g++) {
          const y = m[g], j = y.length;
          if (j)
            for (let B = 0, R, _; B < j; B++)
              if (_ = y[B], l) {
                if (l[_]) {
                  if (!p) {
                    if (n)
                      n--;
                    else if (o[f++] = _, f === i)
                      return o;
                  }
                  (p || s) && (w[_] = 1), k = !0;
                }
                if (s && (R = (h[_] || 0) + 1, h[_] = R, R < r)) {
                  const q = s[R - 2] || (s[R - 2] = []);
                  q[q.length] = _;
                }
              } else
                w[_] = 1;
        }
        if (s)
          l || (h = w);
        else if (!k)
          return [];
        l = w;
      }
      if (s)
        for (let p = s.length - 1, m, A; 0 <= p; p--) {
          m = s[p], A = m.length;
          for (let w = 0, k; w < A; w++)
            if (k = m[w], !l[k]) {
              if (n)
                n--;
              else if (o[f++] = k, f === i)
                return o;
              l[k] = 1;
            }
        }
      return o;
    }
    function na(e, i) {
      const n = v(), s = v(), r = [];
      for (let o = 0; o < e.length; o++)
        n[e[o]] = 1;
      for (let o = 0, l; o < i.length; o++) {
        l = i[o];
        for (let h = 0, f; h < l.length; h++)
          f = l[h], n[f] && !s[f] && (s[f] = 1, r[r.length] = f);
      }
      return r;
    }
    function J(e) {
      this.l = e !== !0 && e, this.cache = v(), this.h = [];
    }
    function oa(e, i, n) {
      C(e) && (e = e.query);
      let s = this.cache.get(e);
      return s || (s = this.search(e, i, n), this.cache.set(e, s)), s;
    }
    J.prototype.set = function(e, i) {
      if (!this.cache[e]) {
        var n = this.h.length;
        for (n === this.l ? delete this.cache[this.h[n - 1]] : n++, --n; 0 < n; n--)
          this.h[n] = this.h[n - 1];
        this.h[0] = e;
      }
      this.cache[e] = i;
    }, J.prototype.get = function(e) {
      const i = this.cache[e];
      if (this.l && i && (e = this.h.indexOf(e))) {
        const n = this.h[e - 1];
        this.h[e - 1] = this.h[e], this.h[e] = n;
      }
      return i;
    };
    const qa = { memory: { charset: "latin:extra", D: 3, B: 4, m: !1 }, performance: { D: 3, B: 3, s: !1, context: { depth: 2, D: 1 } }, match: { charset: "latin:extra", G: "reverse" }, score: { charset: "latin:advanced", D: 20, B: 3, context: { depth: 3, D: 9 } }, default: {} };
    function ra(e, i, n, s, r, o, l) {
      setTimeout(function() {
        const h = e(n ? n + "." + s : s, JSON.stringify(l));
        h && h.then ? h.then(function() {
          i.export(e, i, n, r, o + 1);
        }) : i.export(e, i, n, r, o + 1);
      });
    }
    function K(e, i) {
      if (!(this instanceof K))
        return new K(e);
      var n;
      if (e) {
        x(e) ? e = qa[e] : (n = e.preset) && (e = Object.assign({}, n[n], e)), n = e.charset;
        var s = e.lang;
        x(n) && (n.indexOf(":") === -1 && (n += ":default"), n = G[n]), x(s) && (s = ka[s]);
      } else
        e = {};
      let r, o, l = e.context || {};
      if (this.encode = e.encode || n && n.encode || ia, this.register = i || v(), this.D = r = e.resolution || 9, this.G = i = n && n.G || e.tokenize || "strict", this.depth = i === "strict" && l.depth, this.l = u(l.bidirectional), this.s = o = u(e.optimize), this.m = u(e.fastupdate), this.B = e.minlength || 1, this.C = e.boost, this.map = o ? aa(r) : v(), this.A = r = l.resolution || 1, this.h = o ? aa(r) : v(), this.F = n && n.F || e.rtl, this.H = (i = e.matcher || s && s.H) && fa(i, !1), this.J = (i = e.stemmer || s && s.J) && fa(i, !0), n = i = e.filter || s && s.filter) {
        n = i, s = v();
        for (let h = 0, f = n.length; h < f; h++)
          s[n[h]] = 1;
        n = s;
      }
      this.filter = n, this.cache = (i = e.cache) && new J(i);
    }
    t = K.prototype, t.append = function(e, i) {
      return this.add(e, i, !0);
    }, t.add = function(e, i, n, s) {
      if (i && (e || e === 0)) {
        if (!s && !n && this.register[e])
          return this.update(e, i);
        if (i = this.encode(i), s = i.length) {
          const p = v(), m = v(), A = this.depth, w = this.D;
          for (let k = 0; k < s; k++) {
            let g = i[this.F ? s - 1 - k : k];
            var r = g.length;
            if (g && r >= this.B && (A || !m[g])) {
              var o = L(w, s, k), l = "";
              switch (this.G) {
                case "full":
                  if (2 < r) {
                    for (o = 0; o < r; o++)
                      for (var h = r; h > o; h--)
                        if (h - o >= this.B) {
                          var f = L(w, s, k, r, o);
                          l = g.substring(o, h), M(this, m, l, f, e, n);
                        }
                    break;
                  }
                case "reverse":
                  if (1 < r) {
                    for (h = r - 1; 0 < h; h--)
                      l = g[h] + l, l.length >= this.B && M(
                        this,
                        m,
                        l,
                        L(w, s, k, r, h),
                        e,
                        n
                      );
                    l = "";
                  }
                case "forward":
                  if (1 < r) {
                    for (h = 0; h < r; h++)
                      l += g[h], l.length >= this.B && M(this, m, l, o, e, n);
                    break;
                  }
                default:
                  if (this.C && (o = Math.min(o / this.C(i, g, k) | 0, w - 1)), M(this, m, g, o, e, n), A && 1 < s && k < s - 1) {
                    for (r = v(), l = this.A, o = g, h = Math.min(A + 1, s - k), r[o] = 1, f = 1; f < h; f++)
                      if ((g = i[this.F ? s - 1 - k - f : k + f]) && g.length >= this.B && !r[g]) {
                        r[g] = 1;
                        const y = this.l && g > o;
                        M(this, p, y ? o : g, L(l + (s / 2 > l ? 0 : 1), s, k, h - 1, f - 1), e, n, y ? g : o);
                      }
                  }
              }
            }
          }
          this.m || (this.register[e] = 1);
        }
      }
      return this;
    };
    function L(e, i, n, s, r) {
      return n && 1 < e ? i + (s || 0) <= e ? n + (r || 0) : (e - 1) / (i + (s || 0)) * (n + (r || 0)) + 1 | 0 : 0;
    }
    function M(e, i, n, s, r, o, l) {
      let h = l ? e.h : e.map;
      (!i[n] || l && !i[n][l]) && (e.s && (h = h[s]), l ? (i = i[n] || (i[n] = v()), i[l] = 1, h = h[l] || (h[l] = v())) : i[n] = 1, h = h[n] || (h[n] = []), e.s || (h = h[s] || (h[s] = [])), o && h.includes(r) || (h[h.length] = r, e.m && (e = e.register[r] || (e.register[r] = []), e[e.length] = h)));
    }
    t.search = function(e, i, n) {
      n || (!i && C(e) ? (n = e, e = n.query) : C(i) && (n = i));
      let s = [], r, o, l = 0;
      if (n) {
        e = n.query || e, i = n.limit, l = n.offset || 0;
        var h = n.context;
        o = n.suggest;
      }
      if (e && (e = this.encode("" + e), r = e.length, 1 < r)) {
        n = v();
        var f = [];
        for (let m = 0, A = 0, w; m < r; m++)
          if ((w = e[m]) && w.length >= this.B && !n[w])
            if (this.s || o || this.map[w])
              f[A++] = w, n[w] = 1;
            else
              return s;
        e = f, r = e.length;
      }
      if (!r)
        return s;
      i || (i = 100), h = this.depth && 1 < r && h !== !1, n = 0;
      let p;
      h ? (p = e[0], n = 1) : 1 < r && e.sort(ba);
      for (let m, A; n < r; n++) {
        if (A = e[n], h ? (m = sa(
          this,
          s,
          o,
          i,
          l,
          r === 2,
          A,
          p
        ), o && m === !1 && s.length || (p = A)) : m = sa(this, s, o, i, l, r === 1, A), m)
          return m;
        if (o && n === r - 1) {
          if (f = s.length, !f) {
            if (h) {
              h = 0, n = -1;
              continue;
            }
            return s;
          }
          if (f === 1)
            return ta(s[0], i, l);
        }
      }
      return ma(s, i, l, o);
    };
    function sa(e, i, n, s, r, o, l, h) {
      let f = [], p = h ? e.h : e.map;
      if (e.s || (p = ua(p, l, h, e.l)), p) {
        let m = 0;
        const A = Math.min(p.length, h ? e.A : e.D);
        for (let w = 0, k = 0, g, y; w < A && !((g = p[w]) && (e.s && (g = ua(g, l, h, e.l)), r && g && o && (y = g.length, y <= r ? (r -= y, g = null) : (g = g.slice(r), r = 0)), g && (f[m++] = g, o && (k += g.length, k >= s)))); w++)
          ;
        if (m) {
          if (o)
            return ta(f, s, 0);
          i[i.length] = f;
          return;
        }
      }
      return !n && f;
    }
    function ta(e, i, n) {
      return e = e.length === 1 ? e[0] : [].concat.apply([], e), n || e.length > i ? e.slice(n, n + i) : e;
    }
    function ua(e, i, n, s) {
      return n ? (s = s && i > n, e = (e = e[s ? i : n]) && e[s ? n : i]) : e = e[i], e;
    }
    t.contain = function(e) {
      return !!this.register[e];
    }, t.update = function(e, i) {
      return this.remove(e).add(e, i);
    }, t.remove = function(e, i) {
      const n = this.register[e];
      if (n) {
        if (this.m)
          for (let s = 0, r; s < n.length; s++)
            r = n[s], r.splice(r.indexOf(e), 1);
        else
          N(this.map, e, this.D, this.s), this.depth && N(this.h, e, this.A, this.s);
        if (i || delete this.register[e], this.cache) {
          i = this.cache;
          for (let s = 0, r, o; s < i.h.length; s++)
            o = i.h[s], r = i.cache[o], r.includes(e) && (i.h.splice(s--, 1), delete i.cache[o]);
        }
      }
      return this;
    };
    function N(e, i, n, s, r) {
      let o = 0;
      if (e.constructor === Array)
        if (r)
          i = e.indexOf(i), i !== -1 ? 1 < e.length && (e.splice(i, 1), o++) : o++;
        else {
          r = Math.min(e.length, n);
          for (let l = 0, h; l < r; l++)
            (h = e[l]) && (o = N(h, i, n, s, r), s || o || delete e[l]);
        }
      else
        for (let l in e)
          (o = N(e[l], i, n, s, r)) || delete e[l];
      return o;
    }
    t.searchCache = oa, t.export = function(e, i, n, s, r) {
      let o, l;
      switch (r || (r = 0)) {
        case 0:
          if (o = "reg", this.m) {
            l = v();
            for (let h in this.register)
              l[h] = 1;
          } else
            l = this.register;
          break;
        case 1:
          o = "cfg", l = { doc: 0, opt: this.s ? 1 : 0 };
          break;
        case 2:
          o = "map", l = this.map;
          break;
        case 3:
          o = "ctx", l = this.h;
          break;
        default:
          return;
      }
      return ra(e, i || this, n, o, s, r, l), !0;
    }, t.import = function(e, i) {
      if (i)
        switch (x(i) && (i = JSON.parse(i)), e) {
          case "cfg":
            this.s = !!i.opt;
            break;
          case "reg":
            this.m = !1, this.register = i;
            break;
          case "map":
            this.map = i;
            break;
          case "ctx":
            this.h = i;
        }
    }, la(K.prototype);
    function va(e) {
      e = e.data;
      var i = self._index;
      const n = e.args;
      var s = e.task;
      switch (s) {
        case "init":
          s = e.options || {}, e = e.factory, i = s.encode, s.cache = !1, i && i.indexOf("function") === 0 && (s.encode = Function("return " + i)()), e ? (Function("return " + e)()(self), self._index = new self.FlexSearch.Index(s), delete self.FlexSearch) : self._index = new K(s);
          break;
        default:
          e = e.id, i = i[s].apply(i, n), postMessage(s === "search" ? { id: e, msg: i } : { id: e });
      }
    }
    let wa = 0;
    function O(e) {
      if (!(this instanceof O))
        return new O(e);
      var i;
      e ? D(i = e.encode) && (e.encode = i.toString()) : e = {}, (i = (self || window)._factory) && (i = i.toString());
      const n = typeof window > "u" && self.exports, s = this;
      this.o = xa(i, n, e.worker), this.h = v(), this.o && (n ? this.o.on("message", function(r) {
        s.h[r.id](r.msg), delete s.h[r.id];
      }) : this.o.onmessage = function(r) {
        r = r.data, s.h[r.id](r.msg), delete s.h[r.id];
      }, this.o.postMessage({ task: "init", factory: i, options: e }));
    }
    P("add"), P("append"), P("search"), P("update"), P("remove");
    function P(e) {
      O.prototype[e] = O.prototype[e + "Async"] = function() {
        const i = this, n = [].slice.call(arguments);
        var s = n[n.length - 1];
        let r;
        return D(s) && (r = s, n.splice(n.length - 1, 1)), s = new Promise(function(o) {
          setTimeout(function() {
            i.h[++wa] = o, i.o.postMessage({ task: e, id: wa, args: n });
          });
        }), r ? (s.then(r), this) : s;
      };
    }
    function xa(a, b, c) {
      let d;
      try {
        d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + va.toString()], { type: "text/javascript" }))) : new Worker(x(c) ? c : "worker/worker.js", { type: "module" });
      } catch (e) {
      }
      return d;
    }
    function Q(e) {
      if (!(this instanceof Q))
        return new Q(e);
      var i = e.document || e.doc || e, n;
      this.K = [], this.h = [], this.A = [], this.register = v(), this.key = (n = i.key || i.id) && S(n, this.A) || "id", this.m = u(e.fastupdate), this.C = (n = i.store) && n !== !0 && [], this.store = n && v(), this.I = (n = i.tag) && S(n, this.A), this.l = n && v(), this.cache = (n = e.cache) && new J(n), e.cache = !1, this.o = e.worker, this.async = !1, n = v();
      let s = i.index || i.field || i;
      x(s) && (s = [s]);
      for (let r = 0, o, l; r < s.length; r++)
        o = s[r], x(o) || (l = o, o = o.field), l = C(l) ? Object.assign({}, e, l) : e, this.o && (n[o] = new O(l), n[o].o || (this.o = !1)), this.o || (n[o] = new K(l, this.register)), this.K[r] = S(o, this.A), this.h[r] = o;
      if (this.C)
        for (e = i.store, x(e) && (e = [e]), i = 0; i < e.length; i++)
          this.C[i] = S(e[i], this.A);
      this.index = n;
    }
    function S(e, i) {
      const n = e.split(":");
      let s = 0;
      for (let r = 0; r < n.length; r++)
        e = n[r], 0 <= e.indexOf("[]") && (e = e.substring(0, e.length - 2)) && (i[s] = !0), e && (n[s++] = e);
      return s < n.length && (n.length = s), 1 < s ? n : n[0];
    }
    function T(e, i) {
      if (x(i))
        e = e[i];
      else
        for (let n = 0; e && n < i.length; n++)
          e = e[i[n]];
      return e;
    }
    function U(e, i, n, s, r) {
      if (e = e[r], s === n.length - 1)
        i[r] = e;
      else if (e)
        if (e.constructor === Array)
          for (i = i[r] = Array(e.length), r = 0; r < e.length; r++)
            U(e, i, n, s, r);
        else
          i = i[r] || (i[r] = v()), r = n[++s], U(e, i, n, s, r);
    }
    function V(e, i, n, s, r, o, l, h) {
      if (e = e[l])
        if (s === i.length - 1) {
          if (e.constructor === Array) {
            if (n[s]) {
              for (i = 0; i < e.length; i++)
                r.add(o, e[i], !0, !0);
              return;
            }
            e = e.join(" ");
          }
          r.add(o, e, h, !0);
        } else if (e.constructor === Array)
          for (l = 0; l < e.length; l++)
            V(e, i, n, s, r, o, l, h);
        else
          l = i[++s], V(e, i, n, s, r, o, l, h);
    }
    t = Q.prototype, t.add = function(e, i, n) {
      if (C(e) && (i = e, e = T(i, this.key)), i && (e || e === 0)) {
        if (!n && this.register[e])
          return this.update(e, i);
        for (let s = 0, r, o; s < this.h.length; s++)
          o = this.h[s], r = this.K[s], x(r) && (r = [r]), V(i, r, this.A, 0, this.index[o], e, r[0], n);
        if (this.I) {
          let s = T(i, this.I), r = v();
          x(s) && (s = [s]);
          for (let o = 0, l, h; o < s.length; o++)
            if (l = s[o], !r[l] && (r[l] = 1, h = this.l[l] || (this.l[l] = []), !n || !h.includes(e)) && (h[h.length] = e, this.m)) {
              const f = this.register[e] || (this.register[e] = []);
              f[f.length] = h;
            }
        }
        if (this.store && (!n || !this.store[e])) {
          let s;
          if (this.C) {
            s = v();
            for (let r = 0, o; r < this.C.length; r++)
              o = this.C[r], x(o) ? s[o] = i[o] : U(i, s, o, 0, o[0]);
          }
          this.store[e] = s || i;
        }
      }
      return this;
    }, t.append = function(e, i) {
      return this.add(e, i, !0);
    }, t.update = function(e, i) {
      return this.remove(e).add(e, i);
    }, t.remove = function(e) {
      if (C(e) && (e = T(e, this.key)), this.register[e]) {
        for (var i = 0; i < this.h.length && (this.index[this.h[i]].remove(e, !this.o), !this.m); i++)
          ;
        if (this.I && !this.m)
          for (let n in this.l) {
            i = this.l[n];
            const s = i.indexOf(e);
            s !== -1 && (1 < i.length ? i.splice(s, 1) : delete this.l[n]);
          }
        this.store && delete this.store[e], delete this.register[e];
      }
      return this;
    }, t.search = function(e, i, n, s) {
      n || (!i && C(e) ? (n = e, e = "") : C(i) && (n = i, i = 0));
      let r = [], o = [], l, h, f, p, m, A, w = 0;
      if (n)
        if (n.constructor === Array)
          f = n, n = null;
        else {
          if (e = n.query || e, f = (l = n.pluck) || n.index || n.field, p = n.tag, h = this.store && n.enrich, m = n.bool === "and", i = n.limit || i || 100, A = n.offset || 0, p && (x(p) && (p = [p]), !e)) {
            for (let g = 0, y; g < p.length; g++)
              (y = ya.call(this, p[g], i, A, h)) && (r[r.length] = y, w++);
            return w ? r : [];
          }
          x(f) && (f = [f]);
        }
      f || (f = this.h), m = m && (1 < f.length || p && 1 < p.length);
      const k = !s && (this.o || this.async) && [];
      for (let g = 0, y, j, B; g < f.length; g++) {
        let R;
        if (j = f[g], x(j) || (R = j, j = R.field, e = R.query || e, i = R.limit || i), k)
          k[g] = this.index[j].searchAsync(e, i, R || n);
        else {
          if (s ? y = s[g] : y = this.index[j].search(e, i, R || n), B = y && y.length, p && B) {
            const _ = [];
            let q = 0;
            m && (_[0] = [y]);
            for (let z = 0, H, $; z < p.length; z++)
              H = p[z], (B = ($ = this.l[H]) && $.length) && (q++, _[_.length] = m ? [$] : $);
            q && (y = m ? ma(_, i || 100, A || 0) : na(y, _), B = y.length);
          }
          if (B)
            o[w] = j, r[w++] = y;
          else if (m)
            return [];
        }
      }
      if (k) {
        const g = this;
        return new Promise(function(y) {
          Promise.all(k).then(function(j) {
            y(g.search(
              e,
              i,
              n,
              j
            ));
          });
        });
      }
      if (!w)
        return [];
      if (l && (!h || !this.store))
        return r[0];
      for (let g = 0, y; g < o.length; g++) {
        if (y = r[g], y.length && h && (y = za.call(this, y)), l)
          return y;
        r[g] = { field: o[g], result: y };
      }
      return r;
    };
    function ya(e, i, n, s) {
      let r = this.l[e], o = r && r.length - n;
      if (o && 0 < o)
        return (o > i || n) && (r = r.slice(n, n + i)), s && (r = za.call(this, r)), { tag: e, result: r };
    }
    function za(e) {
      const i = Array(e.length);
      for (let n = 0, s; n < e.length; n++)
        s = e[n], i[n] = { id: s, doc: this.store[s] };
      return i;
    }
    t.contain = function(e) {
      return !!this.register[e];
    }, t.get = function(e) {
      return this.store[e];
    }, t.set = function(e, i) {
      return this.store[e] = i, this;
    }, t.searchCache = oa, t.export = function(e, i, n, s, r) {
      if (r || (r = 0), s || (s = 0), s < this.h.length) {
        const o = this.h[s], l = this.index[o];
        i = this, setTimeout(function() {
          l.export(e, i, r ? o : "", s, r++) || (s++, r = 1, i.export(e, i, o, s, r));
        });
      } else {
        let o, l;
        switch (r) {
          case 1:
            o = "tag", l = this.l;
            break;
          case 2:
            o = "store", l = this.store;
            break;
          default:
            return;
        }
        ra(e, this, n, o, s, r, l);
      }
    }, t.import = function(e, i) {
      if (i)
        switch (x(i) && (i = JSON.parse(i)), e) {
          case "tag":
            this.l = i;
            break;
          case "reg":
            this.m = !1, this.register = i;
            for (let s = 0, r; s < this.h.length; s++)
              r = this.index[this.h[s]], r.register = i, r.m = !1;
            break;
          case "store":
            this.store = i;
            break;
          default:
            e = e.split(".");
            const n = e[0];
            e = e[1], n && e && this.index[n].import(e, i);
        }
    }, la(Q.prototype);
    var Ba = { encode: Aa, F: !1, G: "" };
    const Ca = [F("[\xE0\xE1\xE2\xE3\xE4\xE5]"), "a", F("[\xE8\xE9\xEA\xEB]"), "e", F("[\xEC\xED\xEE\xEF]"), "i", F("[\xF2\xF3\xF4\xF5\xF6\u0151]"), "o", F("[\xF9\xFA\xFB\xFC\u0171]"), "u", F("[\xFD\u0177\xFF]"), "y", F("\xF1"), "n", F("[\xE7c]"), "k", F("\xDF"), "s", F(" & "), " and "];
    function Aa(e) {
      var i = e = "" + e;
      return i.normalize && (i = i.normalize("NFD").replace(ea, "")), ca.call(this, i.toLowerCase(), !e.normalize && Ca);
    }
    var Ea = { encode: Da, F: !1, G: "strict" };
    const Fa = /[^a-z0-9]+/, Ga = { b: "p", v: "f", w: "f", z: "s", x: "s", \u00DF: "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
    function Da(e) {
      e = Aa.call(this, e).join(" ");
      const i = [];
      if (e) {
        const n = e.split(Fa), s = n.length;
        for (let r = 0, o, l = 0; r < s; r++)
          if ((e = n[r]) && (!this.filter || !this.filter[e])) {
            o = e[0];
            let h = Ga[o] || o, f = h;
            for (let p = 1; p < e.length; p++) {
              o = e[p];
              const m = Ga[o] || o;
              m && m !== f && (h += m, f = m);
            }
            i[l++] = h;
          }
      }
      return i;
    }
    var Ia = { encode: Ha, F: !1, G: "" };
    const Ja = [F("ae"), "a", F("oe"), "o", F("sh"), "s", F("th"), "t", F("ph"), "f", F("pf"), "f", F("(?![aeo])h(?![aeo])"), "", F("(?!^[aeo])h(?!^[aeo])"), ""];
    function Ha(e, i) {
      return e && (e = Da.call(this, e).join(" "), 2 < e.length && (e = E(e, Ja)), i || (1 < e.length && (e = ha(e)), e && (e = e.split(" ")))), e || [];
    }
    var La = { encode: Ka, F: !1, G: "" };
    const Ma = F("(?!\\b)[aeo]");
    function Ka(e) {
      return e && (e = Ha.call(this, e, !0), 1 < e.length && (e = e.replace(Ma, "")), 1 < e.length && (e = ha(e)), e && (e = e.split(" "))), e || [];
    }
    G["latin:default"] = ja, G["latin:simple"] = Ba, G["latin:balance"] = Ea, G["latin:advanced"] = Ia, G["latin:extra"] = La;
    const W = self;
    let Y;
    const Z = { Index: K, Document: Q, Worker: O, registerCharset: function(e, i) {
      G[e] = i;
    }, registerLanguage: function(e, i) {
      ka[e] = i;
    } };
    (Y = W.define) && Y.amd ? Y([], function() {
      return Z;
    }) : W.exports ? W.exports = Z : W.FlexSearch = Z;
  })(commonjsGlobal);
})(flexsearch_bundle);
const FlexSearch = flexsearch_bundle.exports, md = new MarkdownIt();
let MAX_PREVIEW_CHARS = 62;
const buildIndexSearch = (e, i) => {
  var n = new FlexSearch.Index(i);
  return e.forEach((s) => {
    n.add(s.id, s.a + " " + s.b);
  }), n;
};
function buildPreviews(e) {
  const i = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    let r = md.render(s.b).replace(/(<([^>]+)>)/gi, "");
    r == "" && (r = s.b), r.length > MAX_PREVIEW_CHARS && (r = r.slice(0, MAX_PREVIEW_CHARS) + " ..."), i[s.id] = {
      t: s.t || s.a,
      p: r,
      l: s.link,
      a: s.a
    };
  }
  return i;
}
async function IndexSearch(e, i) {
  console.log("  \u{1F50E} Indexing..."), i.previewLength && (MAX_PREVIEW_CHARS = i.previewLength);
  const n = await buildDocs(e), s = buildPreviews(n), r = buildIndexSearch(n, i);
  var o = {
    reg: JSON.stringify(r.registry),
    cfg: JSON.stringify(r.cfg),
    map: JSON.stringify(r.map),
    ctx: JSON.stringify(r.ctx)
  };
  const l = `const INDEX_DATA = ${JSON.stringify(o)};
  const PREVIEW_LOOKUP = ${JSON.stringify(s)};
  const Options = ${JSON.stringify(i)};
  const data = { INDEX_DATA, PREVIEW_LOOKUP, Options };
  export default data;`;
  return console.log("  \u{1F50E} Done."), l;
}
const DEFAULT_OPTIONS = {
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs"
};
function SearchPlugin(e) {
  const i = {
    ...DEFAULT_OPTIONS,
    ...e
  };
  let n;
  const s = "virtual:search-data", r = "\0" + s;
  return {
    name: "vite-plugin-search",
    enforce: "pre",
    configResolved(o) {
      n = o;
    },
    config: () => ({
      resolve: {
        alias: { "./VPNavBarSearch.vue": "vitepress-plugin-search/Search.vue" }
      }
    }),
    async resolveId(o) {
      if (o === s)
        return r;
    },
    async load(o) {
      if (o === r)
        return n.build.ssr ? `const INDEX_DATA = { "version": "2.3.9", "fields": ["b", "a"], "fieldVectors": [], "invertedIndex": [], "pipeline": ["stemmer"] };
				const PREVIEW_LOOKUP = {};
				const Options = ${JSON.stringify(i)};
				const data = { INDEX_DATA, PREVIEW_LOOKUP, Options };
				export default data;` : await IndexSearch(n.root, i);
    }
  };
}
export {
  SearchPlugin
};
