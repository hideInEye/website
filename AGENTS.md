# Frontend project guidance

This branch uses Vite, React 19, React Router data routers, TypeScript, Tailwind CSS v4 and the existing shadcn/ui components. It has no Next.js runtime or server components.

- Keep the existing page appearance, typography, CSS tokens and responsive behavior.
- Put route declarations in `src/app/router.tsx`; feature pages, loaders and API services belong in `src/features/<feature>`. Cross-feature imports use that feature's `index.ts`.
- Route loaders own server reads. Components use `useLoaderData`, local UI state and the shared browser API client. Revalidate the route after mutations that affect its data.
- Browser requests use same-origin `/api/v1`; database, mail and MinIO credentials belong only to the Go backend. Never expose secrets using `VITE_*` variables.
- Local development uses independent frontend/backend commands. Production builds images in GitHub Actions and serves the frontend with Nginx on container port 3000.
- The new frontend image tag is `ghcr.io/hideineye/sunset-footprints-web:vite`; do not overwrite the previous `:deploy` image during this refactor.
- The original `../website-server` is read-only. The new Go service is `../website-go-server`.
- Respect the user's instruction not to run builds or test suites unless they request them; report verification gaps explicitly. Static type and lint checks are available.
