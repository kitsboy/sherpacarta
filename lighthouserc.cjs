/** @type {import('lighthouse').Flags} */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/', 'http://localhost:4173/treasury.html', 'http://localhost:4173/security.html'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      // 3 runs, median asserted — a single run on shared CI runners can
      // swing whole points (observed 0.25 vs local 0.62 same build, 2026-09-09)
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};