---
layout: cheatsheet
title: Testing
description: Unit testing, benchmarking, and test utilities in Go
permalink: /tooling/testing/
---

# Go Testing

## Basic Testing

Creating and running tests:

```go
// In file calc_test.go
package calc

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}

// Run tests
// go test
// go test ./...         # Test all packages
// go test -v            # Verbose output
// go test -run TestAdd  # Run specific test
```

## Test Tables

Testing multiple cases:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -2, -3},
        {"mixed", -1, 5, 4},
    }
    
    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got := Add(tc.a, tc.b)
            if got != tc.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", 
                    tc.a, tc.b, got, tc.expected)
            }
        })
    }
}
```

## Setup and Teardown

Managing test resources:

```go
func TestMain(m *testing.M) {
    // Setup code
    setupDatabase()
    
    // Run tests
    code := m.Run()
    
    // Teardown code
    cleanupDatabase()
    
    // Exit with code from tests
    os.Exit(code)
}

func setupTest(t *testing.T) func() {
    // Setup for an individual test
    t.Log("Setting up test")
    
    // Return teardown function
    return func() {
        t.Log("Tearing down test")
    }
}

func TestSomething(t *testing.T) {
    teardown := setupTest(t)
    defer teardown()
    
    // Test code here
}
```

## Subtests

Organizing tests hierarchically:

```go
func TestUserAPI(t *testing.T) {
    t.Run("Create", func(t *testing.T) {
        // Test user creation
    })
    
    t.Run("Read", func(t *testing.T) {
        // Test user retrieval
    })
    
    t.Run("Update", func(t *testing.T) {
        // Test user update
    })
    
    t.Run("Delete", func(t *testing.T) {
        // Test user deletion
    })
}

// Run specific subtest
// go test -run TestUserAPI/Create
```

## Benchmarking

Measuring performance:

```go
func BenchmarkAdd(b *testing.B) {
    // Reset timer if doing setup
    b.ResetTimer()
    
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}

// Run benchmarks
// go test -bench=.
// go test -bench=Add
// go test -bench=. -benchmem  // Include memory allocations
```

## Parallel Testing

Running tests concurrently:

```go
func TestParallel(t *testing.T) {
    t.Parallel() // Mark test as parallel-capable
    
    // Test code here
}

// Run tests with limited parallelism
// go test -parallel 4
```

## Test Helpers

Creating reusable test utilities:

```go
// Helper function
func assertDeepEqual(t *testing.T, got, want interface{}) {
    t.Helper() // Mark as helper (improves error reporting)
    
    if !reflect.DeepEqual(got, want) {
        t.Errorf("Got %v, want %v", got, want)
    }
}

func TestWithHelper(t *testing.T) {
    got := []int{1, 2, 3}
    want := []int{1, 2, 3}
    assertDeepEqual(t, got, want)
}
```

## Mocks and Fakes

Testing with dependencies:

```go
// Interface for dependency
type DataStore interface {
    GetUser(id string) (User, error)
}

// Mock implementation
type MockDataStore struct {
    Users map[string]User
}

func (m *MockDataStore) GetUser(id string) (User, error) {
    user, exists := m.Users[id]
    if !exists {
        return User{}, errors.New("user not found")
    }
    return user, nil
}

// Testing with mock
func TestUserService(t *testing.T) {
    mockStore := &MockDataStore{
        Users: map[string]User{
            "123": {ID: "123", Name: "Bob"},
        },
    }
    
    service := NewUserService(mockStore)
    user, err := service.GetUserByID("123")
    
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    
    if user.Name != "Bob" {
        t.Errorf("Expected name 'Bob', got '%s'", user.Name)
    }
}
```

## Coverage

Measuring test coverage:

```bash
# Run tests with coverage
go test -cover

# Generate coverage profile
go test -coverprofile=coverage.out

# View coverage in browser
go tool cover -html=coverage.out

# Check coverage percentage
go tool cover -func=coverage.out
```

## Fuzzing (Go 1.18+)

Generate random inputs for tests:

```go
func FuzzAdd(f *testing.F) {
    // Provide seed corpus
    f.Add(1, 2)
    f.Add(-1, -2)
    
    // Fuzz test function
    f.Fuzz(func(t *testing.T, a, b int) {
        result := Add(a, b)
        
        // Verify properties that should always hold
        if a > 0 && b > 0 && result <= 0 {
            t.Errorf("Add(%d, %d) = %d, expected positive", a, b, result)
        }
        
        if a == 0 && result != b {
            t.Errorf("Add(0, %d) = %d, expected %d", b, result, b)
        }
    })
}

// Run fuzz tests
// go test -fuzz=Fuzz
