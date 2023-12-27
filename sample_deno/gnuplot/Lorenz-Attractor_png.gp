set term pngcairo
set title font "Arial, 21"
set tics font "Arial, 11"

set output "png/Lorenz-Attractor.png"
set title "Lorenz-Attractor"

splot "result/Lorenz-Attractor.txt" with lines linecolor "blue" notitle

