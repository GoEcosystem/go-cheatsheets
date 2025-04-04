---
layout: cheatsheet
title: Concurrency
description: Goroutines, channels, select statements, and synchronization patterns
permalink: /concurrency/concurrency/
---

# Go Concurrency

## Goroutines

Lightweight concurrent functions:

```go
// Starting a goroutine
go func() {
    // This function executes concurrently
    fmt.Println("Running in a goroutine")
}()

// Goroutine with a function
go myFunc(arg1, arg2)

// Simple example
func main() {
    go sayHello()
    // Wait to prevent program from exiting before goroutine completes
    time.Sleep(100 * time.Millisecond)
}

func sayHello() {
    fmt.Println("Hello from goroutine!")
}
```

## Channels

Communication between goroutines:

```go
// Create a channel
ch := make(chan int)      // Unbuffered channel
ch := make(chan int, 10)  // Buffered channel with capacity 10

// Send data to a channel (blocks if channel is full)
ch <- 42

// Receive data from a channel (blocks if channel is empty)
value := <-ch

// Check if receive was successful
value, ok := <-ch
if !ok {
    // Channel is closed
}

// Close a channel (sender only)
close(ch)

// Range over channel values until closed
for value := range ch {
    fmt.Println(value)
}
```

## Select Statement

Handling multiple channel operations:

```go
// Basic select statement
select {
case v1 := <-ch1:
    fmt.Println("Received from ch1:", v1)
case v2 := <-ch2:
    fmt.Println("Received from ch2:", v2)
case ch3 <- 23:
    fmt.Println("Sent to ch3")
case <-time.After(1 * time.Second):
    fmt.Println("Timeout after 1 second")
default:
    // Non-blocking case if no other case is ready
    fmt.Println("No channel operation ready")
}
```

## Wait Groups

Waiting for multiple goroutines:

```go
func main() {
    var wg sync.WaitGroup
    
    // Add number of goroutines to wait for
    wg.Add(2)
    
    go func() {
        defer wg.Done() // Signal completion
        time.Sleep(1 * time.Second)
        fmt.Println("Goroutine 1 finished")
    }()
    
    go func() {
        defer wg.Done() // Signal completion
        time.Sleep(2 * time.Second)
        fmt.Println("Goroutine 2 finished")
    }()
    
    // Wait for all goroutines to finish
    wg.Wait()
    fmt.Println("All goroutines completed")
}
```

## Mutex

Protecting shared resources:

```go
var (
    counter int
    mu      sync.Mutex
)

func increment() {
    mu.Lock()       // Lock the mutex
    defer mu.Unlock() // Ensure unlock happens
    counter++
}

func main() {
    // Start 1000 goroutines
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            increment()
        }()
    }
    wg.Wait()
    fmt.Println("Counter:", counter) // 1000
}
```

## Context

Controlling goroutine lifecycles:

```go
func main() {
    // Create a context with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel() // Always call cancel to release resources
    
    // Use context to coordinate goroutines
    go worker(ctx)
    
    // Wait for context to be done
    <-ctx.Done()
    fmt.Println("Main:", ctx.Err())
}

func worker(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Worker: Stopping due to", ctx.Err())
            return
        default:
            fmt.Println("Worker: Working...")
            time.Sleep(500 * time.Millisecond)
        }
    }
}
```

## Patterns

Common concurrency patterns:

```go
// Worker pool
func workerPool(numWorkers int, jobs <-chan int, results chan<- int) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2 // Do work
            }
        }(i)
    }
    wg.Wait()
    close(results)
}

// Fan-out, fan-in
func fanOutFanIn(input <-chan int) <-chan int {
    // Fan out to multiple workers
    workers := 4
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        channels[i] = worker(input)
    }
    
    // Fan in from multiple channels
    return merge(channels...)
}
