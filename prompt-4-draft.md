# Prompt 4 — Dark/Light Mode with Dark as Default

Add theme switching (dark/light mode) with **dark mode as the default**. Do NOT commit.

## Setup

- Install `next-themes` package
- Configure `ThemeProvider` wrapping the app in `layout.tsx` with `defaultTheme="dark"` and `attribute="class"`
- Ensure Tailwind/shadcn dark mode works via `class` strategy (should already be configured)

## Theme Toggle

- Add a **theme toggle button** in the Navbar (next to auth buttons)
- Use `Sun` and `Moon` icons from lucide-react
- Dark mode → show Sun icon (click to switch to light)
- Light mode → show Moon icon (click to switch to dark)
- Smooth icon transition/rotation on toggle
- Persist theme choice in localStorage via next-themes (built-in)

## Dark Mode Palette

Make sure all components look great in dark mode:

- **Background**: dark neutral (shadcn default dark bg, not pure black)
- **Cards**: subtle elevated bg (e.g., `bg-card` / slightly lighter than page bg), with subtle border
- **Vote button**: indigo accent still pops in dark — voted state uses indigo-500 bg, unvoted uses border with muted bg
- **Status badges**: keep colored but adjust for dark — use darker bg variants (e.g., `bg-green-900/30 text-green-400` instead of `bg-green-100 text-green-700`)
- **Text**: primary text white/gray-100, secondary text gray-400
- **Search bar and sort tabs**: proper dark borders and focus rings
- **Hero section**: text contrast works on dark bg
- **Navbar**: dark bg, clear separation from page content
- **Forms (login, register, submit feature)**: dark input fields, proper placeholder contrast
- **Skeleton loading**: dark shimmer variant
- **Hover states on cards**: shadow should be visible on dark bg (use a lighter shadow or border glow)

## Important

- Do NOT change the light mode colors — they should remain as they are now
- Dark mode should be the **default** when a user visits for the first time
- All shadcn/ui components should respect the theme automatically via CSS variables — just make sure they do
- Test both modes visually — use Playwright to take a screenshot in each mode

Do NOT commit.
