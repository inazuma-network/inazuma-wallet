var M1 = Object.create;
var { getPrototypeOf: F1, defineProperty: lq, getOwnPropertyNames: w1 } = Object;
var I1 = Object.prototype.hasOwnProperty;
var P1 = ($, J, q) => {
  q = $ != null ? M1(F1($)) : {};
  let Q = J || !$ || !$.__esModule ? lq(q, "default", { value: $, enumerable: !0 }) : q;
  for (let Z of w1($)) if (!I1.call(Q, Z)) lq(Q, Z, { get: () => $[Z], enumerable: !0 });
  return Q;
};
var y = ($, J) => () => (J || $((J = { exports: {} }).exports, J), J.exports);
var iq = y((Rz, nq) => {
  nq.exports = function () {
    return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
  };
});
var h0 = y((E1) => {
  var qJ,
    T1 = [
      0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991,
      1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761,
      2876, 3034, 3196, 3362, 3532, 3706,
    ];
  E1.getSymbolSize = function (J) {
    if (!J) throw Error('"version" cannot be null or undefined');
    if (J < 1 || J > 40) throw Error('"version" should be in range from 1 to 40');
    return J * 4 + 17;
  };
  E1.getSymbolTotalCodewords = function (J) {
    return T1[J];
  };
  E1.getBCHDigit = function ($) {
    let J = 0;
    while ($ !== 0) (J++, ($ >>>= 1));
    return J;
  };
  E1.setToSJISFunction = function (J) {
    if (typeof J !== "function") throw Error('"toSJISFunc" is not a valid function.');
    qJ = J;
  };
  E1.isKanjiModeEnabled = function () {
    return typeof qJ < "u";
  };
  E1.toSJIS = function (J) {
    return qJ(J);
  };
});
var R8 = y((f1) => {
  f1.L = { bit: 1 };
  f1.M = { bit: 0 };
  f1.Q = { bit: 3 };
  f1.H = { bit: 2 };
  function S1($) {
    if (typeof $ !== "string") throw Error("Param is not a string");
    switch ($.toLowerCase()) {
      case "l":
      case "low":
        return f1.L;
      case "m":
      case "medium":
        return f1.M;
      case "q":
      case "quartile":
        return f1.Q;
      case "h":
      case "high":
        return f1.H;
      default:
        throw Error("Unknown EC Level: " + $);
    }
  }
  f1.isValid = function (J) {
    return J && typeof J.bit < "u" && J.bit >= 0 && J.bit < 4;
  };
  f1.from = function (J, q) {
    if (f1.isValid(J)) return J;
    try {
      return S1(J);
    } catch (Q) {
      return q;
    }
  };
});
var JQ = y((Mz, $Q) => {
  function eq() {
    ((this.buffer = []), (this.length = 0));
  }
  eq.prototype = {
    get: function ($) {
      let J = Math.floor($ / 8);
      return ((this.buffer[J] >>> (7 - ($ % 8))) & 1) === 1;
    },
    put: function ($, J) {
      for (let q = 0; q < J; q++) this.putBit((($ >>> (J - q - 1)) & 1) === 1);
    },
    getLengthInBits: function () {
      return this.length;
    },
    putBit: function ($) {
      let J = Math.floor(this.length / 8);
      if (this.buffer.length <= J) this.buffer.push(0);
      if ($) this.buffer[J] |= 128 >>> (this.length % 8);
      this.length++;
    },
  };
  $Q.exports = eq;
});
var QQ = y((Fz, qQ) => {
  function h$($) {
    if (!$ || $ < 1) throw Error("BitMatrix size must be defined and greater than 0");
    ((this.size = $),
      (this.data = new Uint8Array($ * $)),
      (this.reservedBit = new Uint8Array($ * $)));
  }
  h$.prototype.set = function ($, J, q, Q) {
    let Z = $ * this.size + J;
    if (((this.data[Z] = q), Q)) this.reservedBit[Z] = !0;
  };
  h$.prototype.get = function ($, J) {
    return this.data[$ * this.size + J];
  };
  h$.prototype.xor = function ($, J, q) {
    this.data[$ * this.size + J] ^= q;
  };
  h$.prototype.isReserved = function ($, J) {
    return this.reservedBit[$ * this.size + J];
  };
  qQ.exports = h$;
});
var YQ = y((A1) => {
  var v1 = h0().getSymbolSize;
  A1.getRowColCoords = function (J) {
    if (J === 1) return [];
    let q = Math.floor(J / 7) + 2,
      Q = v1(J),
      Z = Q === 145 ? 26 : Math.ceil((Q - 13) / (2 * q - 2)) * 2,
      Y = [Q - 7];
    for (let X = 1; X < q - 1; X++) Y[X] = Y[X - 1] - Z;
    return (Y.push(6), Y.reverse());
  };
  A1.getPositions = function (J) {
    let q = [],
      Q = A1.getRowColCoords(J),
      Z = Q.length;
    for (let Y = 0; Y < Z; Y++)
      for (let X = 0; X < Z; X++) {
        if ((Y === 0 && X === 0) || (Y === 0 && X === Z - 1) || (Y === Z - 1 && X === 0)) continue;
        q.push([Q[Y], Q[X]]);
      }
    return q;
  };
});
var XQ = y((u1) => {
  var y1 = h0().getSymbolSize;
  u1.getPositions = function (J) {
    let q = y1(J);
    return [
      [0, 0],
      [q - 7, 0],
      [0, q - 7],
    ];
  };
});
var OQ = y((c1) => {
  c1.Patterns = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7,
  };
  var D$ = { N1: 3, N2: 3, N3: 40, N4: 10 };
  c1.isValid = function (J) {
    return J != null && J !== "" && !isNaN(J) && J >= 0 && J <= 7;
  };
  c1.from = function (J) {
    return c1.isValid(J) ? parseInt(J, 10) : void 0;
  };
  c1.getPenaltyN1 = function (J) {
    let q = J.size,
      Q = 0,
      Z = 0,
      Y = 0,
      X = null,
      U = null;
    for (let z = 0; z < q; z++) {
      ((Z = Y = 0), (X = U = null));
      for (let G = 0; G < q; G++) {
        let W = J.get(z, G);
        if (W === X) Z++;
        else {
          if (Z >= 5) Q += D$.N1 + (Z - 5);
          ((X = W), (Z = 1));
        }
        if (((W = J.get(G, z)), W === U)) Y++;
        else {
          if (Y >= 5) Q += D$.N1 + (Y - 5);
          ((U = W), (Y = 1));
        }
      }
      if (Z >= 5) Q += D$.N1 + (Z - 5);
      if (Y >= 5) Q += D$.N1 + (Y - 5);
    }
    return Q;
  };
  c1.getPenaltyN2 = function (J) {
    let q = J.size,
      Q = 0;
    for (let Z = 0; Z < q - 1; Z++)
      for (let Y = 0; Y < q - 1; Y++) {
        let X = J.get(Z, Y) + J.get(Z, Y + 1) + J.get(Z + 1, Y) + J.get(Z + 1, Y + 1);
        if (X === 4 || X === 0) Q++;
      }
    return Q * D$.N2;
  };
  c1.getPenaltyN3 = function (J) {
    let q = J.size,
      Q = 0,
      Z = 0,
      Y = 0;
    for (let X = 0; X < q; X++) {
      Z = Y = 0;
      for (let U = 0; U < q; U++) {
        if (((Z = ((Z << 1) & 2047) | J.get(X, U)), U >= 10 && (Z === 1488 || Z === 93))) Q++;
        if (((Y = ((Y << 1) & 2047) | J.get(U, X)), U >= 10 && (Y === 1488 || Y === 93))) Q++;
      }
    }
    return Q * D$.N3;
  };
  c1.getPenaltyN4 = function (J) {
    let q = 0,
      Q = J.data.length;
    for (let Y = 0; Y < Q; Y++) q += J.data[Y];
    return Math.abs(Math.ceil((q * 100) / Q / 5) - 10) * D$.N4;
  };
  function b1($, J, q) {
    switch ($) {
      case c1.Patterns.PATTERN000:
        return (J + q) % 2 === 0;
      case c1.Patterns.PATTERN001:
        return J % 2 === 0;
      case c1.Patterns.PATTERN010:
        return q % 3 === 0;
      case c1.Patterns.PATTERN011:
        return (J + q) % 3 === 0;
      case c1.Patterns.PATTERN100:
        return (Math.floor(J / 2) + Math.floor(q / 3)) % 2 === 0;
      case c1.Patterns.PATTERN101:
        return ((J * q) % 2) + ((J * q) % 3) === 0;
      case c1.Patterns.PATTERN110:
        return (((J * q) % 2) + ((J * q) % 3)) % 2 === 0;
      case c1.Patterns.PATTERN111:
        return (((J * q) % 3) + ((J + q) % 2)) % 2 === 0;
      default:
        throw Error("bad maskPattern:" + $);
    }
  }
  c1.applyMask = function (J, q) {
    let Q = q.size;
    for (let Z = 0; Z < Q; Z++)
      for (let Y = 0; Y < Q; Y++) {
        if (q.isReserved(Y, Z)) continue;
        q.xor(Y, Z, b1(J, Y, Z));
      }
  };
  c1.getBestMask = function (J, q) {
    let Q = Object.keys(c1.Patterns).length,
      Z = 0,
      Y = 1 / 0;
    for (let X = 0; X < Q; X++) {
      (q(X), c1.applyMask(X, J));
      let U = c1.getPenaltyN1(J) + c1.getPenaltyN2(J) + c1.getPenaltyN3(J) + c1.getPenaltyN4(J);
      if ((c1.applyMask(X, J), U < Y)) ((Y = U), (Z = X));
    }
    return Z;
  };
});
var ZJ = y((d1) => {
  var d0 = R8(),
    V8 = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6,
      6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12,
      18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25,
      9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40,
      13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48,
      57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47,
      65, 77, 25, 49, 68, 81,
    ],
    j8 = [
      7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96,
      112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224,
      264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280,
      408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224,
      442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870,
      1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350,
      450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570,
      1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660,
      1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430,
    ];
  d1.getBlocksCount = function (J, q) {
    switch (q) {
      case d0.L:
        return V8[(J - 1) * 4 + 0];
      case d0.M:
        return V8[(J - 1) * 4 + 1];
      case d0.Q:
        return V8[(J - 1) * 4 + 2];
      case d0.H:
        return V8[(J - 1) * 4 + 3];
      default:
        return;
    }
  };
  d1.getTotalCodewordsCount = function (J, q) {
    switch (q) {
      case d0.L:
        return j8[(J - 1) * 4 + 0];
      case d0.M:
        return j8[(J - 1) * 4 + 1];
      case d0.Q:
        return j8[(J - 1) * 4 + 2];
      case d0.H:
        return j8[(J - 1) * 4 + 3];
      default:
        return;
    }
  };
});
var DQ = y((i1) => {
  var d$ = new Uint8Array(512),
    M8 = new Uint8Array(256);
  (function () {
    let J = 1;
    for (let q = 0; q < 255; q++) if (((d$[q] = J), (M8[J] = q), (J <<= 1), J & 256)) J ^= 285;
    for (let q = 255; q < 512; q++) d$[q] = d$[q - 255];
  })();
  i1.log = function (J) {
    if (J < 1) throw Error("log(" + J + ")");
    return M8[J];
  };
  i1.exp = function (J) {
    return d$[J];
  };
  i1.mul = function (J, q) {
    if (J === 0 || q === 0) return 0;
    return d$[M8[J] + M8[q]];
  };
});
var RQ = y((t1) => {
  var YJ = DQ();
  t1.mul = function (J, q) {
    let Q = new Uint8Array(J.length + q.length - 1);
    for (let Z = 0; Z < J.length; Z++)
      for (let Y = 0; Y < q.length; Y++) Q[Z + Y] ^= YJ.mul(J[Z], q[Y]);
    return Q;
  };
  t1.mod = function (J, q) {
    let Q = new Uint8Array(J);
    while (Q.length - q.length >= 0) {
      let Z = Q[0];
      for (let X = 0; X < q.length; X++) Q[X] ^= YJ.mul(q[X], Z);
      let Y = 0;
      while (Y < Q.length && Q[Y] === 0) Y++;
      Q = Q.slice(Y);
    }
    return Q;
  };
  t1.generateECPolynomial = function (J) {
    let q = new Uint8Array([1]);
    for (let Q = 0; Q < J; Q++) q = t1.mul(q, new Uint8Array([1, YJ.exp(Q)]));
    return q;
  };
});
var MQ = y((Hz, jQ) => {
  var VQ = RQ();
  function XJ($) {
    if (((this.genPoly = void 0), (this.degree = $), this.degree)) this.initialize(this.degree);
  }
  XJ.prototype.initialize = function (J) {
    ((this.degree = J), (this.genPoly = VQ.generateECPolynomial(this.degree)));
  };
  XJ.prototype.encode = function (J) {
    if (!this.genPoly) throw Error("Encoder not initialized");
    let q = new Uint8Array(J.length + this.degree);
    q.set(J);
    let Q = VQ.mod(q, this.genPoly),
      Z = this.degree - Q.length;
    if (Z > 0) {
      let Y = new Uint8Array(this.degree);
      return (Y.set(Q, Z), Y);
    }
    return Q;
  };
  jQ.exports = XJ;
});
var UJ = y(($9) => {
  $9.isValid = function (J) {
    return !isNaN(J) && J >= 1 && J <= 40;
  };
});
var zJ = y((X9) => {
  var l$ =
    "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  l$ = l$.replace(/u/g, "\\u");
  var q9 =
    "(?:(?![A-Z0-9 $%*+\\-./:]|" +
    l$ +
    `)(?:.|[\r
]))+`;
  X9.KANJI = new RegExp(l$, "g");
  X9.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  X9.BYTE = new RegExp(q9, "g");
  X9.NUMERIC = new RegExp("[0-9]+", "g");
  X9.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
  var Q9 = new RegExp("^" + l$ + "$"),
    Z9 = new RegExp("^[0-9]+$"),
    Y9 = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  X9.testKanji = function (J) {
    return Q9.test(J);
  };
  X9.testNumeric = function (J) {
    return Z9.test(J);
  };
  X9.testAlphanumeric = function (J) {
    return Y9.test(J);
  };
});
var l0 = y((j9) => {
  var R9 = UJ(),
    WJ = zJ();
  j9.NUMERIC = { id: "Numeric", bit: 1, ccBits: [10, 12, 14] };
  j9.ALPHANUMERIC = { id: "Alphanumeric", bit: 2, ccBits: [9, 11, 13] };
  j9.BYTE = { id: "Byte", bit: 4, ccBits: [8, 16, 16] };
  j9.KANJI = { id: "Kanji", bit: 8, ccBits: [8, 10, 12] };
  j9.MIXED = { bit: -1 };
  j9.getCharCountIndicator = function (J, q) {
    if (!J.ccBits) throw Error("Invalid mode: " + J);
    if (!R9.isValid(q)) throw Error("Invalid version: " + q);
    if (q >= 1 && q < 10) return J.ccBits[0];
    else if (q < 27) return J.ccBits[1];
    return J.ccBits[2];
  };
  j9.getBestModeForData = function (J) {
    if (WJ.testNumeric(J)) return j9.NUMERIC;
    else if (WJ.testAlphanumeric(J)) return j9.ALPHANUMERIC;
    else if (WJ.testKanji(J)) return j9.KANJI;
    else return j9.BYTE;
  };
  j9.toString = function (J) {
    if (J && J.id) return J.id;
    throw Error("Invalid mode");
  };
  j9.isValid = function (J) {
    return J && J.bit && J.ccBits;
  };
  function V9($) {
    if (typeof $ !== "string") throw Error("Param is not a string");
    switch ($.toLowerCase()) {
      case "numeric":
        return j9.NUMERIC;
      case "alphanumeric":
        return j9.ALPHANUMERIC;
      case "kanji":
        return j9.KANJI;
      case "byte":
        return j9.BYTE;
      default:
        throw Error("Unknown mode: " + $);
    }
  }
  j9.from = function (J, q) {
    if (j9.isValid(J)) return J;
    try {
      return V9(J);
    } catch (Q) {
      return q;
    }
  };
});
var EQ = y((g9) => {
  var F8 = h0(),
    T9 = ZJ(),
    wQ = R8(),
    n0 = l0(),
    NJ = UJ(),
    IQ = F8.getBCHDigit(7973);
  function E9($, J, q) {
    for (let Q = 1; Q <= 40; Q++) if (J <= g9.getCapacity(Q, q, $)) return Q;
    return;
  }
  function PQ($, J) {
    return n0.getCharCountIndicator($, J) + 4;
  }
  function k9($, J) {
    let q = 0;
    return (
      $.forEach(function (Q) {
        let Z = PQ(Q.mode, J);
        q += Z + Q.getBitsLength();
      }),
      q
    );
  }
  function H9($, J) {
    for (let q = 1; q <= 40; q++) if (k9($, q) <= g9.getCapacity(q, J, n0.MIXED)) return q;
    return;
  }
  g9.from = function (J, q) {
    if (NJ.isValid(J)) return parseInt(J, 10);
    return q;
  };
  g9.getCapacity = function (J, q, Q) {
    if (!NJ.isValid(J)) throw Error("Invalid QR Code version");
    if (typeof Q > "u") Q = n0.BYTE;
    let Z = F8.getSymbolTotalCodewords(J),
      Y = T9.getTotalCodewordsCount(J, q),
      X = (Z - Y) * 8;
    if (Q === n0.MIXED) return X;
    let U = X - PQ(Q, J);
    switch (Q) {
      case n0.NUMERIC:
        return Math.floor((U / 10) * 3);
      case n0.ALPHANUMERIC:
        return Math.floor((U / 11) * 2);
      case n0.KANJI:
        return Math.floor(U / 13);
      case n0.BYTE:
      default:
        return Math.floor(U / 8);
    }
  };
  g9.getBestVersionForData = function (J, q) {
    let Q,
      Z = wQ.from(q, wQ.M);
    if (Array.isArray(J)) {
      if (J.length > 1) return H9(J, Z);
      if (J.length === 0) return 1;
      Q = J[0];
    } else Q = J;
    return E9(Q.mode, Q.getLength(), Z);
  };
  g9.getEncodedBits = function (J) {
    if (!NJ.isValid(J) || J < 7) throw Error("Invalid QR Code version");
    let q = J << 12;
    while (F8.getBCHDigit(q) - IQ >= 0) q ^= 7973 << (F8.getBCHDigit(q) - IQ);
    return (J << 12) | q;
  };
});
var HQ = y((S9) => {
  var RJ = h0(),
    kQ = RJ.getBCHDigit(1335);
  S9.getEncodedBits = function (J, q) {
    let Q = (J.bit << 3) | q,
      Z = Q << 10;
    while (RJ.getBCHDigit(Z) - kQ >= 0) Z ^= 1335 << (RJ.getBCHDigit(Z) - kQ);
    return ((Q << 10) | Z) ^ 21522;
  };
});
var BQ = y((fz, gQ) => {
  var x9 = l0();
  function g$($) {
    ((this.mode = x9.NUMERIC), (this.data = $.toString()));
  }
  g$.getBitsLength = function (J) {
    return 10 * Math.floor(J / 3) + (J % 3 ? (J % 3) * 3 + 1 : 0);
  };
  g$.prototype.getLength = function () {
    return this.data.length;
  };
  g$.prototype.getBitsLength = function () {
    return g$.getBitsLength(this.data.length);
  };
  g$.prototype.write = function (J) {
    let q, Q, Z;
    for (q = 0; q + 3 <= this.data.length; q += 3)
      ((Q = this.data.substr(q, 3)), (Z = parseInt(Q, 10)), J.put(Z, 10));
    let Y = this.data.length - q;
    if (Y > 0) ((Q = this.data.substr(q)), (Z = parseInt(Q, 10)), J.put(Z, Y * 3 + 1));
  };
  gQ.exports = g$;
});
var LQ = y((xz, CQ) => {
  var v9 = l0(),
    VJ = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":",
    ];
  function B$($) {
    ((this.mode = v9.ALPHANUMERIC), (this.data = $));
  }
  B$.getBitsLength = function (J) {
    return 11 * Math.floor(J / 2) + 6 * (J % 2);
  };
  B$.prototype.getLength = function () {
    return this.data.length;
  };
  B$.prototype.getBitsLength = function () {
    return B$.getBitsLength(this.data.length);
  };
  B$.prototype.write = function (J) {
    let q;
    for (q = 0; q + 2 <= this.data.length; q += 2) {
      let Q = VJ.indexOf(this.data[q]) * 45;
      ((Q += VJ.indexOf(this.data[q + 1])), J.put(Q, 11));
    }
    if (this.data.length % 2) J.put(VJ.indexOf(this.data[q]), 6);
  };
  CQ.exports = B$;
});
var fQ = y((vz, SQ) => {
  var A9 = l0();
  function C$($) {
    if (((this.mode = A9.BYTE), typeof $ === "string")) this.data = new TextEncoder().encode($);
    else this.data = new Uint8Array($);
  }
  C$.getBitsLength = function (J) {
    return J * 8;
  };
  C$.prototype.getLength = function () {
    return this.data.length;
  };
  C$.prototype.getBitsLength = function () {
    return C$.getBitsLength(this.data.length);
  };
  C$.prototype.write = function ($) {
    for (let J = 0, q = this.data.length; J < q; J++) $.put(this.data[J], 8);
  };
  SQ.exports = C$;
});
var vQ = y((Az, xQ) => {
  var _9 = l0(),
    y9 = h0();
  function L$($) {
    ((this.mode = _9.KANJI), (this.data = $));
  }
  L$.getBitsLength = function (J) {
    return J * 13;
  };
  L$.prototype.getLength = function () {
    return this.data.length;
  };
  L$.prototype.getBitsLength = function () {
    return L$.getBitsLength(this.data.length);
  };
  L$.prototype.write = function ($) {
    let J;
    for (J = 0; J < this.data.length; J++) {
      let q = y9.toSJIS(this.data[J]);
      if (q >= 33088 && q <= 40956) q -= 33088;
      else if (q >= 57408 && q <= 60351) q -= 49472;
      else
        throw Error(
          "Invalid SJIS character: " +
            this.data[J] +
            `
Make sure your charset is UTF-8`,
        );
      ((q = ((q >>> 8) & 255) * 192 + (q & 255)), $.put(q, 13));
    }
  };
  xQ.exports = L$;
});
var AQ = y((_z, jJ) => {
  var n$ = {
    single_source_shortest_paths: function ($, J, q) {
      var Q = {},
        Z = {};
      Z[J] = 0;
      var Y = n$.PriorityQueue.make();
      Y.push(J, 0);
      var X, U, z, G, W, K, O, R, D;
      while (!Y.empty()) {
        ((X = Y.pop()), (U = X.value), (G = X.cost), (W = $[U] || {}));
        for (z in W)
          if (W.hasOwnProperty(z)) {
            if (((K = W[z]), (O = G + K), (R = Z[z]), (D = typeof Z[z] > "u"), D || R > O))
              ((Z[z] = O), Y.push(z, O), (Q[z] = U));
          }
      }
      if (typeof q < "u" && typeof Z[q] > "u") {
        var M = ["Could not find a path from ", J, " to ", q, "."].join("");
        throw Error(M);
      }
      return Q;
    },
    extract_shortest_path_from_predecessor_list: function ($, J) {
      var q = [],
        Q = J,
        Z;
      while (Q) (q.push(Q), (Z = $[Q]), (Q = $[Q]));
      return (q.reverse(), q);
    },
    find_path: function ($, J, q) {
      var Q = n$.single_source_shortest_paths($, J, q);
      return n$.extract_shortest_path_from_predecessor_list(Q, q);
    },
    PriorityQueue: {
      make: function ($) {
        var J = n$.PriorityQueue,
          q = {},
          Q;
        $ = $ || {};
        for (Q in J) if (J.hasOwnProperty(Q)) q[Q] = J[Q];
        return ((q.queue = []), (q.sorter = $.sorter || J.default_sorter), q);
      },
      default_sorter: function ($, J) {
        return $.cost - J.cost;
      },
      push: function ($, J) {
        var q = { value: $, cost: J };
        (this.queue.push(q), this.queue.sort(this.sorter));
      },
      pop: function () {
        return this.queue.shift();
      },
      empty: function () {
        return this.queue.length === 0;
      },
    },
  };
  if (typeof jJ < "u") jJ.exports = n$;
});
var hQ = y((p9) => {
  var v = l0(),
    uQ = BQ(),
    mQ = LQ(),
    bQ = fQ(),
    cQ = vQ(),
    i$ = zJ(),
    w8 = h0(),
    u9 = AQ();
  function _Q($) {
    return unescape(encodeURIComponent($)).length;
  }
  function r$($, J, q) {
    let Q = [],
      Z;
    while ((Z = $.exec(q)) !== null)
      Q.push({ data: Z[0], index: Z.index, mode: J, length: Z[0].length });
    return Q;
  }
  function pQ($) {
    let J = r$(i$.NUMERIC, v.NUMERIC, $),
      q = r$(i$.ALPHANUMERIC, v.ALPHANUMERIC, $),
      Q,
      Z;
    if (w8.isKanjiModeEnabled()) ((Q = r$(i$.BYTE, v.BYTE, $)), (Z = r$(i$.KANJI, v.KANJI, $)));
    else ((Q = r$(i$.BYTE_KANJI, v.BYTE, $)), (Z = []));
    return J.concat(q, Q, Z)
      .sort(function (X, U) {
        return X.index - U.index;
      })
      .map(function (X) {
        return { data: X.data, mode: X.mode, length: X.length };
      });
  }
  function MJ($, J) {
    switch (J) {
      case v.NUMERIC:
        return uQ.getBitsLength($);
      case v.ALPHANUMERIC:
        return mQ.getBitsLength($);
      case v.KANJI:
        return cQ.getBitsLength($);
      case v.BYTE:
        return bQ.getBitsLength($);
    }
  }
  function m9($) {
    return $.reduce(function (J, q) {
      let Q = J.length - 1 >= 0 ? J[J.length - 1] : null;
      if (Q && Q.mode === q.mode) return ((J[J.length - 1].data += q.data), J);
      return (J.push(q), J);
    }, []);
  }
  function b9($) {
    let J = [];
    for (let q = 0; q < $.length; q++) {
      let Q = $[q];
      switch (Q.mode) {
        case v.NUMERIC:
          J.push([
            Q,
            { data: Q.data, mode: v.ALPHANUMERIC, length: Q.length },
            { data: Q.data, mode: v.BYTE, length: Q.length },
          ]);
          break;
        case v.ALPHANUMERIC:
          J.push([Q, { data: Q.data, mode: v.BYTE, length: Q.length }]);
          break;
        case v.KANJI:
          J.push([Q, { data: Q.data, mode: v.BYTE, length: _Q(Q.data) }]);
          break;
        case v.BYTE:
          J.push([{ data: Q.data, mode: v.BYTE, length: _Q(Q.data) }]);
      }
    }
    return J;
  }
  function c9($, J) {
    let q = {},
      Q = { start: {} },
      Z = ["start"];
    for (let Y = 0; Y < $.length; Y++) {
      let X = $[Y],
        U = [];
      for (let z = 0; z < X.length; z++) {
        let G = X[z],
          W = "" + Y + z;
        (U.push(W), (q[W] = { node: G, lastCount: 0 }), (Q[W] = {}));
        for (let K = 0; K < Z.length; K++) {
          let O = Z[K];
          if (q[O] && q[O].node.mode === G.mode)
            ((Q[O][W] = MJ(q[O].lastCount + G.length, G.mode) - MJ(q[O].lastCount, G.mode)),
              (q[O].lastCount += G.length));
          else {
            if (q[O]) q[O].lastCount = G.length;
            Q[O][W] = MJ(G.length, G.mode) + 4 + v.getCharCountIndicator(G.mode, J);
          }
        }
      }
      Z = U;
    }
    for (let Y = 0; Y < Z.length; Y++) Q[Z[Y]].end = 0;
    return { map: Q, table: q };
  }
  function yQ($, J) {
    let q,
      Q = v.getBestModeForData($);
    if (((q = v.from(J, Q)), q !== v.BYTE && q.bit < Q.bit))
      throw Error(
        '"' +
          $ +
          '" cannot be encoded with mode ' +
          v.toString(q) +
          `.
 Suggested mode is: ` +
          v.toString(Q),
      );
    if (q === v.KANJI && !w8.isKanjiModeEnabled()) q = v.BYTE;
    switch (q) {
      case v.NUMERIC:
        return new uQ($);
      case v.ALPHANUMERIC:
        return new mQ($);
      case v.KANJI:
        return new cQ($);
      case v.BYTE:
        return new bQ($);
    }
  }
  p9.fromArray = function (J) {
    return J.reduce(function (q, Q) {
      if (typeof Q === "string") q.push(yQ(Q, null));
      else if (Q.data) q.push(yQ(Q.data, Q.mode));
      return q;
    }, []);
  };
  p9.fromString = function (J, q) {
    let Q = pQ(J, w8.isKanjiModeEnabled()),
      Z = b9(Q),
      Y = c9(Z, q),
      X = u9.find_path(Y.map, "start", "end"),
      U = [];
    for (let z = 1; z < X.length - 1; z++) U.push(Y.table[X[z]].node);
    return p9.fromArray(m9(U));
  };
  p9.rawSplit = function (J) {
    return p9.fromArray(pQ(J, w8.isKanjiModeEnabled()));
  };
});
var dQ = y((XX) => {
  var P8 = h0(),
    wJ = R8(),
    l9 = JQ(),
    n9 = QQ(),
    i9 = YQ(),
    r9 = XQ(),
    TJ = OQ(),
    EJ = ZJ(),
    o9 = MQ(),
    I8 = EQ(),
    a9 = HQ(),
    t9 = l0(),
    IJ = hQ();
  function s9($, J) {
    let q = $.size,
      Q = r9.getPositions(J);
    for (let Z = 0; Z < Q.length; Z++) {
      let Y = Q[Z][0],
        X = Q[Z][1];
      for (let U = -1; U <= 7; U++) {
        if (Y + U <= -1 || q <= Y + U) continue;
        for (let z = -1; z <= 7; z++) {
          if (X + z <= -1 || q <= X + z) continue;
          if (
            (U >= 0 && U <= 6 && (z === 0 || z === 6)) ||
            (z >= 0 && z <= 6 && (U === 0 || U === 6)) ||
            (U >= 2 && U <= 4 && z >= 2 && z <= 4)
          )
            $.set(Y + U, X + z, !0, !0);
          else $.set(Y + U, X + z, !1, !0);
        }
      }
    }
  }
  function e9($) {
    let J = $.size;
    for (let q = 8; q < J - 8; q++) {
      let Q = q % 2 === 0;
      ($.set(q, 6, Q, !0), $.set(6, q, Q, !0));
    }
  }
  function $X($, J) {
    let q = i9.getPositions(J);
    for (let Q = 0; Q < q.length; Q++) {
      let Z = q[Q][0],
        Y = q[Q][1];
      for (let X = -2; X <= 2; X++)
        for (let U = -2; U <= 2; U++)
          if (X === -2 || X === 2 || U === -2 || U === 2 || (X === 0 && U === 0))
            $.set(Z + X, Y + U, !0, !0);
          else $.set(Z + X, Y + U, !1, !0);
    }
  }
  function JX($, J) {
    let q = $.size,
      Q = I8.getEncodedBits(J),
      Z,
      Y,
      X;
    for (let U = 0; U < 18; U++)
      ((Z = Math.floor(U / 3)),
        (Y = (U % 3) + q - 8 - 3),
        (X = ((Q >> U) & 1) === 1),
        $.set(Z, Y, X, !0),
        $.set(Y, Z, X, !0));
  }
  function PJ($, J, q) {
    let Q = $.size,
      Z = a9.getEncodedBits(J, q),
      Y,
      X;
    for (Y = 0; Y < 15; Y++) {
      if (((X = ((Z >> Y) & 1) === 1), Y < 6)) $.set(Y, 8, X, !0);
      else if (Y < 8) $.set(Y + 1, 8, X, !0);
      else $.set(Q - 15 + Y, 8, X, !0);
      if (Y < 8) $.set(8, Q - Y - 1, X, !0);
      else if (Y < 9) $.set(8, 15 - Y - 1 + 1, X, !0);
      else $.set(8, 15 - Y - 1, X, !0);
    }
    $.set(Q - 8, 8, 1, !0);
  }
  function qX($, J) {
    let q = $.size,
      Q = -1,
      Z = q - 1,
      Y = 7,
      X = 0;
    for (let U = q - 1; U > 0; U -= 2) {
      if (U === 6) U--;
      while (!0) {
        for (let z = 0; z < 2; z++)
          if (!$.isReserved(Z, U - z)) {
            let G = !1;
            if (X < J.length) G = ((J[X] >>> Y) & 1) === 1;
            if (($.set(Z, U - z, G), Y--, Y === -1)) (X++, (Y = 7));
          }
        if (((Z += Q), Z < 0 || q <= Z)) {
          ((Z -= Q), (Q = -Q));
          break;
        }
      }
    }
  }
  function QX($, J, q) {
    let Q = new l9();
    q.forEach(function (z) {
      (Q.put(z.mode.bit, 4), Q.put(z.getLength(), t9.getCharCountIndicator(z.mode, $)), z.write(Q));
    });
    let Z = P8.getSymbolTotalCodewords($),
      Y = EJ.getTotalCodewordsCount($, J),
      X = (Z - Y) * 8;
    if (Q.getLengthInBits() + 4 <= X) Q.put(0, 4);
    while (Q.getLengthInBits() % 8 !== 0) Q.putBit(0);
    let U = (X - Q.getLengthInBits()) / 8;
    for (let z = 0; z < U; z++) Q.put(z % 2 ? 17 : 236, 8);
    return ZX(Q, $, J);
  }
  function ZX($, J, q) {
    let Q = P8.getSymbolTotalCodewords(J),
      Z = EJ.getTotalCodewordsCount(J, q),
      Y = Q - Z,
      X = EJ.getBlocksCount(J, q),
      U = Q % X,
      z = X - U,
      G = Math.floor(Q / X),
      W = Math.floor(Y / X),
      K = W + 1,
      O = G - W,
      R = new o9(O),
      D = 0,
      M = Array(X),
      H = Array(X),
      C = 0,
      V = new Uint8Array($.buffer);
    for (let L = 0; L < X; L++) {
      let S = L < z ? W : K;
      ((M[L] = V.slice(D, D + S)), (H[L] = R.encode(M[L])), (D += S), (C = Math.max(C, S)));
    }
    let N = new Uint8Array(Q),
      F = 0,
      E,
      x;
    for (E = 0; E < C; E++) for (x = 0; x < X; x++) if (E < M[x].length) N[F++] = M[x][E];
    for (E = 0; E < O; E++) for (x = 0; x < X; x++) N[F++] = H[x][E];
    return N;
  }
  function YX($, J, q, Q) {
    let Z;
    if (Array.isArray($)) Z = IJ.fromArray($);
    else if (typeof $ === "string") {
      let G = J;
      if (!G) {
        let W = IJ.rawSplit($);
        G = I8.getBestVersionForData(W, q);
      }
      Z = IJ.fromString($, G || 40);
    } else throw Error("Invalid data");
    let Y = I8.getBestVersionForData(Z, q);
    if (!Y) throw Error("The amount of data is too big to be stored in a QR Code");
    if (!J) J = Y;
    else if (J < Y)
      throw Error(
        `
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` +
          Y +
          `.
`,
      );
    let X = QX(J, q, Z),
      U = P8.getSymbolSize(J),
      z = new n9(U);
    if ((s9(z, J), e9(z), $X(z, J), PJ(z, q, 0), J >= 7)) JX(z, J);
    if ((qX(z, X), isNaN(Q))) Q = TJ.getBestMask(z, PJ.bind(null, z, q));
    return (
      TJ.applyMask(Q, z),
      PJ(z, q, Q),
      { modules: z, version: J, errorCorrectionLevel: q, maskPattern: Q, segments: Z }
    );
  }
  XX.create = function (J, q) {
    if (typeof J > "u" || J === "") throw Error("No input text");
    let Q = wJ.M,
      Z,
      Y;
    if (typeof q < "u") {
      if (
        ((Q = wJ.from(q.errorCorrectionLevel, wJ.M)),
        (Z = I8.from(q.version)),
        (Y = TJ.from(q.maskPattern)),
        q.toSJISFunc)
      )
        P8.setToSJISFunction(q.toSJISFunc);
    }
    return YX(J, Z, Q, Y);
  };
});
var HJ = y((zX) => {
  function lQ($) {
    if (typeof $ === "number") $ = $.toString();
    if (typeof $ !== "string") throw Error("Color should be defined as hex string");
    let J = $.slice().replace("#", "").split("");
    if (J.length < 3 || J.length === 5 || J.length > 8) throw Error("Invalid hex color: " + $);
    if (J.length === 3 || J.length === 4)
      J = Array.prototype.concat.apply(
        [],
        J.map(function (Q) {
          return [Q, Q];
        }),
      );
    if (J.length === 6) J.push("F", "F");
    let q = parseInt(J.join(""), 16);
    return {
      r: (q >> 24) & 255,
      g: (q >> 16) & 255,
      b: (q >> 8) & 255,
      a: q & 255,
      hex: "#" + J.slice(0, 6).join(""),
    };
  }
  zX.getOptions = function (J) {
    if (!J) J = {};
    if (!J.color) J.color = {};
    let q = typeof J.margin > "u" || J.margin === null || J.margin < 0 ? 4 : J.margin,
      Q = J.width && J.width >= 21 ? J.width : void 0,
      Z = J.scale || 4;
    return {
      width: Q,
      scale: Q ? 4 : Z,
      margin: q,
      color: { dark: lQ(J.color.dark || "#000000ff"), light: lQ(J.color.light || "#ffffffff") },
      type: J.type,
      rendererOpts: J.rendererOpts || {},
    };
  };
  zX.getScale = function (J, q) {
    return q.width && q.width >= J + q.margin * 2 ? q.width / (J + q.margin * 2) : q.scale;
  };
  zX.getImageWidth = function (J, q) {
    let Q = zX.getScale(J, q);
    return Math.floor((J + q.margin * 2) * Q);
  };
  zX.qrToImageData = function (J, q, Q) {
    let Z = q.modules.size,
      Y = q.modules.data,
      X = zX.getScale(Z, Q),
      U = Math.floor((Z + Q.margin * 2) * X),
      z = Q.margin * X,
      G = [Q.color.light, Q.color.dark];
    for (let W = 0; W < U; W++)
      for (let K = 0; K < U; K++) {
        let O = (W * U + K) * 4,
          R = Q.color.light;
        if (W >= z && K >= z && W < U - z && K < U - z) {
          let D = Math.floor((W - z) / X),
            M = Math.floor((K - z) / X);
          R = G[Y[D * Z + M] ? 1 : 0];
        }
        ((J[O++] = R.r), (J[O++] = R.g), (J[O++] = R.b), (J[O] = R.a));
      }
  };
});
var iQ = y((NX) => {
  var gJ = HJ();
  function OX($, J, q) {
    if (($.clearRect(0, 0, J.width, J.height), !J.style)) J.style = {};
    ((J.height = q), (J.width = q), (J.style.height = q + "px"), (J.style.width = q + "px"));
  }
  function DX() {
    try {
      return document.createElement("canvas");
    } catch ($) {
      throw Error("You need to specify a canvas element");
    }
  }
  NX.render = function (J, q, Q) {
    let Z = Q,
      Y = q;
    if (typeof Z > "u" && (!q || !q.getContext)) ((Z = q), (q = void 0));
    if (!q) Y = DX();
    Z = gJ.getOptions(Z);
    let X = gJ.getImageWidth(J.modules.size, Z),
      U = Y.getContext("2d"),
      z = U.createImageData(X, X);
    return (gJ.qrToImageData(z.data, J, Z), OX(U, Y, X), U.putImageData(z, 0, 0), Y);
  };
  NX.renderToDataURL = function (J, q, Q) {
    let Z = Q;
    if (typeof Z > "u" && (!q || !q.getContext)) ((Z = q), (q = void 0));
    if (!Z) Z = {};
    let Y = NX.render(J, q, Z),
      X = Z.type || "image/png",
      U = Z.rendererOpts || {};
    return Y.toDataURL(X, U.quality);
  };
});
var oQ = y((MX) => {
  var VX = HJ();
  function rQ($, J) {
    let q = $.a / 255,
      Q = J + '="' + $.hex + '"';
    return q < 1 ? Q + " " + J + '-opacity="' + q.toFixed(2).slice(1) + '"' : Q;
  }
  function BJ($, J, q) {
    let Q = $ + J;
    if (typeof q < "u") Q += " " + q;
    return Q;
  }
  function jX($, J, q) {
    let Q = "",
      Z = 0,
      Y = !1,
      X = 0;
    for (let U = 0; U < $.length; U++) {
      let z = Math.floor(U % J),
        G = Math.floor(U / J);
      if (!z && !Y) Y = !0;
      if ($[U]) {
        if ((X++, !(U > 0 && z > 0 && $[U - 1])))
          ((Q += Y ? BJ("M", z + q, 0.5 + G + q) : BJ("m", Z, 0)), (Z = 0), (Y = !1));
        if (!(z + 1 < J && $[U + 1])) ((Q += BJ("h", X)), (X = 0));
      } else Z++;
    }
    return Q;
  }
  MX.render = function (J, q, Q) {
    let Z = VX.getOptions(q),
      Y = J.modules.size,
      X = J.modules.data,
      U = Y + Z.margin * 2,
      z = !Z.color.light.a
        ? ""
        : "<path " + rQ(Z.color.light, "fill") + ' d="M0 0h' + U + "v" + U + 'H0z"/>',
      G = "<path " + rQ(Z.color.dark, "stroke") + ' d="' + jX(X, Y, Z.margin) + '"/>',
      W = 'viewBox="0 0 ' + U + " " + U + '"',
      O =
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        (!Z.width ? "" : 'width="' + Z.width + '" height="' + Z.width + '" ') +
        W +
        ' shape-rendering="crispEdges">' +
        z +
        G +
        `</svg>
`;
    if (typeof Q === "function") Q(null, O);
    return O;
  };
});
var tQ = y((PX) => {
  var wX = iq(),
    CJ = dQ(),
    aQ = iQ(),
    IX = oQ();
  function LJ($, J, q, Q, Z) {
    let Y = [].slice.call(arguments, 1),
      X = Y.length,
      U = typeof Y[X - 1] === "function";
    if (!U && !wX()) throw Error("Callback required as last argument");
    if (U) {
      if (X < 2) throw Error("Too few arguments provided");
      if (X === 2) ((Z = q), (q = J), (J = Q = void 0));
      else if (X === 3)
        if (J.getContext && typeof Z > "u") ((Z = Q), (Q = void 0));
        else ((Z = Q), (Q = q), (q = J), (J = void 0));
    } else {
      if (X < 1) throw Error("Too few arguments provided");
      if (X === 1) ((q = J), (J = Q = void 0));
      else if (X === 2 && !J.getContext) ((Q = q), (q = J), (J = void 0));
      return new Promise(function (z, G) {
        try {
          let W = CJ.create(q, Q);
          z($(W, J, Q));
        } catch (W) {
          G(W);
        }
      });
    }
    try {
      let z = CJ.create(q, Q);
      Z(null, $(z, J, Q));
    } catch (z) {
      Z(z);
    }
  }
  PX.create = CJ.create;
  PX.toCanvas = LJ.bind(null, aQ.render);
  PX.toDataURL = LJ.bind(null, aQ.renderToDataURL);
  PX.toString = LJ.bind(null, function ($, J, q) {
    return IX.render($, q);
  });
});
var q1 = P1(tQ(), 1);
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */ var YZ = Object.freeze({
    p: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,
    n: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
    h: 8n,
    a: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,
    d: 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,
    Gx: 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
    Gy: 0x6666666666666666666666666666666666666666666666666666666666666658n,
  }),
  { p: E8, n: T8, Gx: sQ, Gy: eQ, a: SJ, d: fJ, h: gX } = YZ;
