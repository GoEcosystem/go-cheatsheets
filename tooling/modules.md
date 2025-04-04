---
layout: cheatsheet
title: Go Modules
description: Go modules for dependency management, versioning, and project organization
permalink: /tooling/modules/
---

# Go Modules

## Initialize a Module

Creating a new Go module:

```bash
# Initialize a new module
go mod init github.com/username/project

# Create a project with the current directory name
go mod init
```

## Managing Dependencies

```bash
# Add a dependency
go get github.com/some/package

# Add a specific version
go get github.com/some/package@v1.2.3

# Add the latest version
go get github.com/some/package@latest

# Add a specific commit
go get github.com/some/package@1234abcd

# Update all dependencies
go get -u ./...

# Update to minor versions
go get -u=patch ./...
```

## Working with go.mod and go.sum

```bash
# Tidy up dependencies (add missing, remove unused)
go mod tidy

# Verify dependencies
go mod verify

# Edit go.mod file
go mod edit -require=github.com/some/package@v1.2.3

# Print module dependencies
go list -m all

# View module graph
go mod graph
```

## Versioning

```bash
# Major version upgrade (v2+)
import "github.com/user/module/v2"

# Releasing a new version
git tag v1.2.3
git push origin v1.2.3
```

## Vendoring

Vendoring dependencies (storing them in your repository):

```bash
# Create vendor directory
go mod vendor

# Build using vendored dependencies
go build -mod=vendor
```

## Workspace Mode (Go 1.18+)

Working with multiple modules:

```bash
# Create a workspace file
go work init ./module1 ./module2

# Add a module to workspace
go work use ./module3

# Replace a module in workspace
go work edit -replace example.com/mod=./localmod
```

## Module Configuration

Example go.mod file:

```go
module github.com/username/project

go 1.21

require (
    github.com/pkg/errors v0.9.1
    golang.org/x/text v0.3.8
)

replace github.com/pkg/errors => ../errors

exclude golang.org/x/net v1.2.3
```

## Working with Private Repositories

```bash
# Configure Git for private modules
go env -w GOPRIVATE=github.com/mycompany/*,gitlab.com/myteam/*

# Using SSH instead of HTTPS
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

## Module Proxies

```bash
# Configure GOPROXY
go env -w GOPROXY=https://proxy.golang.org,direct

# Disable proxy
go env -w GOPROXY=direct
```

## Best Practices

1. Use semantic versioning for module releases
2. Run `go mod tidy` before committing changes
3. Consider vendoring dependencies for deployment stability
4. Use replace directives for local development
5. Pin dependencies to specific versions for stability
