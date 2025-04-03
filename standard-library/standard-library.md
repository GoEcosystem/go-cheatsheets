---
layout: default
title: Standard Library
description: Common packages and functions from the Go standard library
permalink: /standard-library/
---

# Go Standard Library Cheatsheet

Go has a rich standard library that provides essential functionality without requiring external dependencies.

<div class="section-nav">
  <ul>
    <li><a href="#fmt">fmt - Formatted I/O</a></li>
    <li><a href="#strings">strings - String Manipulation</a></li>
    <li><a href="#strconv">strconv - String Conversions</a></li>
    <li><a href="#time">time - Date and Time</a></li>
    <li><a href="#io">io - Input/Output</a></li>
    <li><a href="#os">os - Operating System</a></li>
    <li><a href="#log">log - Logging</a></li>
  </ul>
</div>

<div class="function-section" id="fmt">
  <h2>fmt - Formatted I/O</h2>

  <div class="function-usage">
    <h3>Basic Printing</h3>
    
```go
// Printing to stdout
fmt.Println("Hello, World!")                // Print with newline
fmt.Print("No newline")                     // Print without newline
fmt.Printf("Formatted %s %d\n", "text", 42) // Formatted print

// String formatting
s := fmt.Sprintf("Value: %v", value)        // Returns formatted string

// Reading from stdin
var name string
fmt.Scanln(&name)                           // Read a line from stdin
fmt.Scanf("%s %d", &name, &age)             // Read formatted input
```
  </div>

  <div class="function-usage">
    <h3>Common Format Verbs</h3>
    
```go
fmt.Printf("%v", value)     // Default format
fmt.Printf("%+v", struct)   // Struct with field names
fmt.Printf("%#v", value)    // Go syntax representation
fmt.Printf("%T", value)     // Type of value
fmt.Printf("%t", true)      // Boolean
fmt.Printf("%d", 10)        // Base 10 integer
fmt.Printf("%b", 10)        // Base 2 (binary)
fmt.Printf("%c", 65)        // Character
fmt.Printf("%x", 15)        // Base 16, lowercase
fmt.Printf("%X", 15)        // Base 16, uppercase
fmt.Printf("%f", 3.14159)   // Floating point
fmt.Printf("%.2f", 3.14159) // Floating point with precision
fmt.Printf("%e", 1000000.0) // Scientific notation
fmt.Printf("%s", "string")  // String
fmt.Printf("%q", "string")  // Quoted string
fmt.Printf("%p", &value)    // Pointer address
fmt.Printf("%9d", 10)       // Width 9, right justified
fmt.Printf("%-9d", 10)      // Width 9, left justified
fmt.Printf("%09d", 10)      // Width 9, zero padded
```
  </div>

  <div class="tip">
    <strong>Tip:</strong> For consistent error handling, prefer the <code>%v</code> verb when printing errors, as it uses the error's <code>Error()</code> method: <code>fmt.Printf("Error: %v", err)</code>
  </div>
</div>

<div class="function-section" id="strings">
  <h2>strings - String Manipulation</h2>

  <div class="function-usage">
    <h3>Creating and comparing</h3>
    
```go
s := "hello"
s := strings.Repeat("na", 8) + " Batman!"   // Repeat string
s := strings.Join([]string{"a", "b", "-"})  // Join strings with separator
```
  </div>

  <div class="function-usage">
    <h3>Inspection</h3>
    
```go
contains := strings.Contains(s, "substring") // Check if contains substring
hasPrefix := strings.HasPrefix(s, "prefix")  // Check if starts with prefix
hasSuffix := strings.HasSuffix(s, "suffix")  // Check if ends with suffix
count := strings.Count(s, "substring")       // Count occurrences
index := strings.Index(s, "substring")       // Find position (-1 if not found)
lastIndex := strings.LastIndex(s, "substring") // Last position (-1 if not found)
```
  </div>

  <div class="function-usage">
    <h3>Manipulation</h3>
    
