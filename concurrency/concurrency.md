---
layout: default
title: Concurrency
description: Goroutines, channels, and synchronization primitives in Go
permalink: /concurrency/
---

# Go Concurrency Cheatsheet

Go's concurrency model is based on goroutines and channels, inspired by Communicating Sequential Processes (CSP).

## Goroutines
Lightweight threads managed by the Go runtime.

```go
// Start a goroutine
go func() {
    // code to run concurrently
    fmt.Println("Running in a goroutine")
}()

// Goroutine with function call
go doSomething(arg1, arg2)

// Wait for goroutines to finish (simple approach)
time.Sleep(time.Second)  // Not recommended for production

// Better approach with WaitGroup
var wg sync.WaitGroup
wg.Add(1)  // Add counter for one goroutine
go func() {
    defer wg.Done()  // Decrement counter when goroutine finishes
    // code
}()
wg.Wait()  // Block until counter becomes zero
```

## Channels
Typed conduits for communication between goroutines.

```go
// Create unbuffered channel
ch := make(chan int)

// Create buffered channel with capacity 5
bufCh := make(chan string, 5)

// Send value to channel (blocks until received)
ch <- 42

// Receive value from channel (blocks until sent)
value := <-ch

// Non-blocking send with select
select {
case ch <- value:
    // value sent
default:
    // would block, not sent
}

// Non-blocking receive with select
select {
case value := <-ch:
    // value received
default:
    // would block, no value available
}

// Close channel (sender should close)
close(ch)

// Check if channel is closed while receiving
value, ok := <-ch  // ok is false if channel is closed and empty

// Range over channel (stops when channel is closed)
for value := range ch {
    // process value
}

// Directional channels (for function parameters)
func send(ch chan<- int)    // can only send to channel
func receive(ch <-chan int) // can only receive from channel
```

## Select Statement
Waits on multiple channel operations.

```go
select {
case v1 := <-ch1:
    // handle value from ch1
case v2 := <-ch2:
    // handle value from ch2
case ch3 <- value:
    // value sent to ch3
case <-time.After(1 * time.Second):
    // timeout after 1 second
default:
    // run if no other case is ready (non-blocking)
}
```

## Synchronization Primitives

### Mutex
Mutual exclusion lock for protecting shared resources.

```go
var mu sync.Mutex
var count int

// Lock before accessing shared resource
mu.Lock()
count++
mu.Unlock()

// Defer unlock (good practice)
func increment() {
    mu.Lock()
    defer mu.Unlock()
    count++
}
```

### RWMutex
Reader/Writer mutual exclusion lock.

```go
var rwMu sync.RWMutex
var data map[string]string

// Multiple readers can acquire read lock
func read(key string) string {
    rwMu.RLock()
    defer rwMu.RUnlock()
    return data[key]
}

// Only one writer can acquire write lock
func write(key, value string) {
    rwMu.Lock()
    defer rwMu.Unlock()
    data[key] = value
}
```

### Once
Ensures a function is executed only once.

```go
var once sync.Once
var instance *Singleton

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}
```

### WaitGroup
Waits for a collection of goroutines to finish.

```go
var wg sync.WaitGroup

// Add number of goroutines to wait for
wg.Add(3)

for i := 0; i < 3; i++ {
    go func(id int) {
        defer wg.Done()  // Decrement counter when done
        // Do work
    }(i)
}

// Wait for all goroutines to finish
wg.Wait()
```

### Cond
Condition variable for goroutine waiting.

```go
var mu sync.Mutex
cond := sync.NewCond(&mu)

// Wait for condition
mu.Lock()
for !condition() {
    cond.Wait()  // Atomically unlocks mu and blocks until Signal/Broadcast
}
// mu is locked again when Wait returns
mu.Unlock()

// Signal one waiting goroutine
mu.Lock()
// Change condition
cond.Signal()
mu.Unlock()

// Signal all waiting goroutines
mu.Lock()
// Change condition
cond.Broadcast()
mu.Unlock()
```

## Context
For cancellation, deadlines, and passing request-scoped values.

```go
// Create context with cancellation
ctx, cancel := context.WithCancel(context.Background())
defer cancel()  // Cancel when we're done

// Create context with timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// Create context with deadline
ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(5*time.Second))
defer cancel()

// Create context with value
ctx = context.WithValue(ctx, "key", "value")

// Get value from context
if value, ok := ctx.Value("key").(string); ok {
    // Use value
}

// Check if context is done
select {
case <-ctx.Done():
    // Context cancelled or timed out
    err := ctx.Err()  // context.Canceled or context.DeadlineExceeded
    return
default:
    // Continue work
}
```

## Common Concurrency Patterns

### Worker Pool
```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        // Do work
        results <- j * 2
    }
}

// Create channels
jobs := make(chan int, 100)
results := make(chan int, 100)

// Start workers
for w := 1; w <= 3; w++ {
    go worker(w, jobs, results)
}

// Send jobs
for j := 1; j <= 9; j++ {
    jobs <- j
}
close(jobs)

// Collect results
for a := 1; a <= 9; a++ {
    <-results
}
```

### Fan-out, Fan-in
```go
func fanOut(input <-chan int, n int) []<-chan int {
    outputs := make([]<-chan int, n)
    for i := 0; i < n; i++ {
        outputs[i] = worker(input)
    }
    return outputs
}

func fanIn(inputs []<-chan int) <-chan int {
    output := make(chan int)
    var wg sync.WaitGroup
    wg.Add(len(inputs))
    
    for _, ch := range inputs {
        go func(c <-chan int) {
            defer wg.Done()
            for n := range c {
                output <- n
            }
        }(ch)
    }
    
    go func() {
        wg.Wait()
        close(output)
    }()
    
    return output
}
```

### Pipeline
```go
func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

// Usage
nums := generator(1, 2, 3, 4)
squares := square(nums)
for n := range squares {
    fmt.Println(n)
}
