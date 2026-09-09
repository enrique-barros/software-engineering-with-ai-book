## Environment / secrets

- .env exists and contains real secrets (Django SECRET_KEY, STRIPE_API_KEY). It is excluded via .opencodeignore. Never read it, print it, or copy its contents into outputs/commits.
- .env.example is the template for all env vars. If you need to know expected configuration, read that instead.
- Appears to be a Django project using SQLite. (DATABASE_URL=sqlite:///db.sqlite3) with Stripe integration. No source code, manifests, or build/test config exist in this repo yet.
