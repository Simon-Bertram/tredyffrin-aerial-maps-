```markdown
# Design System: The Digital Archive

## 1. Overview & Creative North Star: "The Digital Curator"

The Creative North Star for this design system is **The Digital Curator**. We are not building a standard website; we are designing a living archive. The experience must feel as intentional and tactile as a well-preserved manuscript, where every element is placed with scholarly precision.

To move beyond the "template" look, this system utilizes **intentional asymmetry** and **tonal layering**. We break the rigid, boxy nature of the web by treating the screen as a physical desk. Elements should overlap slightly, white space should be treated as a luxury (not a void), and the typography must command the page with an editorial authority that feels both historic and contemporary.

---

## 2. Colors & Surface Philosophy

The palette is rooted in history—deep forest greens, parchment creams, and antique gold—but applied with a modern, high-end digital sensibility.

### Surface Hierarchy & Nesting

We reject the "flat" web. Depth is achieved through **Surface Stacking**.

- **Base Layer:** Use `surface` (#fcf9f0) for the primary canvas.
- **The Nested Sheet:** Place `surface_container_low` (#f6f3ea) or `surface_container` (#f1eee5) sections atop the base to denote a change in content (e.g., a "Current Exhibits" section).
- **The Highlighted Document:** Use `surface_container_lowest` (#ffffff) for cards or featured content to create a soft, natural lift that mimics a fresh sheet of paper resting on a desk.

### The "No-Line" Rule

**Standard 1px solid borders are strictly prohibited for sectioning.**
Boundaries must be defined through background shifts. If you need to separate two sections, transition from `surface` to `surface_container_low`. This creates a sophisticated, "borderless" interface that feels expensive and seamless.

### Signature Textures & Gradients

To provide visual "soul," use a subtle linear gradient for hero backgrounds or primary CTAs:

- **Primary Gradient:** `primary` (#173124) to `primary_container` (#2d4739). This adds a velvet-like depth to the forest green that a flat hex code cannot achieve.

---

## 3. Typography: The Editorial Voice

The tension between the academic Noto Serif and the functional Inter creates the "Classic Modern" aesthetic.

- **Display & Headlines (Noto Serif):** These are your "Manuscript" titles. Use `display-lg` for hero moments with tight letter-spacing (-0.02em) to give it a modern, high-fashion edge.
- **Body (Inter):** This is your "Reference" text. Inter provides a clean, neutral counterpoint to the serif headers, ensuring high legibility for long-form historical entries.
- **Labels (Inter Bold):** Use `label-md` in all-caps with generous letter-spacing (+0.1em) for category tags or "Established 1924" markers to evoke a sense of archival cataloging.

---

## 4. Elevation & Depth

In this design system, "Elevation" is a whisper, not a shout.

- **The Layering Principle:** Use the `surface-container` tiers (Lowest to Highest) to create hierarchy. A `surface_container_highest` element should be reserved for the most interactive or urgent components, such as a "Donate" modal.
- **Ambient Shadows:** Shadows should be almost invisible. Use a 24px-32px blur with only 4% opacity of the `on_surface` color. It should feel like the soft shadow of a heavy book, not a digital button.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in a high-contrast state), use the `outline_variant` token at **15% opacity**. It should be a "suggestion" of a line, appearing like a light crease in paper.
- **Glassmorphism:** For floating navigation bars or "Quick Fact" overlays, use a semi-transparent `surface` color with a `20px` backdrop blur. This allows the earthy colors of the background to bleed through, softening the layout.

---

## 5. Components

### Buttons

- **Primary:** `primary` (#173124) background with `on_primary` (#ffffff) text. No border. 0px radius. Use wide horizontal padding (32px) for a luxurious, confident stance.
- **Secondary (The Antique Gold):** `secondary` (#775a19) text on a `surface_container_low` background. This is used for "Learn More" or "View Collection."
- **Tertiary:** `on_surface` text with a "Ghost Border" (15% opacity `outline_variant`) that becomes 40% opaque on hover.

### Cards & Lists

- **The Archive Card:** Forbid divider lines. Separate items using `surface_container` shifts. A card should have 0px corner radius—sharp corners imply precision and historical permanence.
- **The "Folio" List:** Use `body-lg` for list titles and `label-sm` for dates. Use vertical white space (32px or 48px) instead of borders to separate list items.

### Input Fields

- **The Ledger Style:** Use a `surface_container_high` background. Instead of a 4-sided box, use a 1px `outline` (#727973) only on the bottom edge, mimicking a ruled notebook.

### Additional Components: "The Artifact Badge"

- Use `secondary_container` (#fed488) with `on_secondary_container` (#785a1a) for small, circular badges indicating "Original Document" or "Rare Find." This adds the "touch of antique gold" requested.

---

## 6. Do’s and Don’ts

### Do:

- **Use "Asymmetric Breathing Room":** Push a text block to the right while leaving the left 30% of the container empty. This creates a scholarly, curated feel.
- **Layer Images:** Place a photograph (historical artifact) so it slightly overlaps the edge of a `surface_container` to create a 3D "stacked paper" effect.
- **Embrace Sharp Edges:** Keep all `borderRadius` at **0px**. The historical society is an institution of record; sharp corners convey strength and timelessness.

### Don’t:

- **Don’t use "Pure Black":** Use `tertiary` (#2b2b2b) or `primary` (#173124) for text. Pure black (#000) is too harsh for the parchment-inspired palette.
- **Don’t use standard shadows:** Never use a default `0px 4px 10px rgba(0,0,0,0.5)`. It breaks the archival illusion.
- **Don’t crowd the page:** If you feel you need a divider line, try adding 24px of white space instead. If it still feels messy, adjust the background tonal shift.
```
