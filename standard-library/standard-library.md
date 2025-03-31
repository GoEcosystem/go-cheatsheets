# Go Standard Library Cheatsheet

Go has a rich standard library that provides essential functionality without requiring external dependencies.

## fmt - Formatted I/O

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

// Common format verbs
fmt.Printf("%v", value)                     // Default format
fmt.Printf("%+v", struct)                   // Struct with field names
fmt.Printf("%#v", value)                    // Go syntax representation
fmt.Printf("%T", value)                     // Type of value
fmt.Printf("%t", bool)                      // Boolean
fmt.Printf("%d", integer)                   // Decimal integer
fmt.Printf("%b", integer)                   // Binary
fmt.Printf("%x", integer)                   // Hexadecimal
fmt.Printf("%f", float)                     // Floating point
fmt.Printf("%.2f", float)                   // Floating point with precision
fmt.Printf("%s", string)                    // String
fmt.Printf("%q", string)                    // Quoted string
fmt.Printf("%p", pointer)                   // Pointer address
```

## strings - String Manipulation

```go
// Creation and conversion
s := "hello"
s := strings.Repeat("na", 8) + " Batman!"   // Repeat string
s := strings.Join([]string{"a", "b"}, ", ") // Join strings with separator

// Inspection
contains := strings.Contains(s, "substring") // Check if contains substring
hasPrefix := strings.HasPrefix(s, "prefix")  // Check if starts with prefix
hasSuffix := strings.HasSuffix(s, "suffix")  // Check if ends with suffix
count := strings.Count(s, "substring")       // Count occurrences
index := strings.Index(s, "substring")       // Find position (-1 if not found)
lastIndex := strings.LastIndex(s, "substring")

// Manipulation
lower := strings.ToLower(s)                 // Convert to lowercase
upper := strings.ToUpper(s)                 // Convert to uppercase
trimmed := strings.TrimSpace(s)             // Remove leading/trailing whitespace
trimmed := strings.Trim(s, "cutset")        // Remove leading/trailing characters
replaced := strings.Replace(s, "old", "new", n) // Replace n occurrences (-1 for all)
fields := strings.Fields(s)                 // Split by whitespace into slice
parts := strings.Split(s, ",")              // Split by separator into slice

// Builder (efficient string concatenation)
var b strings.Builder
b.WriteString("Hello")
b.WriteString(", ")
b.WriteString("World!")
result := b.String()
```

## strconv - String Conversions

```go
// String to numeric
i, err := strconv.Atoi("42")                // String to int
i, err := strconv.ParseInt("42", 10, 64)    // String to int64 (base 10)
f, err := strconv.ParseFloat("3.14", 64)    // String to float64
b, err := strconv.ParseBool("true")         // String to bool

// Numeric to string
s := strconv.Itoa(42)                       // Int to string
s := strconv.FormatInt(42, 10)              // Int64 to string (base 10)
s := strconv.FormatFloat(3.14, 'f', 2, 64)  // Float64 to string with precision
s := strconv.FormatBool(true)               // Bool to string
```

## time - Date and Time

```go
// Current time
now := time.Now()                           // Current local time
utc := time.Now().UTC()                     // Current UTC time

// Creating time
t := time.Date(2023, time.January, 1, 12, 30, 0, 0, time.UTC)
t, err := time.Parse("2006-01-02", "2023-01-01") // Parse from string
t, err := time.Parse(time.RFC3339, "2023-01-01T12:30:00Z")

// Formatting time
s := t.Format("2006-01-02 15:04:05")        // Custom format
s := t.Format(time.RFC3339)                 // Standard format

// Time components
year, month, day := t.Date()
hour, min, sec := t.Clock()
weekday := t.Weekday()
unix := t.Unix()                            // Unix timestamp (seconds)

// Time manipulation
t2 := t.Add(2 * time.Hour)                  // Add duration
t2 := t.AddDate(1, 2, 3)                    // Add years, months, days
duration := t2.Sub(t)                       // Difference between times

// Sleep and timers
time.Sleep(2 * time.Second)                 // Pause execution
timer := time.NewTimer(2 * time.Second)     // Create timer
<-timer.C                                   // Wait for timer

// Ticker (periodic events)
ticker := time.NewTicker(1 * time.Second)
for t := range ticker.C {
    // Do something every second
    // Break the loop to stop the ticker
}
ticker.Stop()
```

## os - Operating System Functionality

```go
// Command-line arguments
args := os.Args                             // All args (including program name)
arg1 := os.Args[1]                          // First argument after program name

// Environment variables
value := os.Getenv("PATH")                  // Get environment variable
os.Setenv("KEY", "VALUE")                   // Set environment variable
env := os.Environ()                         // All environment variables

