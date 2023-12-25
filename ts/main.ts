import { TypeParam, TypeFuncRes } from "./solve_ode";
import { SolveOde, rkf45, dopri5, dop853 } from "./solve_ode";

// ODE
// dx0/dt = x1
// dx1/dt = -2 * param[0] * x1 - x0
function func(x: number[], param: TypeParam, _t: number): TypeFuncRes {
    return [
        x[1],
        -2 * param[0] * x[1] - x[0]
    ];
}


const param = [0.15];
const res = SolveOde(
    func, dop853,  // ODE, solver
    param,         // parameters
    0, 20, 0.5,    // start, end, step
    [1, -0.15]     // initial values
);
console.log(res)

