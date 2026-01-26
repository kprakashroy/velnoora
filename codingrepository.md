# Coding Guidelines for Velnoora Repository

## Table of Contents
1. [General Principles](#general-principles)
2. [Code Structure](#code-structure)
3. [React/Next.js Best Practices](#reactnextjs-best-practices)
4. [Performance Optimization](#performance-optimization)
5. [Database Query Optimization](#database-query-optimization)
6. [TypeScript Guidelines](#typescript-guidelines)
7. [File Organization](#file-organization)
8. [Naming Conventions](#naming-conventions)
9. [Error Handling](#error-handling)
10. [Memory Management](#memory-management)

## General Principles

### 1. Code Quality
- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Keep functions small and focused (single responsibility)
- Prefer composition over inheritance
- Use meaningful variable and function names

### 2. Self-Documenting Code
- **Function and variable names should be self-explanatory**
- Avoid excessive comments - code should speak for itself
- Use descriptive names that clearly indicate purpose
- Only add comments when explaining "why" not "what"
- Comments should explain complex business logic or non-obvious decisions
- Remove obvious comments that just restate what the code does

**Examples:**
```typescript
// ❌ Bad: Comment is redundant
// Function to get user profile
const getUserProfile = () => { ... }

// ✅ Good: Self-documenting name, no comment needed
const getUserProfile = () => { ... }

// ❌ Bad: Obvious comment
// Set loading to true
setLoading(true);

// ✅ Good: No comment needed
setLoading(true);

// ✅ Good: Comment explains "why" for complex logic
// Using debounce to prevent excessive API calls during rapid typing
const debouncedSearch = debounce(handleSearch, 300);
```

### 3. Code Reviews
- All code must be reviewed before merging
- Focus on optimization, code structure, and maintainability
- Ensure no functionality is broken during refactoring

## Code Structure

### 1. Component Organization
- **Component Size**: Keep components under 300 lines when possible
- **Separation of Concerns**: Split large components into smaller, reusable pieces
- **Custom Hooks**: Extract complex logic into custom hooks
- **State Management**: Use local state for component-specific data, Redux for global state

### 2. File Structure
```
src/
  ├── app/              # Next.js app router pages
  ├── components/        # Reusable UI components
  ├── shared/           # Shared components and utilities
  ├── hooks/            # Custom React hooks
  ├── lib/              # Library configurations and utilities
  ├── store/            # Redux store and slices
  ├── constants/        # Application constants
  ├── utils/            # Utility functions
  └── styles/           # Global styles
```

### 3. Import Organization
```typescript
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party library imports
import { FiEdit } from 'react-icons/fi';

// 3. Internal imports (use @ alias)
import { ButtonPrimary } from '@/shared/Button/ButtonPrimary';
import { useAuthApi } from '@/hooks/useAuthApi';

// 4. Type imports
import type { Product } from '@/types';
```

## React/Next.js Best Practices

### 1. Component Patterns
- Use functional components with hooks
- Prefer `'use client'` directive only when necessary
- Use Server Components by default in Next.js 13+
- Extract complex logic into custom hooks

### 2. State Management
```typescript
// ✅ Good: Group related state
const [formState, setFormState] = useState({
  description: '',
  price: '',
  category: '',
});

// ❌ Bad: Too many separate state variables
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [category, setCategory] = useState('');
```

### 3. Hooks Best Practices
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed as props
- Always include all dependencies in dependency arrays
- Clean up side effects in `useEffect` cleanup functions

### 4. Navigation
```typescript
// ✅ Good: Use Next.js Link for client-side navigation
import Link from 'next/link';
<Link href="/products">Products</Link>

// ❌ Bad: Using anchor tags for internal navigation
<a href="/products">Products</a>
```

## Performance Optimization

### 1. React Optimization
- **Memoization**: Use `React.memo` for components that re-render frequently
- **useMemo**: For expensive calculations
- **useCallback**: For functions passed to child components
- **Code Splitting**: Use dynamic imports for large components

```typescript
// ✅ Good: Memoized expensive calculation
const filteredProducts = useMemo(
  () => products.filter(p => p.category === selectedCategory),
  [products, selectedCategory]
);

// ✅ Good: Memoized callback
const handleSubmit = useCallback((e: React.FormEvent) => {
  e.preventDefault();
  // ... logic
}, [dependencies]);
```

### 2. Image Optimization
- Use Next.js `Image` component for automatic optimization
- Implement lazy loading for images below the fold
- Use appropriate image formats (WebP, AVIF)

### 3. Bundle Size
- Avoid importing entire libraries when only a function is needed
- Use tree-shaking friendly imports
- Remove unused dependencies

## Database Query Optimization

### 1. Select Specific Fields
```typescript
// ✅ Good: Select only needed fields
const { data } = await supabase
  .from('products')
  .select('id, description, amount, main_image_url')
  .eq('category', category);

// ❌ Bad: Selecting all fields with *
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category', category);
```

### 2. Query Optimization
- Always use `.select()` with specific fields
- Use indexes for frequently queried columns
- Implement pagination for large datasets
- Use `.single()` when expecting one result
- Add proper error handling

### 3. Pagination
```typescript
// ✅ Good: Implement pagination
const limit = 20;
const offset = (page - 1) * limit;
const { data } = await supabase
  .from('products')
  .select('id, description')
  .range(offset, offset + limit - 1);
```

### 4. Filtering
- Apply filters early in the query chain
- Use indexed columns for filtering
- Combine multiple filters efficiently

## TypeScript Guidelines

### 1. Type Safety
- Avoid `any` type - use proper types or `unknown`
- Define interfaces for component props
- Use type inference when possible
- Export types from dedicated files

```typescript
// ✅ Good: Proper typing
interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

// ❌ Bad: Using any
const ProductCard = ({ product }: { product: any }) => { ... }
```

### 2. Type Definitions
- Create shared types in `src/types/` or `src/lib/types.ts`
- Use type unions for limited value sets
- Prefer interfaces over types for object shapes

## File Organization

### 1. Component Files
- One component per file
- Component name should match file name
- Export default for main component
- Export types and interfaces separately

### 2. Hook Files
- One hook per file
- Prefix custom hooks with `use`
- Keep hooks focused and reusable

### 3. Utility Files
- Group related utilities together
- Use named exports for utilities
- Keep functions pure when possible

## Naming Conventions

### 1. Variables and Functions
- Use camelCase for variables and functions
- Use descriptive names
- Boolean variables should start with `is`, `has`, `should`, etc.

```typescript
// ✅ Good
const isEditing = true;
const hasError = false;
const shouldShowModal = true;

// ❌ Bad
const editing = true;
const error = false;
```

### 2. Components
- Use PascalCase for component names
- Use descriptive, self-documenting names

### 3. Constants
- Use UPPER_SNAKE_CASE for constants
- Group related constants in objects

## Error Handling

### 1. Error Boundaries
- Implement error boundaries for React components
- Provide user-friendly error messages
- Log errors for debugging

### 2. API Error Handling
```typescript
// ✅ Good: Comprehensive error handling
try {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message);
  }
  return data;
} catch (err) {
  console.error('Unexpected error:', err);
  throw err;
}
```

### 3. User Feedback
- Show loading states during async operations
- Display clear error messages to users
- Provide retry mechanisms when appropriate

## Memory Management

### 1. Object URLs
- Always revoke object URLs created with `URL.createObjectURL()`
- Clean up in `useEffect` cleanup functions
- Avoid memory leaks from unrevoked URLs

```typescript
// ✅ Good: Proper cleanup
useEffect(() => {
  const imageUrl = URL.createObjectURL(file);
  setImagePreview(imageUrl);
  
  return () => {
    URL.revokeObjectURL(imageUrl);
  };
}, [file]);
```

### 2. Event Listeners
- Remove event listeners in cleanup functions
- Use refs for DOM elements when needed

```typescript
// ✅ Good: Cleanup event listeners
useEffect(() => {
  const handleClick = (e: MouseEvent) => { ... };
  document.addEventListener('click', handleClick);
  
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, []);
```

### 3. Subscriptions
- Unsubscribe from observables and subscriptions
- Cancel pending requests when components unmount

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] Code follows the structure guidelines
- [ ] All TypeScript types are properly defined
- [ ] No `any` types are used unnecessarily
- [ ] Components are properly memoized where needed
- [ ] Database queries select specific fields
- [ ] Memory leaks are prevented (object URLs, event listeners)
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] Code is properly formatted
- [ ] No console.log statements in production code
- [ ] All dependencies are included in useEffect/useCallback arrays
- [ ] No functionality is broken

## Additional Best Practices

### 1. Accessibility
- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### 2. Security
- Never expose API keys or secrets
- Validate user input
- Use parameterized queries
- Implement proper authentication checks

### 3. Testing
- Write unit tests for utilities
- Write integration tests for critical flows
- Test error scenarios
- Maintain good test coverage

### 4. Documentation
- Prefer self-documenting code over comments
- Add JSDoc comments only for public APIs or complex functions
- Document component props with TypeScript interfaces
- Keep README files updated
- Document API endpoints in code or separate API docs
- Avoid inline comments that just describe what the code does

---

**Last Updated**: January 2026
**Version**: 1.0.0
