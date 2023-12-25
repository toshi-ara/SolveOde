"use strict";
const solve_ode = require("./solve_ode");

// ODE
// dx0/dt = x1
// dx1/dt = -2 * param[0] * x1 - x0
function func(x, param, _t) {
    return [
        x[1],
        -2 * param[0] * x[1] - x[0]
    ];
}

let param = [0.15]
let res = solve_ode.SolveOde(
    func,              // ODE
    solve_ode.dop853,  // solver
    param,             // parameters
    0, 20, 0.5,        // start, end, step
    [1, -0.15]         // initial values
);
console.log(res);
