# First things first

I wanted to mention that the use of `bun` is not mandatory but recommended. I used it for the server, but you can use `npm` or `yarn` if you prefer. Just make sure to install the dependencies in the `server` folder. I find it faster and more efficient than `npm` or `yarn`, but it’s up to you.

Please make sure you don't push the `.env` file to GitHub.

---

# Prisma

The following commands should be run inside the `server` folder.

To update the schema:

```bash
npx prisma migrate dev --name <migration_name>
```

**Note:** If you've made significant changes to the schema, you may want to reset the database. Be careful—this will erase **all data** in the database:

```bash
npx prisma migrate reset
```

If you get a `"permission denied for schema public"` error (error 42501), do the following:

1. Go to the Supabase dashboard
2. Open the SQL editor
3. Click **"Schema and Table Permissions"**
4. Click **"Run"**

This should fix the issue. If not—good luck, soldier 🫡

---

# Server

All server environment variables are in the `server/.env` file—pretty standard.

For testing the server, I recommend using **ngrok**. It's super easy to use (I didn’t even need a tutorial, surprisingly), and it’s free. Ngrok creates a tunnel (a public URL) to your localhost, so you can test the server without deploying it. You can also use `localtunnel` if you prefer, but I found ngrok easier.

**Note:** The server runs on port `8080` (not the default), so make sure ngrok is configured accordingly and don't forget to run the local server first:

```bash
bun run dev
ngrok http 8080
```

---

# Templates

Even though the templates aren’t part of the `server` folder, I placed them outside so they’re easier to find. You’ll find them in the `templates` folder.

All templates are HTML-based. Note that the original templates **don’t have inlined CSS**, but CSS _must_ be inlined for email clients to display them correctly. I’m using `juice` to inline the CSS from the HTML automatically. This is handled in `server/src/utils.js` inside the `loadTemplate` function.

Test templates are saved in the `test` folder, also outside the `server` folder.

I also left the `sample_data.csv` file inside `test` folder just in case if you have to reset the database so that you have some dummy data to work with, it is only for the `Parts` table though, you can easily import it inside supabase.

Some of the templates are used inside supabase > Authentication > Emails

---
