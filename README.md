# Solve ordinary differential equations (ODEs) numerically with Typescript
## Reference URL

I modified the Typescript codes in
 https://zenn.dev/yonda/articles/71aef28aa46fcb (in Japanese).
Since he says "Please feel free to copy and paste the code in this article as you like," I modified and published them under the MIT License.

## Major features
1. Changed the arguments of solver functions (rk45, dopri5, dop853)
   so that they can take parameters
   used in ordinary differential equation (ODE) functions.
    - the parameter had to be set as a global variable
      before the change
1. Values are calculated up to the specified end time
    in the `SolveOde` function, which numerically solves ODEs.
    - If you do something like `start_time =+ interval`,
      the data at end time is missing due to decimal rounding error
    - Rust's `ode_solvers` applies

## Solver functions
+ `rkf45`: Runge-Kutta method
+ `dopri5`: Dormand-Prince method order 5
+ `dop853`: Dormand-Prince method order 8


## Example
The example in https://zenn.dev/yonda/articles/71aef28aa46fcb (in Japanese)

- $\dfrac{x_{0}}{dt} = x_{1}$
- $\dfrac{dx_{1}}{dt} = -2\gamma x_{1} - x_{0}$
- parameter values: $\gamma = 0.15$
- initial values: $x_{0} = 1, x_{1} = -0.15$

### Import required types and functions
```
import { TypeFuncRes, TypeParam } from "./solve_ode";
import { SolveOde, rkf45, dopri5, dop853 } from "./solve_ode";
```

- `TypeParam`: `number[]`
- `TypeFuncRes`: `number[]`

### Define of ordinary differential equations (ODEs)

```typescript
// Definition of ODE
function func(x: number[], param: TypeParam, _t: number): TypeFuncRes {
    return [
        x[1],                        // dx0/dt = x1
        -2 * param[0] * x[1] - x[0]  // dx1/dt = -2 * param[0] * x1 - x0
    ];
}
```

### Set and parse parameter values
```typescript
let param = [0.15];
let init = [1, -1.5];

let res = SolveOde(
    func,        // user-defined ODE
    dop853,      // solver function
    param,       // parameters
    0, 20, 0.5,  // start, end, step
    init         // initial values
);
console.log(res);
```

### Execute
```bash
# download from repository
npm install
npm run build  # bundle using webpack

node dist/main.js
```

The type of return values is `[number[], number[][]]`
- element 1： array of times
- element 2： array of "array of values"

```typescript
[
  [
     0,  0.5,  1,  1.5,  2,  2.5,  3,  3.5,
     4,  4.5,  5,  5.5,  6,  6.5,  7,  7.5,
     8,  8.5,  9,  9.5, 10, 10.5, 11, 11.5,
    12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5,
    16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5,
    20
  ],
  [ 
    [ 1, -0.15 ],
    [ 0.8166746082016955, -0.557692153141863 ],
    [ 0.4732068547304446, -0.7817998448337315 ],
    [ 0.06999369577839351, -0.796942079229001 ],
    [ -0.29296876631077856, -0.6287833580492583 ],
    [ -0.538764437154819, -0.3410884006508845 ],
    [ -0.6278299171850139, -0.015917620080742143 ],
    [ -0.5617466546837617, 0.2675784748910966 ],
    [ -0.377150240555385, 0.45074951486228504 ],
    [ -0.1325182233446417, 0.5059244391806383 ],
    [ 0.108167684175686, 0.4383875833898941 ],
    [ 0.29073509407040543, 0.2805868154348402 ],
    [ 0.38177114949700197, 0.0809725652433621 ],
    [ 0.37332759332299786, -0.10924683419221558 ],
    [ 0.2811808583957149, -0.24813196381575087 ],
    [ 0.13794049725821486, -0.31125652705202045 ],
    [ -0.01670960459052124, -0.2948214440471942 ],
    [ -0.14601910585511502, -0.21364539900084717 ],
    [ -0.22411810217094255, -0.09520237647253792 ],
    [ -0.24038331741250435, 0.02838757207966796 ],
    [ -0.19972966488592925, 0.12830826343618923 ],
    [ -0.11932845288765788, 0.18513879181538354 ],
    [ -0.02299611928126133, 0.19196035473015535 ],
    [ 0.06514625783123669, 0.15418786007944127 ],
    [ 0.12619953247723414, 0.08662081192625241 ],
    [ 0.1500560037190719, 0.008771314213723642 ],
    [ 0.13647291184074287, -0.060228604569482015 ],
    [ 0.09375352427278882, -0.10592388418793355 ],
    [ 0.03566892159044637, -0.12117145286237656 ],
    [ -0.022434601049273587, -0.10674576554678848 ],
    [ -0.06734406337492452, -0.07005987649144976 ],
    [ -0.09068673306717923, -0.02255531249078119 ],
    [ -0.09015953186782914, 0.023460392555516397 ],
    [ -0.06920720620196623, 0.05773255117331912 ],
    [ -0.03543850777137111, 0.07410487021245042 ],
    [ 0.0016837355195970214, 0.07134826438697033 ],
    [ 0.03325233441033073, 0.052753978829039525 ],
    [ 0.05286346976044077, 0.024755649705834232 ],
    [ 0.05772395744096257, -0.004971149328666756 ],
    [ 0.048783370558624965, -0.029427008029129665 ],
    [ 0.0299968094632241, -0.043785872625261305 ]
  ]
]
```

