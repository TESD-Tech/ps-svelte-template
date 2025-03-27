# PowerSchool Svelte Template Contrast Fix

This contrast fix addresses the white text on white background issue in the PowerSchool Svelte Template project.

## What Was Fixed

The fix targets several areas in the application:

1. The Development Tools section where text was white on white background
2. The "SWITCH PORTAL" text and related UI elements
3. Headings with gradient backgrounds that were unreadable
4. Buttons and interactive elements with insufficient contrast
5. Shadow DOM content with inherited contrast issues

## How It Works

The solution works by:

1. Creating contrast-specific CSS that overrides the problematic styles
2. Injecting this CSS into both the global document and Shadow DOM
3. Modifying the component registration to automatically apply the contrast fix
4. Ensuring all text elements have proper color values with sufficient contrast

## Implementation Details

The fix consists of three key files:

1. `src/css-fix/contrast-fix.css` - The CSS rules that fix the contrast issues
2. `src/css-fix/styleInjector.ts` - Utility to inject the CSS into the document and Shadow DOM
3. Modifications to `custom-element.ts` and `lib-components.ts` to use the contrast fix

## How to Use

The contrast fix has already been integrated into the project. It automatically initializes when the application starts, so you don't need to do anything special to enable it.

If you need to apply the fix to new components:

```typescript
// Import the style injector
import { injectShadowContrastFix } from './css-fix/styleInjector';

// Then in your Shadow DOM creation:
const shadow = this.attachShadow({ mode: 'open' });
injectShadowContrastFix(shadow);
```

## Customization

If you need to adjust the contrast fix:

1. Edit `src/css-fix/contrast-fix.css` to modify the CSS rules
2. The changes will automatically apply to all components

## Testing

To verify the fix is working:

1. Check the Development Tools section - text should be clearly visible
2. Verify that all buttons have proper text contrast
3. Check that headings are readable without gradient backgrounds interfering
4. Test across different portals to ensure consistent appearance

## Troubleshooting

If you still encounter contrast issues:

1. Open the browser developer tools and inspect the problematic element
2. Verify that the contrast fix styles are being applied (should see `!important` rules)
3. If not, check that the Shadow DOM contains the `#contrast-fix-styles` element
4. For persistent issues, add more specific CSS selectors to `contrast-fix.css`

## Maintenance

When adding new components or UI elements:

1. Use the standard color variables defined in `app.css`
2. Avoid using white text on light backgrounds
3. Test in different portal contexts to ensure readability
4. If needed, add specific overrides to `contrast-fix.css`
