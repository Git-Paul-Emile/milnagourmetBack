import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: false,
    // Chargé avant chaque fichier de test : fixe les variables
    // d'environnement et neutralise la journalisation.
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // On mesure la couverture là où les bugs coûtent de l'argent :
      // services métier, contrôleurs, validateurs, middlewares.
      include: [
        'src/services/**/*.ts',
        'src/controller/**/*.ts',
        'src/validator/**/*.ts',
        'src/middleware/**/*.ts',
        'src/utils/**/*.ts',
      ],
      exclude: ['**/*.test.ts', 'src/services/notification/templates/layout.ts'],
    },
  },
});
