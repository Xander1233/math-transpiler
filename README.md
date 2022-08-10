# math-transpiler
Transpiler to create mathematical expression and automatically obtain the result via the console

## Usage

with ts-node:
```
$ ts-node ./src/transpiler.ts '<Code>'
```

transpile the Typescript and execute afterwards: (Typescript is required)
```
$ tsc
$ node ./dist/transpiler.js '<Code>'
```

## Documentation

### Constants

`PI`

PI constant

`E`

Euler constant

`LN10`

Natural logarithm of 10

`LN2`

Natural logarithm of 2

`LOG10E`

Logarithm of 10 of Euler constant

`LOG2E`

Logarithm of 2 of Euler constant

`SQRT1_2`

Square root of 1/2

`SQRT2`

Square root of 2


### Functions

`acos`

arcus cosinus function

acos(x)

Max 1 parameter

`asin`

arcus sinus function

asin(x)

Max 1 parameter

`atan`

arcus tangens function

atan(x)

Max 1 parameter

`sin`

sinus function

sin(x)

Max 1 parameter

`cos`

cosinus function

cos(x)

Max 1 parameter

`tan`

tangens function

tan(x)

Max 1 parameter

`cbrt`

cube root function

cbrt(x)

Max 1 parameter

`log`

logarithm function

log(x)

Max 1 parameter

`log10`

logarithm function with base 10

log10(x)

Max 1 parameter

`log2`

logarithm function with base 2

log2(x)

Max 1 parameter

`rand`

random number function

rand()

Max 0 parameter

`sqrt`

square root function

sqrt(x)

Max 1 parameter

`floor`

floor function

floor(x)

Max 1 parameter

`add`

addition function

add(x, y)

Max 2 parameter

`subtract`

subtraction function

subtract(x, y)

Max 2 parameter

`multiply`

multiplication function

multiply(x, y)

Max 2 parameter

`divide`

division function

divide(x, y)

Max 2 parameter

`pow`

power function

pow(x, y)

Max 2 parameter