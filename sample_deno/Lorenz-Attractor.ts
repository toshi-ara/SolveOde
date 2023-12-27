// deno run --allow-write Lorenz-Attractor.ts
import { writeFile } from "https://deno.land/std@0.86.0/node/fs.ts";
import { TypeParam, TypeFuncRes } from "../ts/solve_ode.ts";
import { SolveOde, dop853 } from "../ts/solve_ode.ts";

// https://en.wikipedia.org/wiki/Lorenz_system
// ODE
// dx/dt = sigma * (y - x)
// dy/dt = x * (rho - z) - y
// dz/dt = x * y - beta * z
// param[sigma, rho, beta]

function func(x: number[], param: TypeParam, _t: number): TypeFuncRes {
    return [
        param[0] * (x[1] - x[0]),
        param[1] * x[0] - x[0] * x[2] - x[1],
        x[0] * x[1] - param[2] * x[2]
    ];
}

let param = [10, 28, 8/3];
let init = [1, 0, 0];

let [time, value] = SolveOde(
    func,          // ODE, solver
    dop853,        // solver
    param,         // parameters
    0, 100, 0.01,  // start, end, step
    init           // initial values
);


// save results
let output_string  = "# x y z\n"; 
for (let d of value) {
    output_string += d.join(" ");
    output_string += "\n";
}

writeFile("result/Lorenz-Attractor.txt", output_string, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('write end');
    }
});

