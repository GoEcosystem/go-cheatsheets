---
layout: default
title: Go Cheatsheets
description: Quick reference guides for Go programming language
---

<div class="hero-section">
  <div class="container">
    <div class="hero-logo">
      <img src="{{ '/assets/images/logos/Go-Logo_White.svg' | relative_url }}" alt="Go Logo" class="hero-image">
    </div>
    <h1>Go Cheatsheets</h1>
    <p class="hero-tagline">Quick reference guides for Go programming language</p>
    <div class="hero-buttons">
      <a href="https://github.com/GoEcosystem/go-cheatsheets" class="btn btn-primary">View on GitHub</a>
      <a href="#cheatsheets" class="btn btn-secondary">Explore Cheatsheets</a>
    </div>
  </div>
</div>

<div class="container" id="cheatsheets">
  <section class="content-section">
    <h2>Go Quick Reference Guides</h2>
    <p>These cheatsheets provide concise reference material for Go programming. Each cheatsheet focuses on a specific topic and includes common syntax, patterns, and best practices.</p>
  </section>

  <section class="cheatsheet-section">
    <div class="cheatsheet-grid">
      <div class="cheatsheet-card">
        <h3>Basics</h3>
        <div class="cheatsheet-card-content">
          <p>Core syntax, variables, functions, and control flow structures in Go.</p>
          <ul>
            <li><a href="{{ '/basics/basic-syntax/' | relative_url }}">Basic Syntax</a></li>
            <li><a href="{{ '/basics/data-structures/' | relative_url }}">Data Structures</a></li>
          </ul>
        </div>
        <div class="cheatsheet-card-footer">
          <a href="{{ '/basics/' | relative_url }}" class="btn btn-secondary">View Basics</a>
        </div>
      </div>
      
      <div class="cheatsheet-card">
        <h3>Advanced</h3>
        <div class="cheatsheet-card-content">
          <p>Advanced Go concepts including interfaces, reflection, and error handling.</p>
          <ul>
            <li><a href="{{ '/advanced/error-handling/' | relative_url }}">Error Handling</a></li>
            <li><a href="{{ '/advanced/interfaces/' | relative_url }}">Interfaces</a></li>
          </ul>
        </div>
        <div class="cheatsheet-card-footer">
          <a href="{{ '/advanced/' | relative_url }}" class="btn btn-secondary">View Advanced</a>
        </div>
      </div>
      
      <div class="cheatsheet-card">
        <h3>Concurrency</h3>
        <div class="cheatsheet-card-content">
          <p>Go's powerful concurrency primitives including goroutines and channels.</p>
          <ul>
            <li><a href="{{ '/concurrency/goroutines/' | relative_url }}">Goroutines</a></li>
            <li><a href="{{ '/concurrency/channels/' | relative_url }}">Channels</a></li>
          </ul>
        </div>
        <div class="cheatsheet-card-footer">
          <a href="{{ '/concurrency/' | relative_url }}" class="btn btn-secondary">View Concurrency</a>
        </div>
      </div>
      
      <div class="cheatsheet-card">
        <h3>Standard Library</h3>
        <div class="cheatsheet-card-content">
          <p>Common packages and functions from Go's extensive standard library.</p>
          <ul>
            <li><a href="{{ '/standard-library/io/' | relative_url }}">I/O Operations</a></li>
            <li><a href="{{ '/standard-library/http/' | relative_url }}">HTTP Client/Server</a></li>
          </ul>
        </div>
        <div class="cheatsheet-card-footer">
          <a href="{{ '/standard-library/' | relative_url }}" class="btn btn-secondary">View Standard Library</a>
        </div>
      </div>
      
      <div class="cheatsheet-card">
        <h3>Tooling</h3>
        <div class="cheatsheet-card-content">
          <p>Go tools for testing, building, and managing Go applications.</p>
          <ul>
            <li><a href="{{ '/tooling/testing/' | relative_url }}">Testing</a></li>
            <li><a href="{{ '/tooling/build/' | relative_url }}">Build Tools</a></li>
          </ul>
        </div>
        <div class="cheatsheet-card-footer">
          <a href="{{ '/tooling/' | relative_url }}" class="btn btn-secondary">View Tooling</a>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section">
    <h2>How to Use</h2>
    <p>Each cheatsheet is a standalone document focusing on a specific topic. They are designed to be concise, providing just enough information to remind you of syntax or patterns without having to search through extensive documentation.</p>
    <p>Browse the categories above or view the <a href="https://github.com/GoEcosystem/go-cheatsheets">full repository on GitHub</a>.</p>
  </section>
</div>
