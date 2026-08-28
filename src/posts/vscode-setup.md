---
title: Setting up a VS Code environment that doesn't fight you
description: A practical, opinionated VS Code setup — the extensions worth installing, the settings worth changing, and the ones to leave alone.
category: tooling
readTime: 5 min read
date: 2026-01-05
---
Most VS Code guides list forty extensions and call it a day. Half of them slow your editor down and you'll disable them within a week. This is the smaller list: what to install, what to turn off, and the three settings changes that make the biggest difference day to day.

## Start with fewer extensions, not more

Every extension you install adds startup time and background CPU usage. Before adding anything, ask whether VS Code already does it natively — recent versions ship with decent IntelliSense, built-in Git support, and a solid debugger for most languages out of the box.

The extensions actually worth keeping, for most stacks:

- **GitLens** — inline blame and history without leaving the file. Worth it the first time you're staring at a weird line wondering who wrote it and why.
- **Error Lens** — surfaces lint and type errors inline instead of tucked away in the Problems tab.
- **A single formatter** for your stack (Prettier, Black, gofmt) — set to run on save, so formatting stops being a conversation.
- **Your language's official extension** — for anything beyond a script, the official one is usually better maintained than community alternatives.

<div class="ad-slot">Ad placeholder — insert AdSense unit here</div>

## Settings worth changing

Three changes to `settings.json` that pay off immediately:

```
{
  "editor.formatOnSave": true,
  "editor.rulers": [100],
  "files.trimTrailingWhitespace": true
}
```

`formatOnSave` removes an entire category of pull request comments. A ruler at your team's line-length limit stops you from writing a 220-character line and finding out in review. Trimming trailing whitespace keeps diffs clean, which matters more than it sounds like it should once a codebase has multiple contributors.

## Keybindings: change fewer than you think

It's tempting to remap everything to match your last editor. Resist it for the first couple of weeks. Muscle memory forms fast, and remapping too early means relearning twice. The one binding worth changing immediately, if it isn't already set: `Cmd/Ctrl+Shift+O` for jumping to a symbol in the current file — it replaces a lot of manual scrolling.

## The workspace settings people skip

If you work across multiple repos with different conventions, put formatting and linting rules in a `.vscode/settings.json` committed to each repo, not in your global settings. It keeps the whole team's editor behaving the same way regardless of anyone's personal setup, and it means a new hire's first commit doesn't get flagged for formatting they had no way of knowing about.

None of this is exotic. That's the point — a good editor setup should be boring enough that you stop noticing it, which is what leaves attention for the actual problem you're supposed to be solving.
