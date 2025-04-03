---
layout: default
title: Go Modules
permalink: /tooling/modules/
---

# Go Modules

This cheatsheet covers Go Modules, the official dependency management system for Go, introduced in Go 1.11 and made the default in Go 1.16. Examples are based on Go 1.24.1.

## In this cheatsheet:
- [Basic Commands](#basic-commands)
- [Creating a Module](#creating-a-module)
- [Adding Dependencies](#adding-dependencies)
- [Upgrading Dependencies](#upgrading-dependencies)
- [Versioning](#versioning)
- [go.mod File](#gomod-file)
- [go.sum File](#gosum-file)
- [Vendoring](#vendoring)
- [Private Repositories](#private-repositories)
- [Best Practices](#best-practices)

## Basic Commands

Essential Go module commands:

```sh
# Initialize a new module in the current directory
go mod init github.com/username/reponame

# Add missing and remove unused modules
go mod tidy

# Download dependencies to local cache
go mod download

# Vendor dependencies
go mod vendor

# Verify dependencies match expected checksums
go mod verify

# Print module dependencies
go list -m all

# Show dependency graph
go mod graph

# Edit go.mod file
go mod edit -go=1.24.1 
```

## Creating a Module

Steps to create a new Go module:

```sh
# Create a new directory for your project
mkdir my-go-project
cd my-go-project

# Initialize the module with its module path
go mod init github.com/username/my-go-project

# This creates a go.mod file in your directory
# Now you can start creating .go files
```

The `go.mod` file will contain:

```go
module github.com/username/my-go-project

go 1.24.1
```

## Adding Dependencies

Adding external dependencies to your project:

```sh
# Option 1: Import and let Go download automatically
# In your .go file:
import "github.com/some/dependency"

# Then run:
go mod tidy

# Option 2: Explicitly add a dependency
go get github.com/some/dependency

# Add a specific version
go get github.com/some/dependency@v1.2.3

# Add the latest version
go get github.com/some/dependency@latest

# Add the latest patch version
go get github.com/some/dependency@v1.2
```

## Upgrading Dependencies

Managing and upgrading dependencies:

```sh
# List available upgrades
go list -u -m all

# Upgrade a specific dependency to latest version
go get -u github.com/some/dependency

# Upgrade all direct dependencies
go get -u ./...

# Upgrade all dependencies (direct and indirect)
go get -u -t all

# Upgrade to a specific version
go get github.com/some/dependency@v2.1.0
```

## Versioning

Understanding Go module versioning:

```sh
# Semantic versioning in Go modules:
go get github.com/example/mod@v1.2.3      # Specific version
go get github.com/example/mod@latest      # Latest version
go get github.com/example/mod@master      # From master branch (not recommended)
go get github.com/example/mod@e3702bed2   # Specific commit

# Major version changes (v2+) require module path changes:
import "github.com/example/mod/v2"        # For v2.x.x versions
import "github.com/example/mod/v3"        # For v3.x.x versions

# Pin a dependency to exact version in go.mod
go mod edit -require github.com/example/mod@v1.2.3
```

## go.mod File

Understanding the go.mod file:

```go
// A typical go.mod file
module github.com/username/projectname

go 1.24.1

// Direct dependencies
require (
    github.com/gin-gonic/gin v1.9.1
    github.com/go-sql-driver/mysql v1.7.0
    golang.org/x/crypto v0.17.0
)

// Indirect dependencies (used by direct dependencies)
require (
    github.com/bytedance/sonic v1.9.1 // indirect
    github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311 // indirect
    // ... more indirect dependencies
)

// Replace directive (useful for local development)
replace github.com/username/lib => ../lib

// Exclude specific versions
exclude github.com/some/dependency v1.2.0
```

## go.sum File

Understanding the go.sum file:

```
# The go.sum file contains cryptographic checksums of dependencies
github.com/gin-gonic/gin v1.9.1 h1:4idEAncQnU5cB7BeOkPtxjfCSye0AAm1R0RVIqJ+Jmg=
github.com/gin-gonic/gin v1.9.1/go.mod h1:hPrL7YrpYKXt5YId3A/Tnip5kqbEAP+KLuI3SUcPTeU=

# Each dependency has two entries:
# 1. Hash of the module itself
# 2. Hash of the module's go.mod file

# The go.sum file should be committed to version control
```

## Vendoring

Vendoring dependencies for reproducible builds:

```sh
# Create a vendor directory with all dependencies
go mod vendor

# Build using vendored dependencies
go build -mod=vendor

# Verify vendored dependencies match checksums
go mod verify
```

## Private Repositories

Working with private repositories:

```sh
# Option 1: Using GOPRIVATE environment variable
export GOPRIVATE=github.com/mycompany/*,gitlab.com/myteam/*

# Option 2: Configure git to use SSH instead of HTTPS for specific domains
git config --global url."git@github.com:".insteadOf "https://github.com/"

# Option 3: Use a personal access token with git
git config --global url."https://username:token@github.com".insteadOf "https://github.com"

# You can make these settings permanent by adding to ~/.gitconfig
```

## Best Practices

1. **Always use go mod tidy** - Ensures all dependencies are correctly tracked.

2. **Pin versions explicitly** - Avoid using `@latest` in production code.

3. **Commit both go.mod and go.sum** - Ensures consistent builds across environments.

4. **Consider vendoring** - For projects requiring maximum reproducibility.

5. **Update dependencies regularly** - Check for security updates and bug fixes.

6. **Use semantic versioning** - Follow the Go convention for module versioning.

7. **Don't edit go.sum manually** - Let Go manage this file.

8. **Update the Go version constraint** - When upgrading the Go version:

   ```sh
   go mod edit -go=1.24.1
   ```

9. **Use modules for all projects** - Even personal or small ones.

10. **Respect semantic import versioning** - Use /vN for major version changes.

> 💡 **Tip**: Go modules is now the standard way to manage dependencies in all Go projects. Older tools like dep, glide, or godep should be considered deprecated.

> 🔔 **Note**: Since Go 1.16, module mode is enabled by default, and `GO111MODULE=auto` is the default setting. For new projects, you don't need to set this environment variable anymore.
