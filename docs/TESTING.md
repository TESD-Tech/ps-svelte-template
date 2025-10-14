================================================
FILE: docs/svelte-testing-library/api.mdx
================================================
---
id: api
title: API
sidebar_label: API
---

`@testing-library/svelte` re-exports everything from
[`@testing-library/dom`][@testing-library/dom], as well as:

- [`render`](#render)
- [`act`](#act)
- [`cleanup`](#cleanup)
- [`fireEvent` (async)](#fireevent-async)

[@testing-library/dom]: ../dom-testing-library/api.mdx

## `render`

Render your component to the DOM with Svelte. By default, the component will be
rendered into a `<div>` appended to `document.body`.

```js
import {render} from '@testing-library/svelte'
import MyComponent from './MyComponent.svelte'

const result = render(MyComponent, componentOptions, renderOptions)
```

### Component Options

You may customize how the component is created and mounted. These options are
passed directly to Svelte.

If you only need to send props to your component, you may pass props directly,
as long as those props don't share a name with a component option.

```js
// pass props to the component
render(YourComponent, {myProp: 'value'})

// pass props and other options to the component
render(YourComponent, {
  props: {myProp: 'value'},
  context: new Map([[('theme': 'dark')]]),
})
```

The most common options you will need are:

| Option    | Description                                             | Default                             |
| --------- | ------------------------------------------------------- | ----------------------------------- |
| `props`   | Props to pass to the component.                         | N/A                                 |
| `context` | A `Map` of context values to render the component with. | N/A                                 |
| `target`  | An `HTMLElement` to render the component into.          | `<div>` appended to `document.body` |

If you specify the `target` option, the `target` element will _not_ be appended
to `document.body` automatically, and it will be used as the base element for
[bound queries](#queries) and [`debug`](#debug).

Refer to the [Svelte client-side component API docs][svelte-component-api] for
all available options.

[svelte-component-api]: https://svelte.dev/docs/client-side-component-api

### Render Options

You may also customize how Svelte Testing Library renders your component. Most
of the time, you shouldn't need to modify these options.

:::caution

Prior to `@testing-library/svelte@5.0.0`, the `baseElement` option was named
`container`.

:::

| Option        | Description                                         | Default                                    |
| ------------- | --------------------------------------------------- | ------------------------------------------ |
| `baseElement` | The base element for queries and [`debug`](#debug). | `componentOptions.target ?? document.body` |
| `queries`     | [Custom Queries][custom-queries].                   | N/A                                        |

[custom-queries]: ../dom-testing-library/api-custom-queries.mdx

### Render Results

| Result                        | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| [`baseElement`](#baseelement) | The base DOM element used for queries.                     |
| [`component`](#component)     | The mounted Svelte component.                              |
| [`container`](#container)     | The DOM element the component is mounted to.               |
| [`debug`](#debug)             | Log elements using [`prettyDOM`][pretty-dom].              |
| [`rerender`](#rerender)       | Update the component's props.                              |
| [`unmount`](#unmount)         | Unmount and destroy the component.                         |
| [`...queries`](#queries)      | [Query functions][query-functions] bound to `baseElement`. |

[pretty-dom]: ../dom-testing-library/api-debugging.mdx#prettydom
[query-functions]: ../queries/about.mdx

#### `baseElement`

_Added in `@testing-library/svelte@5.0.0`_

The base DOM element that queries are bound to. Corresponds to
`renderOptions.baseElement`. If you do not use `componentOptions.target` nor
`renderOptions.baseElement`, this will be `document.body`.

#### `container`

The DOM element the component is mounted in. Corresponds to
`componentOptions.target`. In general, avoid using `container` directly to query
for elements; use [testing-library queries][query-functions] instead.

:::tip

Use `container.firstChild` to get the first rendered element of your component.

:::

:::caution

Prior to `@testing-library/svelte@5.0.0`, `container` was set to the base
element. Use `container.firstChild.firstChild` to get the first rendered element
of the component in earlier versions.

:::

#### `component`

The Svelte component instance. See the [Svelte component
API][svelte-component-api] for more details.

:::tip

Avoid using `component` except to test developer-facing APIs, like exported
functions. Instead, interact with the DOM. Read [Avoid the Test User][test-user]
by Kent C. Dodds to understand the difference between the **end user** and
**developer user**.

:::

[test-user]: https://kentcdodds.com/blog/avoid-the-test-user

#### `debug`

Log the `baseElement` or a given element using [`prettyDOM`][pretty-dom].

:::tip

If your `baseElement` is the default `document.body`, we recommend using
[`screen.debug`][screen-debug].

:::

```js
import {render, screen} from '@testing-library/svelte'

const {debug} = render(MyComponent, {myProp: 'value'})

const button = screen.getByRole('button')

// log `document.body`
screen.debug()

// log your custom `target` or `baseElement`
debug()

// log a specific element
screen.debug(button)
debug(button)
```

[screen-debug]: ../dom-testing-library/api-debugging.mdx#screendebug

#### `rerender`

Update one or more of the component's props and wait for Svelte to update.

```js
const {rerender} = render(MyComponent, {myProp: 'value'})

await rerender({myProp: 'new value'}))
```

:::caution

Prior to `@testing-library/svelte@5.0.0`, calling `rerender` would destroy and
remount the component. Use `component.$set` and [`act`](#act) to update props in
earlier versions:

```js
const {component} = render(MyComponent, {myProp: 'value'})

await act(() => component.$set({myProp: 'new value'}))
```

:::

#### `unmount`

Unmount and destroy the Svelte component.

```js
const {unmount} = render(MyComponent, {myProp: 'value'})

unmount()
```

#### Queries

[Query functions][query-functions] bound to the [`baseElement`](#baseelement).
If you passed [custom queries][custom-queries] to `render`, those will be
available instead of the default queries.

:::tip

If your [`baseElement`](#baseelement) is the default `document.body`, we
recommend using [`screen`][screen] rather than bound queries.

:::

```js
import {render, screen} from '@testing-library/svelte'

const {getByRole} = render(MyComponent, {myProp: 'value'})

// query `document.body`
const button = screen.getByRole('button')

// query using a custom `target` or `baseElement`
const button = getByRole('button')
```

[screen]: ../queries/about.mdx#screen

## `cleanup`

Destroy all components and remove any elements added to `document.body`.

:::info

`cleanup` is called automatically if your testing framework adds a global
`afterEach` method (e.g. Mocha, Jest, or Jasmine), or if you use
`import '@testing-library/svelte/vitest'` in your [Vitest setup
file][vitest-setup]. Usually, you shouldn't need to call `cleanup` yourself.

If you'd like to disable automatic cleanup in a framework that uses a global
`afterEach` method, set `process.env.STL_SKIP_AUTO_CLEANUP`.

:::

```js
import {render, cleanup} from '@testing-library/svelte'

// Default: runs after each test
afterEach(() => {
  cleanup()
})

render(YourComponent)

// Called manually for more control
cleanup()
```

[vitest-setup]: ./setup.mdx#vitest

## `act`

Ensure all pending updates from Svelte are applied to the DOM. Optionally, you
may pass a function to be called before updates are applied. If the function
returns a `Promise`, it will be resolved first.

Uses Svelte's [`tick`][svelte-tick] method to apply updates.

```js
import {act, render} from '@testing-library/svelte'

const {component} = render(MyComponent)

await act(() => {
  component.updateSomething()
})
```

[svelte-tick]: https://svelte.dev/docs/svelte#tick

## `fireEvent` (async)

Fire an event and wait for Svelte to update the DOM. An asynchronous wrapper of
DOM Testing Library's [`fireEvent`][fire-event].

:::tip

Where possible, we recommend [`@testing-library/user-event`][user-event] instead
of `fireEvent`.

:::

```js
import {fireEvent, render, screen} from '@testing-library/svelte'

render(MyComponent)

const button = screen.getByRole('button')
await fireEvent.click(button)
```

[fire-event]: ../dom-testing-library/api-events.mdx
[user-event]: ../user-event/intro.mdx



================================================
FILE: docs/svelte-testing-library/example.mdx
================================================
---
id: example
title: Example
sidebar_label: Example
---

For additional resources, patterns, and best practices about testing Svelte
components and other Svelte features, take a look at the [Svelte Society testing
recipes][testing-recipes].

[testing-recipes]:
  https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component

## Basic

This basic example demonstrates how to:

- Pass props to your Svelte component using `render`
- Query the structure of your component's DOM elements using `screen`
- Interact with your component using [`@testing-library/user-event`][user-event]
- Make assertions using `expect`, using matchers from
  [`@testing-library/jest-dom`][jest-dom]

```html title="greeter.svelte"
<script>
  export let name

  let showGreeting = false

  const handleClick = () => (showGreeting = true)
</script>

<button on:click="{handleClick}">Greet</button>

{#if showGreeting}
<p>Hello {name}</p>
{/if}
```

```js title="greeter.test.js"
import {render, screen} from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import {expect, test} from 'vitest'

import Greeter from './greeter.svelte'

test('no initial greeting', () => {
  render(Greeter, {name: 'World'})

  const button = screen.getByRole('button', {name: 'Greet'})
  const greeting = screen.queryByText(/hello/iu)

  expect(button).toBeInTheDocument()
  expect(greeting).not.toBeInTheDocument()
})

test('greeting appears on click', async () => {
  const user = userEvent.setup()
  render(Greeter, {name: 'World'})

  const button = screen.getByRole('button')
  await user.click(button)
  const greeting = screen.getByText(/hello world/iu)

  expect(greeting).toBeInTheDocument()
})
```

[user-event]: ../user-event/intro.mdx
[jest-dom]: https://github.com/testing-library/jest-dom

## Events

Events can be tested using spy functions. If you're using Vitest you can use
[`vi.fn()`][vi-fn] to create a spy.

:::info

Consider using function props to make testing events easier.

:::

```html title="button-with-event.svelte"
<button on:click>click me</button>
```

```html title="button-with-prop.svelte"
<script>
  export let onClick
</script>

<button on:click="{onClick}">click me</button>
```

```js title="button.test.ts"
import {render, screen} from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import {expect, test, vi} from 'vitest'

import ButtonWithEvent from './button-with-event.svelte'
import ButtonWithProp from './button-with-prop.svelte'

test('button with event', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  const {component} = render(ButtonWithEvent)
  component.$on('click', onClick)

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onClick).toHaveBeenCalledOnce()
})

test('button with function prop', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(ButtonWithProp, {onClick})

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onClick).toHaveBeenCalledOnce()
})
```

[vi-fn]: https://vitest.dev/api/vi.html#vi-fn

## Slots

Slots cannot be tested directly. It's usually easier to structure your code so
that you can test the user-facing results, leaving any slots as an
implementation detail.

However, if slots are an important developer-facing API of your component, you
can use a wrapper component and "dummy" children to test them. Test IDs can be
helpful when testing slots in this manner.

```html title="heading.svelte"
<h1>
  <slot />
</h1>
```

```html title="heading.test.svelte"
<script>
  import Heading from './heading.svelte'
</script>

<Heading>
  <span data-testid="child" />
</Heading>
```

```js title="heading.test.js"
import {render, screen, within} from '@testing-library/svelte'
import {expect, test} from 'vitest'

import HeadingTest from './heading.test.svelte'

test('heading with slot', () => {
  render(HeadingTest)

  const heading = screen.getByRole('heading')
  const child = within(heading).getByTestId('child')

  expect(child).toBeInTheDocument()
})
```

## Two-way data binding

Two-way data binding cannot be tested directly. It's usually easier to structure
your code so that you can test the user-facing results, leaving the binding as
an implementation detail.

However, if two-way binding is an important developer-facing API of your
component, you can use a wrapper component and writable store to test the
binding itself.

```html title="text-input.svelte"
<script>
  export let value = ''
</script>

<input type="text" bind:value="{value}" />
```

```html title="text-input.test.svelte"
<script>
  import TextInput from './text-input.svelte'

  export let valueStore
</script>

<TextInput bind:value="{$valueStore}" />
```

```js title="text-input.test.js"
import {render, screen} from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import {get, writable} from 'svelte/store'
import {expect, test} from 'vitest'

import TextInputTest from './text-input.test.svelte'

test('text input with value binding', async () => {
  const user = userEvent.setup()
  const valueStore = writable('')

  render(TextInputTest, {valueStore})

  const input = screen.getByRole('textbox')
  await user.type(input, 'hello world')

  expect(get(valueStore)).toBe('hello world')
})
```

## Contexts

If your component requires access to contexts, you can pass those contexts in
when you [`render`][component-options] the component. When you use options like
`context`, be sure to place props under the `props` key.

[component-options]: ./api.mdx#component-options

```html title="notifications-provider.svelte"
<script>
  import {setContext} from 'svelte'
  import {writable} from 'svelte/stores'

  setContext('messages', writable([]))
</script>
```

```html title="notifications.svelte"
<script>
  import {getContext} from 'svelte'

  export let label

  const messages = getContext('messages')
</script>

<div role="status" aria-label="{label}">
  {#each $messages as message (message.id)}
  <p>{message.text}</p>
  <hr />
  {/each}
</div>
```

```js title="notifications.test.js"
import {render, screen} from '@testing-library/svelte'
import {readable} from 'svelte/store'
import {expect, test} from 'vitest'

import Notifications from './notifications.svelte'

test('notifications with messages from context', async () => {
  const messages = readable([
    {id: 'abc', text: 'hello'},
    {id: 'def', text: 'world'},
  ])

  render(Notifications, {
    context: new Map([['messages', messages]]),
    props: {label: 'Notifications'},
  })

  const status = screen.getByRole('status', {name: 'Notifications'})

  expect(status).toHaveTextContent('hello world')
})
```



================================================
FILE: docs/svelte-testing-library/faq.mdx
================================================
---
id: faq
title: FAQ
sidebar_label: FAQ
---

- [Does this library also work with SvelteKit?](#does-this-library-also-work-with-sveltekit)
- [Why isn't `onMount` called when rendering components?](#why-isnt-onmount-called-when-rendering-components)
- [How do I test file upload?](#how-do-i-test-file-upload)
- [Why aren't transition events running?](#why-arent-transition-events-running)

---

## Does this library also work with SvelteKit?

Yes, it does. It requires the same [setup][] as a "normal" Svelte project.

## Why isn't `onMount` called when rendering components?

Since the test is running in a Node environment instead of a browser
environment, it uses the SSR exports from Svelte, which declare all lifecycle
events as no-ops.

One solution is to configure Vite to use browser resolutions in tests.

```js title="vite.config.js"
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {defineConfig} from 'vite'

export default defineConfig(({mode}) => ({
  plugins: [svelte()],
  resolve: {
    // The default would be [ 'svelte', 'node' ]
    // as set by vite-plugin-svelte and vitest.
    // This sets [ 'browser', 'svelte', 'node' ]
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    environment: 'jsdom',
  },
}))
```

See svelte-testing-library's [issue 222][] for more details.

[setup]: ./setup.mdx
[issue 222]:
  https://github.com/testing-library/svelte-testing-library/issues/222

## How do I test file upload?

Use the [upload][] utility from `@testing-library/user-event` rather than
`fireEvent`. It works well in both [jsdom][] and [happy-dom][].

```js
test('upload file', async () => {
  const user = userEvent.setup()

  render(Uploader)
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})
  const input = screen.getByLabelText(/upload file/i)

  await user.upload(input, file)

  expect(input.files[0]).toBe(file)
  expect(input.files.item(0)).toBe(file)
  expect(input.files).toHaveLength(1)
})
```

[upload]: ../user-event/api-utility.mdx#upload
[jsdom]: https://github.com/jsdom/jsdom
[happy-dom]: https://github.com/capricorn86/happy-dom

## Why aren't [transition events][] running?

The [jsdom][] implementation of `requestAnimationFrame` can be unreliable in
Vitest. To work around it, you can:

- Switch to [happy-dom][], if you are able, which does not exhibit the same
  issues
- Replace the implementation of `requestAnimationFrame`

```js
beforeEach(() => {
  const raf = fn => setTimeout(() => fn(new Date()), 16)
  vi.stubGlobal('requestAnimationFrame', raf)
})

// Alternatively, set `unstubGlobals: true` in vitest.config.js
afterEach(() => {
  vi.unstubAllGlobals()
})
```

See svelte-testing-library's [issue 206][] for more details.

[transition events]:
  https://svelte.dev/docs/element-directives#transition-events
[issue 206]:
  https://github.com/testing-library/svelte-testing-library/issues/206



================================================
FILE: docs/svelte-testing-library/intro.mdx
================================================
---
id: intro
title: Intro
sidebar_label: Introduction
---

[Svelte Testing Library on GitHub][gh]

[gh]: https://github.com/testing-library/svelte-testing-library

```bash npm2yarn
npm install --save-dev @testing-library/svelte
```

> This library is built on top of [`dom-testing-library`][dom-testing-library]
> which is where most of the logic behind the queries is.

[dom-testing-library]: ../dom-testing-library/intro.mdx

## The Problem

You want to write tests for your Svelte components so that they avoid including
implementation details, and are maintainable in the long run.

## This Solution

The Svelte Testing Library is a very lightweight solution for testing Svelte
components. It provides light utility functions on top of `svelte`, in a way
that encourages better testing practices. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][testing-library-blurb]

So rather than dealing with instances of rendered Svelte components, your tests
will work with actual DOM nodes. See the
[`dom-testing-library`][dom-solution-explainer] for a more in-depth explanation.

[testing-library-blurb]:
  https://twitter.com/kentcdodds/status/977018512689455106
[dom-solution-explainer]: ../dom-testing-library/intro.mdx#this-solution

**What this library is not**:

1.  A test runner or framework.
2.  Specific to a testing framework.



================================================
FILE: docs/svelte-testing-library/setup.mdx
================================================
---
id: setup
title: Setup
sidebar_label: Setup
---

We recommend using [Vitest][], but you're free to use the library with any test
runner that's ESM compatible.

[vitest]: https://vitest.dev/

## Vitest

1. Add development dependencies

   - [`@testing-library/svelte`][@testing-library/svelte]
   - [`@testing-library/jest-dom`][@testing-library/jest-dom] (Optional, but
     highly recommended)
   - [`@sveltejs/vite-plugin-svelte`][@sveltejs/vite-plugin-svelte]
   - [`vitest`][vitest]
   - [`jsdom`][jsdom], [`happy-dom`][happy-dom], or other [Vitest DOM
     environment][vitest dom]

   ```bash npm2yarn
   npm install --save-dev \
     @testing-library/svelte \
     @testing-library/jest-dom \
     @sveltejs/vite-plugin-svelte \
     vitest \
     jsdom
   ```

   Optionally install [`@vitest/ui`][@vitest/ui], which opens a UI within a
   browser window to follow the progress and interact with your tests.

   ```bash npm2yarn
   npm install --save-dev @vitest/ui
   ```

2. Add a `vitest-setup.js` file to optionally set up
   [`@testing-library/jest-dom`][@testing-library/jest-dom] expect matchers.

   ```js title="vitest-setup.js"
   import '@testing-library/jest-dom/vitest'
   ```

3. Add `vitest.config.js`, or update your existing `vite.config.js`, with the
   `svelte` and `svelteTesting` Vite plugins. Set the testing environment to
   your DOM library of choice and optionally configure your setup file from step
   (2).

   ```js title="vite.config.js"
   import {defineConfig} from 'vitest/config'
   import {svelte} from '@sveltejs/vite-plugin-svelte'
   import {svelteTesting} from '@testing-library/svelte/vite'

   export default defineConfig({
     plugins: [svelte(), svelteTesting()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./vitest-setup.js'],
     },
   })
   ```

   Or, if you're using [SvelteKit][sveltekit]:

   ```js title="vite.config.js"
   import {defineConfig} from 'vitest/config'
   import {sveltekit} from '@sveltejs/kit/vite'
   import {svelteTesting} from '@testing-library/svelte/vite'

   export default defineConfig({
     plugins: [sveltekit(), svelteTesting()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./vitest-setup.js'],
     },
   })
   ```

   :::note

   The `svelteTesting` plugin:

   - Adds an automatic cleanup fixture to [`test.setupFiles`][test-setup-files]
   - Adds `browser` to [`resolve.conditions`][resolve-conditions]

   If needed, you can disable either behavior. Disabling both options is
   equivalent to omitting the plugin.

   ```js
   svelteTesting({
     // disable auto cleanup
     autoCleanup: false,
     // disable browser resolution condition
     resolveBrowser: false,
   })
   ```

   Resolving the `browser` condition may cause issues if you have a complex Vite
   configuration or dependencies that cannot be loaded into Node.js. See
   [testing-library/svelte-testing-library#222][] for more information and
   alternative configuration options to ensure Svelte's browser code is used.
   :::

4. Add test scripts to your `package.json` to run the tests with Vitest

   ```json title="package.json"
   {
     "scripts": {
       "test": "vitest run",
       "test:ui": "vitest --ui",
       "test:watch": "vitest"
     }
   }
   ```

5. Create your component and a test file (checkout the rest of the docs to see
   how) and run the following command to run the tests.

   ```bash npm2yarn
   npm test
   ```

[@testing-library/svelte]:
  https://github.com/testing-library/svelte-testing-library
[@testing-library/jest-dom]: https://github.com/testing-library/jest-dom
[@sveltejs/vite-plugin-svelte]: https://github.com/sveltejs/vite-plugin-svelte
[jsdom]: https://github.com/jsdom/jsdom
[happy-dom]: https://github.com/capricorn86/happy-dom
[@vitest/ui]: https://vitest.dev/guide/ui.html
[vitest dom]: https://vitest.dev/guide/environment.html
[sveltekit]: https://kit.svelte.dev/
[testing-library/svelte-testing-library#222]:
  https://github.com/testing-library/svelte-testing-library/issues/222
[test-setup-files]: https://vitest.dev/config/#setupfiles
[resolve-conditions]:
  https://vitejs.dev/config/shared-options.html#resolve-conditions

### TypeScript

Include [`@testing-library/jest-dom`][@testing-library/jest-dom] to the TypeScript `types` to make the TypeScript compiler aware about the [`@testing-library/jest-dom`][@testing-library/jest-dom] matchers.

```json title="tsconfig.json"
{
  "compilerOptions": {
	"types": ["@testing-library/jest-dom"],
  }
}
```

## Jest

[`@testing-library/svelte`][@testing-library/svelte] is ESM-only, which means
you must use Jest in [ESM mode][jest esm mode].

1. Add development dependencies

   - [`@testing-library/svelte`][@testing-library/svelte]
   - [`@testing-library/jest-dom`][@testing-library/jest-dom] (Optional, but
     highly recommended)
   - [`svelte-jester`][svelte-jester]
   - [`jest`][vitest]
   - [`jest-environment-jsdom`][jest-environment-jsdom]

   ```bash npm2yarn
   npm install --save-dev \
     @testing-library/svelte \
     @testing-library/jest-dom \
     svelte-jester \
     jest \
     jest-environment-jsdom
   ```

2. Add a `jest-setup.js` file to configure
   [`@testing-library/jest-dom`][@testing-library/jest-dom], if using.

   ```ts title="jest-setup.js"
   import '@testing-library/jest-dom'
   ```

3. Configure Jest to use jsdom, transform Svelte files, and use your setup file

   ```js title="jest.config.js"
   export default {
     transform: {
       '^.+\\.svelte$': 'svelte-jester',
     },
     moduleFileExtensions: ['js', 'svelte'],
     extensionsToTreatAsEsm: ['.svelte'],
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
   }
   ```

   :::note

   If you are using Svelte 5, you must use `svelte-jester@5` or later, and you
   will need to make additional changes to your Jest configuration.

   - Update `transform` to compile `.svelte.(js|ts)` modules
   - Allow `@testing-library/svelte` to be transformed, even though it's in
     `node_modules`

   ```diff title="jest.config.js"
     export default {
       transform: {
   -     '^.+\\.svelte$': 'svelte-jester',
   +     '^.+\\.svelte(\\.(js|ts))?$': 'svelte-jester',
       },
   +   transformIgnorePatterns: [
   +     '/node_modules/(?!@testing-library/svelte/)',
   +   ],
       moduleFileExtensions: ['js', 'svelte'],
       extensionsToTreatAsEsm: ['.svelte'],
       testEnvironment: 'jsdom',
       setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
     }
   ```

   :::

4. Add the following to your `package.json`

   ```json title="package.json"
   {
     "scripts": {
       "test": "npx --node-options=\"--experimental-vm-modules\" jest src",
       "test:watch": "npx --node-options=\"--experimental-vm-modules\" jest src --watch"
     }
   }
   ```

5. Create your component + test file (checkout the rest of the docs to see how)
   and run it

   ```bash npm2yarn
   npm test
   ```

[jest esm mode]: https://jestjs.io/docs/ecmascript-modules
[svelte-jester]: https://github.com/svelteness/svelte-jester
[jest-environment-jsdom]:
  https://jestjs.io/docs/configuration#testenvironment-string

### TypeScript and preprocessors

To use TypeScript with Jest, you'll need to install and configure
`svelte-preprocess` and `ts-jest`. For full instructions, see the
[`svelte-jester` docs][svelte-jester typescript].

If you'd like include any other [Svelte preprocessors][svelte-preprocess], see
the [`svelte-jester` docs][svelte-jester preprocess].

[svelte-preprocess]: https://github.com/sveltejs/svelte-preprocess
[svelte-jester typescript]:
  https://github.com/svelteness/svelte-jester#typescript
[svelte-jester preprocess]:
  https://github.com/svelteness/svelte-jester#preprocess


