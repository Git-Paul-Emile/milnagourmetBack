import { defineConfig } from 'prisma/config';
// Note: Prisma versions 6.x and 7.x have different config shapes. Use `as any` to
// ensure TypeScript interoperability between versions used by the CLI and VSCode
// extensions. Also define the `datasources` object here (moved from schema) so we
// comply with new Prisma configurations that no longer allow `url` in the schema.
export default defineConfig({
    schema: './schema.prisma',
    datasources: {
        db: {
            provider: 'mysql',
            // Use environment variable for connection string; migrations and Prisma Client
            // will pick this up from the config or runtime options.
            url: process.env.DATABASE_URL
        }
    }
});
//# sourceMappingURL=prisma.config.js.map