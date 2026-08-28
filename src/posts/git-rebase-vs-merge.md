---
title: "Git rebase vs. merge: picking one and moving on"
description: The rebase vs merge debate outlives most codebases. A simple rule for choosing one and ending the argument on your team.
category: git
readTime: 7 min read
date: 2026-01-12
---
This argument has been running since before most current engineers joined the industry, and it will outlive most of the codebases it's fought over. Both approaches work. What actually matters is picking one per situation and writing it down so the team stops relitigating it in every pull request.

## What each one actually does

A merge takes two branch histories and joins them with a new commit that has two parents. Nothing about the original commits changes — you get an honest record of what happened and when, including the messy parts.

A rebase takes your commits and replays them one by one on top of another branch's latest state, as if you'd started from there. The result looks like a straight line, but it rewrites commit hashes — which means anyone else who already pulled the old commits is now out of sync.

## A rule that ends the debate

Use this split and most teams stop arguing:

- **Rebase your own feature branch** before opening a pull request, to clean up "fix typo" commits and bring it up to date with main. It's still local and only yours, so rewriting history is free.
- **Merge into main** once a branch is reviewed and ready. Main is shared, so its history should stay honest and untouched — rewriting a branch everyone else has already pulled from is how you get a Tuesday afternoon debugging session that shouldn't exist.

The short version: rebase what's private, merge what's shared.

<div class="ad-slot">Ad placeholder — insert AdSense unit here</div>

## The command that actually matters

If you're cleaning up before a pull request, this is the one worth knowing well:

```
git fetch origin
git rebase origin/main
```

It replays your commits on top of the latest main, so your diff in review shows only what you actually changed — not a pile of unrelated commits from everyone else who merged before you.

## Squash merges: the third option nobody mentions

Most Git hosts (GitHub, GitLab) offer a "squash and merge" button that combines an entire pull request into a single commit on main. It sidesteps a chunk of this debate entirely: main stays linear and readable, but you never have to rebase a shared branch to get there. For teams that don't care about preserving every intermediate commit, it's often the least argued-about default.

## One rule that saves the most pain

Never rebase a branch other people have already pulled from, unless everyone on it knows and is ready to reset. That single mistake causes more lost afternoons than any actual merge conflict does.
