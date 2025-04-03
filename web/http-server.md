---
layout: default
title: Go HTTP Server Cheatsheet
permalink: /web/http-server/
---

# Go HTTP Server

This cheatsheet provides examples and best practices for building HTTP servers in Go using the standard library and common patterns based on Go 1.24.1.

## In this cheatsheet:
- [Basic HTTP Server](#basic-http-server)
- [Routing](#routing)
- [Middleware](#middleware)
- [Request Handling](#request-handling)
- [Response Writing](#response-writing)
- [JSON APIs](#json-apis)
- [Form Handling](#form-handling)
- [File Uploads](#file-uploads)
- [HTTPS](#https)
- [Best Practices](#best-practices)

## Basic HTTP Server

Creating a simple HTTP server:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, Go Web Development!")
}

func main() {
    // Register handler function
    http.HandleFunc("/hello", helloHandler)
    
    // Serve static files
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
    
    // Start server on port 8080
    fmt.Println("Server starting on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Routing

Different approaches to routing:

```go
// 1. Standard library routing
http.HandleFunc("/", rootHandler)
http.HandleFunc("/about", aboutHandler)
http.HandleFunc("/users/", usersHandler)

// 2. Using ServeMux for more control
mux := http.NewServeMux()
mux.HandleFunc("/", rootHandler)
mux.HandleFunc("/about", aboutHandler)
mux.Handle("/api/", apiHandler)
http.ListenAndServe(":8080", mux)

// 3. Path parameters (manual extraction)
func usersHandler(w http.ResponseWriter, r *http.Request) {
    // Extract user ID from path like /users/123
    path := r.URL.Path
    segments := strings.Split(path, "/")
    
    if len(segments) < 3 {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    userID := segments[2]
    fmt.Fprintf(w, "User ID: %s", userID)
}
```

## Middleware

Creating and using middleware:

```go
// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Log request details before processing
        startTime := time.Now()
        log.Printf("Started %s %s", r.Method, r.URL.Path)
        
        // Call the next handler
        next.ServeHTTP(w, r)
        
        // Log after processing
        log.Printf("Completed %s %s in %v", r.Method, r.URL.Path, time.Since(startTime))
    })
}

// Authentication middleware
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Check for auth token
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // Validate token (simplified)
        if !isValidToken(token) {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        // Call the next handler
        next.ServeHTTP(w, r)
    })
}

// Using middleware
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", homeHandler)
    
    // Apply middleware to all routes
    handler := loggingMiddleware(authMiddleware(mux))
    http.ListenAndServe(":8080", handler)
}
```

## Request Handling

Working with HTTP requests:

```go
func requestHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Getting URL parameters
    query := r.URL.Query()
    name := query.Get("name")
    page, err := strconv.Atoi(query.Get("page"))
    if err != nil {
        page = 1 // Default value
    }
    
    // 2. Reading headers
    userAgent := r.Header.Get("User-Agent")
    contentType := r.Header.Get("Content-Type")
    
    // 3. Reading cookies
    cookie, err := r.Cookie("session_id")
    if err == nil {
        sessionID := cookie.Value
        // Use session ID
    }
    
    // 4. Reading request body
    if r.Method == "POST" {
        body, err := io.ReadAll(r.Body)
        if err != nil {
            http.Error(w, "Error reading request body", http.StatusBadRequest)
            return
        }
        defer r.Body.Close()
        
        // Process body data
        fmt.Printf("Request body: %s\n", body)
    }
}
```

## Response Writing

Writing HTTP responses:

```go
func responseHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Setting response headers
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    w.Header().Set("X-Custom-Header", "custom value")
    
    // 2. Setting cookies
    cookie := http.Cookie{
        Name:     "session_id",
        Value:    "abc123",
        Path:     "/",
        HttpOnly: true,
        Secure:   true,
        MaxAge:   3600, // 1 hour
    }
    http.SetCookie(w, &cookie)
    
    // 3. Setting status code
    w.WriteHeader(http.StatusOK)
    
    // 4. Writing response body
    fmt.Fprintf(w, "<h1>Hello Go</h1>")
    
    // Alternative methods for response body
    // io.WriteString(w, "Hello Go")
    // w.Write([]byte("Hello Go"))
}
```

## JSON APIs

Handling JSON requests and responses:

```go
// User struct with JSON tags
type User struct {
    ID       int    `json:"id"`
    Username string `json:"username"`
    Email    string `json:"email,omitempty"`
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Handling JSON requests
    if r.Method == "POST" {
        // Parse JSON request
        var user User
        decoder := json.NewDecoder(r.Body)
        if err := decoder.Decode(&user); err != nil {
            http.Error(w, "Invalid JSON", http.StatusBadRequest)
            return
        }
        defer r.Body.Close()
        
        // Process the user data
        fmt.Printf("Received user: %+v\n", user)
    }
    
    // 2. Sending JSON responses
    w.Header().Set("Content-Type", "application/json")
    
    users := []User{
        {ID: 1, Username: "alice", Email: "alice@example.com"},
        {ID: 2, Username: "bob", Email: "bob@example.com"},
    }
    
    // Option 1: Using json.Marshal
    /*
    data, err := json.Marshal(users)
    if err != nil {
        http.Error(w, "Error creating JSON", http.StatusInternalServerError)
        return
    }
    w.Write(data)
    */
    
    // Option 2: Using json.Encoder (typically preferred)
    w.WriteHeader(http.StatusOK)
    encoder := json.NewEncoder(w)
    encoder.SetIndent("", "  ") // Pretty printing (optional)
    if err := encoder.Encode(users); err != nil {
        http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
        return
    }
}
```

## Form Handling

Processing HTML forms:

```go
func formHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        // Display form for GET requests
        w.Header().Set("Content-Type", "text/html")
        fmt.Fprint(w, `
            <form method="POST">
                <div>
                    <label>Name:</label>
                    <input type="text" name="name">
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email">
                </div>
                <button type="submit">Submit</button>
            </form>
        `)
        return
    }
    
    // Process form submission
    if err := r.ParseForm(); err != nil {
        http.Error(w, "Error parsing form", http.StatusBadRequest)
        return
    }
    
    // Get form values
    name := r.FormValue("name")
    email := r.FormValue("email")
    
    // Single value from form or URL query parameter
    // r.Form.Get("param") 
    
    // Multiple values (e.g., checkboxes)
    // r.Form["interests"]
    
    // Respond to form submission
    w.Header().Set("Content-Type", "text/html")
    fmt.Fprintf(w, "Received: Name=%s, Email=%s", name, email)
}
```

## File Uploads

Handling file uploads:

```go
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        // Display upload form for GET requests
        w.Header().Set("Content-Type", "text/html")
        fmt.Fprint(w, `
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="file">
                <button type="submit">Upload</button>
            </form>
        `)
        return
    }
    
    // Parse the multipart form (maximum 10 MB files)
    maxSize := 10 << 20 // 10 MB
    if err := r.ParseMultipartForm(maxSize); err != nil {
        http.Error(w, "File too large or form error", http.StatusBadRequest)
        return
    }
    
    // Get the file from the form
    file, handler, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Error retrieving file", http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    // Read file details
    fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("File Size: %+v\n", handler.Size)
    fmt.Printf("MIME Type: %+v\n", handler.Header.Get("Content-Type"))
    
    // Create a new file on the server
    dst, err := os.Create("./uploads/" + handler.Filename)
    if err != nil {
        http.Error(w, "Error saving file", http.StatusInternalServerError)
        return
    }
    defer dst.Close()
    
    // Copy the uploaded file to the destination file
    if _, err := io.Copy(dst, file); err != nil {
        http.Error(w, "Error saving file", http.StatusInternalServerError)
        return
    }
    
    // Respond to the client
    fmt.Fprintf(w, "File uploaded successfully: %s", handler.Filename)
}
```

## HTTPS

Setting up HTTPS server:

```go
func main() {
    // Register handlers
    http.HandleFunc("/", rootHandler)
    
    // Option 1: Using ListenAndServeTLS
    log.Println("Starting HTTPS server on port 8443...")
    log.Fatal(http.ListenAndServeTLS(":8443", "server.crt", "server.key", nil))
    
    // Option 2: Custom TLS configuration
    /*
    server := &http.Server{
        Addr:    ":8443",
        Handler: nil, // Using default ServeMux
        TLSConfig: &tls.Config{
            MinVersion: tls.VersionTLS12,
            // Additional TLS configurations
        },
    }
    log.Fatal(server.ListenAndServeTLS("server.crt", "server.key"))
    */
}

// Generating self-signed certificate (for development only):
// go run $(go env GOROOT)/src/crypto/tls/generate_cert.go --host=localhost
```

## Best Practices

1. **Use the http.Handler interface** - It's more flexible than http.HandlerFunc.

2. **Organize your code by endpoints** - Group handlers related to the same resource.

3. **Use middleware for cross-cutting concerns** - Logging, authentication, CORS, etc.

4. **Set appropriate timeouts**:

   ```go
   server := &http.Server{
       Addr:         ":8080",
       Handler:      mux,
       ReadTimeout:  5 * time.Second,
       WriteTimeout: 10 * time.Second,
       IdleTimeout:  120 * time.Second,
   }
   ```

5. **Always validate and sanitize user input** - Never trust client data.

6. **Handle errors gracefully** - Return appropriate status codes and informative messages.

7. **Use contexts for cancellation** - Handle timeouts and client disconnects:

   ```go
   func handler(w http.ResponseWriter, r *http.Request) {
       ctx := r.Context()
       result := make(chan string)
       
       go func() {
           // Simulate processing
           time.Sleep(2 * time.Second)
           result <- "Result data"
       }()
       
       select {
       case <-ctx.Done():
           // Request was cancelled
           log.Println("Request cancelled by client")
           return
       case res := <-result:
           fmt.Fprint(w, res)
       }
   }
   ```

8. **Graceful shutdown** - Allow active requests to complete:

   ```go
   srv := &http.Server{Addr: ":8080", Handler: mux}
   
   // Start server in goroutine
   go func() {
       if err := srv.ListenAndServe(); err != http.ErrServerClosed {
           log.Fatalf("Server error: %v", err)
       }
   }()
   
   // Wait for interrupt signal
   stop := make(chan os.Signal, 1)
   signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
   <-stop
   
   // Shutdown with timeout
   ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
   defer cancel()
   if err := srv.Shutdown(ctx); err != nil {
       log.Fatalf("Server shutdown error: %v", err)
   }
   log.Println("Server gracefully stopped")
   ```

> 🔔 **Note**: The standard library's net/http package is powerful and production-ready. For more complex routing and middleware support, consider third-party libraries like gorilla/mux, chi, or gin.
