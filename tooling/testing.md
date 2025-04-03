---
layout: default
title: Testing
description: Unit testing, benchmarking, and mocking in Go
permalink: /tooling/testing/
---

# Go Testing Cheatsheet

Go has built-in testing support in the standard library's `testing` package.

## Basic Testing

```go
// file: math.go
package math

func Add(a, b int) int {
    return a + b
}

// file: math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}
```

## Running Tests

```bash
# Run all tests in current package
go test

# Run tests with verbose output
go test -v

# Run specific test
go test -run TestAdd

# Run tests matching pattern
go test -run "TestAdd|TestSubtract"

# Run tests in specific package
go test github.com/user/project/package

# Run tests in all packages
go test ./...

# Run tests with race detector
go test -race

# Run benchmarks
go test -bench=.

# Run benchmarks with memory allocation stats
go test -bench=. -benchmem
```

## Test Structure

```go
func TestXxx(t *testing.T) {
    // Setup
    
    // Test
    got := functionUnderTest()
    
    // Assert
    if got != want {
        t.Errorf("functionUnderTest() = %v; want %v", got, want)
    }
    
    // Teardown (if needed)
}
```

## Table-Driven Tests

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -2, -3, -5},
        {"mixed", -2, 3, 1},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

## Test Helpers

```go
func setupTest(t *testing.T) *TestEnv {
    t.Helper() // Marks this function as a helper (error reports caller's line number)
    
    // Setup code
    env := &TestEnv{
        // Initialize test environment
    }
    
    return env
}

func TestSomething(t *testing.T) {
    env := setupTest(t)
    // Test using env
}
```

## Assertions and Test Control

```go
// Fatal stops test execution immediately
if err != nil {
    t.Fatalf("Setup failed: %v", err)
}

// Error reports error but continues test
if got != want {
    t.Errorf("Got %v, want %v", got, want)
}

// Log outputs information when tests are run with -v flag
t.Logf("Processing item %d", i)

// Skip skips the current test
if testing.Short() {
    t.Skip("Skipping in short mode")
}

// Parallel marks test to be run in parallel with other parallel tests
t.Parallel()
```

## Subtests

```go
func TestFeature(t *testing.T) {
    // Setup common to all subtests
    
    t.Run("case1", func(t *testing.T) {
        // Test case 1
    })
    
    t.Run("case2", func(t *testing.T) {
        // Test case 2
    })
}
```

## Benchmarks

```go
func BenchmarkAdd(b *testing.B) {
    // Setup
    
    b.ResetTimer() // Reset timer if setup is expensive
    
    for i := 0; i < b.N; i++ {
        Add(2, 3) // Function under test
    }
}

// Benchmark with different input sizes
func BenchmarkSliceAccess(b *testing.B) {
    for size := 1; size <= 1024*1024; size *= 4 {
        b.Run(fmt.Sprintf("size-%d", size), func(b *testing.B) {
            slice := make([]int, size)
            b.ResetTimer()
            
            for i := 0; i < b.N; i++ {
                _ = slice[i%size]
            }
        })
    }
}
```

## Examples (Testable Documentation)

```go
func ExampleAdd() {
    sum := Add(1, 2)
    fmt.Println(sum)
    // Output: 3
}

func ExamplePerson_FullName() {
    p := Person{First: "John", Last: "Doe"}
    fmt.Println(p.FullName())
    // Output: John Doe
}
```

## Mocking

Go doesn't have built-in mocking, but interfaces make it easy to create test doubles.

```go
// Interface to mock
type Database interface {
    GetUser(id string) (User, error)
}

// Mock implementation
type MockDB struct {
    users map[string]User
}

func (m *MockDB) GetUser(id string) (User, error) {
    user, ok := m.users[id]
    if !ok {
        return User{}, errors.New("user not found")
    }
    return user, nil
}

// Test using mock
func TestUserService(t *testing.T) {
    mockDB := &MockDB{
        users: map[string]User{
            "123": {ID: "123", Name: "Test User"},
        },
    }
    
    service := NewUserService(mockDB)
    user, err := service.GetUserDetails("123")
    
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    
    if user.Name != "Test User" {
        t.Errorf("Expected name 'Test User', got '%s'", user.Name)
    }
}
```

## HTTP Testing

```go
import (
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestHandler(t *testing.T) {
    // Create a request
    req, err := http.NewRequest("GET", "/api/users", nil)
    if err != nil {
        t.Fatal(err)
    }
    
    // Create a response recorder
    rr := httptest.NewRecorder()
    
    // Create the handler
    handler := http.HandlerFunc(UserHandler)
    
    // Serve the request
    handler.ServeHTTP(rr, req)
    
    // Check status code
    if status := rr.Code; status != http.StatusOK {
        t.Errorf("handler returned wrong status code: got %v want %v",
            status, http.StatusOK)
    }
    
    // Check response body
    expected := `{"users":[]}`
    if rr.Body.String() != expected {
        t.Errorf("handler returned unexpected body: got %v want %v",
            rr.Body.String(), expected)
    }
}

// Test server for integration tests
func TestIntegration(t *testing.T) {
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"status":"ok"}`))
    }))
    defer server.Close()
    
    resp, err := http.Get(server.URL)
    if err != nil {
        t.Fatal(err)
    }
    
    if resp.StatusCode != http.StatusOK {
        t.Errorf("Expected status OK, got %v", resp.Status)
    }
}
```

## Test Coverage

```bash
# Run tests with coverage
go test -cover

# Generate coverage profile
go test -coverprofile=coverage.out

# View coverage in browser
go tool cover -html=coverage.out

# View coverage in terminal
go tool cover -func=coverage.out
```

## Test Main

```go
func TestMain(m *testing.M) {
    // Setup before all tests
    setupDatabase()
    
    // Run tests
    code := m.Run()
    
    // Teardown after all tests
    cleanupDatabase()
    
    // Exit with test result code
    os.Exit(code)
}
```

## Golden Files for Test Data

```go
func TestGenerateReport(t *testing.T) {
    got := GenerateReport(testData)
    
    // Update golden file if flag is set
    if *update {
        os.WriteFile("testdata/report.golden", []byte(got), 0644)
    }
    
    // Read golden file
    want, err := os.ReadFile("testdata/report.golden")
    if err != nil {
        t.Fatalf("Failed to read golden file: %v", err)
    }
    
    if got != string(want) {
        t.Errorf("GenerateReport() = %v, want %v", got, string(want))
    }
}
```

## Testing with Temporary Files/Directories

```go
func TestFileProcessing(t *testing.T) {
    // Create temp dir that's automatically cleaned up
    tempDir, err := os.MkdirTemp("", "test")
    if err != nil {
        t.Fatalf("Failed to create temp dir: %v", err)
    }
    defer os.RemoveAll(tempDir)
    
    // Create temp file
    tempFile, err := os.CreateTemp(tempDir, "test-*.txt")
    if err != nil {
        t.Fatalf("Failed to create temp file: %v", err)
    }
    
    // Write test data
    _, err = tempFile.Write([]byte("test data"))
    if err != nil {
        t.Fatalf("Failed to write to temp file: %v", err)
    }
    tempFile.Close()
    
    // Test function that processes the file
    result, err := ProcessFile(tempFile.Name())
    
    // Assertions
    if err != nil {
        t.Errorf("ProcessFile() error = %v", err)
    }
    if result != "expected result" {
        t.Errorf("ProcessFile() = %v, want %v", result, "expected result")
    }
}
