# Component Design & Styling Guidelines

This document details the usage and style specifications for core UI components, structured for the Portfolio frontend design system.

---

## 1. Buttons

### CSS Specification
```css
button {
  --btn-bg: var(--analytics-btn-bg, transparent);
  --btn-text: var(--analytics-btn-text, var(--ink));
  
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: 1px solid transparent;
  font-family: var(--font-mono);
  transition: background 150ms, color 150ms, border-color 150ms;
  cursor: pointer;
}

button:hover:not(:disabled) {
  --btn-bg: var(--analytics-btn-hover, var(--ink));
  --btn-text: var(--analytics-btn-hover-text, var(--wall));
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modifiers */
.admin-btn {
  --analytics-btn-bg: transparent;
  --analytics-btn-text: var(--ink);
  --analytics-btn-hover: var(--ink);
  --analytics-btn-hover-text: var(--wall);
  
  border: 1px solid var(--ink);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 14px;
}

.admin-btn-sm {
  --analytics-btn-bg: transparent;
  --analytics-btn-text: var(--ink-muted);
  --analytics-btn-hover: var(--ink);
  --analytics-btn-hover-text: var(--ink);
  
  border: 1px solid var(--rule);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  white-space: nowrap;
}

.admin-btn-sm:hover:not(:disabled) {
  border-color: var(--ink);
}
```

### Usage Example
```tsx
// Primary Button
<button className="admin-btn">Save Changes</button>

// Small/Secondary Button
<button className="admin-btn-sm">Edit</button>
```

---

## 2. Inputs

### CSS Specification
```css
input[type="text"],
input[type="email"],
input[type="password"],
textarea,
select {
  --input-bg: transparent;
  --input-border: var(--rule);
  
  background: var(--input-bg);
  border: none;
  border-bottom: 1px solid var(--input-border);
  color: var(--ink);
  font-family: var(--font-body);
  transition: border-color 150ms;
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  --input-border: var(--ink);
}

.admin-input {
  display: block;
  width: 100%;
  font-size: 14px;
  padding: 6px 0;
  resize: vertical;
}
```

### Usage Example
```tsx
<input 
  type="text" 
  className="admin-input" 
  placeholder="Enter title..." 
/>
```

---

## 3. Cards

### CSS Specification
```css
.card {
  --card-bg: var(--wall-dark);
  --card-border: var(--rule);
  
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  padding: var(--spacing-2);
  transition: border-color 150ms;
}

.card:hover {
  --card-border: var(--ink);
}
```

### Usage Example
```tsx
<div className="card">
  <h3>Project Title</h3>
  <p>Project description goes here.</p>
</div>
```
