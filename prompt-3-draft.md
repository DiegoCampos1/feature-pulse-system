# Prompt 3 — Visual Redesign of Feature Cards & UI Polish

Redesign the feature cards and overall UI for a more polished, professional look. Do NOT commit.

## Feature Card Redesign

Change the card layout to a **horizontal layout with vote on the left** (like ProductHunt/Canny style):

```
┌──────────────────────────────────────────────────┐
│  ┌─────────┐                                     │
│  │    ▲    │  Title of the Feature        [Open] │
│  │   42    │  Description truncated to 2 lines...│
│  │  votes  │  👤 Test User  ·  🕐 4m ago          │
│  └─────────┘                                     │
└──────────────────────────────────────────────────┘
```

- Vote button on the **left side**, compact (around 60px wide), vertically centered
- Arrow icon on top, vote count below, "votes" label small underneath
- When voted: filled background with accent color, white text/icon
- When not voted: outlined/ghost style, subtle border
- Rest of the card content to the right: title (bold, one line), description (text-muted, max 2 lines truncated), metadata row at bottom

## Color & Accent

Add a **primary accent color** to break the all-gray monotony. Use a vibrant but professional palette:
- Primary accent: **Indigo-600** (`#4F46E5`) — for voted state, primary buttons, links, active states
- Success green for status badges like "Planned", "Completed"
- Amber/yellow for "Under Review"
- Blue for "In Progress"
- Gray for "Open"
- Red for "Declined"

Apply accent color to:
- Upvote button when voted (filled indigo background)
- "Submit Feature" button in the navbar
- Hero section icon/sparkle
- Active sort option

## Status Badges

Style the status badges with **colored backgrounds** (subtle, pastel-like) matching their meaning:
- Open → gray-100 bg, gray-700 text
- Under Review → amber-100 bg, amber-700 text
- Planned → blue-100 bg, blue-700 text
- In Progress → indigo-100 bg, indigo-700 text
- Completed → green-100 bg, green-700 text
- Declined → red-100 bg, red-700 text

## Metadata Row

- Add a small clock icon (lucide-react `Clock`) before the relative time
- Add a small user icon (lucide-react `User`) before the author name
- Use `text-muted-foreground` and smaller font size
- Separate items with a dot `·`

## Vote Interaction

- Add a subtle **scale animation** on the vote button when clicked (press effect)
- Animate the vote count number change (quick fade or slide transition)
- Show a brief **confetti/pulse effect** on first vote (optional, keep subtle)

## General Polish

- Add subtle **hover shadow/elevation** on cards (shadow-sm → shadow-md on hover, with transition)
- Cards should have a subtle left border accent when the user has voted on them (2-3px indigo left border)
- Search bar: add a subtle focus ring with the accent color
- Sort buttons: highlight the active sort option with accent color, not just bold text
- Add **skeleton loading** cards while features are loading (3 placeholder cards with shimmer animation)
- Hero section: make the sparkle icon use the accent color

## Responsive Adjustments

- On mobile (< 640px): vote button slightly smaller, description max 2 lines
- On tablet+: description can show 3 lines, cards have more padding
- The layout should breathe — add proper spacing between cards (gap-4)

Do NOT commit.