var BX = (...$) => {
    if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function")
      Error.captureStackTrace(...$);
  },
  s = ($ = "") => {
    let J = Error($);
    throw (BX(J, s), J);
  },
  CX = ($) => typeof $ === "bigint",
  LX = ($) => typeof $ === "string",
  SX = ($) =>
    $ instanceof Uint8Array ||
    (ArrayBuffer.isView($) &&
      $.constructor.name === "Uint8Array" &&
      "BYTES_PER_ELEMENT" in $ &&
      $.BYTES_PER_ELEMENT === 1),
  i0 = ($, J, q = "") => {
    let Q = SX($),
      Z = $?.length,
      Y = J !== void 0;
    if (!Q || (Y && Z !== J)) {
      let X = q && `"${q}" `,
        U = Y ? ` of length ${J}` : "",
        z = Q ? `length=${Z}` : `type=${typeof $}`,
        G = X + "expected Uint8Array" + U + ", got " + z;
      throw Q ? RangeError(G) : TypeError(G);
    }
    return $;
  },
  yJ = ($) => new Uint8Array($),
  uJ = ($) => Uint8Array.from($),
  XZ = ($, J) => $.toString(16).padStart(J, "0"),
  UZ = ($) =>
    Array.from(i0($))
      .map((J) => XZ(J, 2))
      .join(""),
  _0 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 },
  $Z = ($) => {
    if ($ >= _0._0 && $ <= _0._9) return $ - _0._0;
    if ($ >= _0.A && $ <= _0.F) return $ - (_0.A - 10);
    if ($ >= _0.a && $ <= _0.f) return $ - (_0.a - 10);
    return;
  },
  zZ = ($) => {
    if (!LX($)) return s("hex invalid");
    let q = $.length,
      Q = q / 2;
    if (q % 2) return s("hex invalid");
    let Z = yJ(Q);
    for (let Y = 0, X = 0; Y < Q; Y++, X += 2) {
      let U = $Z($.charCodeAt(X)),
        z = $Z($.charCodeAt(X + 1));
      if (U === void 0 || z === void 0) return s("hex invalid");
      Z[Y] = U * 16 + z;
    }
    return Z;
  },
  fX = () => globalThis?.crypto,
  xX = () => fX()?.subtle ?? s("crypto.subtle must be defined, consider polyfill"),
  k8 = (...$) => {
    let J = 0;
    for (let Z of $) J += i0(Z).length;
    let q = yJ(J),
      Q = 0;
    return (
      $.forEach((Z) => {
        (q.set(Z, Q), (Q += Z.length));
      }),
      q
    );
  };
