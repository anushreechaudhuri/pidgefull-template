---
name: Pidgefull stationery
description: A pink envelope and watercolor greeting card
colors:
  berry: "#823a4d"
  berry-hover: "#692b3e"
  envelope-pink: "#edbcc5"
  flap-pink: "#f5d4da"
  envelope-back: "#d99aa9"
  paper: "#ffffff"
  ground: "#fbf7f6"
  ink: "#473b3c"
  line: "#dac9cd"
  muted-ink: "#6e5a60"
  cover-ink: "#675b60"
typography:
  cover:
    fontFamily: "Caveat, cursive"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.075em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  message:
    fontFamily: "Georgia, serif"
    fontSize: "21px"
    lineHeight: 1.7
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 600
rounded:
  control: "5px"
  field: "4px"
  envelope: "3px"
spacing:
  control-gap: "8px"
  field-row-gap: "16px"
  field-stack-gap: "22px"
components:
  button-primary:
    backgroundColor: "{colors.berry}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.berry-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "11px 12px"
---

# Design System: Pidgefull stationery

## Overview

**Creative North Star: "The watercolor letter"**

This scoped system follows the supplied jam-toast card reference: a pink paper envelope, white greeting-card stock and a small watercolor illustration. White space around the artwork makes the cover feel like a physical card. The note uses a readable serif face. The editor uses quiet, practical controls.

This document applies to the stationery routes only. The photographic gallery keeps its own design rules. The metaphor names the supplied direction; it is not a newly approved global identity.

**Key Characteristics:**

- Soft pink folded paper surrounding white stock.
- A watercolor cover followed by one complete photograph and a sender-authored note.

## Colors

### Primary

Berry supplies primary actions, links, carets and focus outlines. Its darker hover variant provides a visible response on the publish action.

### Secondary

Envelope pink, flap pink and envelope back provide the principal folded-paper planes. The illustration supplies its own watercolor hues; the controls do not repeat every painted color.

### Neutral

Paper is the card and field surface. Ground sits behind the physical object. Ink is the main readable text color; muted ink supports editor captions and placeholders, with placeholder opacity fixed at (1). Cover ink softens the uppercase front copy. Line separates fields and editor sections.

**The Scoped Palette Rule.** Keep this palette on stationery; the older photographic-card palette remains authoritative for the photographic gallery.

## Typography

**Display Font:** Caveat, cursive fallback.
**Body Font:** Manrope, sans-serif fallback.
**Message Font:** Georgia, serif fallback.

Caveat gives the addressed envelope and cover an informal card character. It is bundled at weight (600). Manrope is bundled at weights (400) and (600). Georgia keeps longer personal notes readable. None of these roles requires the owner's handwriting.

### Hierarchy

The normative frontmatter records desktop cover, body, message and label roles. Envelope addresses use Caveat at (30px), with sender text at (18px). The editor title is Caveat at (30px) and line height (1.2). Inputs use (16px) text and line height (1.55). Cover text is uppercase and preserves author-entered line breaks.

At the mobile breakpoint, cover text becomes (18px), message text becomes (20px) with line height (1.65), and the final address override uses (24px) with sender text at (15px). Smaller editor preview covers use their own scaled type: (17px) desktop and (15px) mobile.

**The Author's Words Rule.** Preserve message line breaks and leave an unwritten note empty. Never supply invented personal copy.

## Layout

The opening stage centers the envelope in at least one small viewport height. The envelope width is capped at (510px) and (87vw); its aspect ratio is (1.5). The cover width is capped at (370px) and (79vw), with aspect ratio (.73). Desktop cover padding is (78px 24px 40px).

The inside opens to two equal columns at a maximum width of (1060px), with minimum height (530px). The photo page has padding (38px); the note has padding (48px 42px). The photograph uses contain sizing, its natural aspect ratio, and a desktop maximum height of (580px).

At (700px) and below, the inside becomes a vertical card, capped at (480px). Photo padding becomes (24px 24px 0), photo height is limited to (42svh), and the message page uses (30px 27px 35px). A blank note retains breathing room. Long notes wrap anywhere when needed.

The editor has a maximum width of (1180px). Its desktop body uses two columns with a gap of (50px); on mobile it stacks with a gap of (32px), preview after fields. The main message field has minimum height (320px).

## Elevation & Depth

Shadows give paper objects gentle separation from the pale ground. The envelope rests at a slight angle; the cover and inside open through their left edge. Fold geometry supplies depth within the envelope.

### Shadow Vocabulary

- Envelope: `0 15px 28px #70334a23`.
- Cover: `0 10px 25px #70334a19`.
- Open card: `0 12px 28px #70334a16`.
- Editor photo preview: `0 4px 14px #70334a12`.

The standard motion easing is `cubic-bezier(.16,1,.3,1)`. The flap hinges over (650ms); the insert rises over (900ms), delayed (200ms). The cover reveal begins after the envelope opening state; its fold-out precedes the inside. Reduced-motion mode disables animations, shortens transitions to (.001ms), and avoids the cover rotation. JavaScript uses short state delays of (25ms) in this mode.

## Shapes

Card stock has square corners. Envelope corners are subtly softened; its folds and triangular flap use clipped polygons. The circular seal is (40px), reduced to (32px) on mobile. Final mobile positioning puts the seal at (41%) of envelope height and the address label (12px) above its bottom, keeping the recipient readable at narrow widths.

Fields use the field radius; filled and outlined actions use the control radius. Field and secondary-button strokes are (1px). Avoid turning the paper objects into rounded dashboard panels.

## Components

### Buttons

Primary actions use berry with white text and minimum height (46px). Secondary actions have a berry stroke and minimum height (44px); hover uses a pale pink fill (`#fbf0f2`). Plain navigation actions are underlined, with underline offset (4px), no border and minimum height (44px). Disabled buttons show a waiting cursor and opacity (.55).

Interactive elements use a berry focus outline of (2px), offset (4px). The focused inside-card article uses offset (6px). The preview toolbar itself has no pointer hit target; its buttons restore pointer events so Back to cover remains reachable.

### Cards / Containers

The cover centers watercolor artwork above uppercase copy. Its art remains uncropped. The inside pairs one complete photograph with a note, stacking on phones. When no photo exists, the note occupies a single narrower card capped at (680px).

### Inputs / Fields

White fields use the line color for their border and ink for their text. Placeholders use muted ink at full opacity. Labels remain separate from placeholders. Textareas resize vertically. The message allows up to (6000) characters; preserving the whole note takes precedence over a fixed inside-card height.

### Navigation

The addressed envelope and cover are keyboard-operable buttons. Opening the envelope moves focus to the front; opening the card moves focus to its inside article. Recipient navigation exposes Back to cover. Private editor previews additionally expose Back to editing.

### Envelope

Layered side and bottom folds sit around a rising white insert. The flap hinges from the top. The recipient and sender label must remain legible below the seal. The envelope-to-cover pause is part of the experience, followed by a separate intentional cover activation.

## Do's and Don'ts

### Do

- **Do** show the photograph in full and preserve its orientation.
- **Do** preserve blank messages, keyboard focus and reduced motion.
- **Do** keep this system scoped to the reusable stationery template.

### Don't

- **Don't** introduce a gallery into this card flow.
- **Don't** replace the photographic gallery's established design.
- **Don't** confuse a device draft with published recipient content.
