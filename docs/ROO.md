# Svelte Testing Reference

This document provides a persistent reference for Svelte component testing in this project, including setup, best practices, troubleshooting, Svelte 5 testing philosophy, and the latest test run result.

---

## 1. Svelte Component Testing: Setup, Best Practices, and Troubleshooting

### Setup

- **Recommended Tools:**  
  - [Vitest](https://vitest.dev/) (preferred for Vite/SvelteKit projects)
  - [@testing-library/svelte](https://github.com/testing-library/svelte-testing-library)
  - [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) (optional, for matchers)
  - [jsdom](https://github.com/jsdom/jsdom) or [happy-dom](https://github.com/capricorn86/happy-dom) for DOM environment

- **Install dependencies (Vitest example):**
  ```bash
  npm install --save-dev @testing-library/svelte @testing-library/jest-dom @sveltejs/vite-plugin-svelte vitest jsdom
  ```

- **Configure Vitest in `vite.config.js`:**
  ```js
  import { defineConfig } from 'vitest/config'
  import { svelte } from '@sveltejs/vite-plugin-svelte'
  import { svelteTesting } from '@testing-library/svelte/vite'

  export default defineConfig({
    plugins: [svelte(), svelteTesting()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest-setup.js'],
    },
    resolve: process.env.VITEST
      ? { conditions: ['browser'] }
      : undefined,
  })
  ```

- **TypeScript:**  
  Add `"types": ["@testing-library/jest-dom"]` to `tsconfig.json` for matcher support.

- **Jest:**  
  Use ESM mode and `svelte-jester@5` or later for Svelte 5. See TESTING.md for full Jest config.

### Best Practices

- **Testing Philosophy:**  
  Write tests that resemble how users interact with your app. Prefer DOM queries and user events over direct component instance access.

- **@testing-library/svelte API highlights:**
  - `render(Component, options)`: Mounts a Svelte component for testing.
  - `screen`: Use for queries (e.g., `screen.getByRole`).
  - `userEvent`: Simulate user interactions.
  - `cleanup()`: Removes components from the DOM (usually automatic).
  - `act()`: Ensures all Svelte updates are applied before assertions.
  - `fireEvent`: For lower-level event simulation (prefer `userEvent`).

- **Patterns:**
  - Pass props via `render(Component, { myProp: value })`.
  - Use wrapper components for testing slots, two-way binding, or context.
  - Use spies (e.g., `vi.fn()`) to test event handlers.
  - Test user-facing results, not implementation details.

- **Component Options:**  
  Use `props`, `context`, and `target` to customize rendering.

- **Troubleshooting:**
  - For SvelteKit, use the same setup as a standard Svelte project.
  - If `onMount` is not called, ensure the test environment is set to `jsdom` and browser conditions are resolved.
  - For file uploads, use `userEvent.upload` instead of `fireEvent`.
  - For transition events, consider using `happy-dom` or stub `requestAnimationFrame` in Vitest.

### Example Test

```js
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Counter from './Counter.svelte'

test('increments on click', async () => {
  render(Counter, { initial: 0 })
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('0')
  await userEvent.click(button)
  expect(button).toHaveTextContent('1')
})
```

---

## 2. Svelte 5 Testing Philosophy and Strategies

### Philosophy

- Svelte is unopinionated about testing frameworks; use what fits your workflow (Vitest, Jasmine, Cypress, Playwright, etc.).
- Focus on testing behavior and user experience, not internal implementation.

### Unit and Integration Testing

- Use Vitest for unit and integration tests.
- Configure Vite to resolve browser conditions for accurate DOM behavior.
- You can use runes (e.g., `$state`, `$effect`) directly in `.svelte` and `.svelte.test.js` files.
- For code using effects, wrap tests in `$effect.root` and use `flushSync` to ensure effects run before assertions.

#### Example: Using runes in tests

```js
import { flushSync } from 'svelte'
import { expect, test } from 'vitest'

test('reactive value', () => {
  let count = $state(0)
  let double = () => count * 2
  expect(double()).toEqual(0)
  count = 5
  expect(double()).toEqual(10)
})
```

### Component Testing

- Use `jsdom` for DOM APIs in tests.
- You can test components using Svelte's `mount`/`unmount` or with `@testing-library/svelte` for a higher-level, user-centric approach.
- Prefer `@testing-library/svelte` for maintainable, less brittle tests.

#### Example: Component test with @testing-library/svelte

```js
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Component from './Component.svelte'

test('Component', async () => {
  render(Component)
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('0')
  await userEvent.click(button)
  expect(button).toHaveTextContent('1')
})
```

- For two-way bindings, context, or snippet props, use wrapper components.

### End-to-End (E2E) Testing

- Use Playwright, Cypress, or similar tools for E2E tests.
- E2E tests interact with the app as a user would, without Svelte-specific APIs.
- Example Playwright config:
  ```js
  // playwright.config.js
  export default {
    webServer: {
      command: 'npm run build && npm run preview',
      port: 4173
    },
    testDir: 'tests',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/
  }
  ```
- Example Playwright test:
  ```js
  import { expect, test } from '@playwright/test'

  test('home page has expected h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })
  ```

---

## 3. Latest Test Run Result

- **Status:** All tests passed (14/14)
- **Errors/Warnings:** None
- **Test file:** `src/lib/Counter.test.ts`

---