var H8 = BigInt,
  N$ = ($, J, q, Q = "bad number: out of range") => {
    if (!CX($)) throw TypeError(Q);
    if (J <= $ && $ < q) return $;
    throw RangeError(Q);
  },
  l = ($, J = E8) => {
    let q = $ % J;
    return q >= 0n ? q : J + q;
  },
  JZ = (1n << 255n) - 1n,
  w = ($) => {
    if ($ < 0n) s("negative coordinate");
    let J = ($ >> 255n) * 19n + ($ & JZ);
    return ((J = (J >> 255n) * 19n + (J & JZ)), J % E8);
  },
  WZ = ($) => l($, T8),
  vX = ($, J) => {
    if ($ === 0n || J <= 0n) s("no inverse n=" + $ + " mod=" + J);
    let q = l($, J),
      Q = J,
      Z = 0n,
      Y = 1n,
      X = 1n,
      U = 0n;
    while (q !== 0n) {
      let z = Q / q,
        G = Q % q,
        W = Z - X * z,
        K = Y - U * z;
      ((Q = q), (q = G), (Z = X), (Y = U), (X = W), (U = K));
    }
    return Q === 1n ? l(Z, J) : s("no inverse");
  },
  AX = ($) => {
    let J = cJ[$];
    if (typeof J !== "function") s("hashes." + $ + " not set");
    return J;
  },
  _X = ($) => i0($, 64, "digest");
var xJ = ($) => ($ instanceof M0 ? $ : s("Point expected")),
  vJ = 2n ** 256n;
class M0 {
  static BASE;
  static ZERO;
  X;
  Y;
  Z;
  T;
  constructor($, J, q, Q) {
    let Z = vJ;
    ((this.X = N$($, 0n, Z)),
      (this.Y = N$(J, 0n, Z)),
      (this.Z = N$(q, 1n, Z)),
      (this.T = N$(Q, 0n, Z)),
      Object.freeze(this));
  }
  static CURVE() {
    return YZ;
  }
  static fromAffine($) {
    return new M0($.x, $.y, 1n, w($.x * $.y));
  }
  static fromBytes($, J = !1) {
    let q = fJ,
      Q = uJ(i0($, 32)),
      Z = $[31];
    Q[31] = Z & -129;
    let Y = KZ(Q);
    N$(Y, 0n, J ? vJ : E8);
    let U = w(Y * Y),
      z = l(U - 1n),
      G = w(q * U + 1n),
      { isValid: W, value: K } = uX(z, G);
    if (!W) s("bad point: y not sqrt");
    let O = (K & 1n) === 1n,
      R = (Z & 128) !== 0;
    if (!J && K === 0n && R) s("bad point: x==0, isLastByteOdd");
    if (R !== O) K = l(-K);
    return new M0(K, Y, 1n, w(K * Y));
  }
  static fromHex($, J) {
    return M0.fromBytes(zZ($), J);
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  assertValidity() {
    let $ = SJ,
      J = fJ,
      q = this;
    if (q.is0()) return s("bad point: ZERO");
    let { X: Q, Y: Z, Z: Y, T: X } = q,
      U = w(Q * Q),
      z = w(Z * Z),
      G = w(Y * Y),
      W = w(G * G),
      K = w(U * $),
      O = w(G * (K + z)),
      R = l(W + w(J * w(U * z)));
    if (O !== R) return s("bad point: equation left != right (1)");
    let D = w(Q * Z),
      M = w(Y * X);
    if (D !== M) return s("bad point: equation left != right (2)");
    return this;
  }
  equals($) {
    let { X: J, Y: q, Z: Q } = this,
      { X: Z, Y, Z: X } = xJ($),
      U = w(J * X),
      z = w(Z * Q),
      G = w(q * X),
      W = w(Y * Q);
    return U === z && G === W;
  }
  is0() {
    return this.equals(R$);
  }
  negate() {
    return new M0(l(-this.X), this.Y, this.Z, l(-this.T));
  }
  double() {
    let { X: $, Y: J, Z: q } = this,
      Q = SJ,
      Z = w($ * $),
      Y = w(J * J),
      X = w(2n * q * q),
      U = w(Q * Z),
      z = l($ + J),
      G = l(w(z * z) - Z - Y),
      W = l(U + Y),
      K = l(W - X),
      O = l(U - Y),
      R = w(G * K),
      D = w(W * O),
      M = w(G * O),
      H = w(K * W);
    return new M0(R, D, H, M);
  }
  add($) {
    let { X: J, Y: q, Z: Q, T: Z } = this,
      { X: Y, Y: X, Z: U, T: z } = xJ($),
      G = SJ,
      W = fJ,
      K = w(J * Y),
      O = w(q * X),
      R = w(w(Z * W) * z),
      D = w(Q * U),
      M = l(w(l(J + q) * l(Y + X)) - K - O),
      H = l(D - R),
      C = l(D + R),
      V = l(O - w(G * K)),
      N = w(M * H),
      F = w(C * V),
      E = w(M * V),
      x = w(H * C);
    return new M0(N, F, x, E);
  }
  subtract($) {
    return this.add(xJ($).negate());
  }
  multiply($, J = !0) {
    if (!J && $ === 0n) return R$;
    if ((N$($, 1n, T8), !J && this.is0())) return R$;
    if ($ === 1n) return this;
    if (this.equals(V$)) return dX($).p;
    let q = R$,
      Q = V$;
    for (let Z = this; $ > 0n; Z = Z.double(), $ >>= 1n)
      if ($ & 1n) q = q.add(Z);
      else if (J) Q = Q.add(Z);
    return q;
  }
  multiplyUnsafe($) {
    return this.multiply($, !1);
  }
  toAffine() {
    let { X: $, Y: J, Z: q } = this;
    if (this.equals(R$)) return { x: 0n, y: 1n };
    let Q = vX(q, E8);
    if (w(q * Q) !== 1n) s("invalid inverse");
    let Z = w($ * Q),
      Y = w(J * Q);
    return { x: Z, y: Y };
  }
  toBytes() {
    let { x: $, y: J } = this.toAffine(),
      q = GZ(J);
    return ((q[31] |= $ & 1n ? 128 : 0), q);
  }
  toHex() {
    return UZ(this.toBytes());
  }
  clearCofactor() {
    return this.multiply(H8(gX), !1);
  }
  isSmallOrder() {
    return this.clearCofactor().is0();
  }
  isTorsionFree() {
    let $ = this.multiply(T8 / 2n, !1).double();
    if (T8 % 2n) $ = $.add(this);
    return $.is0();
  }
}
var V$ = new M0(sQ, eQ, 1n, l(sQ * eQ)),
  R$ = new M0(0n, 1n, 1n, 0n);
M0.BASE = V$;
M0.ZERO = R$;
var GZ = ($) => zZ(XZ(N$($, 0n, vJ), 64)).reverse(),
  KZ = ($) => H8("0x" + UZ(uJ(i0($)).reverse())),
  f0 = ($, J) => {
    let q = $;
    while (J-- > 0n) q = w(q * q);
    return q;
  },
  yX = ($) => {
    let J = w($ * $),
      q = w(J * $),
      Q = w(f0(q, 2n) * q),
      Z = w(f0(Q, 1n) * $),
      Y = w(f0(Z, 5n) * Z),
      X = w(f0(Y, 10n) * Y),
      U = w(f0(X, 20n) * X),
      z = w(f0(U, 40n) * U),
      G = w(f0(z, 80n) * z),
      W = w(f0(G, 80n) * z),
      K = w(f0(W, 10n) * Y);
    return { pow_p_5_8: w(f0(K, 2n) * $), b2: q };
  },
  qZ = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,
  uX = ($, J) => {
    let q = w(J * w(J * J)),
      Q = w(w(q * q) * J),
      Z = yX(w($ * Q)).pow_p_5_8,
      Y = w($ * w(q * Z)),
      X = w(J * w(Y * Y)),
      U = Y,
      z = w(Y * qZ),
      G = X === $,
      W = X === l(-$),
      K = X === l(-$ * qZ);
    if (G) Y = U;
    if (W || K) Y = z;
    if ((l(Y) & 1n) === 1n) Y = l(-Y);
    return { isValid: G || W, value: Y };
  },
  AJ = ($) => WZ(KZ($));
var mJ = (...$) => _X(AX("sha512")(k8(...$))),
  mX = ($) => {
    let J = uJ($),
      q = J.slice(0, 32);
    ((q[0] &= 248), (q[31] &= 127), (q[31] |= 64));
    let Q = J.slice(32, 64),
      Z = AJ(q),
      Y = V$.multiply(Z),
      X = Y.toBytes();
    return { head: q, prefix: Q, scalar: Z, point: Y, pointBytes: X };
  };
var OZ = ($) => mX(mJ(i0($, 32)));
var DZ = ($) => OZ($).pointBytes;
var bX = ($) => $.finish(mJ($.hashable)),
  cX = ($, J, q) => {
    let { pointBytes: Q, scalar: Z } = $,
      Y = AJ(J),
      X = V$.multiply(Y).toBytes();
    return {
      hashable: k8(X, Q, q),
      finish: (G) => {
        let W = WZ(Y + AJ(G) * Z);
        return i0(k8(X, GZ(W)), 64);
      },
    };
  };
var bJ = ($, J) => {
  let q = i0($),
    Q = OZ(J),
    Z = mJ(Q.prefix, q);
  return bX(cX(Q, Z, q));
};
var cJ = {
  sha512Async: async ($) => {
    let J = xX(),
      q = k8($);
    return yJ(await J.digest("SHA-512", q.buffer));
  },
  sha512: void 0,
};
var g8 = 8,
  pX = 256,
  NZ = Math.ceil(pX / g8) + 1,
  _J = 2 ** (g8 - 1),
  hX = () => {
    let $ = [],
      J = V$,
      q = J;
    for (let Q = 0; Q < NZ; Q++) {
      ((q = J), $.push(q));
      for (let Z = 1; Z < _J; Z++) ((q = q.add(J)), $.push(q));
      J = q.double();
    }
    return $;
  },
  QZ = void 0,
  ZZ = ($, J) => {
    let q = J.negate();
    return $ ? q : J;
  },
  dX = ($) => {
    let J = QZ || (QZ = hX()),
      q = R$,
      Q = V$,
      Z = 2 ** g8,
      Y = Z,
      X = H8(Z - 1),
      U = H8(g8);
    for (let z = 0; z < NZ; z++) {
      let G = Number($ & X);
      if ((($ >>= U), G > _J)) ((G -= Y), ($ += 1n));
      let W = z * _J,
        K = W,
        O = W + Math.abs(G) - 1,
        R = z % 2 !== 0,
        D = G < 0;
      if (G === 0) Q = Q.add(ZZ(R, J[K]));
      else q = q.add(ZZ(D, J[O]));
    }
    if ($ !== 0n) s("invalid wnaf");
    return { p: q, f: Q };
  };
function B8($) {
  return (
    $ instanceof Uint8Array ||
    (ArrayBuffer.isView($) &&
      $.constructor.name === "Uint8Array" &&
      "BYTES_PER_ELEMENT" in $ &&
      $.BYTES_PER_ELEMENT === 1)
  );
}
var C8 = ($) => ($ ? `"${$}" ` : "");
function U0($, J = "") {
  if (typeof $ !== "number") throw TypeError(C8(J) + "expected number, got " + typeof $);
  if (!Number.isSafeInteger($) || $ < 0)
    throw RangeError(C8(J) + "expected integer >= 0, got " + $);
  return $;
}
function jZ($, J = "") {
  if (typeof $ !== "boolean") throw TypeError(C8(J) + "expected boolean, got type=" + typeof $);
  return $;
}
function n($, J, q = "") {
  if (B8($) && (J === void 0 || $.length === J)) return $;
  if (J !== void 0) U0(J, "length");
  let Q = B8($),
    Z = J !== void 0 ? ` of length ${J}` : "",
    Y = Q ? `length=${$.length}` : `type=${typeof $}`,
    X = C8(q) + "expected Uint8Array" + Z + ", got " + Y;
  if (!Q) throw TypeError(X);
  throw RangeError(X);
}
function MZ($) {
  if (typeof $ !== "function" || typeof $.create !== "function")
    throw TypeError("expected hash wrapped by utils.createHasher");
  if ((U0($.outputLen), U0($.blockLen), $.outputLen < 1 || $.blockLen < 1))
    throw Error("hash blockLen / outputLen must be >= 1");
}
var RZ = ($, J) => {
  if ($ === null || typeof $ !== "object" || Array.isArray($))
    throw TypeError((J === "object" ? "" : `"${J}" `) + "expected object, got type=" + typeof $);
};
function S$($, J = !0) {
  if ($.destroyed) throw Error("hash was destroyed");
  if (J && $.finished) throw Error("digest() was already called");
}
function L8($, J) {
  n($, void 0, "output");
  let q = J.outputLen;
  if (!($.length >= q)) throw RangeError('"output" expected length >= ' + q);
}
function pJ($) {
  return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
}
function r0(...$) {
  for (let J = 0; J < $.length; J++) $[J].fill(0);
}
function S8($) {
  return new DataView($.buffer, $.byteOffset, $.byteLength);
}
function H0($, J) {
  return ($ << (32 - J)) | ($ >>> J);
}
var FZ = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function nX($) {
  return (
    (($ << 24) & 4278190080) | (($ << 8) & 16711680) | (($ >>> 8) & 65280) | (($ >>> 24) & 255)
  );
}
function iX($) {
  for (let J = 0; J < $.length; J++) $[J] = nX($[J]);
  return $;
}
var hJ = FZ ? ($) => $ : iX,
  wZ = (() =>
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")(),
  rX = Array.from({ length: 256 }, ($, J) => J.toString(16).padStart(2, "0"));
function z0($) {
  if ((n($), wZ)) return $.toHex();
  let J = "";
  for (let q = 0; q < $.length; q++) J += rX[$[q]];
  return J;
}
function VZ($) {
  return $ >= 48 && $ <= 57
    ? $ - 48
    : $ >= 65 && $ <= 70
      ? $ - 55
      : $ >= 97 && $ <= 102
        ? $ - 87
        : void 0;
}
function j$($) {
  if (typeof $ !== "string") throw TypeError("hex string expected, got " + typeof $);
  if (wZ)
    try {
      return Uint8Array.fromHex($);
    } catch (Z) {
      if (Z instanceof SyntaxError) throw RangeError(Z.message);
      throw Z;
    }
  let J = $.length,
    q = J / 2;
  if (J % 2) throw RangeError("hex string expected, got unpadded hex of length " + J);
  let Q = new Uint8Array(q);
  for (let Z = 0, Y = 0; Z < q; Z++, Y += 2) {
    let X = VZ($.charCodeAt(Y)),
      U = VZ($.charCodeAt(Y + 1));
    if (X === void 0 || U === void 0) {
      let z = $[Y] + $[Y + 1];
      throw RangeError('hex string expected, got non-hex character "' + z + '" at index ' + Y);
    }
    Q[Z] = X * 16 + U;
  }
  return Q;
}
function dJ(...$) {
  let J = 0;
  for (let Q = 0; Q < $.length; Q++) {
    let Z = $[Q];
    (n(Z), (J += Z.length));
  }
  let q = new Uint8Array(J);
  for (let Q = 0, Z = 0; Q < $.length; Q++) {
    let Y = $[Q];
    (q.set(Y, Z), (Z += Y.length));
  }
  return q;
}
function lJ($, J, q = "opts") {
  if ((RZ($, "defaults"), J !== void 0)) RZ(J, q);
  return Object.assign($, J);
}
function o$($, J = {}) {
  if (typeof $ !== "function")
    throw TypeError('"hashCons" expected function, got type=' + typeof $);
  J = lJ({}, J, "info");
  let q = (Z, Y) => $(Y).update(Z).digest(),
    Q = $(void 0);
  return (
    (q.outputLen = Q.outputLen),
    (q.blockLen = Q.blockLen),
    (q.canXOF = Q.canXOF),
    (q.create = (Z) => $(Z)),
    Object.assign(q, J),
    Object.freeze(q)
  );
}
function IZ($ = 32) {
  U0($, "bytesLength");
  let J = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof J?.getRandomValues !== "function")
    throw Error("crypto.getRandomValues must be defined");
  if ($ > 65536) throw RangeError(`"bytesLength" expected <= 65536, got ${$}`);
  return J.getRandomValues(new Uint8Array($));
}
var f$ = ($) => ({ oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, $]) });
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ function nJ(
  $,
  J = "object",
) {
  if ($ === null || typeof $ !== "object" || Array.isArray($))
    throw TypeError(
      J === "object"
        ? "expected valid options object"
        : `"${J}" expected object, got type=${typeof $}`,
    );
  return $;
}
var oX = ($) => ($ ? `"${$}" ` : "");
function PZ($, J = "") {
  if (typeof $ !== "boolean") throw TypeError(oX(J) + "expected boolean, got type=" + typeof $);
  return $;
}
function TZ($, J = {}, q = {}, Q = "object") {
  (nJ($, Q), nJ(J, "fields"), nJ(q, "optFields"));
  function Z(X, U, z) {
    let G = Q === "object" ? `param "${String(X)}"` : `"${Q}.${String(X)}"`,
      W = $[X];
    if (!Object.hasOwn($, X) && (z ? W !== void 0 : U !== "function"))
      throw TypeError(`${G} is invalid: expected own property`);
    if (z && W === void 0) return;
    let K = typeof W;
    if (K !== U || W === null) throw TypeError(`${G} is invalid: expected ${U}, got ${K}`);
  }
  let Y = (X, U) => Object.entries(X).forEach(([z, G]) => Z(z, G, U));
  (Y(J, !1), Y(q, !0));
}
var f8 = (() => BigInt(4294967295))(),
  EZ = BigInt(32);
function aX($, J = !1) {
  if (J) return { h: Number($ & f8), l: Number(($ >> EZ) & f8) };
  return { h: Number(($ >> EZ) & f8) | 0, l: Number($ & f8) | 0 };
}
function x8($, J = !1) {
  let q = $.length,
    Q = new Uint32Array(q),
    Z = new Uint32Array(q);
  for (let Y = 0; Y < q; Y++) {
    let { h: X, l: U } = aX($[Y], J);
    [Q[Y], Z[Y]] = [X, U];
  }
  return [Q, Z];
}
var tX = ($) => ($ / 4294967296) | 0,
  sX = ($) => $ >>> 0;
function kZ($, J, q, Q) {
  let Z = tX(q),
    Y = sX(q);
  ($.setUint32(J, Q ? Y : Z, Q), $.setUint32(J + 4, Q ? Z : Y, Q));
}
var iJ = ($, J, q) => $ >>> q,
  rJ = ($, J, q) => ($ << (32 - q)) | (J >>> q),
  M$ = ($, J, q) => ($ >>> q) | (J << (32 - q)),
  F$ = ($, J, q) => ($ << (32 - q)) | (J >>> q),
  a$ = ($, J, q) => ($ << (64 - q)) | (J >>> (q - 32)),
  t$ = ($, J, q) => ($ >>> (q - 32)) | (J << (64 - q));
function x0($, J, q, Q) {
  let Z = (J >>> 0) + (Q >>> 0);
  return { h: ($ + q + ((Z / 4294967296) | 0)) | 0, l: Z | 0 };
}
var HZ = ($, J, q) => ($ >>> 0) + (J >>> 0) + (q >>> 0),
  gZ = ($, J, q, Q) => (J + q + Q + (($ / 4294967296) | 0)) | 0,
  BZ = ($, J, q, Q) => ($ >>> 0) + (J >>> 0) + (q >>> 0) + (Q >>> 0),
  CZ = ($, J, q, Q, Z) => (J + q + Q + Z + (($ / 4294967296) | 0)) | 0,
  LZ = ($, J, q, Q, Z) => ($ >>> 0) + (J >>> 0) + (q >>> 0) + (Q >>> 0) + (Z >>> 0),
  SZ = ($, J, q, Q, Z, Y) => (J + q + Q + Z + Y + (($ / 4294967296) | 0)) | 0;
var $U = BigInt(0),
  s$ = BigInt(1),
  JU = BigInt(2),
  qU = BigInt(7),
  QU = BigInt(256),
  ZU = BigInt(113),
  vZ = [],
  AZ = [],
  _Z = [];
for (let $ = 0, J = s$, q = 1, Q = 0; $ < 24; $++) {
  (([q, Q] = [Q, (2 * q + 3 * Q) % 5]),
    vZ.push(2 * (5 * Q + q)),
    AZ.push(((($ + 1) * ($ + 2)) / 2) % 64));
  let Z = $U;
  for (let Y = 0; Y < 7; Y++)
    if (((J = ((J << s$) ^ ((J >> qU) * ZU)) % QU), J & JU)) Z ^= s$ << ((s$ << BigInt(Y)) - s$);
  _Z.push(Z);
}
var yZ = x8(_Z, !0),
  YU = yZ[0],
  XU = yZ[1],
  UU = ($, J, q) => ($ << q) | (J >>> (32 - q)),
  zU = ($, J, q) => (J << q) | ($ >>> (32 - q)),
  WU = ($, J, q) => (J << (q - 32)) | ($ >>> (64 - q)),
  GU = ($, J, q) => ($ << (q - 32)) | (J >>> (64 - q)),
  fZ = ($, J, q) => (q > 32 ? WU($, J, q) : UU($, J, q)),
  xZ = ($, J, q) => (q > 32 ? GU($, J, q) : zU($, J, q)),
  x$ = new Uint32Array(10);
