| Folder                   | When to Add                                                        | Purpose                                      |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------------------- |
| `packages/shared-types/` | When frontend & backend need common types (like Zod/Prisma models) | Central place for type-safe models           |
| `packages/ui/`           | When you build reusable ShadCN components                          | Centralize custom buttons, modals, inputs    |
| `docs/`                  | As soon as you have setup notes or schema details                  | Keep DB design, feature roadmap, setup guide |
| `scripts/`               | When you automate backups, seeding, or deploys                     | Organize one-off utilities or CLI tools      |
| `tests/`                 | When you add Vitest/Jest tests                                     | Clean separation of business tests           |
