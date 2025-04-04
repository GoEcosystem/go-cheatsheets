---
layout: cheatsheet
title: Basic Syntax
description: Variables, functions, control flow, and basic syntax in Go
permalink: /basics/basic-syntax/
---

# Go Basic Syntax Cheatsheet

## Package Declaration
Every Go file must start with a package declaration:
```go
{% raw %}
package main  // Executable program
package mylib // Reusable library
{% endraw %}
```

## Import Statements
```go
{% raw %}
// Single import
import "fmt"

// Multiple imports
import (
    "fmt"
    "time"
    "strings"
)
{% endraw %}
```

## Main Function
Entry point for executable programs:
```go
{% raw %}
func main() {
    // Your code here
}
{% endraw %}
```

## Variables
```go
{% raw %}
// Variable declaration with explicit type
var name string = "John"
var age int = 30

// Short variable declaration (type inferred)
name := "John"
age := 30

// Multiple variable declaration
var (
    name string = "John"
    age  int    = 30
)

// Multiple short declarations
name, age := "John", 30

// Constants
const Pi = 3.14159
const (
    StatusOK   = 200
    StatusNotFound = 404
)
{% endraw %}
```

## Basic Data Types
```go
{% raw %}
// Numeric types
var i int = 10         // Platform dependent (32 or 64 bit)
var i8 int8 = 127      // -128 to 127
var i16 int16 = 32767  // -32768 to 32767
var i32 int32 = 2147483647
var i64 int64 = 9223372036854775807

var ui uint = 10       // Platform dependent (32 or 64 bit)
var ui8 uint8 = 255    // 0 to 255
var ui16 uint16 = 65535
var ui32 uint32 = 4294967295
var ui64 uint64 = 18446744073709551615

// Floating point
var f32 float32 = 3.14
var f64 float64 = 3.141592653589793

// Complex numbers
var c64 complex64 = 5 + 6i
var c128 complex128 = 5 + 6i

// Boolean
var isTrue bool = true
var isFalse bool = false

// String
var greeting string = "Hello, Go!"

// Rune (alias for int32, represents Unicode code point)
var r rune = 'A'

// Byte (alias for uint8)
var b byte = 'a'
{% endraw %}
```

## Control Structures

### If-Else
```go
{% raw %}
if x > 10 {
    // do something
} else if x < 0 {
    // do something else
} else {
    // default case
}

// If with initialization statement
if value := getValue(); value > 10 {
    // value is available only in this scope
}
{% endraw %}
```

### For Loops
```go
{% raw %}
// Standard for loop
for i := 0; i < 10; i++ {
    // code
}

// While-like loop
for count < 10 {
    // code
}

// Infinite loop
for {
    // code
    if condition {
        break
    }
}

// For-range loop (arrays, slices, strings, maps, channels)
for index, value := range collection {
    // code
}

// Skipping values in range
for _, value := range collection {
    // code (ignore index)
}
for index, _ := range collection {
    // code (ignore value)
}
{% endraw %}
```

### Switch
```go
{% raw %}
switch value {
case 1:
    // code
case 2, 3, 4:
    // code for multiple values
default:
    // default code
}

// Switch with initialization
switch os := runtime.GOOS; os {
case "darwin":
    // code for macOS
case "linux":
    // code for Linux
default:
    // code for other OS
}

// Switch without expression (like if-else chain)
switch {
case x > 100:
    // code
case x < 0:
    // code
default:
    // code
}
{% endraw %}
```

## Functions
```go
{% raw %}
// Basic function
func add(x int, y int) int {
    return x + y
}

// Multiple parameters of same type
func add(x, y int) int {
    return x + y
}

// Multiple return values
func divide(x, y float64) (float64, error) {
    if y == 0 {
        return 0, errors.New("division by zero")
    }
    return x / y, nil
}

// Named return values
func divide(x, y float64) (result float64, err error) {
    if y == 0 {
        err = errors.New("division by zero")
        return // returns result=0, err=error
    }
    result = x / y
    return // returns result=x/y, err=nil
}

// Variadic functions
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}
// Call as: sum(1, 2, 3) or sum(nums...)
{% endraw %}
```

## Comments
```go
{% raw %}
// Single-line comment

/*
   Multi-line
   comment
*/

// Documentation comment for the package
// Package math provides basic mathematical functions.
package math

// Documentation comment for a function
// Add returns the sum of x and y.
func Add(x, y int) int {
    return x + y
}
{% endraw %}
