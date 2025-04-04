---
layout: default
title: Go Cheatsheets
description: A comprehensive reference guide for Go programming language based on Go 1.24.1 documentation
---

<div class="hero">
  <div class="container">
    <h1>Go Cheatsheets</h1>
    <p>A comprehensive reference guide for Go programming language based on Go 1.24.1 documentation</p>
    <div class="hero-buttons">
      <a href="https://github.com/GoEcosystem/go-cheatsheets" class="btn btn-secondary">View on GitHub</a>
      <a href="{{ '/basics/' | relative_url }}" class="btn btn-primary">Explore Documentation</a>
    </div>
  </div>
</div>

<div class="container">
  <h2 class="section-title">Available Sections</h2>
  <div class="card-grid">
    <div class="card">
      <h3>Basics</h3>
      <p>Core Go language syntax and data structures, including variables, functions, control flow, arrays, slices, maps, and structs.</p>
      <a href="{{ '/basics/' | relative_url }}" class="btn btn-primary">View Basics →</a>
    </div>
    
    <div class="card">
      <h3>Advanced</h3>
      <p>Advanced Go concepts including interfaces, error handling, and generics.</p>
      <a href="{{ '/advanced/' | relative_url }}" class="btn btn-primary">View Advanced →</a>
    </div>
    
    <div class="card">
      <h3>Concurrency</h3>
      <p>Go's powerful concurrency primitives, including goroutines, channels, and concurrency patterns.</p>
      <a href="{{ '/concurrency/' | relative_url }}" class="btn btn-primary">View Concurrency →</a>
    </div>
    
    <div class="card">
      <h3>Standard Library</h3>
      <p>Common packages and functions from Go's extensive standard library.</p>
      <a href="{{ '/standard-library/' | relative_url }}" class="btn btn-primary">View Standard Library →</a>
    </div>
    
    <div class="card">
      <h3>Tooling</h3>
      <p>Go tools for testing, building, and managing Go applications.</p>
      <a href="{{ '/tooling/' | relative_url }}" class="btn btn-primary">View Tooling →</a>
    </div>
  </div>

  <h2 class="section-title">About These Cheatsheets</h2>
  <p>
    These cheatsheets are designed to be quick reference for Go programmers of all levels. They provide concise examples of common patterns and syntax without extensive explanations. For comprehensive learning resources, please refer to the <a href="https://go.dev/doc/">official Go documentation</a>.
  </p>

  <h2 class="section-title">Contributing</h2>
  <p>
    These cheatsheets are maintained as part of the GoEcosystem initiative. Contributions are welcome through pull requests to our <a href="https://github.com/GoEcosystem/go-cheatsheets">GitHub repository</a>.
  </p>

  <h2 class="section-title">Getting Started</h2>
  <div class="terminal">
    <div class="command">git clone https://github.com/GoEcosystem/go-cheatsheets.git</div>
    <div class="command">cd go-cheatsheets</div>
    <div class="command">bundle install</div>
    <div class="command">bundle exec jekyll serve</div>
    <div>Server running at http://127.0.0.1:4000/go-cheatsheets/</div>
  </div>
</div>
