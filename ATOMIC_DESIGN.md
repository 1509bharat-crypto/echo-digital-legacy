# Atomic Design Principles

## Overview

This project follows Atomic Design methodology with Object-Oriented Programming principles to create a scalable, maintainable component architecture.

## Component Hierarchy

### Atoms
The smallest, most basic building blocks. Cannot be broken down further.

**Rules:**
- Single responsibility only
- No business logic
- Pure presentational components
- Highly reusable
- No dependencies on other components
- Maximum 50 lines of code

**Examples:**
- Button
- Input
- Label
- Icon
- Text
- Image
- Link

**Location:** `/src/components/atoms/`

### Molecules
Simple groups of atoms functioning together as a unit.

**Rules:**
- Combine 2-5 atoms maximum
- Single, clear purpose
- Minimal logic (only for internal state)
- Reusable across different contexts
- Maximum 100 lines of code

**Examples:**
- FormField (Label + Input)
- SearchBar (Input + Button + Icon)
- Card (Image + Text + Button)
- NavItem (Icon + Link)

**Location:** `/src/components/molecules/`

### Organisms
Complex components composed of atoms, molecules, and other organisms.

**Rules:**
- Represent distinct sections of interface
- Can contain business logic
- May use hooks and state management
- Should still be reusable
- Maximum 200 lines of code

**Examples:**
- Header (Logo + Navigation + SearchBar)
- Footer (NavItems + Text + Links)
- ProductCard (Image + Text + Price + Button)
- ContactForm (Multiple FormFields + Button)

**Location:** `/src/components/organisms/`

### Templates
Page-level layouts without real content.

**Rules:**
- Define page structure and layout
- Use placeholder content/props
- No hardcoded data
- Focus on layout grid and spacing
- Client components when using animations

**Examples:**
- HomePageTemplate
- DashboardTemplate
- ArticleTemplate

**Location:** `/src/components/templates/`

### Pages
Specific instances of templates with real content.

**Rules:**
- Populate templates with actual data
- Handle data fetching
- Implement page-specific logic
- Server components by default (Next.js 13+)

**Location:** `/src/app/*/page.tsx`

## Object-Oriented Principles

### Encapsulation
- Each component manages its own state
- Internal implementation details are hidden
- Clear public interface through props

### Inheritance (Composition over Inheritance)
- Use composition to extend functionality
- Create wrapper components instead of class inheritance
- Share logic through hooks, not inheritance

### Polymorphism
- Components accept variant props
- Same interface, different implementations
- Use TypeScript discriminated unions for variants

### Single Responsibility
- One component = one job
- If a component does multiple things, split it

## Component Structure

### File Organization
```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── hooks/
├── utils/
└── types/
```

### Component Template
```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// ComponentName.tsx
import { ComponentNameProps } from './ComponentName.types';

export const ComponentName = ({
  variant = 'primary',
  size = 'md',
  children
}: ComponentNameProps) => {
  return (
    <div className={`component-${variant} component-${size}`}>
      {children}
    </div>
  );
};

// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

## Naming Conventions

### Components
- PascalCase: `Button`, `NavBar`, `UserProfile`
- Descriptive and specific: `SubmitButton` not `Btn`
- Prefix with category when needed: `IconButton`, `TextButton`

### Props
- camelCase: `onClick`, `isDisabled`, `backgroundColor`
- Boolean props: prefix with `is`, `has`, `should`: `isActive`, `hasError`
- Event handlers: prefix with `on`: `onClick`, `onSubmit`, `onHover`

### Files
- Match component name: `Button.tsx`, `NavBar.tsx`
- Types file: `ComponentName.types.ts`
- Styles (if separate): `ComponentName.styles.ts`

## TypeScript Requirements

### Strict Typing
- All props must have explicit types
- No `any` types
- Use `interface` for props
- Export all types

### Prop Types
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

## Styling Rules

### Tailwind CSS
- Use utility classes
- Extract repeated patterns to components
- Use className prop for customization
- Avoid inline styles

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test all breakpoints

## Best Practices

### DRY (Don't Repeat Yourself)
- Extract repeated JSX into components
- Use composition for shared functionality
- Create utility functions for common operations

### Props Drilling
- Maximum 2 levels of prop drilling
- Use Context for deeply nested props
- Consider state management for complex data flow

### Performance
- Memoize expensive computations
- Use `React.memo()` for expensive renders
- Lazy load heavy components
- Optimize images and assets

### Accessibility
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

### Testing
- Write unit tests for atoms
- Integration tests for molecules/organisms
- E2E tests for critical user flows

## Component Checklist

Before creating a component, ask:

1. ✅ Is this the smallest possible component?
2. ✅ Does it have a single responsibility?
3. ✅ Can it be reused in different contexts?
4. ✅ Are props clearly typed?
5. ✅ Is it accessible?
6. ✅ Does it follow naming conventions?
7. ✅ Is it in the correct category (atom/molecule/organism)?

## Code Review Standards

Every component must:
- [ ] Follow Atomic Design hierarchy
- [ ] Have TypeScript types
- [ ] Be properly documented
- [ ] Include prop descriptions
- [ ] Follow naming conventions
- [ ] Be under size limits
- [ ] Have no console.logs or debug code
- [ ] Use semantic HTML
- [ ] Be responsive
- [ ] Be accessible

## Examples

### ❌ Bad: Too Complex, Mixed Concerns
```typescript
const UserDashboard = () => {
  // 500 lines of code
  // Fetches data, renders header, sidebar, content, footer
  // Multiple responsibilities
}
```

### ✅ Good: Atomic Approach
```typescript
// Atom
const Avatar = ({ src, alt }) => <img src={src} alt={alt} />;

// Molecule
const UserInfo = ({ avatar, name, email }) => (
  <div>
    <Avatar src={avatar} alt={name} />
    <Text>{name}</Text>
    <Text>{email}</Text>
  </div>
);

// Organism
const DashboardHeader = ({ user }) => (
  <header>
    <Logo />
    <Navigation />
    <UserInfo {...user} />
  </header>
);

// Template
const DashboardTemplate = ({ header, sidebar, content }) => (
  <div>
    {header}
    {sidebar}
    {content}
  </div>
);

// Page
const DashboardPage = () => {
  const user = useUser();
  return (
    <DashboardTemplate
      header={<DashboardHeader user={user} />}
      sidebar={<Sidebar />}
      content={<MainContent />}
    />
  );
};
```

## Migration Strategy

When refactoring existing code:

1. Start with atoms (buttons, inputs, text)
2. Combine atoms into molecules
3. Build organisms from molecules
4. Create templates for layouts
5. Update pages to use new components
6. Remove old components
7. Update imports
8. Test thoroughly

## Resources

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [React Component Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
