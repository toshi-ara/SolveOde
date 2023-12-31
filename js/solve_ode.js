"use strict";
//////////////////////////////////
// type definition
//////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.dop853 = exports.dopri5 = exports.rkf45 = exports.SolveOde = void 0;
//////////////////////////////////
// SolveOde (main function)
//
// input:
//   func: ordinary differential equation (ODE) you want to specify
//   solver: rkf45, dopri5, or dop853
//   param: Parameters for ODE
//   start:
//   end:
//   h: step
//   amt: initial values (number[])
//
// output: TypeResult
//   [
//      number[],    // x
//      number[][]   // vector of y
//   ]
//////////////////////////////////
function SolveOde(func, solver, param, start, end, h, amt) {
    var n = Math.floor((end - start) / h);
    var t = start;
    var x = Array(n + 1);
    var y = Array(n + 1);
    for (var i = 0; i < n - 1; i++) {
        x[i] = t;
        y[i] = amt;
        amt = solver(func, param, amt, t, h, false)[0];
        t += h;
    }
    // last - 1
    x[n - 1] = t;
    y[n - 1] = amt;
    // last
    amt = solver(func, param, amt, t, end - t, false)[0];
    x[n] = end;
    y[n] = amt;
    return [x, y];
}
exports.SolveOde = SolveOde;
//////////////////////////////////
// Reference:
//   https://zenn.dev/yonda/articles/71aef28aa46fcb
//   add parameters as argument
//////////////////////////////////
//////////////////////////////////
// helper functions
//////////////////////////////////
function zip() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Array.from(Array(Math.min.apply(Math, args.map(function (v) { return v.length; }))), function (_, i) {
        return args.map(function (v) { return v[i]; });
    });
}
function adds() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return zip.apply(void 0, args).map(function (v) {
        return v.reduce(function (a, b) { return a + b; });
    });
}
;
function multiple(a, b) {
    return b.map(function (v) {
        return a * v;
    });
}
;
function estimateError(x, x_, delta, atol, rtol) {
    var err = 0;
    for (var i = 0; i < delta.length; i++) {
        var sc = atol[i] + Math.max(Math.abs(x[i]), Math.abs(x_[i])) * rtol[i];
        err += Math.pow((delta[i] / sc), 2);
    }
    err = Math.sqrt(err / delta.length);
    return err;
}
;
//////////////////////////////////
// Reference
// Ernst Hairer, Gerhard Wanner, Syvert P. Nørsett.
// Solving Ordinary Differential Equations I: Nonstiff Problems.
// Springer.
//////////////////////////////////
function _ode(func, param, x, t, h, adaptive) {
    var _a;
    if (!adaptive) {
        var x_ = func(param, x, t, h)[0];
        return [x_, t + h, h];
    }
    var maxiter = (_a = adaptive.maxiter) !== null && _a !== void 0 ? _a : 100;
    var facmax = 5;
    if (adaptive.facmax && adaptive.facmax > 0) {
        facmax = adaptive.facmax;
    }
    var facmin = 0.1;
    if (adaptive.facmin && adaptive.facmin > 0) {
        facmin = adaptive.facmin;
    }
    var fac = 0.9;
    if (adaptive.fac && adaptive.fac > 0) {
        fac = adaptive.fac;
    }
    var h_ = h;
    var i = 0;
    while (i++ < maxiter) {
        var _b = func(param, x, t, h_, {
            atol: adaptive.atol,
            rtol: adaptive.rtol
        }), x_ = _b[0], err = _b[1];
        if (!err) {
            break;
        }
        var t_ = t + h_;
        h_ *= Math.min(facmax, Math.max(facmin, fac * (Math.pow((1 / err), 0.2))));
        if (err < 1) {
            return [x_, t_, h_];
        }
    }
    throw new Error();
}
;
// Runge-Kutta-Fehlberg
function rkf45(func, param, x, t, h, adaptive) {
    function calc(param, x, t, h, adaptive) {
        var k1 = func(x, param, t);
        var k2 = func(adds(x, multiple(1 / 4 * h, k1)), param, t + 1 / 4 * h);
        var k3 = func(adds(x, multiple(3 / 32 * h, k1), multiple(9 / 32 * h, k2)), param, t + 3 / 8 * h);
        var k4 = func(adds(x, multiple(1932 / 2197 * h, k1), multiple(-7200 / 2197 * h, k2), multiple(7296 / 2197 * h, k3)), param, t + 12 / 13 * h);
        var k5 = func(adds(x, multiple(439 / 216 * h, k1), multiple(-8 * h, k2), multiple(3680 / 513 * h, k3), multiple(-845 / 4104 * h, k4)), param, t + h);
        var x_ = adds(x, multiple(25 / 216 * h, k1), multiple(1408 / 2565 * h, k3), multiple(2197 / 4104 * h, k4), multiple(-1 / 5 * h, k5));
        if (!adaptive) {
            return [x_, null];
        }
        var k6 = func(adds(x, multiple(-8 / 27 * h, k1), multiple(2 * h, k2), multiple(-3544 / 2565 * h, k3), multiple(1859 / 4104 * h, k4), multiple(-11 / 40 * h, k5)), param, t + 0.5 * h);
        var delta = adds(multiple(71 / 57600 * h, k1), multiple(-128 / 4275 * h, k3), multiple(-2197 / 75240 * h, k4), multiple(1 / 50 * h, k5), multiple(2 / 55 * h, k6));
        return [x_, estimateError(x, x_, delta, adaptive.atol, adaptive.rtol)];
    }
    ; // end of calc
    var options = (adaptive === false) ? undefined : (function () {
        var atol = [];
        var rtol = [];
        var userOptions = (typeof adaptive === "boolean") ? undefined : adaptive;
        for (var i = 0; i < x.length; i++) {
            var a = userOptions ?
                (Array.isArray(userOptions.atol) ? userOptions.atol[i] :
                    userOptions.atol) : undefined;
            var r = userOptions ?
                (Array.isArray(userOptions.rtol) ? userOptions.rtol[i] :
                    userOptions.rtol) : undefined;
            atol.push(((a === 0 && r === 0) || typeof a === "undefined" || a < 0) ?
                1e-6 : a);
            rtol.push((typeof r === "undefined" || r < 0) ? 1e-3 : r);
        }
        return {
            atol: atol,
            rtol: rtol,
            maxiter: userOptions === null || userOptions === void 0 ? void 0 : userOptions.maxiter,
            fac: userOptions === null || userOptions === void 0 ? void 0 : userOptions.fac,
            facmax: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmax,
            facmin: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmin,
        };
    })();
    return _ode(calc, param, x, t, h, options);
}
exports.rkf45 = rkf45;
;
// Dormand-Prince method order 5
function dopri5(func, param, x, t, h, adaptive) {
    function calc(param, x, t, h, adaptive) {
        var k1 = func(x, param, t);
        var k2 = func(adds(x, multiple(1 / 5 * h, k1)), param, t + 1 / 5 * h);
        var k3 = func(adds(x, multiple(3 / 40 * h, k1), multiple(9 / 40 * h, k2)), param, t + 3 / 10 * h);
        var k4 = func(adds(x, multiple(44 / 45 * h, k1), multiple(-56 / 15 * h, k2), multiple(32 / 9 * h, k3)), param, t + 4 / 5 * h);
        var k5 = func(adds(x, multiple(19372 / 6561 * h, k1), multiple(-25360 / 2187 * h, k2), multiple(64448 / 6561 * h, k3), multiple(-212 / 729 * h, k4)), param, t + 8 / 9 * h);
        var k6 = func(adds(x, multiple(9017 / 3168 * h, k1), multiple(-355 / 33 * h, k2), multiple(46732 / 5247 * h, k3), multiple(49 / 176 * h, k4), multiple(-5103 / 18656 * h, k5)), param, t + h);
        var x_ = adds(x, multiple(35 / 384 * h, k1), multiple(500 / 1113 * h, k3), multiple(125 / 192 * h, k4), multiple(-2187 / 6784 * h, k5), multiple(11 / 84 * h, k6));
        if (!adaptive) {
            return [x_, null];
        }
        var k7 = func(adds(x, multiple(35 / 384 * h, k1), multiple(500 / 1113 * h, k3), multiple(125 / 192 * h, k4), multiple(-2187 / 6784 * h, k5), multiple(11 / 84 * h, k6)), param, t + h);
        var delta = adds(multiple(71 / 57600 * h, k1), multiple(-71 / 16695 * h, k3), multiple(71 / 1920 * h, k4), multiple(-17253 / 339200 * h, k5), multiple(22 / 525 * h, k6), multiple(-1 / 40 * h, k7));
        return [x_, estimateError(x, x_, delta, adaptive.atol, adaptive.rtol)];
    }
    ; // end of calc
    var options = (adaptive === false) ? undefined : (function () {
        var atol = [];
        var rtol = [];
        var userOptions = (typeof adaptive === "boolean") ? undefined : adaptive;
        for (var i = 0; i < x.length; i++) {
            var a = userOptions ?
                (Array.isArray(userOptions.atol) ? userOptions.atol[i] :
                    userOptions.atol) : undefined;
            var r = userOptions ?
                (Array.isArray(userOptions.rtol) ? userOptions.rtol[i] :
                    userOptions.rtol) : undefined;
            atol.push(((a === 0 && r === 0) || typeof a === "undefined" || a < 0) ?
                1e-12 : a);
            rtol.push((typeof r === "undefined" || r < 0) ? 1e-6 : r);
        }
        return {
            atol: atol,
            rtol: rtol,
            maxiter: userOptions === null || userOptions === void 0 ? void 0 : userOptions.maxiter,
            fac: userOptions === null || userOptions === void 0 ? void 0 : userOptions.fac,
            facmax: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmax,
            facmin: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmin,
        };
    })();
    return _ode(calc, param, x, t, h, options);
}
exports.dopri5 = dopri5;
;
// Dormand-Prince method order 8
// Reference
// dop853.f
// http://www.unige.ch/~hairer/software.html
function dop853(func, param, x, t, h, adaptive) {
    function calc(param, x, t, h, adaptive) {
        var k1 = func(x, param, t);
        var k2 = func(adds(x, multiple(5.26001519587677318785587544488e-2 * h, k1)), param, t + 0.526001519587677318785587544488e-1 * h);
        var k3 = func(adds(x, multiple(1.97250569845378994544595329183e-2 * h, k1), multiple(5.91751709536136983633785987549e-2 * h, k2)), param, t + 0.789002279381515978178381316732e-1 * h);
        var k4 = func(adds(x, multiple(2.95875854768068491816892993775e-2 * h, k1), multiple(8.87627564304205475450678981324e-2 * h, k3)), param, t + 0.118350341907227396726757197510 * h);
        var k5 = func(adds(x, multiple(2.41365134159266685502369798665e-1 * h, k1), multiple(-8.84549479328286085344864962717e-1 * h, k3), multiple(9.24834003261792003115737966543e-1 * h, k4)), param, t + 0.281649658092772603273242802490 * h);
        var k6 = func(adds(x, multiple(3.7037037037037037037037037037e-2 * h, k1), multiple(1.70828608729473871279604482173e-1 * h, k4), multiple(1.25467687566822425016691814123e-1 * h, k5)), param, t + 0.333333333333333333333333333333 * h);
        var k7 = func(adds(x, multiple(3.7109375e-2 * h, k1), multiple(1.70252211019544039314978060272e-1 * h, k4), multiple(6.02165389804559606850219397283e-2 * h, k5), multiple(-1.7578125e-2 * h, k6)), param, t + 0.25 * h);
        var k8 = func(adds(x, multiple(3.70920001185047927108779319836e-2 * h, k1), multiple(1.70383925712239993810214054705e-1 * h, k4), multiple(1.07262030446373284651809199168e-1 * h, k5), multiple(-1.53194377486244017527936158236e-2 * h, k6), multiple(8.27378916381402288758473766002e-3 * h, k7)), param, t + 0.307692307692307692307692307692 * h);
        var k9 = func(adds(x, multiple(6.24110958716075717114429577812e-1 * h, k1), multiple(-3.36089262944694129406857109825 * h, k4), multiple(-8.68219346841726006818189891453e-1 * h, k5), multiple(2.75920996994467083049415600797e1 * h, k6), multiple(2.01540675504778934086186788979e1 * h, k7), multiple(-4.34898841810699588477366255144e1 * h, k8)), param, t + 0.651282051282051282051282051282 * h);
        var k10 = func(adds(x, multiple(4.77662536438264365890433908527e-1 * h, k1), multiple(-2.48811461997166764192642586468 * h, k4), multiple(-5.90290826836842996371446475743e-1 * h, k5), multiple(2.12300514481811942347288949897e1 * h, k6), multiple(1.52792336328824235832596922938e1 * h, k7), multiple(-3.32882109689848629194453265587e1 * h, k8), multiple(-2.03312017085086261358222928593e-2 * h, k9)), param, t + 0.6 * h);
        var k11 = func(adds(x, multiple(-9.3714243008598732571704021658e-1 * h, k1), multiple(5.18637242884406370830023853209 * h, k4), multiple(1.09143734899672957818500254654 * h, k5), multiple(-8.14978701074692612513997267357 * h, k6), multiple(-1.85200656599969598641566180701e1 * h, k7), multiple(2.27394870993505042818970056734e1 * h, k8), multiple(2.49360555267965238987089396762 * h, k9), multiple(-3.0467644718982195003823669022 * h, k10)), param, t + 0.857142857142857142857142857142 * h);
        var k12 = func(adds(x, multiple(2.27331014751653820792359768449 * h, k1), multiple(-1.05344954667372501984066689879e1 * h, k4), multiple(-2.00087205822486249909675718444 * h, k5), multiple(-1.79589318631187989172765950534e1 * h, k6), multiple(2.79488845294199600508499808837e1 * h, k7), multiple(-2.85899827713502369474065508674 * h, k8), multiple(-8.87285693353062954433549289258 * h, k9), multiple(1.23605671757943030647266201528e1 * h, k10), multiple(6.43392746015763530355970484046e-1 * h, k11)), param, t + h);
        var x_ = adds(x, multiple(5.42937341165687622380535766363e-2 * h, k1), multiple(4.45031289275240888144113950566 * h, k6), multiple(1.89151789931450038304281599044 * h, k7), multiple(-5.8012039600105847814672114227 * h, k8), multiple(3.1116436695781989440891606237e-1 * h, k9), multiple(-1.52160949662516078556178806805e-1 * h, k10), multiple(2.01365400804030348374776537501e-1 * h, k11), multiple(4.47106157277725905176885569043e-2 * h, k12));
        if (!adaptive) {
            return [x_, null];
        }
        var delta5 = adds(multiple(0.1312004499419488073250102996e-1, k1), multiple(-0.1225156446376204440720569753e+1, k6), multiple(-0.4957589496572501915214079952, k7), multiple(0.1664377182454986536961530415e+1, k8), multiple(-0.3503288487499736816886487290, k9), multiple(0.3341791187130174790297318841, k10), multiple(0.8192320648511571246570742613e-1, k11), multiple(-0.2235530786388629525884427845e-1, k12));
        var delta3 = adds(multiple(-0.189800754072407617468755659980, k1), multiple(4.45031289275240888144113950566, k6), multiple(1.89151789931450038304281599044, k7), multiple(-5.8012039600105847814672114227, k8), multiple(-0.422682321323791962932445679177, k9), multiple(-1.52160949662516078556178806805e-1, k10), multiple(2.01365400804030348374776537501e-1, k11), multiple(0.0226517921983608258118062039631, k12));
        var err5 = 0;
        var err3 = 0;
        for (var i = 0; i < x.length; i++) {
            var sc = adaptive.atol[i] +
                Math.max(Math.abs(x[i]), Math.abs(x_[i])) * adaptive.rtol[i];
            err5 += Math.pow((delta5[i] / sc), 2);
            err3 += Math.pow((delta3[i] / sc), 2);
        }
        var denominator = (err5 !== 0 || err3 !== 0) ? err5 + 0.01 * err3 : 1;
        var err = Math.abs(h) * err5 * Math.sqrt(1 / (x.length * denominator));
        return [x_, err];
    }
    ; // end of calc
    var options = (adaptive === false) ? undefined : (function () {
        var atol = [];
        var rtol = [];
        var userOptions = (typeof adaptive === "boolean") ? undefined : adaptive;
        for (var i = 0; i < x.length; i++) {
            var a = userOptions ?
                (Array.isArray(userOptions.atol) ? userOptions.atol[i] :
                    userOptions.atol) : undefined;
            var r = userOptions ?
                (Array.isArray(userOptions.rtol) ? userOptions.rtol[i] :
                    userOptions.rtol) : undefined;
            atol.push(((a === 0 && r === 0) || typeof a === "undefined" || a < 0) ?
                1e-12 : a);
            rtol.push((typeof r === "undefined" || r < 0) ? 1e-6 : r);
        }
        return {
            atol: atol,
            rtol: rtol,
            maxiter: userOptions === null || userOptions === void 0 ? void 0 : userOptions.maxiter,
            fac: userOptions === null || userOptions === void 0 ? void 0 : userOptions.fac,
            facmax: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmax,
            facmin: userOptions === null || userOptions === void 0 ? void 0 : userOptions.facmin,
        };
    })();
    return _ode(calc, param, x, t, h, options);
}
exports.dop853 = dop853;
;
