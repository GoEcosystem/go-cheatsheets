---
layout: cheatsheet
title: Standard Library
description: Common packages and functions from Go's extensive standard library
permalink: /go-cheatsheets/standard-library/standard-library/
---

# Go Standard Library

## fmt - Formatted I/O

```go
// Printing
fmt.Println("Hello, world")              // Print with newline
fmt.Print("No newline")                  // Print without newline
fmt.Printf("Formatted %s %d\n", "text", 42) // Format and print

// String formatting
s := fmt.Sprintf("Formatted %s %d", "text", 42) // Format to string

// Reading input
var name string
fmt.Scanln(&name)   // Read a line of text
fmt.Scanf("%s", &name) // Read with format
```

## os - Operating System Functionality

```go
// File operations
file, err := os.Open("file.txt")          // Open for reading
file, err := os.Create("newfile.txt")     // Create or truncate
file, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0755) // Custom flags

// Reading and writing files
data, err := os.ReadFile("file.txt")      // Read entire file
err := os.WriteFile("file.txt", data, 0644) // Write entire file

// Environment variables
value := os.Getenv("PATH")                // Get environment variable
os.Setenv("DEBUG", "true")                // Set environment variable

// Process information
pid := os.Getpid()                        // Get process ID
dir, _ := os.Getwd()                      // Get working directory
```

## io - Basic I/O interfaces

```go
// Copy data
n, err := io.Copy(dst, src)              // Copy from src to dst
n, err := io.CopyN(dst, src, 10)         // Copy exactly n bytes

// Reading with limits
data, err := io.ReadAll(reader)           // Read until EOF
n, err := io.ReadFull(reader, buf)        // Fill buf or error
```

## http - HTTP Client and Server

```go
// Basic HTTP server
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
})
log.Fatal(http.ListenAndServe(":8080", nil))

// HTTP client
resp, err := http.Get("https://example.com")
if err != nil {
    // Handle error
}
defer resp.Body.Close()
body, err := io.ReadAll(resp.Body)

// POST request
resp, err := http.Post("https://example.com", 
                      "application/json", 
                      strings.NewReader(`{"name":"value"}`))
```

## json - JSON Encoding/Decoding

```go
// Struct to JSON
type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age,omitempty"`
}
p := Person{Name: "John", Age: 30}
data, err := json.Marshal(p)

// JSON to struct
var p Person
err := json.Unmarshal(data, &p)

// Working with dynamic JSON
var data map[string]interface{}
err := json.Unmarshal(jsonData, &data)
name := data["name"].(string)
```

## time - Time and Duration

```go
// Getting current time
now := time.Now()                         // Current local time
utc := time.Now().UTC()                   // Current UTC time

// Creating time values
t := time.Date(2023, time.April, 15, 12, 30, 0, 0, time.UTC)

// Formatting and parsing
formatted := t.Format("2006-01-02 15:04:05") // Format time
t, err := time.Parse("2006-01-02", "2023-04-15") // Parse time string

// Duration
duration := 5 * time.Second
time.Sleep(duration)                      // Pause execution
timeout := time.After(10 * time.Second)   // Channel that receives after duration
```

## strings - String Manipulation

```go
// String operations
contains := strings.Contains("seafood", "foo")  // Check substring
count := strings.Count("hello", "l")            // Count occurrences
upper := strings.ToUpper("Hello")               // Convert to uppercase
lower := strings.ToLower("Hello")               // Convert to lowercase

// Splitting and joining
parts := strings.Split("a,b,c", ",")            // Split by separator
joined := strings.Join([]string{"a", "b"}, "-") // Join with separator

// Trimming
trimmed := strings.TrimSpace(" hello ")         // Remove leading/trailing spaces
trimPrefix := strings.TrimPrefix("hello", "he") // Remove prefix
```

## sync - Synchronization Primitives

```go
// WaitGroup
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    // Do work...
}()
wg.Wait()

// Mutex
var mu sync.Mutex
mu.Lock()
// Critical section...
mu.Unlock()

// RWMutex (reader/writer mutex)
var rwmu sync.RWMutex
rwmu.RLock()     // Multiple readers can read
// Read data...
rwmu.RUnlock()
```

## net - Network I/O

```go
// TCP Server
listener, err := net.Listen("tcp", ":8080")
for {
    conn, err := listener.Accept()
    go handleConnection(conn)
}

// TCP Client
conn, err := net.Dial("tcp", "example.com:80")
fmt.Fprintf(conn, "GET / HTTP/1.0\r\n\r\n")

// UDP
addr, _ := net.ResolveUDPAddr("udp", ":8080")
conn, _ := net.ListenUDP("udp", addr)
```

## context - Request-scoped Values and Cancellation

```go
// Creating contexts
ctx := context.Background()                     // Empty context
ctx, cancel := context.WithCancel(ctx)          // With cancellation
ctx, cancel := context.WithTimeout(ctx, 5*time.Second) // With timeout
defer cancel()                                  // Always call cancel

// Using context in functions
func doWork(ctx context.Context) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case <-time.After(100 * time.Millisecond):
        return nil
    }
}
```