```go
lower := strings.ToLower(s)                  // Convert to lowercase
upper := strings.ToUpper(s)                  // Convert to uppercase
trimmed := strings.TrimSpace(s)              // Remove leading/trailing whitespace
replaced := strings.Replace(s, "old", "new", -1) // Replace occurrences (-1 for all)
fields := strings.Fields(s)                  // Split by whitespace into slice
parts := strings.Split(s, ",")               // Split by separator into slice
```
  </div>

  <div class="note">
    <strong>Note:</strong> String functions in Go create new strings rather than modifying existing ones, as strings are immutable in Go.
  </div>
</div>

<div class="function-section" id="strconv">
  <h2>strconv - String Conversions</h2>

  <div class="function-usage">
    <h3>String to numeric</h3>
    
```go
i, err := strconv.Atoi("42")                 // String to int
i, err := strconv.ParseInt("42", 10, 64)     // String to int64 (base 10)
f, err := strconv.ParseFloat("3.14", 64)     // String to float64
b, err := strconv.ParseBool("true")          // String to bool
```
  </div>

  <div class="function-usage">
    <h3>Numeric to string</h3>
    
```go
s := strconv.Itoa(42)                        // Int to string
s := strconv.FormatInt(42, 10)               // Int64 to string (base 10)
s := strconv.FormatFloat(3.14, 'f', 2, 64)   // Float64 to string with precision
s := strconv.FormatBool(true)                // Bool to string
```
  </div>

  <div class="warning">
    <strong>Warning:</strong> Always check error return values from string conversion functions, as they will fail on invalid input.
  </div>
</div>

<div class="function-section" id="time">
  <h2>time - Date and Time</h2>

  <div class="function-usage">
    <h3>Creating time values</h3>
    
```go
now := time.Now()                            // Current local time
utc := time.Now().UTC()                      // Current UTC time
date := time.Date(2025, time.April, 3, 14, 30, 0, 0, time.UTC) // Specific time
parsed, err := time.Parse("2006-01-02", "2025-04-03") // Parse from string
```
  </div>

  <div class="function-usage">
    <h3>Working with time</h3>
    
```go
future := now.Add(time.Hour * 24)            // Add duration
past := now.AddDate(0, 0, -7)                // Subtract 7 days
diff := future.Sub(now)                      // Duration between times
isAfter := future.After(now)                 // Compare times
isBefore := past.Before(now)                 // Compare times
isEqual := now.Equal(now)                    // Compare times

// Components
year, month, day := now.Date()               // Get date components
hour, min, sec := now.Clock()                // Get time components
yearDay := now.YearDay()                     // Day of year
weekday := now.Weekday()                     // Day of week
```
  </div>

  <div class="function-usage">
    <h3>Formatting time</h3>
    
```go
formatted := now.Format("2006-01-02 15:04:05") // Custom format
formatted := now.Format(time.RFC3339)          // Predefined format
unix := now.Unix()                             // Unix timestamp (seconds)
unixNano := now.UnixNano()                     // Unix timestamp (nanoseconds)
```
  </div>

  <div class="important">
    <strong>Important:</strong> Go uses a reference time for formatting: "2006-01-02 15:04:05.999999999 -0700 MST". Remember this as 01/02 03:04:05PM '06 -0700.
  </div>
</div>

<div class="function-section" id="io">
  <h2>io - Input/Output</h2>

  <div class="function-usage">
    <h3>Core interfaces</h3>
    
```go
// io.Reader interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

// io.Writer interface
type Writer interface {
    Write(p []byte) (n int, err error)
}

// io.Closer interface
type Closer interface {
    Close() error
}
```
  </div>

  <div class="function-usage">
    <h3>Common io operations</h3>
    
```go
// Copy data from reader to writer
n, err := io.Copy(dst, src)               // Copy until EOF
n, err := io.CopyN(dst, src, 1024)        // Copy exactly N bytes

// Read all data
data, err := io.ReadAll(reader)           // Read until EOF into []byte

// Limited reader
limited := io.LimitReader(reader, 1024)   // Only read up to 1024 bytes

// Multi-writer/reader
mw := io.MultiWriter(writer1, writer2)    // Write to multiple writers
mr := io.MultiReader(reader1, reader2)    // Read from multiple readers in sequence
```
  </div>

  <div class="function-usage">
    <h3>Reading/writing strings</h3>
    
