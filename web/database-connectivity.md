---
layout: default
title: Go Database Connectivity
permalink: /web/database-connectivity/
---

# Go Database Connectivity

This cheatsheet covers database connectivity in Go using the standard library's `database/sql` package and common database drivers. Examples are based on Go 1.24.1.

## In this cheatsheet:
- [Database Drivers](#database-drivers)
- [Connecting to Databases](#connecting-to-databases)
- [Basic CRUD Operations](#basic-crud-operations)
- [Transactions](#transactions)
- [Prepared Statements](#prepared-statements)
- [Working with NULL Values](#working-with-null-values)
- [Connection Pooling](#connection-pooling)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Database Drivers

Common database drivers in Go:

```go
// MySQL driver
import _ "github.com/go-sql-driver/mysql"

// PostgreSQL driver
import _ "github.com/lib/pq"

// SQLite driver
import _ "github.com/mattn/go-sqlite3"

// SQL Server driver
import _ "github.com/denisenkom/go-mssqldb"
```

## Connecting to Databases

Establishing database connections:

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    // MySQL
    // dsn format: username:password@protocol(address)/dbname?param=value
    db, err := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/dbname?parseTime=true")
    
    // PostgreSQL
    // db, err := sql.Open("postgres", "postgres://user:password@localhost/dbname?sslmode=disable")
    
    // SQLite
    // db, err := sql.Open("sqlite3", "./database.db")
    
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
    
    // Verify connection
    if err := db.Ping(); err != nil {
        log.Fatal("Cannot connect to database:", err)
    }
    
    fmt.Println("Successfully connected to database!")
}
```

## Basic CRUD Operations

Working with database records:

```go
// User represents a database record
type User struct {
    ID       int
    Username string
    Email    string
    Created  time.Time
}

// CREATE - Insert a new record
func createUser(db *sql.DB, user User) (int64, error) {
    query := "INSERT INTO users (username, email, created_at) VALUES (?, ?, ?)"
    
    result, err := db.Exec(query, user.Username, user.Email, time.Now())
    if err != nil {
        return 0, err
    }
    
    // Get the ID of the inserted record
    id, err := result.LastInsertId()
    return id, err
}

// READ - Query a single record
func getUserByID(db *sql.DB, id int) (User, error) {
    query := "SELECT id, username, email, created_at FROM users WHERE id = ?"
    
    var user User
    err := db.QueryRow(query, id).Scan(&user.ID, &user.Username, &user.Email, &user.Created)
    if err != nil {
        if err == sql.ErrNoRows {
            return user, fmt.Errorf("user not found: %d", id)
        }
        return user, err
    }
    
    return user, nil
}

// READ - Query multiple records
func getAllUsers(db *sql.DB) ([]User, error) {
    query := "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
    
    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Created); err != nil {
            return nil, err
        }
        users = append(users, user)
    }
    
    // Check for errors from iterating over rows
    if err := rows.Err(); err != nil {
        return nil, err
    }
    
    return users, nil
}

// UPDATE - Update a record
func updateUser(db *sql.DB, user User) error {
    query := "UPDATE users SET username = ?, email = ? WHERE id = ?"
    
    _, err := db.Exec(query, user.Username, user.Email, user.ID)
    return err
}

// DELETE - Delete a record
func deleteUser(db *sql.DB, id int) error {
    query := "DELETE FROM users WHERE id = ?"
    
    _, err := db.Exec(query, id)
    return err
}
```

## Transactions

Managing database transactions:

```go
func transferFunds(db *sql.DB, fromID, toID int, amount float64) error {
    // Start a transaction
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    
    // Defer rollback in case anything fails
    // If tx.Commit() is called successfully, this becomes a no-op
    defer tx.Rollback()
    
    // Subtract from source account
    _, err = tx.Exec("UPDATE accounts SET balance = balance - ? WHERE id = ?", amount, fromID)
    if err != nil {
        return err
    }
    
    // Add to destination account
    _, err = tx.Exec("UPDATE accounts SET balance = balance + ? WHERE id = ?", amount, toID)
    if err != nil {
        return err
    }
    
    // Create transaction record
    _, err = tx.Exec("INSERT INTO transfers (from_id, to_id, amount) VALUES (?, ?, ?)", 
        fromID, toID, amount)
    if err != nil {
        return err
    }
    
    // Commit the transaction
    return tx.Commit()
}
```

## Prepared Statements

Using prepared statements for better performance:

```go
func batchInsertUsers(db *sql.DB, users []User) error {
    // Prepare the statement
    stmt, err := db.Prepare("INSERT INTO users (username, email, created_at) VALUES (?, ?, ?)")
    if err != nil {
        return err
    }
    defer stmt.Close()
    
    // Execute for each user
    for _, user := range users {
        _, err := stmt.Exec(user.Username, user.Email, time.Now())
        if err != nil {
            return err
        }
    }
    
    return nil
}

// Reusing prepared statements
func userRepository() {
    // Prepare statements once on initialization
    insertStmt, _ := db.Prepare("INSERT INTO users (username, email) VALUES (?, ?)")
    selectStmt, _ := db.Prepare("SELECT id, username, email FROM users WHERE id = ?")
    updateStmt, _ := db.Prepare("UPDATE users SET email = ? WHERE id = ?")
    deleteStmt, _ := db.Prepare("DELETE FROM users WHERE id = ?")
    
    // Close statements when done
    defer insertStmt.Close()
    defer selectStmt.Close()
    defer updateStmt.Close()
    defer deleteStmt.Close()
    
    // Use prepared statements
    insertStmt.Exec("new_user", "new@example.com")
    // ...
}
```

## Working with NULL Values

Handling NULL values in database:

```go
import (
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    ID        int
    Username  string
    Email     string
    Phone     sql.NullString  // Can be NULL
    LastLogin sql.NullTime    // Can be NULL
    Active    sql.NullBool    // Can be NULL
    Score     sql.NullFloat64 // Can be NULL
    Count     sql.NullInt64   // Can be NULL
}

func getUserWithNulls(db *sql.DB, id int) (User, error) {
    query := `SELECT id, username, email, phone, last_login, active, score, count 
              FROM users WHERE id = ?`
    
    var user User
    err := db.QueryRow(query, id).Scan(
        &user.ID,
        &user.Username,
        &user.Email,
        &user.Phone,
        &user.LastLogin,
        &user.Active,
        &user.Score,
        &user.Count,
    )
    
    if err != nil {
        return user, err
    }
    
    // Check if phone is NULL before using it
    if user.Phone.Valid {
        phoneNumber := user.Phone.String
        fmt.Println("Phone:", phoneNumber)
    } else {
        fmt.Println("Phone: Not provided")
    }
    
    // Check if last login is NULL
    if user.LastLogin.Valid {
        lastLogin := user.LastLogin.Time
        fmt.Println("Last Login:", lastLogin)
    }
    
    return user, nil
}
```

## Connection Pooling

Configuring database connection pools:

```go
func configurePool(db *sql.DB) {
    // Set maximum number of open connections
    db.SetMaxOpenConns(25)
    
    // Set maximum number of idle connections
    db.SetMaxIdleConns(5)
    
    // Set maximum lifetime of a connection
    db.SetConnMaxLifetime(5 * time.Minute)
    
    // Set maximum idle time of a connection
    db.SetConnMaxIdleTime(1 * time.Minute)
}
```

## Error Handling

Common database error handling:

```go
// Check specific error types
func handleDBError(err error) {
    if err == sql.ErrNoRows {
        // Handle case where query returned no rows
        fmt.Println("No records found")
    } else if err == sql.ErrTxDone {
        // Handle transaction already closed error
        fmt.Println("Transaction already completed")
    } else {
        // Handle other database errors
        fmt.Println("Database error:", err)
    }
}

// Using errors.Is for specific driver errors (MySQL example)
import "github.com/go-sql-driver/mysql"

func handleMySQLError(err error) {
    var mysqlErr *mysql.MySQLError
    if errors.As(err, &mysqlErr) {
        switch mysqlErr.Number {
        case 1062: // Duplicate entry error
            fmt.Println("Duplicate entry")
        case 1452: // Foreign key constraint error
            fmt.Println("Foreign key constraint failed")
        default:
            fmt.Printf("MySQL Error %d: %s\n", mysqlErr.Number, mysqlErr.Message)
        }
    } else {
        fmt.Println("Non-MySQL error:", err)
    }
}
```

## Best Practices

1. **Always check for errors** - Database operations can fail for many reasons.

2. **Use prepared statements** - For repeated queries and to prevent SQL injection.

3. **Close resources** - Close rows, statements, and DB connections when done:

   ```go
   rows, err := db.Query("SELECT * FROM users")
   if err != nil {
       log.Fatal(err)
   }
   defer rows.Close() // Important!
   ```

4. **Configure connection pools** - Based on your application's needs.

5. **Use transactions for multiple operations** - Ensure data consistency.

6. **Handle NULL values correctly** - Use the sql.Null* types.

7. **Consider context for cancellation** - Use context-aware database methods:

   ```go
   ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
   defer cancel()
   
   var count int
   err := db.QueryRowContext(ctx, "SELECT COUNT(*) FROM large_table").Scan(&count)
   ```

8. **Use proper parameter placeholders** - Different databases use different placeholders:
   - MySQL: `?`
   - PostgreSQL: `$1, $2, ...`
   - SQLite: `?` or `$1, $2, ...`
   - SQL Server: `@p1, @p2, ...`

> ⚠️ **Warning**: Never concatenate user input directly into SQL queries. Always use parameterized queries to prevent SQL injection attacks.
