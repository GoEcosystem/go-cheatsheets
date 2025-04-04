---
layout: cheatsheet
title: Generics
description: Type parameters, constraints, and generic data structures
permalink: /advanced/generics/
---

# Go Generics

## Basic Generic Functions

Generic functions with type parameters:

```go
// Generic function with a single type parameter
func PrintAny[T any](item T) {
    fmt.Println(item)
}

// Usage
PrintAny[string]("hello")
PrintAny[int](42)
// Type inference allows omitting the type argument
PrintAny(true)
```

## Type Constraints

Constraining type parameters with interfaces:

```go
// Generic function with constraint
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

// Usage
min := Min[int](5, 10)
minFloat := Min(3.14, 2.71) // Type inference
```

## Custom Constraints

Creating custom type constraints:

```go
// Custom constraint interface
type Number interface {
    int | int64 | float64 | float32
}

// Generic function with custom constraint
func Sum[T Number](values []T) T {
    var result T
    for _, v := range values {
        result += v
    }
    return result
}

// Usage
ints := []int{1, 2, 3, 4, 5}
sum := Sum(ints) // 15
```

## Generic Data Structures

Creating generic data structures:

```go
// Generic stack
type Stack[T any] struct {
    items []T
}

// Methods on generic types
func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, error) {
    var zero T
    if len(s.items) == 0 {
        return zero, errors.New("stack is empty")
    }
    
    index := len(s.items) - 1
    item := s.items[index]
    s.items = s.items[:index]
    return item, nil
}

// Usage
strStack := Stack[string]{}
strStack.Push("hello")
strStack.Push("world")
item, _ := strStack.Pop() // "world"
```

## Type Parameter Inference

Type inference in function chains:

```go
// Generic map function
func Map[T, U any](items []T, fn func(T) U) []U {
    result := make([]U, len(items))
    for i, item := range items {
        result[i] = fn(item)
    }
    return result
}

// Usage with type inference
nums := []int{1, 2, 3, 4}
squares := Map(nums, func(n int) int { 
    return n * n 
})
// squares = [1, 4, 9, 16]
```

## Best Practices for Generics

1. Use generics when there's a clear need for type parameterization
2. Prefer the narrowest possible constraint that works for your use case
3. Use `any` constraint when you need to accept all types
4. Import `golang.org/x/exp/constraints` for common constraints (Go 1.18+)
5. Remember that type parameters are resolved at compile time
