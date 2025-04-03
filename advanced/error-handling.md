---
layout: default
title: Error Handling
description: Working with errors and custom error types in Go
permalink: /advanced/error-handling/
---

# Go Error Handling Cheatsheet

Go uses explicit error handling with return values rather than exceptions.

## Basic Error Handling

```go
// Function that returns an error
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Handling errors
result, err := divide(10, 2)
if err != nil {
    // Handle error
    fmt.Println("Error:", err)
    return // or handle it appropriately
}
// Use result
fmt.Println("Result:", result)
```

## Creating Errors

```go
// Using errors.New
err := errors.New("something went wrong")

// Using fmt.Errorf (with formatting)
err := fmt.Errorf("invalid value: %v", value)

// Custom error types
type ValidationError struct {
    Field string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}

// Creating custom error
err := ValidationError{Field: "age", Message: "must be positive"}
```

## Error Wrapping (Go 1.13+)

```go
// Wrapping an error with additional context
if err != nil {
    return fmt.Errorf("failed to process file: %w", err)
}

// Unwrapping an error
originalErr := errors.Unwrap(err)

// Checking if an error is a specific type
var validationErr ValidationError
if errors.As(err, &validationErr) {
    // It's a ValidationError, use validationErr
}

// Checking if an error matches a specific error
if errors.Is(err, os.ErrNotExist) {
    // File doesn't exist
}
```

## Multiple Error Handling Patterns

### Sentinel Errors
Predefined error values that can be compared with `==` or `errors.Is()`.

```go
// Defining sentinel errors
var (
    ErrNotFound = errors.New("not found")
    ErrPermission = errors.New("permission denied")
)

// Using sentinel errors
if errors.Is(err, ErrNotFound) {
    // Handle not found case
}
```

### Error Types
Custom error types that implement the `error` interface.

```go
type QueryError struct {
    Query string
    Err error
}

func (e *QueryError) Error() string {
    return fmt.Sprintf("query error for %q: %v", e.Query, e.Err)
}

func (e *QueryError) Unwrap() error {
    return e.Err
}
```

### Behavior-Based Error Handling
Checking if an error implements a specific interface.

```go
// Define an interface for errors that can provide a status code
type StatusCoder interface {
    StatusCode() int
}

// Check if error implements the interface
var sc StatusCoder
if errors.As(err, &sc) {
    statusCode := sc.StatusCode()
    // Use status code
}
```

## Panic and Recover

For exceptional situations where the program cannot continue.

```go
// Causing a panic
func doSomething() {
    if somethingTerribleHappened {
        panic("something terrible happened")
    }
}

// Recovering from a panic
func doSafely() (err error) {
    defer func() {
        if r := recover(); r != nil {
            // Convert panic to error
            err = fmt.Errorf("recovered from panic: %v", r)
        }
    }()
    
    doSomething() // might panic
    return nil
}
```

## Defer Statement

Often used with error handling to ensure cleanup.

```go
func processFile(filename string) error {
    f, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer f.Close() // Will be called when function returns
    
    // Process file...
    return nil
}
```

## Best Practices

### Handle Errors Once
```go
// Good
if err != nil {
    return err
}

// Avoid
if err != nil {
    log.Println(err) // Logging and returning is often redundant
    return err
}
```

### Add Context to Errors
```go
// Better error messages
if err != nil {
    return fmt.Errorf("failed to open config file %s: %w", filename, err)
}
```

### Don't Discard Errors
```go
// Bad
_ = someFunc() // Ignoring errors

// Good
err := someFunc()
if err != nil {
    // Handle it
}
```

### Use Structured Error Handling
```go
switch {
case errors.Is(err, ErrNotFound):
    // Handle not found
case errors.Is(err, ErrPermission):
    // Handle permission error
default:
    // Handle other errors
}
```

### Avoid Nested Error Handling
```go
// Avoid
if err := step1(); err != nil {
    if err := cleanup(); err != nil {
        log.Println("cleanup failed:", err)
    }
    return err
}

// Better
if err := step1(); err != nil {
    err2 := cleanup()
    if err2 != nil {
        log.Println("cleanup failed:", err2)
    }
    return err
}
