# Go Data Structures Cheatsheet

## Arrays
Fixed-size collection of elements of the same type.

```go
// Declaration with explicit size
var scores [5]int                     // Array of 5 integers, initialized to zero values
var names [3]string                   // Array of 3 strings, initialized to empty strings

// Declaration with initialization
var scores = [5]int{10, 20, 30, 40, 50}
names := [3]string{"Alice", "Bob", "Charlie"}

// Size inferred from initialization
scores := [...]int{10, 20, 30, 40, 50} // Array of 5 integers

// Accessing elements (zero-indexed)
firstScore := scores[0]               // 10
scores[1] = 25                        // Modify second element

// Array length
length := len(scores)                 // 5

// Multi-dimensional arrays
var matrix [3][4]int                  // 3x4 matrix of integers
grid := [2][3]int{{1, 2, 3}, {4, 5, 6}}
```

## Slices
Dynamic, flexible view into an array. Most common collection type in Go.

```go
// Declaration
var scores []int                      // Nil slice (length and capacity are 0)
var names []string                    // Nil slice

// Creation with make
scores := make([]int, 5)              // Slice of 5 integers, initialized to zero values
scores := make([]int, 5, 10)          // Length 5, capacity 10

// Creation with literal
scores := []int{10, 20, 30, 40, 50}   // Slice with 5 elements
names := []string{"Alice", "Bob", "Charlie"}

// From array
arr := [5]int{10, 20, 30, 40, 50}
slice := arr[1:4]                     // Slice with elements 20, 30, 40

// Slice operations
length := len(scores)                 // Length of slice
capacity := cap(scores)               // Capacity of underlying array

// Append (may create new underlying array if capacity is exceeded)
scores = append(scores, 60)           // Add one element
scores = append(scores, 70, 80, 90)   // Add multiple elements
combined := append(scores, moreScores...) // Append another slice

// Copy
dest := make([]int, len(source))
copied := copy(dest, source)          // Returns number of elements copied

// Slice of slice
slice2 := slice[1:3]                  // Sub-slice

// Clear a slice (Go 1.21+)
clear(scores)                         // Sets all elements to zero values

// Delete from slice (no built-in, common patterns)
// Remove element at index i
scores = append(scores[:i], scores[i+1:]...)
// Remove element at index i (preserving order but reusing the same underlying array)
copy(scores[i:], scores[i+1:])
scores = scores[:len(scores)-1]
```

## Maps
Unordered collection of key-value pairs.

```go
// Declaration
var ages map[string]int               // Nil map (cannot be assigned to)

// Creation with make
ages := make(map[string]int)          // Empty map

// Creation with literal
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
    "Charlie": 35,
}

// Access (returns zero value if key not found)
aliceAge := ages["Alice"]             // 30

// Check if key exists
age, exists := ages["Dave"]           // age=0, exists=false if key not found

// Add or update
ages["Dave"] = 28

// Delete
delete(ages, "Charlie")

// Length
count := len(ages)                    // Number of key-value pairs

// Iteration (order not guaranteed)
for name, age := range ages {
    fmt.Printf("%s is %d years old\n", name, age)
}

// Clear a map (Go 1.21+)
clear(ages)                           // Removes all key-value pairs
```

## Structs
Composite data type that groups together variables of different data types.

```go
// Declaration
type Person struct {
    Name    string
    Age     int
    Address string
}

// Creation
var p Person                          // All fields have zero values
alice := Person{
    Name:    "Alice",
    Age:     30,
    Address: "123 Main St",
}
bob := Person{"Bob", 25, "456 Elm St"} // Order must match struct declaration

// Field access
name := alice.Name
alice.Age = 31

// Anonymous structs
point := struct {
    X, Y int
}{10, 20}

// Embedded structs
type Employee struct {
    Person                            // Embedded struct (anonymous field)
    Title    string
    Salary   float64
}

emp := Employee{
    Person:  Person{"Alice", 30, "123 Main St"},
    Title:   "Developer",
    Salary:  75000,
}
// Access embedded fields directly
fmt.Println(emp.Name)                 // "Alice" (from Person)
```

## Pointers
Store memory addresses of values.

```go
// Declaration
var p *int                            // Nil pointer

// Create pointer to variable
x := 10
p = &x                                // p points to x

// Dereference (access value)
value := *p                           // 10

// Change value through pointer
*p = 20                               // x is now 20

// New function
p := new(int)                         // Creates pointer to zero value int
*p = 10

// Struct pointers
person := &Person{"Alice", 30, "123 Main St"}
fmt.Println(person.Name)              // "Alice" (shorthand for (*person).Name)

// Function with pointer receiver (modifies original)
func (p *Person) Birthday() {
    p.Age++
}
```

## Interfaces
Define behavior as a set of methods.

```go
// Declaration
type Geometry interface {
    Area() float64
    Perimeter() float64
}

// Implementation (implicit)
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Using interfaces
var g Geometry
g = Rectangle{5.0, 4.0}
fmt.Println(g.Area())                 // 20.0

// Empty interface (any type)
var i interface{}
i = 42
i = "hello"
i = struct{ Name string }{"Alice"}

// Type assertions
str, ok := i.(string)                 // str="hello", ok=true if i holds a string
if num, ok := i.(int); ok {
    fmt.Println("i is an integer:", num)
}

// Type switches
switch v := i.(type) {
case int:
    fmt.Println("i is an integer:", v)
case string:
    fmt.Println("i is a string:", v)
default:
    fmt.Println("i is another type")
}
```
