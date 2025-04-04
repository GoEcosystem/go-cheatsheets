---
layout: default
title: Go Cheatsheets
description: Comprehensive reference guides for Go programming language
---

<div class="container">
  <div class="section">
    <p>The Go Cheatsheets provide concise references for Go programming language syntax, standard library usage, and best practices. These cheatsheets are based on Go 1.24.1 documentation.</p>

    <h2 class="section-title">Available Sections</h2>
    
    <div class="card-grid">
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">Basics</h3>
          <p class="card-description">Core Go language syntax and data structures, including variables, functions, control flow, arrays, slices, maps, and structs.</p>
          <a href="{{ '/basics/' | relative_url }}" class="card-link">View Basics →</a>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">Advanced</h3>
          <p class="card-description">Advanced Go concepts including interfaces, error handling, and generics.</p>
          <a href="{{ '/advanced/' | relative_url }}" class="card-link">View Advanced →</a>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">Concurrency</h3>
          <p class="card-description">Go's powerful concurrency primitives including goroutines, channels, and synchronization patterns.</p>
          <a href="{{ '/concurrency/' | relative_url }}" class="card-link">View Concurrency →</a>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">Standard Library</h3>
          <p class="card-description">Common packages and functions from Go's extensive standard library.</p>
          <a href="{{ '/standard-library/' | relative_url }}" class="card-link">View Standard Library →</a>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">Tooling</h3>
          <p class="card-description">Go tools for testing, building, and managing Go applications.</p>
          <a href="{{ '/tooling/' | relative_url }}" class="card-link">View Tooling →</a>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">About These Cheatsheets</h2>
    <p>These cheatsheets are designed to be quick references for Go programmers of all levels. They provide concise examples of common patterns and syntax without extensive explanations. For comprehensive learning resources, please refer to the <a href="https://go.dev/doc/">official Go documentation</a>.</p>
    
    <h3>Contributing</h3>
    <p>These cheatsheets are maintained as part of the GoEcosystem initiative. Contributions are welcome through pull requests to our <a href="https://github.com/GoEcosystem/go-cheatsheets">GitHub repository</a>.</p>
  </div>
</div>

<div class="getting-started">
  <div class="container">
    <h2>Getting Started</h2>
    <div class="terminal">
      <div class="terminal-line">$ git clone https://github.com/GoEcosystem/go-cheatsheets.git</div>
      <div class="terminal-line">$ cd go-cheatsheets</div>
      <div class="terminal-line">$ bundle install</div>
      <div class="terminal-line">$ bundle exec jekyll serve</div>
      <div class="terminal-line">Server running at http://127.0.0.1:4000/go-cheatsheets/</div>
    </div>
  </div>
</div>
