# Frontend Design System Style Guide

Welcome to the Portfolio Frontend Design System. This guide provides references for all design tokens, component specifications, responsive design rules, and accessibility standards.

---

## 1. Color System

### Design Tokens
* `--wall`: Base background wall color.
* `--wall-dark`: Secondary background (depth / layering / card background).
* `--ink`: Primary text color.
* `--ink-muted`: Muted secondary text.
* `--ink-faint`: Faint secondary text / metadata.
* `--accent`: Hero focus color (`#FFB300`).
* `--error`: Error / destructive action color (`#E74C3C`).
* `--warning`: Warning / alert color (`#FFDC00`).
* `--rule`: Standard horizontal divider / border line.

### Theme Values
| Token | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| `--wall` | `#fafaf8` | `#141412` |
| `--wall-dark` | `#e4e4df` | `#2a2a26` |
| `--ink` | `#1a1a18` | `#cececa` |
| `--ink-muted` | `#3a3a38` | `#a0a09a` |
| `--ink-faint` | `#5a5a58` | `#70706a` |
| `--accent` | `#FFB300` | `#FFB300` |
| `--error` | `#E74C3C` | `#E74C3C` |
| `--warning` | `#FFDC00` | `#FFDC00` |
| `--rule` | `#e4e4df` | `#2a2a26` |

---

## 2. Typography

### Font Families
* `--font-display`: `"DM Sans", "Segoe UI", Arial, sans-serif` (Headings)
* `--font-body`: `"DM Sans", "Segoe UI", Arial, sans-serif` (Standard reading body text)
* `--font-mono`: `"DM Sans", "Segoe UI", Arial, sans-serif` (Buttons / Labels / Tags / Tabular data)

### Typography Scale
| Element | Font Size | Line Height | Font Weight |
| :--- | :--- | :--- | :--- |
| **Heading (`h1`)** | `2.5rem` | `1.2` | `400` |
| **Subheading** | `1.8rem` | `1.4` | `500` |
| **Body** | `1rem` | `1.6` | `400` |
| **Code / Label** | `0.9rem` | `1.1` | `600` |

---

## 3. Spacing & Layout

### Spacing Tokens
* `--spacing-1`: `0.5rem` (Internal padding, tight gaps)
* `--spacing-2`: `1rem` (Standard component margins and padding)
* `--spacing-4`: `1.5rem` (Sub-sectional spacing)
* `--section-gap`: `4rem` (Major section dividers)

### Responsive Breakpoints
* `sm`: `600px` (Mobile)
* `md`: `960px` (Tablet / Small desktop)
* `lg`: `1200px` (Desktop)

---

## 4. Accessibility Rules

1. **Contrast Ratio**: Ensure a contrast ratio of at least `4.5:1` between text (`--ink`) and background (`--wall` or `--wall-dark`) in both light and dark modes. Check with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
2. **Keyboard Navigation**: All interactive elements (`button`, `a`, `input`, `textarea`, `select`) must have distinct `:focus` styles with standard keyboard outline or border color visibility.
3. **Semantic HTML**: Maintain clear heading hierarchies (`h1` -> `h2` -> `h3`) and include descriptive `alt` tags on all images.
