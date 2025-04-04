---
layout: cheatsheet
title: Interfaces
description: Interface definitions, type assertions, and empty interfaces
permalink: /go-cheatsheets/advanced/interfaces/
---

# Go Interfaces

Interfaces in Go define behavior by declaring a set of methods. This cheatsheet explains how to effectively use interfaces in Go 1.24.1.

## In this cheatsheet:
- [Interface Basics](#interface-basics)
- [Empty Interface](#empty-interface)
- [Interface Implementation](#interface-implementation)
- [Type Assertions](#type-assertions)
- [Type Switches](#type-switches)
- [Interface Composition](#interface-composition)
- [Common Interfaces](#common-interfaces)
- [Best Practices](#best-practices)

## Interface Basics

Declaring and implementing interfaces:

```go
// Declaring an interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Implementing an interface
type FileReader struct {
    // fields
}

// This method makes FileReader implement the Reader interface
func (fr *FileReader) Read(p []byte) (n int, err error) {
    // implementation
    return len(p), nil
}
```

## Empty Interface

The empty interface can hold values of any type:

```go
// Empty interface (any type)
var i interface{}

// Can hold any value
i = 42
i = "hello"
i = struct{ Name string }{"Go"}

// Since Go 1.18, you can use 'any' as an alias for interface{}
var j any
j = []int{1, 2, 3}
```

## Interface Implementation

In Go, interface implementation is implicit:

```go
// An interface for shapes
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Circle implements Shape
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// Using the interface
func PrintShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

// Creating an instance
c := Circle{Radius: 5}
PrintShapeInfo(c) // Automatically works, no explicit declaration needed
```

## Type Assertions

Type assertions provide access to an interface's underlying concrete value:

```go
// Type assertion syntax
value, ok := i.(Type)

// Example
var i interface{} = "hello"

// Successful type assertion
if s, ok := i.(string); ok {
    fmt.Println(s) // "hello"
}

// Failed type assertion
if n, ok := i.(int); ok {
    fmt.Println(n)
} else {
    fmt.Println("i is not an int") // This will be printed
}

// Panic if type is wrong and not using the comma-ok form
s := i.(string)  // Safe because i contains a string
n := i.(int)     // Will panic
```

## Type Switches

Type switches allow handling multiple types:

```go
// Type switch syntax
switch v := i.(type) {
case Type1:
    // v has Type1
case Type2:
    // v has Type2
default:
    // v has the same type as i
}

// Example
func describe(i interface{}) {
    switch v := i.(type) {
    case int:
        fmt.Printf("Integer: %d\n", v)
    case string:
        fmt.Printf("String: %s\n", v)
    case bool:
        fmt.Printf("Boolean: %v\n", v)
    default:
        fmt.Printf("Unknown type: %T\n", v)
    }
}

describe(42)      // Integer: 42
describe("hello") // String: hello
describe(true)    // Boolean: true
describe(3.14)    // Unknown type: float64
```

## Interface Composition

Interfaces can be composed from other interfaces:

```go
// Component interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Composed interface
type ReadWriter interface {
    Reader
    Writer
}

// Using a composed interface
func Copy(rw ReadWriter) error {
    buf := make([]byte, 1024)
    n, err := rw.Read(buf)
    if err != nil {
        return err
    }
    _, err = rw.Write(buf[:n])
    return err
}
```

## Common Interfaces

Standard library interfaces you should know:

```go
// io.Reader - for reading data
type Reader interface {
    Read(p []byte) (n int, err error)
}

// io.Writer - for writing data
type Writer interface {
    Write(p []byte) (n int, err error)
}

// fmt.Stringer - for string representation
type Stringer interface {
    String() string
}

// error - for error handling
type error interface {
    Error() string
}
```

## Best Practices

1. **Keep interfaces small** - Interfaces with fewer methods are more flexible.

2. **Accept interfaces, return concrete types** - Functions should accept interface parameters but return concrete types.

3. **Define interfaces where they're used** - Define interfaces in the package that uses them, not the package that implements them.

4. **Use composition** - Build complex interfaces from simpler ones.

5. **Don't export interfaces for implementation** - Unless they're meant to be implemented by users.

> 💡 **Tip**: One of Go's strengths is designing around behavior (interfaces) rather than hierarchies. This promotes composition over inheritance and leads to more flexible code.
