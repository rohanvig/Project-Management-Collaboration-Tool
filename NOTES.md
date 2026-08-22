architecture and extra notes

here are some quick notes on how i built the app based on the optional requirements in the pdf.

architecture decisions:
- used the mern stack (mongodb, express, react, node) because it's easy to keep everything in javascript.
- built a standard rest api for the backend.
- for state management, i just used react's context api for auth instead of redux because redux is a bit overkill for a simple kanban app.
- added a global error handler middleware so all api errors look the same on the frontend.

caching:
- for caching i'm just storing the jwt tokens (access and refresh) in localstorage so the user stays logged in if they refresh the page.
- the kanban board updates the ui immediately when you drag a task (optimistic update) so it feels fast, while the api call happens in the background.

background jobs:
- i didn't add actual background jobs like redis/bullmq because it wasn't required for the core features, but if i had to scale this i would use them to clean up old tokens in the db or send email invites in the background so the main server doesn't get blocked.
