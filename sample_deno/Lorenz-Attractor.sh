#!/bin/bash

mkdir -p result png
deno run --allow-write Lorenz-Attractor.ts
gnuplot gnuplot/Lorenz-Attractor_png.gp

