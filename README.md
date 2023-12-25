# Typescriptで常微分方程式を数値的に解く
## 参考URL

基本的に[Javascriptで8次のルンゲクッタ](https://zenn.dev/yonda/articles/71aef28aa46fcb)
に記載されているプログラムを改変しました。

"本記事のコード自体はお好きにコピペをどうぞ"
と書かれていたため、
改変した上でMIT Licenseで公開します。

## 主な特徴
1. ソルバー関数（rk45, dopri5, dop853）の引数に
   常微分方程式の関数で使用するパラメータを取れるように変更した
    - 変更前はパラメータをグローバル変数として設定する必要があったため
1. 常微分方程式を数値的に解く関数`SolveOde`内で
   指定した終了時間まで値を求めるようにした
    - `開始時間 =+ 間隔`のようにすると、
      小数の丸め誤差によって終了時間のデータが欠損する
    - Rustの`ode_solvers`が該当する

## ソルバー関数
+ rkf45
    + ルンゲ＝クッタ法 (Runge-Kutta method)
+ dopri5
    + ドルマン=プリンス法 (Dormand-Prince method order 5)
+ dop853
    + ドルマン=プリンス法 (Dormand-Prince method order 8)


## 例
[Javascriptで8次のルンゲクッタ](https://zenn.dev/yonda/articles/71aef28aa46fcb)
に記載されている例

### 必要な型および関数のインポート
```
import { TypeFuncRes, TypeParam } from "./solve_ode";
import { SolveOde, rkf45, dopri5, dop853 } from "./solve_ode";
```

- `TypeParam`: `number[]`
- `TypeFuncRes`: `number[]`

### 常微分方程式の定義

```typescript
// Definition of ODE
//
// dx0/dt = x1
// dx1/dt = -2 * param[0] * x1 - x0
function func(x: number[], param: TypeParam, _t: number): TypeFuncRes {
    return [
        x[1],
        -2 * param[0] * x[1] - x[0]
    ];
}
```

### パラメータ値の設定および解析
```typescript
let param = [0.15]

let res = SolveOde(
    func,        // ODE, solver
    dop853,      // solver
    param,       // parameters
    0, 20, 0.5,  // start, end, step
    [1, -0.15]   // initial values
);
console.log(res)
```

### 実行
```bash
# download from repository
npm install
npm run build  # bundle using webpack

node dist/main.js
```

返り値は`[number[], number[][]]`
- 要素1： 時間の配列
- 要素2： "値の配列"の配列

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

