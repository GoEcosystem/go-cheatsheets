---
layout: default
title: Go Generics
permalink: /advanced/generics/
---

# Go Generics

Go 1.18 introduced generics, bringing type parameters to the language. This cheatsheet covers how to use generics effectively in Go projects.

## In this cheatsheet:
- [Basic Syntax](#basic-syntax)
- [Type Constraints](#type-constraints)
- [Generic Data Structures](#generic-data-structures)
- [Generic Functions](#generic-functions)
- [Type Sets](#type-sets)
- [Best Practices](#best-practices)

## Basic Syntax

Declare a generic function with type parameters:

```go
// A generic function that works with any type
func Print[T any](value T) {
    fmt.Println(value)
}

// Using the generic function
Print[string]("Hello, Generics!")
// Type inference allows omitting the type parameter
Print(42)
```

## Type Constraints

Constrain type parameters using interfaces:

```go
// Constraint for types that support comparison
type Comparable interface {
    comparable
}

// Function that only accepts comparable types
func AreEqual[T Comparable](a, b T) bool {
    return a == b
}

// Using built-in constraints from constraints package
import "golang.org/x/exp/constraints"

// Function that only accepts numeric types
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

## Generic Data Structures

Create generic data structures:

```go
// A generic stack
type Stack[T any] struct {
    items []T
}

// Methods for the generic stack
func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, error) {
    if len(s.items) == 0 {
        var zero T
        return zero, fmt.Errorf("stack is empty")
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, nil
}

// Creating and using a generic stack
strStack := Stack[string]{}
strStack.Push("Hello")
strStack.Push("World")
val, _ := strStack.Pop() // "World"
```

## Generic Functions

Using generics for algorithms:

```go
// Generic function to find an element in a slice
func Find[T comparable](slice []T, target T) int {
    for i, item := range slice {
        if item == target {
            return i
        }
    }
    return -1
}

// Using the function
nums := []int{1, 2, 3, 4, 5}
index := Find(nums, 3) // Returns 2
```

## Type Sets

Define type sets using union operators:

```go
// Type set for integers only
type Integer interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 | ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64
}

// Function that works with any integer type
func Sum[T Integer](values []T) T {
    var sum T
    for _, v := range values {
        sum += v
    }
    return sum
}
```

## Best Practices

Guidelines for using generics effectively:

1. **Use generics sparingly**: Only introduce generics when they provide clear benefits.

2. **Prefer concrete types**: Use concrete types when you know the exact type for better readability.

3. **Keep constraints simple**: Define reusable constraints in a central package.

4. **Provide examples**: Include examples in documentation to show how to use generic functions.

5. **Be cautious with performance**: Test and benchmark generic code versus specialized code.

> 🔔 **Note**: Generics in Go aim to solve real programming problems without adding unnecessary complexity. Use them when they provide tangible benefits in code reuse and type safety.