```go
// String as reader
reader := strings.NewReader("some text")  // io.Reader from string

// Buffered operations
buf := new(bytes.Buffer)                 // Buffer for read/write
reader := bufio.NewReader(someReader)    // Buffered reader
writer := bufio.NewWriter(someWriter)    // Buffered writer
scanner := bufio.NewScanner(someReader)  // Scanner for tokenized reading
```
  </div>
</div>

<div class="function-section" id="os">
  <h2>os - Operating System</h2>

  <div class="function-usage">
    <h3>Command-line args and environment</h3>
    
```go
args := os.Args                             // All args (including program name)
arg1 := os.Args[1]                          // First argument after program name

// Environment variables
value := os.Getenv("PATH")                  // Get environment variable
os.Setenv("KEY", "value")                   // Set environment variable
envs := os.Environ()                        // All environment variables
```
  </div>

  <div class="function-usage">
    <h3>File operations</h3>
    
```go
// Opening files
file, err := os.Open("file.txt")            // Open for reading
file, err := os.Create("file.txt")          // Create or truncate for writing
file, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0644) // Custom options

// Reading/writing files
data, err := os.ReadFile("file.txt")        // Read entire file
err := os.WriteFile("file.txt", data, 0644) // Write entire file

// File info
info, err := os.Stat("file.txt")            // Get file info
info.Name()                                 // File name
info.Size()                                 // File size
info.Mode()                                 // File mode
info.ModTime()                              // Last modification time
info.IsDir()                                // Is it a directory

// File system operations
err := os.Mkdir("dir", 0755)                // Create directory
err := os.MkdirAll("path/to/dir", 0755)     // Create directory and parents
err := os.Remove("file.txt")                // Remove file
err := os.RemoveAll("dir")                  // Remove directory and contents
err := os.Rename("old", "new")              // Rename/move

// Working directory
dir, err := os.Getwd()                      // Get current directory
err := os.Chdir("path/to/dir")              // Change directory
```
  </div>

  <div class="function-usage">
    <h3>Process control</h3>
    
```go
pid := os.Getpid()                          // Get process ID
ppid := os.Getppid()                        // Get parent process ID
os.Exit(0)                                  // Exit with status code

// Executing commands
cmd := exec.Command("ls", "-l")             // Create command
out, err := cmd.Output()                    // Run and get output
err := cmd.Run()                            // Run without capturing output
```
  </div>
</div>

<div class="function-section" id="log">
  <h2>log - Logging</h2>

  <div class="function-usage">
    <h3>Standard logger</h3>
    
```go
log.Println("Info message")                 // Print log message with newline
log.Printf("Formatted %s", "message")       // Formatted log message
log.Print("Simple message")                 // Print log message

// Fatal and Panic logs
log.Fatal("Fatal error")                    // Log and os.Exit(1)
log.Fatalf("Fatal: %s", err)                // Formatted fatal
log.Panic("Panic error")                    // Log and panic()
```
  </div>

  <div class="function-usage">
    <h3>Custom loggers</h3>
    
```go
logger := log.New(os.Stderr, "PREFIX: ", log.LstdFlags) // Create logger
logger.Println("Custom logger message")

// Common flags
// log.Ldate         - Date: 2009/01/23
// log.Ltime         - Time: 01:23:23
// log.Lmicroseconds - Microsecond resolution: 01:23:23.123123
// log.Llongfile     - Full file name and line: /a/b/c/d.go:23
// log.Lshortfile    - Final file name and line: d.go:23
// log.LUTC          - Use UTC rather than local time
// log.Lmsgprefix    - Move prefix from beginning of line to before message
```
  </div>

  <div class="warning">
    <strong>Warning:</strong> <code>log.Fatal</code> and <code>log.Panic</code> terminate the program. Use them only when recovery is not possible or desired.
  </div>
</div>

<div style="margin-top: 3rem; text-align: center;">
  <a href="https://golang.org/pkg/" class="btn btn-primary" target="_blank">Explore Official Go Packages</a>
</div>
