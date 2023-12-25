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
export declare function SolveOde(func: (x: number[], param: TypeParam, t: number) => TypeFuncRes, solver: (func: (x: number[], param: TypeParam, t: number) => TypeFuncRes, param: TypeParam, x: number[], t: number, h: number, adaptive?: boolean | TypeAdaptive) => TypeOdeRes, param: TypeParam, start: number, end: number, h: number, amt: number[]): TypeResult;
export declare function rkf45(func: (x: number[], param: TypeParam, t: number) => TypeFuncRes, param: TypeParam, x: number[], t: number, h: number, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export declare function dopri5(func: (x: number[], param: TypeParam, t: number) => TypeFuncRes, param: TypeParam, x: number[], t: number, h: number, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export declare function dop853(func: (x: number[], param: TypeParam, t: number) => TypeFuncRes, param: TypeParam, x: number[], t: number, h: number, adaptive?: boolean | TypeAdaptive): TypeOdeRes;
export {};
