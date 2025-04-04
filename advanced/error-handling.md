---
layout: cheatsheet
title: Error Handling
description: Error handling patterns, custom errors, and error wrapping
permalink: /go-cheatsheets/advanced/error-handling/
---

# Go Error Handling

## Basic Error Handling

In Go, errors are values returned by functions:

```go
// Function that returns an error
func doSomething() error {
    // If an error occurs
    if problemHappened {
        return errors.New("something went wrong")
    }
    return nil // No error
}

// Handling errors
err := doSomething()
if err != nil {
    // Handle the error
    log.Fatalf("Error: %v", err)
}
```

## Custom Error Types

Creating custom error types for more specific error handling:

```go
// Custom error type
type NotFoundError struct {
    Item string
}

// Implementing the error interface
func (e NotFoundError) Error() string {
    return fmt.Sprintf("%s not found", e.Item)
}

// Using custom error
func findItem(id string) (Item, error) {
    // If item not found
    return Item{}, NotFoundError{Item: id}
}

// Type assertion in error handling
item, err := findItem("xyz")
if err != nil {
    if nfErr, ok := err.(NotFoundError); ok {
        // Handle not found error specifically
        fmt.Printf("Could not find: %s\n", nfErr.Item)
    } else {
        // Handle other errors
        fmt.Printf("Error: %v\n", err)
    }
}
```

## Error Wrapping (Go 1.13+)

Wrapping errors to add context:

```go
// Wrapping an error
func processFile(path string) error {
    file, err := os.Open(path)
    if err != nil {
        return fmt.Errorf("failed to open file: %w", err)
    }
    defer file.Close()
    
    // More processing...
    return nil
}

// Unwrapping errors
err := processFile("config.json")
if err != nil {
    // Print full error chain
    fmt.Println(err)
    
    // Get original error
    if errors.Is(err, os.ErrNotExist) {
        fmt.Println("File does not exist")
    }
}
```

## Multiple Error Checks

Go 1.20+ introduced more elegant ways to handle multiple errors:

```go
// Check multiple error conditions
func process() error {
    if err := step1(); err != nil {
        return err
    }
    if err := step2(); err != nil {
        return err
    }
    if err := step3(); err != nil {
        return err
    }
    return nil
}

// Alternative approach with defer and named return
func processWithDefer() (err error) {
    defer func() {
        if err != nil {
            err = fmt.Errorf("process failed: %w", err)
        }
    }()
    
    if err = step1(); err != nil {
        return // early return, defer adds context
    }
    if err = step2(); err != nil {
        return
    }
    return step3()
}
```

## Error Handling Best Practices

1. Return errors rather than panicking
2. Check errors explicitly
3. Add context to errors when returning up the call stack
4. Only handle errors once
5. Use package `errors` for creating, wrapping, and inspecting errors