function KU($, J = 24) {
  if (!($ instanceof Uint32Array))
    throw TypeError('"s" expected Uint32Array(50), got type=' + typeof $);
  if ($.length !== 50) throw RangeError('"s" expected Uint32Array(50), got length=' + $.length);
  if ((U0(J, "rounds"), J < 1 || J > 24)) throw Error('"rounds" expected integer 1..24');
  for (let q = 24 - J; q < 24; q++) {
    for (let Y = 0; Y < 10; Y++) x$[Y] = $[Y] ^ $[Y + 10] ^ $[Y + 20] ^ $[Y + 30] ^ $[Y + 40];
    for (let Y = 0; Y < 10; Y += 2) {
      let X = (Y + 8) % 10,
        U = (Y + 2) % 10,
        z = x$[U],
        G = x$[U + 1],
        W = fZ(z, G, 1) ^ x$[X],
        K = xZ(z, G, 1) ^ x$[X + 1];
      for (let O = 0; O < 50; O += 10) (($[Y + O] ^= W), ($[Y + O + 1] ^= K));
    }
    let Q = $[2],
      Z = $[3];
    for (let Y = 0; Y < 24; Y++) {
      let X = AZ[Y],
        U = fZ(Q, Z, X),
        z = xZ(Q, Z, X),
        G = vZ[Y];
      ((Q = $[G]), (Z = $[G + 1]), ($[G] = U), ($[G + 1] = z));
    }
    for (let Y = 0; Y < 50; Y += 10) {
      let X = $[Y],
        U = $[Y + 1],
        z = $[Y + 2],
        G = $[Y + 3];
      (($[Y] ^= ~$[Y + 2] & $[Y + 4]),
        ($[Y + 1] ^= ~$[Y + 3] & $[Y + 5]),
        ($[Y + 2] ^= ~$[Y + 4] & $[Y + 6]),
        ($[Y + 3] ^= ~$[Y + 5] & $[Y + 7]),
        ($[Y + 4] ^= ~$[Y + 6] & $[Y + 8]),
        ($[Y + 5] ^= ~$[Y + 7] & $[Y + 9]),
        ($[Y + 6] ^= ~$[Y + 8] & X),
        ($[Y + 7] ^= ~$[Y + 9] & U),
        ($[Y + 8] ^= ~X & z),
        ($[Y + 9] ^= ~U & G));
    }
    (($[0] ^= YU[q]), ($[1] ^= XU[q]));
  }
  r0(x$);
}
class oJ {
  state;
  pos = 0;
  posOut = 0;
  finished = !1;
  state32;
  destroyed = !1;
  blockLen;
  suffix;
  outputLen;
  canXOF;
  enableXOF = !1;
  rounds;
  constructor($, J, q, Q = !1, Z = 24) {
    if (
      (U0($, "blockLen"),
      U0(J, "suffix"),
      U0(Z, "rounds"),
      jZ(Q, "enableXOF"),
      (this.blockLen = $),
      (this.suffix = J),
      (this.outputLen = q),
      (this.enableXOF = Q),
      (this.canXOF = Q),
      (this.rounds = Z),
      U0(q, "outputLen"),
      !(0 < $ && $ < 200))
    )
      throw Error('"blockLen" must be 1..199');
    ((this.state = new Uint8Array(200)), (this.state32 = pJ(this.state)));
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    (hJ(this.state32),
      KU(this.state32, this.rounds),
      hJ(this.state32),
      (this.posOut = 0),
      (this.pos = 0));
  }
  update($) {
    (S$(this), n($));
    let { blockLen: J, state: q, state32: Q } = this,
      Z = $.length,
      Y = J % 4 === 0 && $.byteOffset % 4 === 0,
      X = J / 4,
      U = Y && Z >= J ? pJ($) : void 0;
    for (let z = 0; z < Z;) {
      if (U !== void 0 && this.pos === 0 && z % 4 === 0 && Z - z >= J) {
        for (let W = 0, K = z / 4; W < X; W++) Q[W] ^= U[K + W];
        ((z += J), (this.pos = J), this.keccak());
        continue;
      }
      let G = Math.min(J - this.pos, Z - z);
      for (let W = 0; W < G; W++) q[this.pos++] ^= $[z++];
      if (this.pos === J) this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = !0;
    let { state: $, suffix: J, pos: q, blockLen: Q } = this;
    if ((($[q] ^= J), (J & 128) !== 0 && q === Q - 1)) this.keccak();
    (($[Q - 1] ^= 128), this.keccak());
  }
  writeInto($) {
    (S$(this, !1), n($), this.finish());
    let J = this.state,
      { blockLen: q } = this;
    for (let Q = 0, Z = $.length; Q < Z;) {
      if (this.posOut >= q) this.keccak();
      let Y = Math.min(q - this.posOut, Z - Q);
      ($.set(J.subarray(this.posOut, this.posOut + Y), Q), (this.posOut += Y), (Q += Y));
    }
    return $;
  }
  xofInto($) {
    if (!this.enableXOF) throw Error("XOF is not enabled");
    return this.writeInto($);
  }
  xof($) {
    return (U0($), this.xofInto(new Uint8Array($)));
  }
  digestInto($) {
    if ((L8($, this), this.finished)) throw Error("digest() was already called");
    (this.writeInto($.length === this.outputLen ? $ : $.subarray(0, this.outputLen)),
      this.destroy());
  }
  digest() {
    let $ = new Uint8Array(this.outputLen);
    return (this.digestInto($), $);
  }
  destroy() {
    ((this.destroyed = !0), r0(this.state));
  }
  _cloneInto($) {
    let { blockLen: J, suffix: q, outputLen: Q, rounds: Z, enableXOF: Y } = this;
    return (
      ($ ||= new oJ(J, q, Q, Y, Z)),
      ($.blockLen = J),
      $.state32.set(this.state32),
      ($.pos = this.pos),
      ($.posOut = this.posOut),
      ($.finished = this.finished),
      ($.rounds = Z),
      ($.suffix = q),
      ($.outputLen = Q),
      ($.enableXOF = Y),
      ($.canXOF = this.canXOF),
      ($.destroyed = this.destroyed),
      $
    );
  }
}
var uZ = ($, J, q, Q = {}) =>
    o$((Z = {}) => {
      return ((Z = lJ({}, Z)), new oJ(J, $, Z.dkLen === void 0 ? q : Z.dkLen, !0));
    }, Q),
  mZ = uZ(31, 168, 16, f$(11)),
  W0 = uZ(31, 136, 32, f$(12));
function e$($, J = "n") {
  if (typeof $ !== "number")
    throw TypeError(`wrong u32 integer "${J}": expected number, got type=${typeof $}`);
  if (!Number.isSafeInteger($) || $ < 0 || $ > 4294967295)
    throw RangeError(`wrong u32 integer "${J}": expected 0..4294967295, got ${$}`);
  return $;
}
function cZ($) {
  return (e$($, "x"), ($ & ($ - 1)) === 0 && $ !== 0);
}
function aJ($, J) {
  if ((e$($), typeof J !== "number"))
    throw TypeError('"bits" expected number, got type=' + typeof J);
  if (!Number.isSafeInteger(J) || J < 0 || J > 32)
    throw Error(`expected integer 0 <= bits <= 32, got ${J}`);
  let q = 0;
  for (let Q = 0; Q < J; Q++, $ >>>= 1) q = (q << 1) | ($ & 1);
  return q >>> 0;
}
function pZ($) {
  return (e$($), 31 - Math.clz32($));
}
function bZ($) {
  if (!$ || typeof $ !== "object" || typeof $.length !== "number")
    throw TypeError('"values" expected array-like, got type=' + typeof $);
  let J = $.length;
  if (!cZ(J)) throw Error("expected positive power-of-two length, got " + J);
  let q = pZ(J);
  for (let Q = 0; Q < J; Q++) {
    let Z = aJ(Q, q);
    if (Q < Z) {
      let Y = $[Q];
      (($[Q] = $[Z]), ($[Z] = Y));
    }
  }
  return $;
}
var tJ = ($, J) => {
  TZ(
    J,
    { N: "number", roots: "object", dit: "boolean" },
    { invertButterflies: "boolean", skipStages: "number", brp: "boolean" },
    "coreOpts",
  );
  let { N: q, roots: Q, dit: Z, invertButterflies: Y = !1, skipStages: X = 0, brp: U = !0 } = J;
  e$(q, "coreOpts.N");
  let z = pZ(q);
  if (!cZ(q)) throw Error("FFT: Polynomial size should be power of two");
  e$(X, "coreOpts.skipStages");
  let G = z === 0 ? 0 : z - 1;
  if (X > G) throw Error(`FFT: wrong skipStages: expected 0 <= skipStages <= ${G}`);
  if (Q.length !== q) throw Error(`FFT: wrong roots length: expected ${q}, got ${Q.length}`);
  let W = Z !== Y;
  return (K) => {
    if (K.length !== q) throw Error("FFT: wrong Polynomial length");
    if (Z && U) bZ(K);
    for (let O = 0, R = 1; O < z - X; O++) {
      let D = Z ? O + 1 + X : z - O,
        M = 1 << D,
        H = M >> 1,
        C = q >> D;
      for (let V = 0; V < q; V += M)
        for (let N = 0, F = R++; N < H; N++) {
          let E = Y ? (Z ? q - F : F) : N * C,
            x = V + N,
            L = V + N + H,
            S = Q[E],
            h = K[L],
            d = K[x];
          if (W) {
            let u = $.mul(h, S);
            ((K[x] = $.add(d, u)), (K[L] = $.sub(d, u)));
          } else if (Y) ((K[x] = $.add(h, d)), (K[L] = $.mul($.sub(h, d), S)));
          else ((K[x] = $.add(d, h)), (K[L] = $.mul($.sub(d, h), S)));
        }
    }
    if (!Z && U) bZ(K);
    return K;
  };
};
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */ var o0 = n;
var sJ = IZ;
function OU($, J, q = () => {}) {
  if (!Array.isArray($)) throw TypeError(`"${J}" expected array, got type=${typeof $}`);
  for (let Q = 0; Q < $.length; Q++) q($[Q], `${J}[${Q}]`);
  return $;
}
function DU($, J = "object") {
  if ($ === null || typeof $ !== "object" || Array.isArray($))
    throw TypeError(
      J === "object"
        ? "expected valid options object"
        : `"${J}" expected object, got type=${typeof $}`,
    );
  return $;
}
function eJ($, J) {
  if ((($ = n($)), (J = n(J)), $.length !== J.length)) return !1;
  let q = 0;
  for (let Q = 0; Q < $.length; Q++) q |= $[Q] ^ J[Q];
  return q === 0;
}
function $q($) {
  if (B8($)) throw TypeError('"opts" expected object, got Uint8Array');
  DU($, "opts");
}
function v8($) {
  if (($q($), $.context !== void 0)) n($.context, void 0, "opts.context");
}
function A8($) {
  if ((v8($), $.extraEntropy !== !1 && $.extraEntropy !== void 0))
    n($.extraEntropy, void 0, "opts.extraEntropy");
}
function $8($, ...J) {
  let q = (Z) => (typeof Z === "number" ? Z : Z.bytesLen),
    Q = J.reduce((Z, Y) => Z + q(Y), 0);
  return {
    bytesLen: Q,
    encode: (Z) => {
      let Y = new Uint8Array(Q);
      for (let X = 0, U = 0; X < J.length; X++) {
        let z = J[X],
          G = q(z),
          W = typeof z === "number" ? Z[X] : z.encode(Z[X]);
        if ((n(W, G, $), Y.set(W, U), typeof z !== "number")) W.fill(0);
        U += G;
      }
      return Y;
    },
    decode: (Z) => {
      n(Z, Q, $);
      let Y = [];
      for (let X of J) {
        let U = q(X),
          z = Z.subarray(0, U);
        (Y.push(typeof X === "number" ? z : X.decode(z)), (Z = Z.subarray(U)));
      }
      return Y;
    },
  };
}
function w$($, J) {
  let q = $,
    Q = J * q.bytesLen;
  return {
    bytesLen: Q,
    encode: (Z) => {
      let Y = OU(Z, "u");
      if (Y.length !== J)
        throw RangeError(`vecCoder.encode: wrong length=${Y.length}. Expected: ${J}`);
      let X = new Uint8Array(Q);
      for (let U = 0, z = 0; U < Y.length; U++) {
        let G = q.encode(Y[U]);
        (X.set(G, z), G.fill(0), (z += G.length));
      }
      return X;
    },
    decode: (Z) => {
      n(Z, Q);
      let Y = [];
      for (let X = 0; X < Z.length; X += q.bytesLen)
        Y.push(q.decode(Z.subarray(X, X + q.bytesLen)));
      return Y;
    },
  };
}
function R0(...$) {
  for (let J of $)
    if (Array.isArray(J)) for (let q of J) q.fill(0);
    else J.fill(0);
}
function Jq($) {
  if ((U0($, "bits"), $ > 32)) throw RangeError('"bits" expected <= 32, got ' + $);
  return $ === 32 ? 4294967295 : ~(-1 << $) >>> 0;
}
var hZ = Uint8Array.of();
function qq($, J = hZ) {
  if ((n($, void 0, "msg"), n(J, void 0, "ctx"), J.length > 255))
    throw RangeError("context should be 255 bytes or less");
  return dJ(new Uint8Array([0, J.length]), J, $);
}
var NU = Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2]);
function Qq($, J = 0) {
  if (typeof $ !== "function" || typeof $.create !== "function")
    throw TypeError('"hash" expected hash function, got type=' + typeof $);
  (MZ($), U0(J, "requiredStrength"));
  let q = $.oid;
  if ((n(q, void 0, "hash.oid"), !eJ(q.subarray(0, 10), NU)))
    throw Error('"hash.oid" is invalid: expected NIST hash');
  let Q = ($.outputLen * 8) / 2;
  if (J > Q) throw Error("Pre-hash security strength too low: " + Q + ", required: " + J);
}
function Zq($, J, q = hZ) {
  if ((Qq($), n(J, void 0, "msg"), n(q, void 0, "ctx"), q.length > 255))
    throw RangeError("context should be 255 bytes or less");
  let Q = $(J);
  return dJ(new Uint8Array([1, q.length]), q, $.oid, Q);
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */ var dZ = ($) => {
    let { newPoly: J, N: q, Q, F: Z, ROOT_OF_UNITY: Y, brvBits: X, isKyber: U } = $,
      z = (N, F = Q) => {
        let E = (N % F) | 0;
        return (E >= 0 ? E | 0 : (F + E) | 0) | 0;
      },
      G = (N, F = Q) => {
        let E = z(N, F) | 0;
        return (E > F >> 1 ? (E - F) | 0 : E) | 0;
      };
    function W() {
      let N = J(q);
      for (let F = 0; F < q; F++) {
        let E = aJ(F, X),
          x = BigInt(Y) ** BigInt(E) % BigInt(Q);
        N[F] = Number(x) | 0;
      }
      return N;
    }
    let K = W(),
      O = (N) => {
        throw Error("not implemented");
      },
      R = U
        ? {
            add: (N, F) => {
              let E = (N + F) | 0;
              return E >= Q ? (E - Q) | 0 : E;
            },
            sub: (N, F) => {
              let E = (N - F) | 0;
              return E < 0 ? (E + Q) | 0 : E;
            },
            mul: (N, F) => z((N | 0) * (F | 0)) | 0,
            inv: O,
          }
        : {
            add: (N, F) => z((N | 0) + (F | 0)) | 0,
            sub: (N, F) => z((N | 0) - (F | 0)) | 0,
            mul: (N, F) => z((N | 0) * (F | 0)) | 0,
            inv: O,
          },
      D = { N: q, roots: K, invertButterflies: !0, skipStages: U ? 1 : 0, brp: !1 },
      M = tJ(R, { dit: !1, ...D }),
      H = tJ(R, { dit: !0, ...D }),
      C = {
        encode: (N) => {
          return M(N);
        },
        decode: (N) => {
          H(N);
          for (let F = 0; F < N.length; F++) N[F] = z(Z * N[F]);
          return N;
        },
      };
    return {
      mod: z,
      smod: G,
      nttZetas: K,
      NTT: { encode: (N) => C.encode(N), decode: (N) => C.decode(N) },
      bitsCoder: (N, F) => {
        for (let L = 0, S = 0; L < q; L++) {
          if (((S += N), S > 32)) Jq(S);
          S %= 8;
        }
        let E = Jq(N),
          x = N * (q / 8);
        return {
          bytesLen: x,
          encode: (L) => {
            let S = L,
              h = new Uint8Array(x);
            for (let d = 0, u = 0, $0 = 0, b0 = 0; d < S.length; d++) {
              ((u |= (F.encode(S[d]) & E) << $0), ($0 += N));
              for (; $0 >= 8; $0 -= 8, u >>= 8) h[b0++] = u & 255;
            }
            return h;
          },
          decode: (L) => {
            let S = J(q);
            for (let h = 0, d = 0, u = 0, $0 = 0; h < L.length; h++) {
              ((d |= L[h] << u), (u += 8));
              for (; u >= N; u -= N, d >>= N) S[$0++] = F.decode(d & E);
            }
            return S;
          },
        };
      },
    };
  },
  lZ = ($) => (J, q) => {
    if (!q) q = $.blockLen;
    let Q = new Uint8Array(J.length + 2);
    Q.set(J);
    let Z = J.length,
      Y = new Uint8Array(q),
      X = $.create({}),
      U = 0,
      z = 0;
    return {
      stats: () => ({ calls: U, xofs: z }),
      get: (G, W) => {
        return (
          (Q[Z + 0] = G),
          (Q[Z + 1] = W),
          X.destroy(),
          (X = $.create({}).update(Q)),
          U++,
          () => {
            return (z++, X.xofInto(Y));
          }
        );
      },
      clean: () => {
        (X.destroy(), R0(Y, Q));
      },
    };
  },
  nZ = lZ(mZ),
  iZ = lZ(W0);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */ function rZ($) {
  if (($q($), $.externalMu !== void 0)) PZ($.externalMu, "opts.externalMu");
}
var c = 256,
  s0 = 8380417,
  RU = 1753,
  VU = 8347681,
  I$ = 13,
  Yq = Math.floor((s0 - 1) / 88) | 0,
  Xq = Math.floor((s0 - 1) / 32) | 0,
  jU = (() =>
    Object.freeze({
      2: Object.freeze({
        K: 4,
        L: 4,
        D: I$,
        GAMMA1: 131072,
        GAMMA2: Yq,
        TAU: 39,
        ETA: 2,
        OMEGA: 80,
      }),
      3: Object.freeze({
        K: 6,
        L: 5,
        D: I$,
        GAMMA1: 524288,
        GAMMA2: Xq,
        TAU: 49,
        ETA: 4,
        OMEGA: 55,
      }),
      5: Object.freeze({
        K: 8,
        L: 7,
        D: I$,
        GAMMA1: 524288,
        GAMMA2: Xq,
        TAU: 60,
        ETA: 2,
        OMEGA: 75,
      }),
    }))(),
  V0 = ($) => new Int32Array($),
  _ = dZ({ N: c, Q: s0, F: VU, ROOT_OF_UNITY: RU, newPoly: V0, isKyber: !1, brvBits: 8 }),
  oZ = ($) => $,
  J8 = ($, J = oZ, q = oZ) => _.bitsCoder($, { encode: (Q) => J(q(Q)), decode: (Q) => q(J(Q)) }),
  a0 = ($, J) => {
    let q = $,
      Q = J;
    for (let Z = 0; Z < q.length; Z++) q[Z] = _.mod(q[Z] + Q[Z]);
    return q;
  },
  aZ = ($, J) => {
    let q = $,
      Q = J;
    for (let Z = 0; Z < q.length; Z++) q[Z] = _.mod(q[Z] - Q[Z]);
    return q;
  },
  MU = ($) => {
    let J = $;
    for (let q = 0; q < c; q++) J[q] <<= I$;
    return J;
  },
  q8 = ($, J) => {
    let q = $;
    for (let Q = 0; Q < c; Q++) if (Math.abs(_.smod(q[Q])) >= J) return !0;
    return !1;
  },
  t0 = ($, J) => {
    let q = $,
      Q = J,
      Z = V0(c);
    for (let Y = 0; Y < q.length; Y++) Z[Y] = _.mod(q[Y] * Q[Y]);
    return Z;
  };
function _8($) {
  let J = $,
    q = V0(c);
  for (let Q = 0; Q < c;) {
    let Z = J();
    if (Z.length % 3) throw Error("RejNTTPoly: unaligned block");
    for (let Y = 0; Q < c && Y <= Z.length - 3; Y += 3) {
      let X = (Z[Y + 0] | (Z[Y + 1] << 8) | (Z[Y + 2] << 16)) & 8388607;
      if (X < s0) q[Q++] = X;
    }
  }
  return q;
}
function FU($) {
  let J = $,
    { K: q, L: Q, GAMMA1: Z, GAMMA2: Y, TAU: X, ETA: U, OMEGA: z } = J,
    { CRH_BYTES: G, TR_BYTES: W, C_TILDE_BYTES: K, XOF128: O, XOF256: R, securityLevel: D } = J;
  if (![2, 4].includes(U)) throw Error("Wrong ETA");
  if (![131072, 524288].includes(Z)) throw Error("Wrong GAMMA1");
  if (![Yq, Xq].includes(Y)) throw Error("Wrong GAMMA2");
  let M = X * U,
    H = (j) => {
      let T = _.mod(j),
        P = _.smod(T, 2 * Y) | 0;
      if (T - P === s0 - 1) return { r1: 0, r0: (P - 1) | 0 };
      return { r1: Math.floor((T - P) / (2 * Y)) | 0, r0: P };
    },
    C = (j) => H(j).r1,
    V = (j) => H(j).r0,
    N = (j, T) => {
      return j <= Y || j > s0 - Y || (j === s0 - Y && T === 0) ? 0 : 1;
    },
    F = Math.floor((s0 - 1) / (2 * Y)),
    E = (j, T) => {
      let { r1: P, r0: I } = H(T);
      if (j === 1) return I > 0 ? _.mod(P + 1, F) | 0 : _.mod(P - 1, F) | 0;
      return P | 0;
    },
    x = (j) => {
      let T = _.mod(j),
        P = _.smod(T, 2 ** I$) | 0;
      return { r1: Math.floor((T - P) / 2 ** I$) | 0, r0: P };
    },
    L = {
      bytesLen: z + q,
      encode: (j) => {
        let T = j;
        if (T === !1) throw Error("hint.encode: hint is false");
        let P = new Uint8Array(z + q);
        for (let I = 0, g = 0; I < q; I++) {
          for (let B = 0; B < c; B++) if (T[I][B] !== 0) P[g++] = B;
          P[z + I] = g;
        }
        return P;
      },
      decode: (j) => {
        let T = [],
          P = 0;
        for (let I = 0; I < q; I++) {
          let g = V0(c);
          if (j[z + I] < P || j[z + I] > z) return !1;
          for (let B = P; B < j[z + I]; B++) {
            if (B > P && j[B] <= j[B - 1]) return !1;
            g[j[B]] = 1;
          }
          ((P = j[z + I]), T.push(g));
        }
        for (let I = P; I < z; I++) if (j[I] !== 0) return !1;
        return T;
      },
    },
    S = J8(
      U === 2 ? 3 : 4,
      (j) => U - j,
      (j) => {
        if (!(-U <= j && j <= U))
          throw Error(`malformed key s1/s3 ${j} outside of ETA range [${-U}, ${U}]`);
        return j;
      },
    ),
    h = J8(13, (j) => (1 << (I$ - 1)) - j),
    d = J8(10),
    u = J8(Z === 131072 ? 18 : 20, (j) => _.smod(Z - j)),
    $0 = J8(Y === Yq ? 6 : 4),
    b0 = w$($0, q),
    C0 = $8("publicKey", 32, w$(d, q)),
    K8 = $8("secretKey", 32, 32, W, w$(S, Q), w$(S, q), w$(h, q)),
    O8 = $8("signature", K, w$(u, Q), L),
    _q = U === 2 ? (j) => (j < 15 ? 2 - (j % 5) : !1) : (j) => (j < 9 ? 4 - j : !1);
  function yq(j) {
    let T = j,
      P = V0(c);
    for (let I = 0; I < c;) {
      let g = T();
      for (let B = 0; I < c && B < g.length; B += 1) {
        let A = _q(g[B] & 15),
          r = _q((g[B] >> 4) & 15);
        if (A !== !1) P[I++] = A;
        if (I < c && r !== !1) P[I++] = r;
      }
    }
    return P;
  }
  let uq = (j) => {
      let T = V0(c),
        P = W0.create({}).update(j),
        I = new Uint8Array(W0.blockLen);
      P.xofInto(I);
      let g = I.slice(0, 8);
      for (let B = c - X, A = 8, r = 0, J0 = 0; B < c; B++) {
        let q0 = B + 1;
        for (; q0 > B;) {
          if (((q0 = I[A++]), A < W0.blockLen)) continue;
          (P.xofInto(I), (A = 0));
        }
        if (((T[B] = T[q0]), (T[q0] = 1 - (((g[r] >> J0++) & 1) << 1)), J0 >= 8)) (r++, (J0 = 0));
      }
      return T;
    },
    mq = (j) => {
      let T = j,
        P = V0(c),
        I = V0(c);
      for (let g = 0; g < T.length; g++) {
        let { r0: B, r1: A } = x(T[g]);
        ((P[g] = B), (I[g] = A));
      }
      return { r0: P, r1: I };
    },
    R1 = (j, T) => {
      let P = j,
        I = T;
      for (let g = 0; g < c; g++) P[g] = E(I[g], P[g]);
      return P;
    },
    V1 = (j, T) => {
      let P = j,
        I = T,
        g = V0(c),
        B = 0;
      for (let A = 0; A < c; A++) {
        let r = N(P[A], I[A]);
        ((g[A] = r), (B += r));
      }
      return { v: g, cnt: B };
    },
    bq = 32,
    cq = $8("seed", 32, 64, 32),
    E0 = Object.freeze({
      info: Object.freeze({ type: "internal-ml-dsa" }),
      lengths: Object.freeze({
        secretKey: K8.bytesLen,
        publicKey: C0.bytesLen,
        seed: 32,
        signature: O8.bytesLen,
        signRand: bq,
      }),
      keygen: (j) => {
        let T = new Uint8Array(34),
          P = j === void 0;
        if (P) j = sJ(32);
        if ((o0(j, 32, "seed"), T.set(j), P)) R0(j);
        ((T[32] = q), (T[33] = Q));
        let [I, g, B] = cq.decode(W0(T, { dkLen: cq.bytesLen })),
          A = R(g),
          r = [];
        for (let f = 0; f < Q; f++) r.push(yq(A.get(f & 255, (f >> 8) & 255)));
        let J0 = [];
        for (let f = Q; f < Q + q; f++) J0.push(yq(A.get(f & 255, (f >> 8) & 255)));
        let q0 = r.map((f) => _.NTT.encode(f.slice())),
          Q0 = [],
          Z0 = [],
          L0 = O(I),
          t = V0(c);
        for (let f = 0; f < q; f++) {
          R0(t);
          for (let Y0 = 0; Y0 < Q; Y0++) {
            let N0 = _8(L0.get(Y0, f));
            a0(t, t0(N0, q0[Y0]));
          }
          _.NTT.decode(t);
          let { r0: O$, r1: m } = mq(a0(t, J0[f]));
          (Q0.push(O$), Z0.push(m));
        }
        let k0 = C0.encode([I, Z0]),
          c0 = W0(k0, { dkLen: W }),
          K$ = K8.encode([I, B, c0, r, J0, Q0]);
        return (
          L0.clean(),
          A.clean(),
          R0(I, g, B, r, J0, q0, t, Q0, Z0, c0, T),
          { publicKey: k0, secretKey: K$ }
        );
      },
      getPublicKey: (j) => {
        let [T, P, I, g, B, A] = K8.decode(j),
          r = O(T),
          J0 = g.map((Z0) => _.NTT.encode(Z0.slice())),
          q0 = [],
          Q0 = V0(c);
        for (let Z0 = 0; Z0 < q; Z0++) {
          Q0.fill(0);
          for (let t = 0; t < Q; t++) {
            let k0 = _8(r.get(t, Z0));
            a0(Q0, t0(k0, J0[t]));
          }
          (_.NTT.decode(Q0), a0(Q0, B[Z0]));
          let { r1: L0 } = mq(Q0);
          q0.push(L0);
        }
        return (r.clean(), R0(Q0, J0, A, g, B), C0.encode([T, q0]));
      },
      sign: (j, T, P = {}) => {
        (A8(P), rZ(P));
        let { extraEntropy: I, externalMu: g = !1 } = P;
        if (g) o0(j, G, "mu");
        let B = I === !1 || I === void 0,
          A = I === !1 ? new Uint8Array(32) : I === void 0 ? sJ(bq) : I;
        o0(A, 32, "extraEntropy");
        let r = (() => {
            try {
              return K8.decode(T);
            } catch (m) {
              if (B) R0(A);
              throw m;
            }
          })(),
          [J0, q0, Q0, Z0, L0, t] = r,
          k0 = [],
          c0 = O(J0);
        for (let m = 0; m < q; m++) {
          let Y0 = [];
          for (let N0 = 0; N0 < Q; N0++) Y0.push(_8(c0.get(N0, m)));
          k0.push(Y0);
        }
        c0.clean();
        for (let m = 0; m < Q; m++) _.NTT.encode(Z0[m]);
        for (let m = 0; m < q; m++) (_.NTT.encode(L0[m]), _.NTT.encode(t[m]));
        let K$ = g ? j : W0.create({ dkLen: G }).update(Q0).update(j).digest(),
          f = W0.create({ dkLen: G }).update(q0).update(A).update(K$).digest();
        if (B) R0(A);
        o0(f, G);
        let O$ = R(f, u.bytesLen);
        $: for (let m = 0; ;) {
          let Y0 = [];
          for (let b = 0; b < Q; b++, m++) Y0.push(u.decode(O$.get(m & 255, m >> 8)()));
          let N0 = Y0.map((b) => _.NTT.encode(b.slice())),
            H$ = [];
          for (let b = 0; b < q; b++) {
            let p$ = V0(c);
            for (let p0 = 0; p0 < Q; p0++) a0(p$, t0(k0[b][p0], N0[p0]));
            (_.NTT.decode(p$), H$.push(p$));
          }
          let e8 = H$.map((b) => b.map(C)),
            $J = W0.create({ dkLen: K }).update(K$).update(b0.encode(e8)).digest(),
            D8 = _.NTT.encode(uq($J)),
            N8 = Z0.map((b) => t0(b, D8));
          for (let b = 0; b < Q; b++)
            if ((a0(_.NTT.decode(N8[b]), Y0[b]), q8(N8[b], Z - M))) continue $;
          let pq = 0,
            JJ = [];
          for (let b = 0; b < q; b++) {
            let p$ = _.NTT.decode(t0(L0[b], D8)),
              p0 = aZ(H$[b], p$).map(V);
            if (q8(p0, Y - M)) continue $;
            let hq = _.NTT.decode(t0(t[b], D8));
            if (q8(hq, Y)) continue $;
            a0(p0, hq);
            let dq = V1(p0, e8[b]);
            (JJ.push(dq.v), (pq += dq.cnt));
          }
          if (pq > z) continue;
          O$.clean();
          let j1 = O8.encode([$J, N8, JJ]);
          if ((R0($J, N8, JJ, D8, e8, H$, N0, Y0, f, Z0, L0, t, ...k0), !g)) R0(K$);
          return j1;
        }
        throw Error("Unreachable code path reached, report this error");
      },
      verify: (j, T, P, I = {}) => {
        rZ(I);
        let { externalMu: g = !1 } = I;
        if (g) o0(T, G, "mu");
        let [B, A] = C0.decode(P),
          r = W0(P, { dkLen: W });
        if (j.length !== O8.bytesLen) return !1;
        let [J0, q0, Q0] = O8.decode(j);
        if (Q0 === !1) return !1;
        for (let f = 0; f < Q; f++) if (q8(q0[f], Z - M)) return !1;
        let Z0 = g ? T : W0.create({ dkLen: G }).update(r).update(T).digest(),
          L0 = _.NTT.encode(uq(J0)),
          t = q0.map((f) => f.slice());
        for (let f = 0; f < Q; f++) _.NTT.encode(t[f]);
        let k0 = [],
          c0 = O(B);
        for (let f = 0; f < q; f++) {
          let O$ = t0(_.NTT.encode(MU(A[f])), L0),
            m = V0(c);
          for (let N0 = 0; N0 < Q; N0++) {
            let H$ = _8(c0.get(N0, f));
            a0(m, t0(H$, t[N0]));
          }
          let Y0 = _.NTT.decode(aZ(m, O$));
          k0.push(R1(Y0, Q0[f]));
        }
        c0.clean();
        let K$ = W0.create({ dkLen: K }).update(Z0).update(b0.encode(k0)).digest();
        for (let f of Q0) if (!(f.reduce((m, Y0) => m + Y0, 0) <= z)) return !1;
        for (let f of q0) if (q8(f, Z - M)) return !1;
        return eJ(J0, K$);
      },
    });
  return Object.freeze({
    info: Object.freeze({ type: "ml-dsa" }),
    internal: E0,
    securityLevel: D,
    keygen: E0.keygen,
    lengths: E0.lengths,
    getPublicKey: E0.getPublicKey,
    sign: (j, T, P = {}) => {
      A8(P);
      let I = qq(j, P.context),
        g = E0.sign(I, T, P);
      return (R0(I), g);
    },
    verify: (j, T, P, I = {}) => {
      return (v8(I), o0(j, void 0, "signature"), E0.verify(j, qq(T, I.context), P));
    },
    prehash: (j) => {
      Qq(j, D);
      let T = j;
      return Object.freeze({
        info: Object.freeze({ type: "hashml-dsa" }),
        securityLevel: D,
        lengths: E0.lengths,
        keygen: E0.keygen,
        getPublicKey: E0.getPublicKey,
        sign: (P, I, g = {}) => {
          A8(g);
          let B = Zq(T, P, g.context),
            A = E0.sign(B, I, g);
          return (R0(B), A);
        },
        verify: (P, I, g, B = {}) => {
          return (v8(B), o0(P, void 0, "signature"), E0.verify(P, Zq(T, I, B.context), g));
        },
      });
    },
  });
}
var Uq = (() =>
  FU({
    ...jU[3],
    CRH_BYTES: 64,
    TR_BYTES: 64,
    C_TILDE_BYTES: 48,
    XOF128: nZ,
    XOF256: iZ,
    securityLevel: 192,
  }))();
function tZ($, J, q) {
  return ($ & J) ^ (~$ & q);
}
function sZ($, J, q) {
  return ($ & J) ^ ($ & q) ^ (J & q);
}
class y8 {
  blockLen;
  outputLen;
  canXOF = !1;
  padOffset;
  isLE;
  buffer;
  view;
  finished = !1;
  length = 0;
  pos = 0;
  destroyed = !1;
  constructor($, J, q, Q) {
    ((this.blockLen = $),
      (this.outputLen = J),
      (this.padOffset = q),
      (this.isLE = Q),
      (this.buffer = new Uint8Array($)),
      (this.view = S8(this.buffer)));
  }
  update($) {
    (S$(this), n($));
    let { view: J, buffer: q, blockLen: Q } = this,
      Z = $.length,
      Y = !1;
    for (let X = 0; X < Z;) {
      let U = Math.min(Q - this.pos, Z - X);
      if (U === Q) {
        let z = S8($);
        for (; Q <= Z - X; X += Q) this.process(z, X);
        Y = !0;
        continue;
      }
      if (
        (q.set(X === 0 && U === Z ? $ : $.subarray(X, X + U), this.pos),
        (this.pos += U),
        (X += U),
        this.pos === Q)
      )
        (this.process(J, 0), (this.pos = 0), (Y = !0));
    }
    if (((this.length += $.length), Y)) this.roundClean();
    return this;
  }
  digestInto($) {
    (S$(this), L8($, this), (this.finished = !0));
    let { buffer: J, view: q, blockLen: Q, isLE: Z } = this,
      { pos: Y } = this;
    if (((J[Y++] = 128), J.fill(0, Y), this.padOffset > Q - Y)) (this.process(q, 0), J.fill(0));
    (kZ(q, Q - 8, this.length * 8, Z), this.process(q, 0), this.roundClean());
    let X = $ === J ? q : S8($),
      U = this.outputLen,
      z = U / 4,
      G = this.get();
    if (U % 4 || z > G.length) throw Error("invalid outputLen");
    for (let W = 0; W < z; W++) X.setUint32(4 * W, G[W], Z);
  }
  digest() {
    let { buffer: $, outputLen: J } = this;
    this.digestInto($);
    let q = $.slice(0, J);
    return (this.destroy(), q);
  }
  _cloneIntoMeta($) {
    let { buffer: J, length: q, finished: Q, destroyed: Z, pos: Y } = this;
    if ((($.destroyed = Z), ($.finished = Q), ($.length = q), ($.pos = Y), Y)) $.buffer.set(J);
    return $;
  }
  clone() {
    return this._cloneInto();
  }
}
var eZ = Uint32Array.from([
  1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225,
]);
var $Y = Uint32Array.from([
  1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129,
  1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209,
]);
var wU = Uint32Array.from([
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
    3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
    3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
    666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
    2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
    1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
  ]),
  e0 = new Uint32Array(64);
class JY extends y8 {
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor($, J) {
    super(64, $, 8, !1);
    ((this.A = J[0] | 0),
      (this.B = J[1] | 0),
      (this.C = J[2] | 0),
      (this.D = J[3] | 0),
      (this.E = J[4] | 0),
      (this.F = J[5] | 0),
      (this.G = J[6] | 0),
      (this.H = J[7] | 0));
  }
  get() {
    let { A: $, B: J, C: q, D: Q, E: Z, F: Y, G: X, H: U } = this;
    return [$, J, q, Q, Z, Y, X, U];
  }
  set($, J, q, Q, Z, Y, X, U) {
    ((this.A = $ | 0),
      (this.B = J | 0),
      (this.C = q | 0),
      (this.D = Q | 0),
      (this.E = Z | 0),
      (this.F = Y | 0),
      (this.G = X | 0),
      (this.H = U | 0));
  }
  _cloneInto($) {
    return (($ ||= new this.constructor()).set(...this.get()), this._cloneIntoMeta($));
  }
  process($, J) {
    for (let W = 0; W < 16; W++, J += 4) e0[W] = $.getUint32(J, !1);
    for (let W = 16; W < 64; W++) {
      let K = e0[W - 15],
        O = e0[W - 2],
        R = H0(K, 7) ^ H0(K, 18) ^ (K >>> 3),
        D = H0(O, 17) ^ H0(O, 19) ^ (O >>> 10);
      e0[W] = (D + e0[W - 7] + R + e0[W - 16]) | 0;
    }
    let { A: q, B: Q, C: Z, D: Y, E: X, F: U, G: z, H: G } = this;
    for (let W = 0; W < 64; W++) {
      let K = H0(X, 6) ^ H0(X, 11) ^ H0(X, 25),
        O = (G + K + tZ(X, U, z) + wU[W] + e0[W]) | 0,
        D = ((H0(q, 2) ^ H0(q, 13) ^ H0(q, 22)) + sZ(q, Q, Z)) | 0;
      ((G = z), (z = U), (U = X), (X = (Y + O) | 0), (Y = Z), (Z = Q), (Q = q), (q = (O + D) | 0));
    }
    ((q = (q + this.A) | 0),
      (Q = (Q + this.B) | 0),
      (Z = (Z + this.C) | 0),
      (Y = (Y + this.D) | 0),
      (X = (X + this.E) | 0),
      (U = (U + this.F) | 0),
      (z = (z + this.G) | 0),
      (G = (G + this.H) | 0),
      this.set(q, Q, Z, Y, X, U, z, G));
  }
  roundClean() {
    r0(e0);
  }
  destroy() {
    ((this.destroyed = !0), this.set(0, 0, 0, 0, 0, 0, 0, 0), r0(this.buffer));
  }
}
class qY extends JY {
  constructor() {
    super(32, eZ);
  }
}
var QY = (() =>
    x8(
      [
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817",
      ].map(($) => BigInt($)),
    ))(),
  IU = (() => QY[0])(),
  PU = (() => QY[1])(),
  $$ = new Uint32Array(80),
  J$ = new Uint32Array(80);
class ZY extends y8 {
  Ah = 0;
  Al = 0;
  Bh = 0;
  Bl = 0;
  Ch = 0;
  Cl = 0;
  Dh = 0;
  Dl = 0;
  Eh = 0;
  El = 0;
  Fh = 0;
  Fl = 0;
  Gh = 0;
  Gl = 0;
  Hh = 0;
  Hl = 0;
  constructor($, J) {
    super(128, $, 16, !1);
    ((this.Ah = J[0] | 0),
      (this.Al = J[1] | 0),
      (this.Bh = J[2] | 0),
      (this.Bl = J[3] | 0),
      (this.Ch = J[4] | 0),
      (this.Cl = J[5] | 0),
      (this.Dh = J[6] | 0),
      (this.Dl = J[7] | 0),
      (this.Eh = J[8] | 0),
      (this.El = J[9] | 0),
      (this.Fh = J[10] | 0),
      (this.Fl = J[11] | 0),
      (this.Gh = J[12] | 0),
      (this.Gl = J[13] | 0),
      (this.Hh = J[14] | 0),
      (this.Hl = J[15] | 0));
  }
  get() {
    let {
      Ah: $,
      Al: J,
      Bh: q,
      Bl: Q,
      Ch: Z,
      Cl: Y,
      Dh: X,
      Dl: U,
      Eh: z,
      El: G,
      Fh: W,
      Fl: K,
      Gh: O,
      Gl: R,
      Hh: D,
      Hl: M,
    } = this;
    return [$, J, q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M];
  }
  set($, J, q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M) {
    ((this.Ah = $ | 0),
      (this.Al = J | 0),
      (this.Bh = q | 0),
      (this.Bl = Q | 0),
      (this.Ch = Z | 0),
      (this.Cl = Y | 0),
      (this.Dh = X | 0),
      (this.Dl = U | 0),
      (this.Eh = z | 0),
      (this.El = G | 0),
      (this.Fh = W | 0),
      (this.Fl = K | 0),
      (this.Gh = O | 0),
      (this.Gl = R | 0),
      (this.Hh = D | 0),
      (this.Hl = M | 0));
  }
  _cloneInto($) {
    return (($ ||= new this.constructor()).set(...this.get()), this._cloneIntoMeta($));
  }
  process($, J) {
    for (let V = 0; V < 16; V++, J += 4)
      (($$[V] = $.getUint32(J)), (J$[V] = $.getUint32((J += 4))));
    for (let V = 16; V < 80; V++) {
      let N = $$[V - 15] | 0,
        F = J$[V - 15] | 0,
        E = M$(N, F, 1) ^ M$(N, F, 8) ^ iJ(N, F, 7),
        x = F$(N, F, 1) ^ F$(N, F, 8) ^ rJ(N, F, 7),
        L = $$[V - 2] | 0,
        S = J$[V - 2] | 0,
        h = M$(L, S, 19) ^ a$(L, S, 61) ^ iJ(L, S, 6),
        d = F$(L, S, 19) ^ t$(L, S, 61) ^ rJ(L, S, 6),
        u = BZ(x, d, J$[V - 7], J$[V - 16]),
        $0 = CZ(u, E, h, $$[V - 7], $$[V - 16]);
      (($$[V] = $0 | 0), (J$[V] = u | 0));
    }
    let {
      Ah: q,
      Al: Q,
      Bh: Z,
      Bl: Y,
      Ch: X,
      Cl: U,
      Dh: z,
      Dl: G,
      Eh: W,
      El: K,
      Fh: O,
      Fl: R,
      Gh: D,
      Gl: M,
      Hh: H,
      Hl: C,
    } = this;
    for (let V = 0; V < 80; V++) {
      let N = M$(W, K, 14) ^ M$(W, K, 18) ^ a$(W, K, 41),
        F = F$(W, K, 14) ^ F$(W, K, 18) ^ t$(W, K, 41),
        E = (W & O) ^ (~W & D),
        x = (K & R) ^ (~K & M),
        L = LZ(C, F, x, PU[V], J$[V]),
        S = SZ(L, H, N, E, IU[V], $$[V]),
        h = L | 0,
        d = M$(q, Q, 28) ^ a$(q, Q, 34) ^ a$(q, Q, 39),
        u = F$(q, Q, 28) ^ t$(q, Q, 34) ^ t$(q, Q, 39),
        $0 = (q & Z) ^ (q & X) ^ (Z & X),
        b0 = (Q & Y) ^ (Q & U) ^ (Y & U);
      ((H = D | 0),
        (C = M | 0),
        (D = O | 0),
        (M = R | 0),
        (O = W | 0),
        (R = K | 0),
        ({ h: W, l: K } = x0(z | 0, G | 0, S | 0, h | 0)),
        (z = X | 0),
        (G = U | 0),
        (X = Z | 0),
        (U = Y | 0),
        (Z = q | 0),
        (Y = Q | 0));
      let C0 = HZ(h, u, b0);
      ((q = gZ(C0, S, d, $0)), (Q = C0 | 0));
    }
    (({ h: q, l: Q } = x0(this.Ah | 0, this.Al | 0, q | 0, Q | 0)),
      ({ h: Z, l: Y } = x0(this.Bh | 0, this.Bl | 0, Z | 0, Y | 0)),
      ({ h: X, l: U } = x0(this.Ch | 0, this.Cl | 0, X | 0, U | 0)),
      ({ h: z, l: G } = x0(this.Dh | 0, this.Dl | 0, z | 0, G | 0)),
      ({ h: W, l: K } = x0(this.Eh | 0, this.El | 0, W | 0, K | 0)),
      ({ h: O, l: R } = x0(this.Fh | 0, this.Fl | 0, O | 0, R | 0)),
      ({ h: D, l: M } = x0(this.Gh | 0, this.Gl | 0, D | 0, M | 0)),
      ({ h: H, l: C } = x0(this.Hh | 0, this.Hl | 0, H | 0, C | 0)),
      this.set(q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M, H, C));
  }
  roundClean() {
    r0($$, J$);
  }
  destroy() {
    ((this.destroyed = !0),
      r0(this.buffer),
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
  }
}
class YY extends ZY {
  constructor() {
    super(64, $Y);
  }
}
var u8 = o$(() => new qY(), f$(1));
var zq = o$(() => new YY(), f$(3));
function TU($) {
  if ($.length >= 255) throw TypeError("Alphabet too long");
  let J = new Uint8Array(256);
  for (let G = 0; G < J.length; G++) J[G] = 255;
  for (let G = 0; G < $.length; G++) {
    let W = $.charAt(G),
      K = W.charCodeAt(0);
    if (J[K] !== 255) throw TypeError(W + " is ambiguous");
    J[K] = G;
  }
  let q = $.length,
    Q = $.charAt(0),
    Z = Math.log(q) / Math.log(256),
    Y = Math.log(256) / Math.log(q);
  function X(G) {
    if (G instanceof Uint8Array);
    else if (ArrayBuffer.isView(G)) G = new Uint8Array(G.buffer, G.byteOffset, G.byteLength);
    else if (Array.isArray(G)) G = Uint8Array.from(G);
    if (!(G instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
    if (G.length === 0) return "";
    let W = 0,
      K = 0,
      O = 0,
      R = G.length;
    while (O !== R && G[O] === 0) (O++, W++);
    let D = ((R - O) * Y + 1) >>> 0,
      M = new Uint8Array(D);
    while (O !== R) {
      let V = G[O],
        N = 0;
      for (let F = D - 1; (V !== 0 || N < K) && F !== -1; F--, N++)
        ((V += (256 * M[F]) >>> 0), (M[F] = (V % q) >>> 0), (V = (V / q) >>> 0));
      if (V !== 0) throw Error("Non-zero carry");
      ((K = N), O++);
    }
    let H = D - K;
    while (H !== D && M[H] === 0) H++;
    let C = Q.repeat(W);
    for (; H < D; ++H) C += $.charAt(M[H]);
    return C;
  }
  function U(G) {
    if (typeof G !== "string") throw TypeError("Expected String");
    if (G.length === 0) return new Uint8Array();
    let W = 0,
      K = 0,
      O = 0;
    while (G[W] === Q) (K++, W++);
    let R = ((G.length - W) * Z + 1) >>> 0,
      D = new Uint8Array(R);
    while (W < G.length) {
      let V = G.charCodeAt(W);
      if (V > 255) return;
      let N = J[V];
      if (N === 255) return;
      let F = 0;
      for (let E = R - 1; (N !== 0 || F < O) && E !== -1; E--, F++)
        ((N += (q * D[E]) >>> 0), (D[E] = (N % 256) >>> 0), (N = (N / 256) >>> 0));
      if (N !== 0) throw Error("Non-zero carry");
      ((O = F), W++);
    }
    let M = R - O;
    while (M !== R && D[M] === 0) M++;
    let H = new Uint8Array(K + (R - M)),
      C = K;
    while (M !== R) H[C++] = D[M++];
    return H;
  }
  function z(G) {
    let W = U(G);
    if (W) return W;
    throw Error("Non-base" + q + " character");
  }
  return { encode: X, decodeUnsafe: U, decode: z };
}
var XY = TU;
var EU = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  m8 = XY(EU);
var P$ = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */ function kU($) {
  return $ instanceof Uint8Array || (ArrayBuffer.isView($) && $.constructor.name === "Uint8Array");
}
function q$($) {
  if (!Number.isSafeInteger($) || $ < 0) throw Error("positive integer expected, got " + $);
}
function y0($, ...J) {
  if (!kU($)) throw Error("Uint8Array expected");
  if (J.length > 0 && !J.includes($.length))
    throw Error("Uint8Array expected of length " + J + ", got length=" + $.length);
}
function b8($) {
  if (typeof $ !== "function" || typeof $.create !== "function")
    throw Error("Hash should be wrapped by utils.createHasher");
  (q$($.outputLen), q$($.blockLen));
}
function v$($, J = !0) {
  if ($.destroyed) throw Error("Hash instance has been destroyed");
  if (J && $.finished) throw Error("Hash#digest() has already been called");
}
function UY($, J) {
  y0($);
  let q = J.outputLen;
  if ($.length < q) throw Error("digestInto() expects output buffer of length at least " + q);
}
function g0(...$) {
  for (let J = 0; J < $.length; J++) $[J].fill(0);
}
function A$($) {
  return new DataView($.buffer, $.byteOffset, $.byteLength);
}
function B0($, J) {
  return ($ << (32 - J)) | ($ >>> J);
}
function zY($) {
  if (typeof $ !== "string") throw Error("string expected");
  return new Uint8Array(new TextEncoder().encode($));
}
function Q8($) {
  if (typeof $ === "string") $ = zY($);
  return (y0($), $);
}
function Wq($) {
  if (typeof $ === "string") $ = zY($);
  return (y0($), $);
}
function WY($, J) {
  if (J !== void 0 && {}.toString.call(J) !== "[object Object]")
    throw Error("options should be object or undefined");
  return Object.assign($, J);
}
class _$ {}
function Gq($) {
  let J = (Q) => $().update(Q8(Q)).digest(),
    q = $();
  return ((J.outputLen = q.outputLen), (J.blockLen = q.blockLen), (J.create = () => $()), J);
}
function GY($ = 32) {
  if (P$ && typeof P$.getRandomValues === "function") return P$.getRandomValues(new Uint8Array($));
  if (P$ && typeof P$.randomBytes === "function") return Uint8Array.from(P$.randomBytes($));
  throw Error("crypto.getRandomValues must be defined");
}
class Kq extends _$ {
  constructor($, J) {
    super();
    ((this.finished = !1), (this.destroyed = !1), b8($));
    let q = Q8(J);
    if (((this.iHash = $.create()), typeof this.iHash.update !== "function"))
      throw Error("Expected instance of class which extends utils.Hash");
    ((this.blockLen = this.iHash.blockLen), (this.outputLen = this.iHash.outputLen));
    let Q = this.blockLen,
      Z = new Uint8Array(Q);
    Z.set(q.length > Q ? $.create().update(q).digest() : q);
    for (let Y = 0; Y < Z.length; Y++) Z[Y] ^= 54;
    (this.iHash.update(Z), (this.oHash = $.create()));
    for (let Y = 0; Y < Z.length; Y++) Z[Y] ^= 106;
    (this.oHash.update(Z), g0(Z));
  }
  update($) {
    return (v$(this), this.iHash.update($), this);
  }
  digestInto($) {
    (v$(this),
      y0($, this.outputLen),
      (this.finished = !0),
      this.iHash.digestInto($),
      this.oHash.update($),
      this.oHash.digestInto($),
      this.destroy());
  }
  digest() {
    let $ = new Uint8Array(this.oHash.outputLen);
    return (this.digestInto($), $);
  }
  _cloneInto($) {
    $ || ($ = Object.create(Object.getPrototypeOf(this), {}));
    let { oHash: J, iHash: q, finished: Q, destroyed: Z, blockLen: Y, outputLen: X } = this;
    return (
      ($ = $),
      ($.finished = Q),
      ($.destroyed = Z),
      ($.blockLen = Y),
      ($.outputLen = X),
      ($.oHash = J._cloneInto($.oHash)),
      ($.iHash = q._cloneInto($.iHash)),
      $
    );
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    ((this.destroyed = !0), this.oHash.destroy(), this.iHash.destroy());
  }
}
var Oq = ($, J, q) => new Kq($, J).update(q).digest();
Oq.create = ($, J) => new Kq($, J);
function HU($, J, q, Q) {
  b8($);
  let Z = WY({ dkLen: 32, asyncTick: 10 }, Q),
    { c: Y, dkLen: X, asyncTick: U } = Z;
  if ((q$(Y), q$(X), q$(U), Y < 1)) throw Error("iterations (c) should be >= 1");
  let z = Wq(J),
    G = Wq(q),
    W = new Uint8Array(X),
    K = Oq.create($, z),
    O = K._cloneInto().update(G);
  return { c: Y, dkLen: X, asyncTick: U, DK: W, PRF: K, PRFSalt: O };
}
function gU($, J, q, Q, Z) {
  if (($.destroy(), J.destroy(), Q)) Q.destroy();
  return (g0(Z), q);
}
function KY($, J, q, Q) {
  let { c: Z, dkLen: Y, DK: X, PRF: U, PRFSalt: z } = HU($, J, q, Q),
    G,
    W = new Uint8Array(4),
    K = A$(W),
    O = new Uint8Array(U.outputLen);
  for (let R = 1, D = 0; D < Y; R++, D += U.outputLen) {
    let M = X.subarray(D, D + U.outputLen);
    (K.setInt32(0, R, !1),
      (G = z._cloneInto(G)).update(W).digestInto(O),
      M.set(O.subarray(0, M.length)));
    for (let H = 1; H < Z; H++) {
      U._cloneInto(G).update(O).digestInto(O);
      for (let C = 0; C < M.length; C++) M[C] ^= O[C];
    }
  }
  return gU(U, z, X, G, O);
}
function BU($, J, q, Q) {
  if (typeof $.setBigUint64 === "function") return $.setBigUint64(J, q, Q);
  let Z = BigInt(32),
    Y = BigInt(4294967295),
    X = Number((q >> Z) & Y),
    U = Number(q & Y),
    z = Q ? 4 : 0,
    G = Q ? 0 : 4;
  ($.setUint32(J + z, X, Q), $.setUint32(J + G, U, Q));
}
function OY($, J, q) {
  return ($ & J) ^ (~$ & q);
}
function DY($, J, q) {
  return ($ & J) ^ ($ & q) ^ (J & q);
}
class c8 extends _$ {
  constructor($, J, q, Q) {
    super();
    ((this.finished = !1),
      (this.length = 0),
      (this.pos = 0),
      (this.destroyed = !1),
      (this.blockLen = $),
      (this.outputLen = J),
      (this.padOffset = q),
      (this.isLE = Q),
      (this.buffer = new Uint8Array($)),
      (this.view = A$(this.buffer)));
  }
  update($) {
    (v$(this), ($ = Q8($)), y0($));
    let { view: J, buffer: q, blockLen: Q } = this,
      Z = $.length;
    for (let Y = 0; Y < Z;) {
      let X = Math.min(Q - this.pos, Z - Y);
      if (X === Q) {
        let U = A$($);
        for (; Q <= Z - Y; Y += Q) this.process(U, Y);
        continue;
      }
      if ((q.set($.subarray(Y, Y + X), this.pos), (this.pos += X), (Y += X), this.pos === Q))
        (this.process(J, 0), (this.pos = 0));
    }
    return ((this.length += $.length), this.roundClean(), this);
  }
  digestInto($) {
    (v$(this), UY($, this), (this.finished = !0));
    let { buffer: J, view: q, blockLen: Q, isLE: Z } = this,
      { pos: Y } = this;
    if (((J[Y++] = 128), g0(this.buffer.subarray(Y)), this.padOffset > Q - Y))
      (this.process(q, 0), (Y = 0));
    for (let W = Y; W < Q; W++) J[W] = 0;
    (BU(q, Q - 8, BigInt(this.length * 8), Z), this.process(q, 0));
    let X = A$($),
      U = this.outputLen;
    if (U % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
    let z = U / 4,
      G = this.get();
    if (z > G.length) throw Error("_sha2: outputLen bigger than state");
    for (let W = 0; W < z; W++) X.setUint32(4 * W, G[W], Z);
  }
  digest() {
    let { buffer: $, outputLen: J } = this;
    this.digestInto($);
    let q = $.slice(0, J);
    return (this.destroy(), q);
  }
  _cloneInto($) {
    ($ || ($ = new this.constructor()), $.set(...this.get()));
    let { blockLen: J, buffer: q, length: Q, finished: Z, destroyed: Y, pos: X } = this;
    if ((($.destroyed = Y), ($.finished = Z), ($.length = Q), ($.pos = X), Q % J)) $.buffer.set(q);
    return $;
  }
  clone() {
    return this._cloneInto();
  }
}
var u0 = Uint32Array.from([
  1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225,
]);
var e = Uint32Array.from([
  1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129,
  1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209,
]);
var p8 = BigInt(4294967295),
  NY = BigInt(32);
function CU($, J = !1) {
  if (J) return { h: Number($ & p8), l: Number(($ >> NY) & p8) };
  return { h: Number(($ >> NY) & p8) | 0, l: Number($ & p8) | 0 };
}
function RY($, J = !1) {
  let q = $.length,
    Q = new Uint32Array(q),
    Z = new Uint32Array(q);
  for (let Y = 0; Y < q; Y++) {
    let { h: X, l: U } = CU($[Y], J);
    [Q[Y], Z[Y]] = [X, U];
  }
  return [Q, Z];
}
var Dq = ($, J, q) => $ >>> q,
  Nq = ($, J, q) => ($ << (32 - q)) | (J >>> q),
  T$ = ($, J, q) => ($ >>> q) | (J << (32 - q)),
  E$ = ($, J, q) => ($ << (32 - q)) | (J >>> q),
  Z8 = ($, J, q) => ($ << (64 - q)) | (J >>> (q - 32)),
  Y8 = ($, J, q) => ($ >>> (q - 32)) | (J << (64 - q));
function v0($, J, q, Q) {
  let Z = (J >>> 0) + (Q >>> 0);
  return { h: ($ + q + ((Z / 4294967296) | 0)) | 0, l: Z | 0 };
}
var VY = ($, J, q) => ($ >>> 0) + (J >>> 0) + (q >>> 0),
  jY = ($, J, q, Q) => (J + q + Q + (($ / 4294967296) | 0)) | 0,
  MY = ($, J, q, Q) => ($ >>> 0) + (J >>> 0) + (q >>> 0) + (Q >>> 0),
  FY = ($, J, q, Q, Z) => (J + q + Q + Z + (($ / 4294967296) | 0)) | 0,
  wY = ($, J, q, Q, Z) => ($ >>> 0) + (J >>> 0) + (q >>> 0) + (Q >>> 0) + (Z >>> 0),
  IY = ($, J, q, Q, Z, Y) => (J + q + Q + Z + Y + (($ / 4294967296) | 0)) | 0;
var SU = Uint32Array.from([
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
    3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
    3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
    666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
    2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
    1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
  ]),
  Q$ = new Uint32Array(64);
class PY extends c8 {
  constructor($ = 32) {
    super(64, $, 8, !1);
    ((this.A = u0[0] | 0),
      (this.B = u0[1] | 0),
      (this.C = u0[2] | 0),
      (this.D = u0[3] | 0),
      (this.E = u0[4] | 0),
      (this.F = u0[5] | 0),
      (this.G = u0[6] | 0),
      (this.H = u0[7] | 0));
  }
  get() {
    let { A: $, B: J, C: q, D: Q, E: Z, F: Y, G: X, H: U } = this;
    return [$, J, q, Q, Z, Y, X, U];
  }
  set($, J, q, Q, Z, Y, X, U) {
    ((this.A = $ | 0),
      (this.B = J | 0),
      (this.C = q | 0),
      (this.D = Q | 0),
      (this.E = Z | 0),
      (this.F = Y | 0),
      (this.G = X | 0),
      (this.H = U | 0));
  }
  process($, J) {
    for (let W = 0; W < 16; W++, J += 4) Q$[W] = $.getUint32(J, !1);
    for (let W = 16; W < 64; W++) {
      let K = Q$[W - 15],
        O = Q$[W - 2],
        R = B0(K, 7) ^ B0(K, 18) ^ (K >>> 3),
        D = B0(O, 17) ^ B0(O, 19) ^ (O >>> 10);
      Q$[W] = (D + Q$[W - 7] + R + Q$[W - 16]) | 0;
    }
    let { A: q, B: Q, C: Z, D: Y, E: X, F: U, G: z, H: G } = this;
    for (let W = 0; W < 64; W++) {
      let K = B0(X, 6) ^ B0(X, 11) ^ B0(X, 25),
        O = (G + K + OY(X, U, z) + SU[W] + Q$[W]) | 0,
        D = ((B0(q, 2) ^ B0(q, 13) ^ B0(q, 22)) + DY(q, Q, Z)) | 0;
      ((G = z), (z = U), (U = X), (X = (Y + O) | 0), (Y = Z), (Z = Q), (Q = q), (q = (O + D) | 0));
    }
    ((q = (q + this.A) | 0),
      (Q = (Q + this.B) | 0),
      (Z = (Z + this.C) | 0),
      (Y = (Y + this.D) | 0),
      (X = (X + this.E) | 0),
      (U = (U + this.F) | 0),
      (z = (z + this.G) | 0),
      (G = (G + this.H) | 0),
      this.set(q, Q, Z, Y, X, U, z, G));
  }
  roundClean() {
    g0(Q$);
  }
  destroy() {
    (this.set(0, 0, 0, 0, 0, 0, 0, 0), g0(this.buffer));
  }
}
var TY = (() =>
    RY(
      [
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817",
      ].map(($) => BigInt($)),
    ))(),
  fU = (() => TY[0])(),
  xU = (() => TY[1])(),
  Z$ = new Uint32Array(80),
  Y$ = new Uint32Array(80);
class EY extends c8 {
  constructor($ = 64) {
    super(128, $, 16, !1);
    ((this.Ah = e[0] | 0),
      (this.Al = e[1] | 0),
      (this.Bh = e[2] | 0),
      (this.Bl = e[3] | 0),
      (this.Ch = e[4] | 0),
      (this.Cl = e[5] | 0),
      (this.Dh = e[6] | 0),
      (this.Dl = e[7] | 0),
      (this.Eh = e[8] | 0),
      (this.El = e[9] | 0),
      (this.Fh = e[10] | 0),
      (this.Fl = e[11] | 0),
      (this.Gh = e[12] | 0),
      (this.Gl = e[13] | 0),
      (this.Hh = e[14] | 0),
      (this.Hl = e[15] | 0));
  }
  get() {
    let {
      Ah: $,
      Al: J,
      Bh: q,
      Bl: Q,
      Ch: Z,
      Cl: Y,
      Dh: X,
      Dl: U,
      Eh: z,
      El: G,
      Fh: W,
      Fl: K,
      Gh: O,
      Gl: R,
      Hh: D,
      Hl: M,
    } = this;
    return [$, J, q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M];
  }
  set($, J, q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M) {
    ((this.Ah = $ | 0),
      (this.Al = J | 0),
      (this.Bh = q | 0),
      (this.Bl = Q | 0),
      (this.Ch = Z | 0),
      (this.Cl = Y | 0),
      (this.Dh = X | 0),
      (this.Dl = U | 0),
      (this.Eh = z | 0),
      (this.El = G | 0),
      (this.Fh = W | 0),
      (this.Fl = K | 0),
      (this.Gh = O | 0),
      (this.Gl = R | 0),
      (this.Hh = D | 0),
      (this.Hl = M | 0));
  }
  process($, J) {
    for (let V = 0; V < 16; V++, J += 4)
      ((Z$[V] = $.getUint32(J)), (Y$[V] = $.getUint32((J += 4))));
    for (let V = 16; V < 80; V++) {
      let N = Z$[V - 15] | 0,
        F = Y$[V - 15] | 0,
        E = T$(N, F, 1) ^ T$(N, F, 8) ^ Dq(N, F, 7),
        x = E$(N, F, 1) ^ E$(N, F, 8) ^ Nq(N, F, 7),
        L = Z$[V - 2] | 0,
        S = Y$[V - 2] | 0,
        h = T$(L, S, 19) ^ Z8(L, S, 61) ^ Dq(L, S, 6),
        d = E$(L, S, 19) ^ Y8(L, S, 61) ^ Nq(L, S, 6),
        u = MY(x, d, Y$[V - 7], Y$[V - 16]),
        $0 = FY(u, E, h, Z$[V - 7], Z$[V - 16]);
      ((Z$[V] = $0 | 0), (Y$[V] = u | 0));
    }
    let {
      Ah: q,
      Al: Q,
      Bh: Z,
      Bl: Y,
      Ch: X,
      Cl: U,
      Dh: z,
      Dl: G,
      Eh: W,
      El: K,
      Fh: O,
      Fl: R,
      Gh: D,
      Gl: M,
      Hh: H,
      Hl: C,
    } = this;
    for (let V = 0; V < 80; V++) {
      let N = T$(W, K, 14) ^ T$(W, K, 18) ^ Z8(W, K, 41),
        F = E$(W, K, 14) ^ E$(W, K, 18) ^ Y8(W, K, 41),
        E = (W & O) ^ (~W & D),
        x = (K & R) ^ (~K & M),
        L = wY(C, F, x, xU[V], Y$[V]),
        S = IY(L, H, N, E, fU[V], Z$[V]),
        h = L | 0,
        d = T$(q, Q, 28) ^ Z8(q, Q, 34) ^ Z8(q, Q, 39),
        u = E$(q, Q, 28) ^ Y8(q, Q, 34) ^ Y8(q, Q, 39),
        $0 = (q & Z) ^ (q & X) ^ (Z & X),
        b0 = (Q & Y) ^ (Q & U) ^ (Y & U);
      ((H = D | 0),
        (C = M | 0),
        (D = O | 0),
        (M = R | 0),
        (O = W | 0),
        (R = K | 0),
        ({ h: W, l: K } = v0(z | 0, G | 0, S | 0, h | 0)),
        (z = X | 0),
        (G = U | 0),
        (X = Z | 0),
        (U = Y | 0),
        (Z = q | 0),
        (Y = Q | 0));
      let C0 = VY(h, u, b0);
      ((q = jY(C0, S, d, $0)), (Q = C0 | 0));
    }
    (({ h: q, l: Q } = v0(this.Ah | 0, this.Al | 0, q | 0, Q | 0)),
      ({ h: Z, l: Y } = v0(this.Bh | 0, this.Bl | 0, Z | 0, Y | 0)),
      ({ h: X, l: U } = v0(this.Ch | 0, this.Cl | 0, X | 0, U | 0)),
      ({ h: z, l: G } = v0(this.Dh | 0, this.Dl | 0, z | 0, G | 0)),
      ({ h: W, l: K } = v0(this.Eh | 0, this.El | 0, W | 0, K | 0)),
      ({ h: O, l: R } = v0(this.Fh | 0, this.Fl | 0, O | 0, R | 0)),
      ({ h: D, l: M } = v0(this.Gh | 0, this.Gl | 0, D | 0, M | 0)),
      ({ h: H, l: C } = v0(this.Hh | 0, this.Hl | 0, H | 0, C | 0)),
      this.set(q, Q, Z, Y, X, U, z, G, W, K, O, R, D, M, H, C));
  }
  roundClean() {
    g0(Z$, Y$);
  }
  destroy() {
    (g0(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
  }
}
var kY = Gq(() => new PY());
var HY = Gq(() => new EY());
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */ function y$($) {
  return $ instanceof Uint8Array || (ArrayBuffer.isView($) && $.constructor.name === "Uint8Array");
}
function jq($, ...J) {
  if (!y$($)) throw Error("Uint8Array expected");
  if (J.length > 0 && !J.includes($.length))
    throw Error("Uint8Array expected of length " + J + ", got length=" + $.length);
}
function LY($, J) {
  if (!Array.isArray(J)) return !1;
  if (J.length === 0) return !0;
  if ($) return J.every((q) => typeof q === "string");
  else return J.every((q) => Number.isSafeInteger(q));
}
function Mq($) {
  if (typeof $ !== "function") throw Error("function expected");
  return !0;
}
function X$($, J) {
  if (typeof J !== "string") throw Error(`${$}: string expected`);
  return !0;
}
function u$($) {
  if (!Number.isSafeInteger($)) throw Error(`invalid integer: ${$}`);
}
function d8($) {
  if (!Array.isArray($)) throw Error("array expected");
}
function l8($, J) {
  if (!LY(!0, J)) throw Error(`${$}: array of strings expected`);
}
function Fq($, J) {
  if (!LY(!1, J)) throw Error(`${$}: array of numbers expected`);
}
function G0(...$) {
  let J = (Y) => Y,
    q = (Y, X) => (U) => Y(X(U)),
    Q = $.map((Y) => Y.encode).reduceRight(q, J),
    Z = $.map((Y) => Y.decode).reduce(q, J);
  return { encode: Q, decode: Z };
}
function K0($) {
  let J = typeof $ === "string" ? $.split("") : $,
    q = J.length;
  l8("alphabet", J);
  let Q = new Map(J.map((Z, Y) => [Z, Y]));
  return {
    encode: (Z) => {
      return (
        d8(Z),
        Z.map((Y) => {
          if (!Number.isSafeInteger(Y) || Y < 0 || Y >= q)
            throw Error(`alphabet.encode: digit index outside alphabet "${Y}". Allowed: ${$}`);
          return J[Y];
        })
      );
    },
    decode: (Z) => {
      return (
        d8(Z),
        Z.map((Y) => {
          X$("alphabet.decode", Y);
          let X = Q.get(Y);
          if (X === void 0) throw Error(`Unknown letter: "${Y}". Allowed: ${$}`);
          return X;
        })
      );
    },
  };
}
function O0($ = "") {
  return (
    X$("join", $),
    {
      encode: (J) => {
        return (l8("join.decode", J), J.join($));
      },
      decode: (J) => {
        return (X$("join.decode", J), J.split($));
      },
    }
  );
}
function U8($, J = "=") {
  return (
    u$($),
    X$("padding", J),
    {
      encode(q) {
        l8("padding.encode", q);
        while ((q.length * $) % 8) q.push(J);
        return q;
      },
      decode(q) {
        l8("padding.decode", q);
        let Q = q.length;
        if ((Q * $) % 8) throw Error("padding: invalid, string should have whole number of bytes");
        for (; Q > 0 && q[Q - 1] === J; Q--)
          if (((Q - 1) * $) % 8 === 0) throw Error("padding: invalid, string has too much padding");
        return q.slice(0, Q);
      },
    }
  );
}
function SY($) {
  return (Mq($), { encode: (J) => J, decode: (J) => $(J) });
}
function Rq($, J, q) {
  if (J < 2) throw Error(`convertRadix: invalid from=${J}, base cannot be less than 2`);
  if (q < 2) throw Error(`convertRadix: invalid to=${q}, base cannot be less than 2`);
  if ((d8($), !$.length)) return [];
  let Q = 0,
    Z = [],
    Y = Array.from($, (U) => {
      if ((u$(U), U < 0 || U >= J)) throw Error(`invalid integer: ${U}`);
      return U;
    }),
    X = Y.length;
  while (!0) {
    let U = 0,
      z = !0;
    for (let G = Q; G < X; G++) {
      let W = Y[G],
        K = J * U,
        O = K + W;
      if (!Number.isSafeInteger(O) || K / J !== U || O - W !== K)
        throw Error("convertRadix: carry overflow");
      let R = O / q;
      U = O % q;
      let D = Math.floor(R);
      if (((Y[G] = D), !Number.isSafeInteger(D) || D * q + U !== O))
        throw Error("convertRadix: carry overflow");
      if (!z) continue;
      else if (!D) Q = G;
      else z = !1;
    }
    if ((Z.push(U), z)) break;
  }
  for (let U = 0; U < $.length - 1 && $[U] === 0; U++) Z.push(0);
  return Z.reverse();
}
var fY = ($, J) => (J === 0 ? $ : fY(J, $ % J)),
  n8 = ($, J) => $ + (J - fY($, J)),
  h8 = (() => {
    let $ = [];
    for (let J = 0; J < 40; J++) $.push(2 ** J);
    return $;
  })();
function i8($, J, q, Q) {
  if ((d8($), J <= 0 || J > 32)) throw Error(`convertRadix2: wrong from=${J}`);
  if (q <= 0 || q > 32) throw Error(`convertRadix2: wrong to=${q}`);
  if (n8(J, q) > 32)
    throw Error(`convertRadix2: carry overflow from=${J} to=${q} carryBits=${n8(J, q)}`);
  let Z = 0,
    Y = 0,
    X = h8[J],
    U = h8[q] - 1,
    z = [];
  for (let G of $) {
    if ((u$(G), G >= X)) throw Error(`convertRadix2: invalid data word=${G} from=${J}`);
    if (((Z = (Z << J) | G), Y + J > 32))
      throw Error(`convertRadix2: carry overflow pos=${Y} from=${J}`);
    Y += J;
    for (; Y >= q; Y -= q) z.push(((Z >> (Y - q)) & U) >>> 0);
    let W = h8[Y];
    if (W === void 0) throw Error("invalid carry");
    Z &= W - 1;
  }
  if (((Z = (Z << (q - Y)) & U), !Q && Y >= J)) throw Error("Excess padding");
  if (!Q && Z > 0) throw Error(`Non-zero padding: ${Z}`);
  if (Q && Y > 0) z.push(Z >>> 0);
  return z;
}
function xY($) {
  u$($);
  let J = 256;
  return {
    encode: (q) => {
      if (!y$(q)) throw Error("radix.encode input should be Uint8Array");
      return Rq(Array.from(q), J, $);
    },
    decode: (q) => {
      return (Fq("radix.decode", q), Uint8Array.from(Rq(q, $, J)));
    },
  };
}
function j0($, J = !1) {
  if ((u$($), $ <= 0 || $ > 32)) throw Error("radix2: bits should be in (0..32]");
  if (n8(8, $) > 32 || n8($, 8) > 32) throw Error("radix2: carry overflow");
  return {
    encode: (q) => {
      if (!y$(q)) throw Error("radix2.encode input should be Uint8Array");
      return i8(Array.from(q), 8, $, !J);
    },
    decode: (q) => {
      return (Fq("radix2.decode", q), Uint8Array.from(i8(q, $, 8, J)));
    },
  };
}
function gY($) {
  return (
    Mq($),
    function (...J) {
      try {
        return $.apply(null, J);
      } catch (q) {}
    }
  );
}
function vU($, J) {
  return (
    u$($),
    Mq(J),
    {
      encode(q) {
        if (!y$(q)) throw Error("checksum.encode: input should be Uint8Array");
        let Q = J(q).slice(0, $),
          Z = new Uint8Array(q.length + $);
        return (Z.set(q), Z.set(Q, q.length), Z);
      },
      decode(q) {
        if (!y$(q)) throw Error("checksum.decode: input should be Uint8Array");
        let Q = q.slice(0, -$),
          Z = q.slice(-$),
          Y = J(Q).slice(0, $);
        for (let X = 0; X < $; X++) if (Y[X] !== Z[X]) throw Error("Invalid checksum");
        return Q;
      },
    }
  );
}
var z8 = {
    alphabet: K0,
    chain: G0,
    checksum: vU,
    convertRadix: Rq,
    convertRadix2: i8,
    radix: xY,
    radix2: j0,
    join: O0,
    padding: U8,
  },
  A5 = G0(j0(4), K0("0123456789ABCDEF"), O0("")),
  _5 = G0(j0(5), K0("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), U8(5), O0("")),
  y5 = G0(j0(5), K0("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), O0("")),
  u5 = G0(j0(5), K0("0123456789ABCDEFGHIJKLMNOPQRSTUV"), U8(5), O0("")),
  m5 = G0(j0(5), K0("0123456789ABCDEFGHIJKLMNOPQRSTUV"), O0("")),
  b5 = G0(
    j0(5),
    K0("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),
    O0(""),
    SY(($) => $.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")),
  ),
  vY = (() =>
    typeof Uint8Array.from([]).toBase64 === "function" &&
    typeof Uint8Array.fromBase64 === "function")(),
  AY = ($, J) => {
    X$("base64", $);
    let q = J ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/,
      Q = J ? "base64url" : "base64";
    if ($.length > 0 && !q.test($)) throw Error("invalid base64");
    return Uint8Array.fromBase64($, { alphabet: Q, lastChunkHandling: "strict" });
  },
  c5 = vY
    ? {
        encode($) {
          return (jq($), $.toBase64());
        },
        decode($) {
          return AY($, !1);
        },
      }
    : G0(
        j0(6),
        K0("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
        U8(6),
        O0(""),
      ),
  p5 = G0(j0(6), K0("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), O0("")),
  h5 = vY
    ? {
        encode($) {
          return (jq($), $.toBase64({ alphabet: "base64url" }));
        },
        decode($) {
          return AY($, !0);
        },
      }
    : G0(
        j0(6),
        K0("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
        U8(6),
        O0(""),
      ),
  d5 = G0(j0(6), K0("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), O0("")),
  wq = ($) => G0(xY(58), K0($), O0("")),
  l5 = wq("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),
  n5 = wq("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),
  i5 = wq("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var Vq = G0(K0("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), O0("")),
  BY = [996825010, 642813549, 513874426, 1027748829, 705979059];
function X8($) {
  let J = $ >> 25,
    q = ($ & 33554431) << 5;
  for (let Q = 0; Q < BY.length; Q++) if (((J >> Q) & 1) === 1) q ^= BY[Q];
  return q;
}
function CY($, J, q = 1) {
  let Q = $.length,
    Z = 1;
  for (let Y = 0; Y < Q; Y++) {
    let X = $.charCodeAt(Y);
    if (X < 33 || X > 126) throw Error(`Invalid prefix (${$})`);
    Z = X8(Z) ^ (X >> 5);
  }
  Z = X8(Z);
  for (let Y = 0; Y < Q; Y++) Z = X8(Z) ^ ($.charCodeAt(Y) & 31);
  for (let Y of J) Z = X8(Z) ^ Y;
  for (let Y = 0; Y < 6; Y++) Z = X8(Z);
  return ((Z ^= q), Vq.encode(i8([Z % h8[30]], 30, 5, !1)));
}
function _Y($) {
  let J = $ === "bech32" ? 1 : 734539939,
    q = j0(5),
    Q = q.decode,
    Z = q.encode,
    Y = gY(Q);
  function X(K, O, R = 90) {
    if ((X$("bech32.encode prefix", K), y$(O))) O = Array.from(O);
    Fq("bech32.encode", O);
    let D = K.length;
    if (D === 0) throw TypeError(`Invalid prefix length ${D}`);
    let M = D + 7 + O.length;
    if (R !== !1 && M > R) throw TypeError(`Length ${M} exceeds limit ${R}`);
    let H = K.toLowerCase(),
      C = CY(H, O, J);
    return `${H}1${Vq.encode(O)}${C}`;
  }
  function U(K, O = 90) {
    X$("bech32.decode input", K);
    let R = K.length;
    if (R < 8 || (O !== !1 && R > O))
      throw TypeError(`invalid string length: ${R} (${K}). Expected (8..${O})`);
    let D = K.toLowerCase();
    if (K !== D && K !== K.toUpperCase()) throw Error("String must be lowercase or uppercase");
    let M = D.lastIndexOf("1");
    if (M === 0 || M === -1) throw Error('Letter "1" must be present between prefix and data only');
    let H = D.slice(0, M),
      C = D.slice(M + 1);
    if (C.length < 6) throw Error("Data must be at least 6 characters long");
    let V = Vq.decode(C).slice(0, -6),
      N = CY(H, V, J);
    if (!C.endsWith(N)) throw Error(`Invalid checksum in ${K}: expected "${N}"`);
    return { prefix: H, words: V };
  }
  let z = gY(U);
  function G(K) {
    let { prefix: O, words: R } = U(K, !1);
    return { prefix: O, words: R, bytes: Q(R) };
  }
  function W(K, O) {
    return X(K, Z(O));
  }
  return {
    encode: X,
    decode: U,
    encodeFromBytes: W,
    decodeToBytes: G,
    decodeUnsafe: z,
    fromWords: Q,
    fromWordsUnsafe: Y,
    toWords: Z,
  };
}
var r5 = _Y("bech32"),
  o5 = _Y("bech32m");
var AU = (() =>
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")(),
  _U = {
    encode($) {
      return (jq($), $.toHex());
    },
    decode($) {
      return (X$("hex", $), Uint8Array.fromHex($));
    },
  },
  a5 = AU
    ? _U
    : G0(
        j0(4),
        K0("0123456789abcdef"),
        O0(""),
        SY(($) => {
          if (typeof $ !== "string" || $.length % 2 !== 0)
            throw TypeError(`hex.decode: expected string, got ${typeof $} with length ${$.length}`);
          return $.toLowerCase();
        }),
      );
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */ var yU = (
  $,
) => $[0] === "あいこくしん";
function yY($) {
  if (typeof $ !== "string") throw TypeError("invalid mnemonic type: " + typeof $);
  return $.normalize("NFKD");
}
function uY($) {
  let J = yY($),
    q = J.split(" ");
  if (![12, 15, 18, 21, 24].includes(q.length)) throw Error("Invalid mnemonic");
  return { nfkd: J, words: q };
}
function mY($) {
  y0($, 16, 20, 24, 28, 32);
}
function bY($, J = 128) {
  if ((q$(J), J % 32 !== 0 || J > 256)) throw TypeError("Invalid entropy");
  return bU(GY(J / 8), $);
}
var uU = ($) => {
  let J = 8 - $.length / 4;
  return new Uint8Array([(kY($)[0] >> J) << J]);
};
function cY($) {
  if (!Array.isArray($) || $.length !== 2048 || typeof $[0] !== "string")
    throw Error("Wordlist: expected array of 2048 strings");
  return (
    $.forEach((J) => {
      if (typeof J !== "string") throw Error("wordlist: non-string element: " + J);
    }),
    z8.chain(z8.checksum(1, uU), z8.radix2(11, !0), z8.alphabet($))
  );
}
function mU($, J) {
  let { words: q } = uY($),
    Q = cY(J).decode(q);
  return (mY(Q), Q);
}
function bU($, J) {
  return (
    mY($),
    cY(J)
      .encode($)
      .join(yU(J) ? "　" : " ")
  );
}
function pY($, J) {
  try {
    mU($, J);
  } catch (q) {
    return !1;
  }
  return !0;
}
var cU = ($) => yY("mnemonic" + $);
function hY($, J = "") {
  return KY(HY, uY($).nfkd, cU(J), { c: 2048, dkLen: 64 });
}
var Iq = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
cJ.sha512 = zq;
var pU = 7777,
  r8 = 9,
  Pq = 10n ** BigInt(r8),
  A0 = 1000n,
  m$ = "inazkey1",
  lY = 26,
  nY = ($) => u8(u8($)).slice(0, 4);
function dY($) {
  let J = j$($.trim().replace(/^0x/, ""));
  if (J.length !== 32) throw Error("Master secret must be 32 bytes.");
  let q = new Uint8Array(33);
  ((q[0] = lY), q.set(J, 1));
  let Q = new Uint8Array(37);
  return (Q.set(q, 0), Q.set(nY(q), 33), m$ + m8.encode(Q));
}
function hU($) {
  let J = $.trim();
  if (!J.toLowerCase().startsWith(m$))
    throw Error(`Not an Inazuma key — it must start with "${m$}".`);
  let q;
  try {
    q = m8.decode(J.slice(m$.length));
  } catch {
    throw Error("Malformed Inazuma key.");
  }
  if (q.length !== 37) throw Error("Malformed Inazuma key (bad length).");
  let Q = q.slice(0, 33);
  if (z0(nY(Q)) !== z0(q.slice(33))) throw Error("Key checksum failed — check for a typo.");
  if (Q[0] !== lY) throw Error("Unsupported key version.");
  return z0(Q.slice(1));
}
var Tq = ($, J) => {
    let q = new Uint8Array($.length + J.length);
    return (q.set(new TextEncoder().encode($), 0), q.set(J, $.length), zq(q).slice(0, 32));
  },
  dU = "inazuma/v2/mnemonic",
  lU = () => bY(Iq, 256),
  nU = ($) => $.trim().split(/\s+/).length >= 12;
var iY = ($) => $.trim().toLowerCase().split(/\s+/).join(" ");
function iU($) {
  let J = iY($);
  if (!pY(J, Iq)) throw Error("Invalid recovery phrase — check the words and their order.");
  let q = hY(J, dU);
  return z0(Tq("inazuma/v2/master", q));
}
function Eq($, J) {
  let q = j$($);
  return J ? q : Tq("inazuma/v2/sig-ed25519", q);
}
function U$($) {
  let J = $.trim();
  if (nU(J)) {
    let Y = iY(J);
    return { ...U$(dY(iU(Y))), mnemonic: Y };
  }
  let q = !J.toLowerCase().startsWith(m$),
    Q = q ? J.replace(/^0x/, "").toLowerCase() : hU(J);
  if (!/^[0-9a-f]{64}$/.test(Q))
    throw Error(`Paste a 24-word recovery phrase or an Inazuma key (starts with "${m$}").`);
  let Z = DZ(Eq(Q, q));
  return { address: m8.encode(Z), pubkeyHex: z0(Z), secretHex: Q, key: q ? Q : dY(Q), legacy: q };
}
function kq() {
  return U$(lU());
}
function rY($) {
  let J = Tq("inazuma/v2/pq-mldsa65", j$($));
  return Uq.keygen(J);
}
function Hq($) {
  return z0(u8(rY($).publicKey).slice(0, 8));
}
var F0 = ($, J = 4) => {
  let q = $ < 0n,
    Q = q ? -$ : $,
    Z = Q / Pq,
    Y = (Q % Pq).toString().padStart(r8, "0").slice(0, J);
  return `${q ? "-" : ""}${Z.toLocaleString("en-US")}${J ? `.${Y}` : ""}`;
};
function oY($) {
  let [J, q = ""] = $.trim().split(".");
  if (!/^\d*$/.test(J ?? "") || !/^\d*$/.test(q)) throw Error("Invalid amount.");
  let Q = (q + "0".repeat(r8)).slice(0, r8);
  return BigInt(J || "0") * Pq + BigInt(Q || "0");
}
function rU($) {
  return new TextEncoder().encode(
    `inazuma-tx|${$.chainId}|${$.kind}|${$.fromPubkey}|${$.to}|${$.amount}|${$.fee}|${$.nonce}`,
  );
}
function aY($) {
  let J = U$($.secret),
    q = $.chainId ?? pU,
    Q = $.feeRai ?? A0,
    Z = rU({
      chainId: q,
      kind: "transfer",
      fromPubkey: J.pubkeyHex,
      to: $.to,
      amount: $.amountRai,
      fee: Q,
      nonce: $.nonce,
    }),
    Y = z0(bJ(Z, Eq(J.secretHex, J.legacy))),
    X = J.legacy ? null : rY(J.secretHex);
  return {
    kind: "transfer",
    from_pubkey: J.pubkeyHex,
    to: $.to,
    amount: Number($.amountRai),
    fee: Number(Q),
    nonce: $.nonce,
    chain_id: q,
    signature: Y,
    ...(X
      ? {
          pq_scheme: "ml-dsa-65",
          pq_pubkey: z0(X.publicKey),
          pq_signature: z0(Uq.sign(Z, X.secretKey)),
        }
      : {}),
  };
}
function tY($, J) {
  let q = U$($),
    Q = z0(bJ(new TextEncoder().encode(J), Eq(q.secretHex, q.legacy)));
  return { address: q.address, pubkeyHex: q.pubkeyHex, signature: Q };
}
var oU = 210000;
async function sY($, J) {
  let q = await crypto.subtle.importKey("raw", new TextEncoder().encode($), "PBKDF2", !1, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: J, iterations: oU, hash: "SHA-256" },
    q,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"],
  );
}
async function eY($, J) {
  let q = U$($),
    Q = crypto.getRandomValues(new Uint8Array(16)),
    Z = crypto.getRandomValues(new Uint8Array(12)),
    Y = await sY(J, Q),
    X = await crypto.subtle.encrypt({ name: "AES-GCM", iv: Z }, Y, new TextEncoder().encode(q.key));
  return { v: 1, address: q.address, salt: z0(Q), iv: z0(Z), data: z0(new Uint8Array(X)) };
}
async function gq($, J) {
  let q = await sY(J, j$($.salt));
  try {
    let Q = await crypto.subtle.decrypt({ name: "AES-GCM", iv: j$($.iv) }, q, j$($.data));
    return U$(new TextDecoder().decode(Q));
  } catch {
    throw Error("Wrong password.");
  }
}
var aU = "https://rpc.inazuma.network",
  Q1 = "https://inazuma.network",
  Sq = `${Q1}/explorer`,
  tU = `${Q1}/api/public/chain/txs`,
  sU = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  eU = 900000,
  a = document.getElementById("root"),
  b$ = document.getElementById("tabs"),
  Z1 = document.getElementById("hdrlock"),
  Bq = document.getElementById("hdracct"),
  i = [],
  X0 = 0,
  p = null,
  w0 = "wallet",
  I0 = 0n,
  z$ = !1,
  G$ = [],
  a8 = null,
  fq = () => i[X0]?.vault ?? null;
async function Cq($, J = {}) {
  let Q = await (
    await fetch(aU, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: $, params: J }),
    })
  ).json();
  if (Q.error) throw Error(Q.error.message ?? "RPC error");
  return Q.result;
}
var W$ = {
    async load() {
      let $ = await chrome.storage.local.get(["accounts", "active", "vault", "hidden"]);
      z$ = $.hidden === !0;
      let J = Array.isArray($.accounts) ? $.accounts : [];
      if (!J.length && $.vault)
        ((J = [{ label: "Account 1", vault: $.vault }]),
          await chrome.storage.local.set({ accounts: J, active: 0 }));
      let q = Math.min(Number($.active ?? 0), Math.max(0, J.length - 1));
      return { accounts: J, active: q };
    },
    save: () => chrome.storage.local.set({ accounts: i, active: X0 }),
    clearAll: () =>
      chrome.storage.local.remove([
        "vault",
        "accounts",
        "active",
        "sites",
        "cacheAddr",
        "cacheBal",
        "cacheTxs",
      ]),
    async sites() {
      let $ = await chrome.storage.local.get("sites");
      return Array.isArray($.sites) ? $.sites : [];
    },
    setSites: ($) => chrome.storage.local.set({ sites: $ }),
  },
  k = ($) => document.getElementById($),
  D0 = ($, J = 6) => ($.length > J * 2 + 2 ? `${$.slice(0, J)}…${$.slice(-J)}` : $),
  o = ($) => $.replace(/[<>&"]/g, (J) => `&#${J.charCodeAt(0)};`);
function P0($, J) {
  let q = document.getElementById("msg");
  if (q) ((q.className = `msg ${J}`), (q.textContent = $));
}
function t8($, J, q = "Copy") {
  return `<button class="iconbtn" id="${$}" data-copy="${o(J)}" title="${q}">&#9106;</button>`;
}
function c$() {
  a.querySelectorAll("[data-copy]").forEach(($) => {
    $.onclick = () => {
      navigator.clipboard.writeText($.dataset.copy ?? "");
      let J = $.innerHTML;
      (($.innerHTML = "&#10003;"),
        window.setTimeout(() => ($.innerHTML = J), 1100),
        P0("Copied to clipboard", "ok"));
    };
  });
}
function Lq($, J) {
  return `<div class="reveal" id="${$}">
      <div class="secret">${J}</div>
      <div class="eye" data-reveal="${$}">&#9673; Tap to reveal</div>
    </div>`;
}
function Y1() {
  a.querySelectorAll("[data-reveal]").forEach(($) => {
    $.onclick = () => {
      let q = k($.dataset.reveal).classList.toggle("shown");
      $.innerHTML = q ? "&#9678; Hide" : "&#9673; Tap to reveal";
    };
  });
}
function X1($) {
  return `<div class="words">${$.split(/\s+/)
    .map((J, q) => `<span><i>${q + 1}</i>${J}</span>`)
    .join("")}</div>`;
}
function xq() {
  if (a8 !== null) window.clearInterval(a8);
  a8 = null;
}
function U1() {
  ((p = null), xq());
  let $ = fq();
  if ($) W8($);
}
Z1.onclick = U1;
Bq.onclick = () => void vq();
b$.querySelectorAll("button[data-tab]").forEach(($) => {
  $.onclick = () => {
    ((w0 = $.dataset.tab), T0());
  };
});
function m0($) {
  if (
    (b$.classList.toggle("on", $),
    (Z1.style.display = $ ? "grid" : "none"),
    (Bq.style.display = $ ? "flex" : "none"),
    $ && p)
  )
    Bq.innerHTML = `<b>${o(i[X0]?.label ?? "Account")}</b><span>${D0(p.address, 4)}</span>`;
  b$.querySelectorAll("button[data-tab]").forEach((J) =>
    J.classList.toggle("active", J.dataset.tab === w0),
  );
}
function s8() {
  (m0(!1),
    (a.innerHTML = `
    <div class="card hero center">
      <img class="logo-lg" src="icon128.png" alt="Inazuma" />
      <h1 class="title">Your Inazuma wallet</h1>
      <p>Self-custody on a sovereign L1. 400ms blocks, ed25519 keys with a
         quantum-resistant ML-DSA co-signer, encrypted on this device.</p>
      <button id="new">Create a new wallet</button>
      <button id="imp" class="ghost">I already have a wallet</button>
    </div>
    <div class="card">
      <div class="kv"><span class="muted">Keys stored</span><span>On this device only</span></div>
      <div class="kv"><span class="muted">Encryption</span><span>AES-256-GCM</span></div>
      <div class="kv"><span class="muted">Recovery</span><span>24 words</span></div>
    </div>
    <div id="msg"></div>`),
    (k("new").onclick = () => G1(kq())),
    (k("imp").onclick = () => K1()));
}
function z1() {
  return `<label>Password</label>
    <input id="pw" type="password" placeholder="At least 8 characters" />
    <label>Confirm password</label>
    <input id="pw2" type="password" placeholder="Repeat password" />`;
}
async function W1($, J) {
  let q = k("pw").value,
    Q = k("pw2").value;
  if (q.length < 8) throw Error("Use at least 8 characters.");
  if (q !== Q) throw Error("Passwords do not match.");
  let Z = await eY($, q);
  if (i.some((Y) => Y.vault.address === Z.address))
    throw Error("That wallet is already in this browser.");
  ((i = [...i, { label: J ?? `Account ${i.length + 1}`, vault: Z }]),
    (X0 = i.length - 1),
    await W$.save(),
    (p = U$($)),
    (I0 = 0n),
    (G$ = []),
    (w0 = "wallet"),
    await T0());
}
function G1($) {
  (m0(!1),
    (a.innerHTML = `
    <div class="card">
      <h2>Back up your phrase</h2>
      <p>Write these 24 words down offline. Anyone who sees them owns your funds —
         Inazuma cannot restore them for you.</p>
      ${Lq("seed", $.mnemonic ? X1($.mnemonic) : o($.key))}
      <div class="row" style="margin-top:10px">
        <button class="ghost" data-copy="${o($.mnemonic ?? $.key)}">Copy phrase</button>
      </div>
      <div class="kv"><span class="muted">Address</span><span>${D0($.address)}</span></div>
      <div class="kv"><span class="muted">PQ fingerprint</span><span class="sig">${Hq($.secretHex)}</span></div>
    </div>
    <div class="card">
      <h2>Set a password</h2>
      <p>Unlocks this account on this browser. It never leaves your device.</p>
      ${z1()}
      <button id="save">Saved it — continue</button>
      <button id="back" class="ghost">Cancel</button>
      <div id="msg"></div>
    </div>`),
    Y1(),
    c$(),
    (k("save").onclick = () => W1($.mnemonic ?? $.key).catch((J) => P0(J.message, "err"))),
    (k("back").onclick = () => (i.length ? void T0() : s8())));
}
function K1() {
  (m0(!1),
    (a.innerHTML = `
    <div class="card">
      <h2>Import wallet</h2>
      <p>Paste your 24-word recovery phrase or an <span class="sig">inazkey1…</span> key.</p>
      <textarea id="sk" rows="3" placeholder="word word word …  or  inazkey1…" spellcheck="false"></textarea>
      ${z1()}
      <button id="save">Import wallet</button>
      <button id="back" class="ghost">Cancel</button>
      <div id="msg"></div>
    </div>`),
    (k("save").onclick = () => W1(k("sk").value.trim()).catch(($) => P0($.message, "err"))),
    (k("back").onclick = () => (i.length ? void T0() : s8())));
}
function W8($) {
  (m0(!1),
    (a.innerHTML = `
    <div class="card hero center">
      <img class="logo-lg" src="icon128.png" alt="Inazuma" />
      <h1 class="title">Welcome back</h1>
      <p class="mono">${o(i[X0]?.label ?? "Account")} · ${D0($.address, 6)}</p>
      <input id="pw" type="password" placeholder="Password" />
      <button id="open">Unlock</button>
      ${i.length > 1 ? '<button id="switch" class="ghost">Switch account</button>' : ""}
      <div id="msg"></div>
    </div>`));
  let J = async () => {
    ((p = await gq($, k("pw").value)),
      (w0 = "wallet"),
      await chrome.storage.local.set({ lastActive: Date.now() }),
      await G8());
  };
  ((k("open").onclick = () => J().catch((Q) => P0(Q.message, "err"))),
    (k("pw").onkeydown = (Q) => {
      if (Q.key === "Enter") J().catch((Z) => P0(Z.message, "err"));
    }),
    k("pw").focus());
  let q = document.getElementById("switch");
  if (q) q.onclick = () => void vq();
}
async function vq() {
  (m0(!1),
    (a.innerHTML = `
    <div class="card">
      <h2>Accounts</h2>
      <p>Each account has its own keys and password. Switching never touches the others.</p>
      <ul id="list">
        ${i
          .map(
            (J, q) => `<li class="acct${q === X0 ? " on" : ""}" data-pick="${q}">
              <span class="av">${o((J.label[0] ?? "A").toUpperCase())}</span>
              <span class="txmeta"><b>${o(J.label)}</b><span class="sub muted">${D0(J.vault.address, 6)}</span></span>
              <span class="sig">${q === X0 ? "&#10003;" : ""}</span>
            </li>`,
          )
          .join("")}
      </ul>
    </div>
    <div class="card">
      <button id="add">Create new account</button>
      <button id="imp" class="ghost">Import existing</button>
      ${p ? '<button id="back" class="ghost">Back to wallet</button>' : ""}
      <div id="msg"></div>
    </div>`),
    a.querySelectorAll("[data-pick]").forEach((J) => {
      J.onclick = async () => {
        let q = Number(J.dataset.pick);
        if (q === X0 && p) {
          await T0();
          return;
        }
        ((X0 = q), (p = null), (I0 = 0n), (G$ = []), await W$.save(), W8(i[q].vault));
      };
    }),
    (k("add").onclick = () => G1(kq())),
    (k("imp").onclick = () => K1()));
  let $ = document.getElementById("back");
  if ($) $.onclick = () => void T0();
}
function $z($) {
  (m0(!1),
    (a.innerHTML = `
    <div class="card hero">
      <h2>Connect request</h2>
      <p>This site is asking to see your Inazuma address.</p>
      <div class="kv"><span class="muted">Site</span><span>${o($.origin.replace(/^https?:\/\//, ""))}</span></div>
      <div class="kv"><span class="muted">Account</span><span class="sig">${D0($.address, 8)}</span></div>
      <div class="kv"><span class="muted">Network</span><span>Inazuma Mainnet</span></div>
    </div>
    <div class="card">
      <p>Only your public address is shared. This site can never move funds without
         a transaction you approve here.</p>
      <div class="row">
        <button id="reject" class="ghost">Reject</button>
        <button id="approve">Connect</button>
      </div>
    </div>`));
  let J = (q) =>
    chrome.runtime.sendMessage(
      { type: "INAZ_APPROVAL", id: $.id, origin: $.origin, approved: q },
      () => void G8(),
    );
  ((k("approve").onclick = () => J(!0)), (k("reject").onclick = () => J(!1)));
}
function Jz($) {
  (m0(!1),
    (a.innerHTML = `
    <div class="card hero">
      <h2>Signature request</h2>
      <p>This site wants you to prove you own this wallet. No gas, no funds move.</p>
      <div class="kv"><span class="muted">Site</span><span>${o($.origin.replace(/^https?:\/\//, ""))}</span></div>
      <div class="kv"><span class="muted">Account</span><span class="sig">${D0($.address, 8)}</span></div>
    </div>
    <div class="card">
      <label>Message</label>
      <div class="secret" style="white-space:pre-wrap;font-size:11px">${o($.message ?? "")}</div>
      <div class="row" style="margin-top:12px">
        <button id="reject" class="ghost">Reject</button>
        <button id="sign">Sign</button>
      </div>
      <div id="msg"></div>
    </div>`),
    (k("reject").onclick = () =>
      chrome.runtime.sendMessage(
        { type: "INAZ_SIGNED", id: $.id, error: "Signature rejected." },
        () => void G8(),
      )),
    (k("sign").onclick = () => {
      try {
        let J = tY(p.key, $.message ?? "");
        chrome.runtime.sendMessage(
          { type: "INAZ_SIGNED", id: $.id, address: J.address, signature: J.signature },
          () => void G8(),
        );
      } catch (J) {
        P0(J.message, "err");
      }
    }));
}
async function T0() {
  if (!p) return;
  if ((m0(!0), w0 === "wallet")) O1();
  if (w0 === "activity") Uz();
  if (w0 === "settings") await N1();
  (Aq(), xq(), (a8 = window.setInterval(() => void J1(), 8000)), J1());
}
function o8($, J, q) {
  return `<button class="tile" id="${$}"><span>${J}</span>${q}</button>`;
}
function O1() {
  let $ = p;
  ((a.innerHTML = `
    <div class="card hero">
      <div class="balrow">
        <span class="sub muted">Total balance</span>
        <button class="iconbtn" id="eye" title="Hide balance">${z$ ? "&#9673;" : "&#9678;"}</button>
      </div>
      <div class="balance" id="bal">${z$ ? "••••" : F0(I0)}<span>INAZ</span></div>
      <div class="addrrow">
        <span class="mono" title="${o($.address)}">${D0($.address, 10)}</span>
        ${t8("cpaddr", $.address, "Copy address")}
        <button class="iconbtn" id="openexp" title="View in explorer">&#8599;</button>
      </div>
      <div class="tiles">
        ${o8("go-send", "&#8599;", "Send")}
        ${o8("go-recv", "&#8600;", "Receive")}
        ${o8("go-act", "&#8635;", "Activity")}
        ${o8("go-set", "&#9881;", "Settings")}
      </div>
    </div>
    <div class="card">
      <div class="balrow"><h2>Recent</h2><span class="sub muted" id="fee">Fee ${F0(A0, 6)} INAZ</span></div>
      <ul id="mini"><li class="tx muted">Loading…</li></ul>
    </div>
    <div id="msg"></div>`),
    c$(),
    (k("eye").onclick = () => {
      ((z$ = !z$), chrome.storage.local.set({ hidden: z$ }), O1(), Aq(), k$("mini", 4));
    }),
    (k("openexp").onclick = () => void chrome.tabs.create({ url: `${Sq}/address/${$.address}` })),
    (k("go-send").onclick = () => D1()),
    (k("go-recv").onclick = () => void qz()),
    (k("go-act").onclick = () => {
      ((w0 = "activity"), T0());
    }),
    (k("go-set").onclick = () => {
      ((w0 = "settings"), T0());
    }),
    k$("mini", 4));
}
function D1() {
  (b$.classList.remove("on"),
    (a.innerHTML = `
    <div class="card">
      <h2>Send INAZ</h2>
      <label>Recipient</label>
      <input id="to" placeholder="Inazuma address" spellcheck="false" />
      <label>Amount</label>
      <input id="amt" placeholder="0.00" inputmode="decimal" />
      <div class="kv"><span class="muted">Available</span><span>${F0(I0, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Network fee</span><span>${F0(A0, 6)} INAZ</span></div>
      <div class="row" style="margin-top:12px">
        <button class="ghost" id="max">Max</button>
        <button id="review">Review</button>
      </div>
      <button class="ghost" id="cancel">Back</button>
      <div id="msg"></div>
    </div>`),
    (k("max").onclick = () => {
      let $ = I0 > A0 ? I0 - A0 : 0n;
      k("amt").value = F0($, 9);
    }),
    (k("review").onclick = () => Qz().catch(($) => P0($.message, "err"))),
    (k("cancel").onclick = () => {
      ((w0 = "wallet"), T0());
    }),
    k("to").focus());
}
async function qz() {
  let $ = p;
  b$.classList.remove("on");
  let J = "";
  try {
    J = await q1.default.toDataURL($.address, {
      margin: 1,
      width: 220,
      color: { dark: "#f6f6f8", light: "#0e0e14" },
    });
  } catch {
    J = "";
  }
  ((a.innerHTML = `
    <div class="card center">
      <h2>Receive</h2>
      <p>Only send INAZ and Inazuma-native assets to this address.</p>
      ${J ? `<img class="qr" src="${J}" alt="Address QR" />` : ""}
      <div class="addrrow">
        <span class="mono" title="${o($.address)}">${D0($.address, 10)}</span>
        ${t8("cpaddr3", $.address, "Copy address")}
      </div>
      <button class="ghost" id="back" style="margin-top:12px">Back</button>
      <div id="msg"></div>
    </div>`),
    c$(),
    (k("back").onclick = () => {
      ((w0 = "wallet"), T0());
    }));
}
async function Qz() {
  let $ = k("to").value.trim(),
    J = k("amt").value;
  if (!sU.test($)) throw Error("That is not a valid Inazuma address.");
  if ($ === p.address) throw Error("That is your own address.");
  let q = oY(J);
  if (q <= 0n) throw Error("Enter an amount above zero.");
  if (q + A0 > I0) throw Error("Not enough balance for amount + fee.");
  Zz($, q);
}
function Zz($, J) {
  let q = p;
  (b$.classList.remove("on"),
    (a.innerHTML = `
    <div class="card hero center">
      <span class="sub muted">You are sending</span>
      <div class="balance">${F0(J, 6)}<span>INAZ</span></div>
    </div>
    <div class="card">
      <div class="kv"><span class="muted">From</span><span>${D0(q.address)}</span></div>
      <div class="kv"><span class="muted">To</span><span>${D0($)}</span></div>
      <div class="kv"><span class="muted">Network fee</span><span>${F0(A0, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Total</span><span class="sig">${F0(J + A0, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Signature</span><span>ed25519 + ML-DSA-65</span></div>
    </div>
    <div class="card">
      <div class="row">
        <button class="ghost" id="cancel">Back</button>
        <button id="confirm">Confirm &amp; send</button>
      </div>
      <div id="msg"></div>
    </div>`),
    (k("cancel").onclick = () => D1()),
    (k("confirm").onclick = () => {
      ((k("confirm").disabled = !0),
        Yz($, J)
          .then((Q) => Xz(Q, $, J))
          .catch((Q) => {
            ((k("confirm").disabled = !1), P0(Q.message, "err"));
          }));
    }));
}
async function Yz($, J) {
  let q = p,
    Q = await Cq("inaz_getAccount", { address: q.address });
  if (J + A0 > BigInt(Q.balance ?? "0")) throw Error("Not enough balance for amount + fee.");
  let Z = aY({ secret: q.key, to: $, amountRai: J, nonce: Q.pendingNonce ?? Q.nonce ?? 0 });
  return (await Cq("inaz_sendTransaction", { tx: Z })).hash;
}
function Xz($, J, q) {
  ((a.innerHTML = `
    <div class="card hero center">
      <div style="font-size:34px;line-height:1">&#10003;</div>
      <h1 class="title" style="margin-top:8px">Transfer sent</h1>
      <p>${F0(q, 6)} INAZ to ${D0(J)}</p>
    </div>
    <div class="card">
      <label>Transaction hash</label>
      <div class="addrrow">
        <span class="mono">${D0($, 10)}</span>
        ${t8("cphash", $, "Copy hash")}
        <button class="iconbtn" id="openexp" title="View in explorer">&#8599;</button>
      </div>
      <button id="done" style="margin-top:12px">Back to wallet</button>
      <div id="msg"></div>
    </div>`),
    c$(),
    (k("openexp").onclick = () => void chrome.tabs.create({ url: `${Sq}/tx/${$}` })),
    (k("done").onclick = () => {
      ((w0 = "wallet"), T0());
    }));
}
function Uz() {
  if (
    ((a.innerHTML = `
    <div class="card">
      <h2>Activity</h2>
      <ul id="full"><li class="tx muted">Loading…</li></ul>
    </div>
    <div id="msg"></div>`),
    G$.length)
  )
    k$("full", 25);
}
function k$($, J) {
  let q = p,
    Q = document.getElementById($);
  if (!Q || !q) return;
  let Z = G$.slice(0, J);
  if (!Z.length) {
    Q.innerHTML = '<li class="tx muted">No transactions yet.</li>';
    return;
  }
  ((Q.innerHTML = Z.map((Y) => {
    let X = Y.from === q.address,
      U = Y.from === Y.to,
      z = X ? Y.to : Y.from,
      G = Y.kind && Y.kind !== "transfer" ? zz(Y.kind) : U ? "Self" : X ? "Sent" : "Received",
      W = U || !Y.amount || Y.amount === "0" ? "" : X ? "-" : "+",
      K = z$ ? "••" : `${W}${Y.amount ? F0(BigInt(Y.amount), 4) : "0"}`;
    return `<li class="tx" data-hash="${o(Y.hash)}" title="Open in explorer">
        <span class="dot ${X && !U ? "out" : "in"}">${X && !U ? "&#8599;" : "&#8600;"}</span>
        <span class="txmeta">
          <b>${o(G)}</b>
          <span class="sub muted">${z ? D0(z, 5) : "—"}${Y.timestampMs ? ` · ${Wz(Y.timestampMs)}` : ""}</span>
        </span>
        <span class="txamt ${X && !U ? "" : "sig"}">${K}</span>
      </li>`;
  }).join("")),
    Q.querySelectorAll("li[data-hash]").forEach((Y) => {
      ((Y.style.cursor = "pointer"),
        (Y.onclick = () => void chrome.tabs.create({ url: `${Sq}/tx/${Y.dataset.hash}` })));
    }));
}
var zz = ($) => $.charAt(0).toUpperCase() + $.slice(1);
function Wz($) {
  let J = Math.max(0, Math.round((Date.now() - $) / 1000));
  if (J < 60) return `${J}s ago`;
  if (J < 3600) return `${Math.round(J / 60)}m ago`;
  if (J < 86400) return `${Math.round(J / 3600)}h ago`;
  return `${Math.round(J / 86400)}d ago`;
}
async function N1() {
  let $ = p,
    J = await W$.sites();
  ((a.innerHTML = `
    <div class="card">
      <h2>Account</h2>
      <label>Name</label>
      <input id="label" value="${o(i[X0]?.label ?? "Account")}" />
      <button class="ghost" id="rename">Save name</button>
      <div class="addrrow">
        <span class="mono">${D0($.address, 9)}</span>
        ${t8("cpaddr2", $.address, "Copy address")}
      </div>
      <div class="kv" style="margin-top:10px"><span class="muted">Network</span><span>Inazuma Mainnet</span></div>
      <div class="kv"><span class="muted">Signature scheme</span><span>ed25519 + ML-DSA-65</span></div>
      <div class="kv"><span class="muted">PQ fingerprint</span><span class="sig">${Hq($.secretHex)}</span></div>
      <div class="kv"><span class="muted">Auto-lock</span><span>15 min</span></div>
      <button class="ghost" id="accts" style="margin-top:10px">Manage accounts</button>
    </div>
    <div class="card">
      <h2>Connected sites</h2>
      ${J.length ? J.map((q, Q) => `<div class="kv"><span>${o(q.replace(/^https?:\/\//, ""))}</span><span><button class="iconbtn" data-revoke="${Q}" title="Revoke">&#10005;</button></span></div>`).join("") : "<p>No sites connected yet.</p>"}
    </div>
    <div class="card warn">
      <h2>Reveal secrets</h2>
      <p>Enter your password to reveal your recovery phrase or private key. Never
         share them — anyone with them controls your funds.</p>
      <input id="expw" type="password" placeholder="Password" />
      <button id="exp" class="ghost">Reveal</button>
      <div id="secrets"></div>
      <div id="msg"></div>
    </div>
    <div class="card">
      <button id="lockbtn" class="ghost">Lock wallet</button>
      <button id="rmacct" class="danger">Remove this account</button>
    </div>`),
    c$(),
    a.querySelectorAll("[data-revoke]").forEach((q) => {
      q.onclick = async () => {
        let Q = J.filter((Z, Y) => Y !== Number(q.dataset.revoke));
        (await W$.setSites(Q), await N1());
      };
    }),
    (k("rename").onclick = async () => {
      let q = k("label").value.trim().slice(0, 24);
      if (!q) return P0("Enter a name.", "err");
      ((i[X0] = { ...i[X0], label: q }), await W$.save(), m0(!0), P0("Name saved", "ok"));
    }),
    (k("accts").onclick = () => void vq()),
    (k("exp").onclick = () => {
      let q = k("expw").value;
      gq(fq(), q)
        .then((Q) => Gz(Q))
        .catch(() => P0("Wrong password.", "err"));
    }),
    (k("lockbtn").onclick = U1),
    (k("rmacct").onclick = async () => {
      if (
        ((i = i.filter((q, Q) => Q !== X0)),
        (X0 = 0),
        (p = null),
        (I0 = 0n),
        (G$ = []),
        xq(),
        !i.length)
      ) {
        (await W$.clearAll(), s8());
        return;
      }
      (await W$.save(), W8(i[0].vault));
    }));
}
function Gz($) {
  let J = k("secrets");
  ((J.innerHTML = `
    ${$.mnemonic ? `<label style="margin-top:10px">Recovery phrase</label>${Lq("s1", X1($.mnemonic))}` : ""}
    <label style="margin-top:12px">Private key (Inazuma format)</label>
    ${Lq("s2", o($.key))}
    <div class="row" style="margin-top:10px">
      ${$.mnemonic ? `<button class="ghost" data-copy="${o($.mnemonic)}">Copy phrase</button>` : ""}
      <button class="ghost" data-copy="${o($.key)}">Copy key</button>
    </div>`),
    Y1(),
    c$(),
    (k("expw").value = ""));
}
function Aq() {
  let $ = document.getElementById("bal");
  if ($) $.innerHTML = `${z$ ? "••••" : F0(I0)}<span>INAZ</span>`;
}
async function Kz($) {
  let J = await chrome.storage.local.get(["cacheBal", "cacheTxs", "cacheAddr"]);
  if (J.cacheAddr !== $) return;
  if (typeof J.cacheBal === "string") I0 = BigInt(J.cacheBal);
  if (Array.isArray(J.cacheTxs)) G$ = J.cacheTxs;
}
function $1($) {
  chrome.storage.local.set({ cacheAddr: $, cacheBal: I0.toString(), cacheTxs: G$.slice(0, 25) });
}
async function Oz($) {
  let J = await Cq("inaz_getAccount", { address: $ });
  return BigInt(J.balance ?? "0");
}
async function Dz($) {
  let J = await fetch(`${tU}?address=${encodeURIComponent($)}&limit=25`, { cache: "no-store" });
  if (!J.ok) throw Error(`Indexer returned ${J.status}`);
  return ((await J.json()).txs ?? []).map((Q) => ({
    hash: Q.hash,
    from: Q.from,
    to: Q.to,
    amount: Q.amountRai,
    height: Q.height,
    kind: Q.kind,
    timestampMs: Q.timestampMs,
  }));
}
async function J1() {
  let $ = p;
  if (!$) return;
  let J = $.address,
    q = Oz(J)
      .then((Z) => {
        ((I0 = Z), Aq(), $1(J));
      })
      .catch((Z) => P0(Z instanceof Error ? Z.message : "Node unreachable.", "err")),
    Q = Dz(J)
      .then((Z) => {
        ((G$ = Z), k$("mini", 4), k$("full", 25), $1(J));
      })
      .catch(() => {
        (k$("mini", 4), k$("full", 25));
      });
  await Promise.all([q, Q]);
}
async function G8() {
  let $ = await W$.load();
  ((i = $.accounts), (X0 = $.active));
  let J = await chrome.storage.local.get(["pending", "lastActive"]),
    q = J.pending,
    Q = Number(J.lastActive ?? 0);
  if (p && Date.now() - Q > eU) p = null;
  let Z = fq();
  if (q && Z && !p) {
    W8(Z);
    return;
  }
  if (q && Z && p) {
    if (q.message) Jz(q);
    else $z(q);
    return;
  }
  if (p) {
    (await Kz(p.address), await T0());
    return;
  }
  if (Z) W8(Z);
  else s8();
}
document.addEventListener("click", () => void chrome.storage.local.set({ lastActive: Date.now() }));
G8();
