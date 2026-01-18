---
title: Structuring Tailwind in Large Hyvä Projects
date: 2025-01-17
excerpt: Structuring Tailwind in large Hyvä projects is mostly about taming growth before it becomes chaos and making the config reflect your design system, not just your current screens.
tags:
  - magento
  - hyva
  - tailwindcss
---

Structuring Tailwind in large Hyvä projects is mostly about taming growth before it becomes chaos and making the config reflect your design system, not just your current screens. Well-structured Tailwind pays you back in faster onboarding, cleaner DOM, and easier multi‑store theming.

## Start with one source of truth

Large Hyvä builds need a single source for tokens and breakpoints instead of ad‑hoc tweaks in each theme. Use the main tailwind.config.js (or a parent/child setup) as your canonical place for colors, typography, spacing and screens.

Define brand colors, font stacks, spacing scale and radius in theme.extend and keep raw hex values out of templates.

In multi‑store setups, keep a shared base config and let child themes extend it via mergeTailwindConfig or similar helper utilities.

Lean on Hyvä’s design‑token support (CSS variables + Tailwind tokens) so PHP‑driven values and Tailwind stay in sync.

## Breakpoints that match your product

Tailwind’s screens are defined in theme.screens and can be customised to match your actual UX and analytics, not just the defaults. In Hyvä, that config lives alongside your theme and can also inherit from the default Hyvä theme if you want a consistent baseline.

Decide on a small, stable set of breakpoints (for example sm, md, lg, xl, 2xl, maybe a 3xl for huge catalog layouts) and document what each means in product terms.

When extending, import parent screens and add only what you need instead of redefining everything, e.g. bringing in the Hyvä default then appending a 3xl breakpoint.

Avoid sprinkling max-* or one‑off custom screens per component; those “special” breakpoints are usually a design‑system decision, not a one‑off hack.

## Design system first, utilities second

Hyvä already pushes you toward a component‑based UI with Tailwind and Alpine, so reflect your design system directly in Tailwind tokens. The goal is: designers talk in tokens and components, developers reach for those same names in Tailwind.

Map your palette and typography to semantically named tokens like brand, accent, muted, heading, body rather than raw Tailwind defaults alone.

Use CSS variables for dynamic values (per store, per theme) and reference them via Tailwind.

Reserve totally ad‑hoc utilities (like mt-[37px]) for genuine edge cases; if something appears twice, it probably wants a proper token.

## Extract components to avoid utility soup

If every .phtml reads like a wall of Tailwind classes, you will eventually hit “utility soup”. Hyvä and Tailwind give you multiple ways to stop that: component classes, UI libraries, and reusable layout partials.

Use @layer components with @apply in your CSS to extract repeated patterns such as buttons, badges and cards into named classes like .btn-primary or .card.

Group layout primitives (e.g. content widths, container padding, grid shells) into a small set of reusable classes or partials instead of inlining full responsive grids every time.

When something mixes behaviour and styling, create a Hyvä UI component or a Magento block with a clear template and keep the Tailwind config behind a simple class name.

## Keep the build lean and maintainable

Hyvä wires Tailwind into Magento with automatic content scanning and a config generation command, but large codebases still need discipline. The more modules and themes you add, the more important it is to control what Tailwind scans and how often you rebuild.

Use hyva:config:generate and hyva.config.json to control which modules are included in Tailwind’s content list so you are not compiling against unused templates.

For custom modules, ship a local Tailwind config and register it so their templates are scanned without polluting the main theme config.

Regularly prune safelists and legacy classes; stale safelisted utilities silently grow your CSS bundle.

## Scaling across teams and stores

On big Hyvä builds, Tailwind structure is a collaboration problem as much as a technical one. A thin layer of agreed rules prevents each dev and store from inventing a new micro‑framework.

Document naming conventions, breakpoint usage and when to extract components in a short “Hyvä Tailwind playbook” and keep it in the repo.

For multi‑store Magento setups, centralise shared tokens and breakpoints, and let each store extend only branding and a small set of layout variations in child themes.

Include Tailwind checks in code review: too many inline utilities, new arbitrary values, or one‑off screens are early signals that the design system or config needs an update.

Handled this way, Tailwind in Hyvä stops being a pile of class strings and becomes an explicit, versioned representation of your design system that scales as your Magento project grows.
