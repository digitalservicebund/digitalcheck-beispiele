# ⚠️ Project status: Archived

The content of this project is being moved from Strapi to an Astro content collection. Strapi is no longer needed, so the Strapi Cloud subscription will be cancelled.

A full backup of the Strapi Cloud data (content, media and configuration) was made on **2 October 2026**. It is stored in this repository as `digitalcheck-backup-02102026.tar`.

## Restoring the backup

The backup is not encrypted, so no key is needed. It does not include admin users or API tokens.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Import the backup into a local SQLite database. This **deletes all existing local content and uploads** before restoring. Confirm with `y` when prompted:

   ```bash
   pnpm strapi import -f digitalcheck-backup-02102026.tar
   ```

3. Start Strapi:

   ```bash
   pnpm run develop
   ```

4. Open http://localhost:1337/admin. If this is a fresh database, register a new admin user first.

5. Entries, media and relations should be present in the Content Manager and Media Library.

# Getting started

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### Git Hooks

For the provided Git hooks, you will need to install [lefthook](https://github.com/evilmartians/lefthook/) and [talisman](https://github.com/thoughtworks/talisman):

```bash
brew install lefthook talisman
lefthook install
```

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
pnpm run develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
pnpm run start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
pnpm run build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
pnpm strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