// Working directory
dir, err := os.Getwd()                      // Get working directory
err := os.Chdir("/path/to/dir")             // Change working directory

// File operations
file, err := os.Open("file.txt")            // Open for reading
file, err := os.Create("file.txt")          // Create/truncate for writing
file, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0666) // Advanced
defer file.Close()                          // Always close files

// Reading/writing files
data, err := os.ReadFile("file.txt")        // Read entire file
err := os.WriteFile("file.txt", data, 0666) // Write entire file

// File info
info, err := os.Stat("file.txt")            // Get file info
size := info.Size()                         // File size
mode := info.Mode()                         // File mode/permissions
isDir := info.IsDir()                       // Check if directory
modTime := info.ModTime()                   // Modification time

// Directory operations
err := os.Mkdir("dir", 0755)                // Create directory
err := os.MkdirAll("path/to/dir", 0755)     // Create directory with parents
entries, err := os.ReadDir("dir")           // List directory contents

// Process
pid := os.Getpid()                          // Get process ID
err := os.Exit(1)                           // Exit with status code
```

## io - Basic I/O Interfaces

```go
// Reading
b := make([]byte, 1024)
n, err := reader.Read(b)                    // Read up to len(b) bytes
data := b[:n]                               // Actual data read

// Writing
n, err := writer.Write([]byte("data"))      // Write data

// Copy
n, err := io.Copy(dst, src)                 // Copy from src to dst
n, err := io.CopyN(dst, src, 1024)          // Copy N bytes

// Buffered I/O (with bufio package)
scanner := bufio.NewScanner(reader)
for scanner.Scan() {
    line := scanner.Text()                  // Process each line
}
err := scanner.Err()                        // Check for errors

// Efficient reading/writing
reader := bufio.NewReader(file)
writer := bufio.NewWriter(file)
defer writer.Flush()                        // Ensure all data is written
```

## net/http - HTTP Client and Server

```go
// Simple HTTP GET
resp, err := http.Get("https://example.com")
if err != nil {
    // Handle error
}
defer resp.Body.Close()
body, err := io.ReadAll(resp.Body)

// HTTP client with options
client := &http.Client{
    Timeout: 10 * time.Second,
}
req, err := http.NewRequest("GET", "https://example.com", nil)
req.Header.Add("User-Agent", "MyApp/1.0")
resp, err := client.Do(req)

// Simple HTTP server
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
})
http.ListenAndServe(":8080", nil)

// HTTP server with more control
mux := http.NewServeMux()
mux.HandleFunc("/api/", apiHandler)
mux.HandleFunc("/", rootHandler)
server := &http.Server{
    Addr:         ":8080",
    Handler:      mux,
    ReadTimeout:  10 * time.Second,
    WriteTimeout: 10 * time.Second,
}
server.ListenAndServe()
```

## json - JSON Encoding/Decoding

```go
// Define struct with JSON tags
type Person struct {
    Name    string `json:"name"`
    Age     int    `json:"age,omitempty"`   // omitempty skips if zero value
    Address string `json:"address,omitempty"`
}

// Marshal (struct to JSON)
person := Person{Name: "John", Age: 30}
data, err := json.Marshal(person)           // []byte containing JSON
prettyData, err := json.MarshalIndent(person, "", "  ") // Pretty-printed

// Unmarshal (JSON to struct)
var person Person
err := json.Unmarshal(data, &person)

// Working with unknown JSON structure
var result map[string]interface{}
err := json.Unmarshal(data, &result)
name := result["name"].(string)             // Type assertion required

// Streaming JSON (for large data)
dec := json.NewDecoder(reader)
for dec.More() {
    var person Person
    err := dec.Decode(&person)
    // Process person
}

enc := json.NewEncoder(writer)
enc.SetIndent("", "  ")                     // Pretty-printing
enc.Encode(person)
```

## log - Logging

```go
// Basic logging
log.Println("Information message")
log.Printf("Formatted %s", "message")

// Error logging
log.Println("Error:", err)
if err != nil {
    log.Fatal("Fatal error:", err)          // Logs and calls os.Exit(1)
}
if err != nil {
    log.Panic("Panic:", err)                // Logs and calls panic()
}

// Custom logger
logger := log.New(os.Stdout, "PREFIX: ", log.Ldate|log.Ltime)
logger.Println("Custom logger message")

// Common flags
// log.Ldate         - Date: 2009/01/23
// log.Ltime         - Time: 01:23:23
// log.Lmicroseconds - Microsecond resolution: 01:23:23.123123
// log.Llongfile     - Full file path and line: /a/b/c/d.go:23
// log.Lshortfile    - Final file name and line: d.go:23
// log.LUTC          - Use UTC rather than local time
// log.Lmsgprefix    - Move prefix from beginning of line to before message
```
