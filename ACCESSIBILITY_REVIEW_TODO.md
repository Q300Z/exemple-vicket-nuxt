# Accessibility Review TODO

This file contains a list of accessibility violations found during the audit of `http://localhost:3000`.

## Critical Violations
- [x] **aria-allowed-attr**: Ensure an element's role supports its ARIA attributes.
  - **Node**: `<div type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed" class="p-1">`
  - **Issue**: ARIA attribute is not allowed: `aria-expanded="false"`.
  - **Fix**: Changed `div` to `section` with `aria-label` in `VicketTicketDialog.vue`. This provides proper semantics and avoids the component being misidentified as a simple button-like trigger.
  - **Selector**: `.p-1`
  - **Help**: [Rule Documentation](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)

- [x] **button-name**: Ensure buttons have discernible text.
  - **Node**: `<button type="button" id="reka-dropdown-menu-trigger-v-0" aria-haspopup="menu" aria-expanded="false" data-state="closed" data-slot="base" class="font-medium inline-f...">`
  - **Issue**: Element does not have inner text that is visible to screen readers or an aria-label.
  - **Fix**: Added `aria-label="Changer la langue"` to the i18n switcher in `app/app.vue`.
  - **Selector**: `#reka-dropdown-menu-trigger-v-0`
  - **Help**: [Rule Documentation](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)

## Serious Violations
- [x] **color-contrast**: Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds.
  - **Node**: `<span class="text-[var(--ui-primary)] font-semibold" data-v-02281a80="">CSS Variables</span>`
  - **Issue**: Element has insufficient color contrast of 3.58. Expected contrast ratio of 4.5:1.
  - **Fix**: Applied hex color `#4a47ff` (calculated by accessibility tool) to the "CSS Variables" span in `app/pages/index.vue` to ensure 4.5:1 contrast ratio against the background.
  - **Selector**: `.font-semibold`
  - **Help**: [Rule Documentation](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)

## Moderate Violations
- [x] **region**: Ensure all page content is contained by landmarks.
  - **Node**: `<div type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed" class="p-1">`
  - **Issue**: Some page content is not contained by landmarks.
  - **Fix**: Wrapped the floating support launcher in an `aside` landmark with an `aria-label="Support et Aide"` in `VicketSupportLauncher.vue`.
  - **Selector**: `.p-1`
  - **Help**: [Rule Documentation](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
