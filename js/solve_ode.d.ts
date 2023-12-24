export type TypeParam = number[];
export type TypeFuncRes = number[];
export type TypeResult = [number[], number[][]];
type TypeAdaptive = {
    atol: number[];
    rtol: number[];
    maxiter?: number;
    fac?: number;
    facmax?: number;
    facmin?: number;
};
type TypeOdeRes = [number[], number, number];
export declare function SolveOde(func: (x: number[], t: number, param: TypeParam) => TypeFuncRes, solver: (func: (x: number[], t: number, param: TypeParam) => TypeFuncRes, x: number[], t: number, h: number, param: TypeParam, adaptive?: boolean | TypeAdaptive) => TypeOdeRes, start: number, end: number, h: number, amt: number[], param: TypeParam): TypeResult;
export declare function rkf45(func: (x: number[], t: number, param: TypeParam) => TypeFuncRes, x: number[], t: number, h: number, param: TypeParam, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export declare function dopri5(func: (x: number[], t: number, param: TypeParam) => TypeFuncRes, x: number[], t: number, h: number, param: TypeParam, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export declare function dop853(func: (x: number[], t: number, param: TypeParam) => TypeFuncRes, x: number[], t: number, h: number, param: TypeParam, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export {};
