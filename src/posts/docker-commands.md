---
title: 5 Docker commands I actually use every week
description: Skip the 40-command cheat sheet. The small set of Docker commands that cover most real working days.
category: containers
readTime: 6 min read
date: 2026-01-19
---
Docker's CLI has well over a hundred subcommands. Most working weeks, five or six of them cover everything. Here's the actual working set, with the reason each one earns its place.

## 1. See what's actually running

```
docker ps
```

The first thing to run when something feels off. Add `-a` to include stopped containers — useful when a container exited immediately and you need to know it exists before you can check why.

## 2. Read the logs

```
docker logs -f <container>
```

The `-f` flag follows the log output live, which is what you want while a service is starting up and you're watching for the line that tells you it's ready — or the stack trace that tells you it isn't.

<div class="ad-slot">Ad placeholder — insert AdSense unit here</div>

## 3. Get a shell inside a running container

```
docker exec -it <container> sh
```

For poking around a filesystem, checking an environment variable actually got set, or confirming a config file landed where you expected. Swap `sh` for `bash` if the image has it; most slim images don't.

## 4. Rebuild without the stale layer cache

```
docker build --no-cache -t myapp .
```

The default layer cache is usually a feature — it's why rebuilds are fast. But when you've changed something outside the files Docker is watching (a base image tag, a remote dependency that didn't bump its version number) and the build still looks unchanged, this is the command that rules out "it's just a stale cache" before you spend twenty minutes debugging something that isn't actually broken.

## 5. Clean up disk space

```
docker system prune -a
```

Removes stopped containers, unused networks, and images not attached to a running container. Worth knowing this exists before your machine mysteriously runs out of disk space mid-build — Docker images accumulate faster than most people expect, especially with a base image that changes often.

## The one to know but rarely need

`docker inspect <container>` dumps the full JSON configuration of a container — networking, mounted volumes, environment variables, all of it. Most days you won't need it. The day a container is connecting to the wrong network or reading from the wrong volume mount, it's the fastest way to confirm what's actually configured versus what you assumed was configured.

That's the whole practical list. Everything else in the Docker CLI is either a variant of these five or something you'll look up the one time a year you need it.
