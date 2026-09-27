import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Shared window globals for the legacy non-module browser scripts in public/.
// These are defined once (e.g. `const state` in sc-core.js, `window.SC` etc.) and
// referenced across many IIFE files — ESLint can't see the cross-file linkage, so we
// declare them here. This is the correct fix for a classic script suite, NOT a mute.
const LEGACY_GLOBALS = {
  // Namespace objects
  SC: 'readonly', SC2: 'readonly', SC3: 'readonly', SC4: 'readonly', SC5: 'readonly',
  SC6: 'readonly', SCA11y: 'readonly', SCShare: 'readonly', SC_ARCH: 'readonly',
  SC_PERF: 'readonly', SHERPA_API: 'readonly', SHERPA_BOUNTY: 'readonly',
  SHERPA_CHANGELOG: 'readonly', SHERPA_CHARTER_I18N: 'readonly', SHERPA_EMBED: 'readonly',
  SHERPA_LOCALES: 'readonly', SHERPA_MCP: 'readonly', SHERPA_MCP_SERVER: 'readonly',
  SHERPA_PETITION: 'readonly', SHERPA_SDK: 'readonly', SHERPA_TREASURY: 'readonly',
  SHERPA_UPGRADES: 'readonly', SherpaCarta: 'readonly', CHARTER: 'readonly',
  CMD_ITEMS: 'readonly', QRCode: 'readonly', state: 'readonly',
  // Cross-file helper functions
  brandAssets: 'readonly', buildCharterTOC: 'readonly', buildFullCharter: 'readonly',
  buildSigners: 'readonly', calcRights: 'readonly', cmdSearch: 'readonly',
  composeBlueskyThread: 'readonly', composeNostrNote: 'readonly', copyHashtags: 'readonly',
  copyMLAEmail: 'readonly', downloadBCOutreachPack: 'readonly', downloadJSONFeed: 'readonly',
  downloadPressKit: 'readonly', downloadPressRelease: 'readonly', downloadRSS: 'readonly',
  exportCharterFormat: 'readonly', exportCharterJSON: 'readonly', exportCharterMD: 'readonly',
  exportPreferences: 'readonly', exportSessionReport: 'readonly', filterCharter: 'readonly',
  generateLegislativeBrief: 'readonly', generateSocialCard: 'readonly',
  generateWeeklyDigest: 'readonly', getCharterPlainText: 'readonly', getReferralLink: 'readonly',
  importPreferences: 'readonly', importSessionReport: 'readonly', makeAllEditable: 'readonly',
  openCharterModal: 'readonly', openCommandPalette: 'readonly', orgEndorse: 'readonly',
  printQuickRef: 'readonly', publishToNostr: 'readonly', renderAmendments: 'readonly',
  resetQuoteTimer: 'readonly', saveVersionSnapshot: 'readonly', scrollToDonate: 'readonly',
  scrollToSign: 'readonly', setSherpaTheme: 'readonly', shareBluesky: 'readonly',
  shareCalcResults: 'readonly', shareEmail: 'readonly', shareNostr: 'readonly',
  shareOn: 'readonly', shareReddit: 'readonly', showNostrQR: 'readonly', showPageQR: 'readonly',
  showQRModal: 'readonly', signStatus: 'readonly', stampCharterHash: 'readonly',
  stampCharterOnBitcoin: 'readonly', toggleTheme: 'readonly', updateHashFooter: 'readonly',
  volunteerInterest: 'readonly',
  // Mutable cross-file state — legacy code reassigns these (intentional, not a bug).
  searchVisible: 'writable', qrCurrentAddress: 'writable', qrCurrentType: 'writable',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Legacy non-module browser scripts in public/ — shared window globals + idiomatic
    // callback params. These files are concatenated classic scripts, not ES modules.
    files: ['public/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...LEGACY_GLOBALS },
    },
    rules: {
      // `_`, `e`, `t`, `n`, `err`, `el`, `limit` are idiomatic callback/catch params
      // in this legacy suite.
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_|^(e|t|n|err|el|limit)$',
        caughtErrorsIgnorePattern: '^_|^(e|t|n|err|el|limit)$',
        // Top-level API functions wired to HTML onclick / cross-file (flat-config
        // equivalent of the eslintrc `/* exported */` directive, which flat config
        // does not support). These are the script's public interface, not dead code.
        varsIgnorePattern: '^(acceptCookies|calcRights|cmdKey|copyArticle|copyQRAddress|filterCharter|focusA11yToolbar|goToQuote|limit|makeAllEditable|nostrArticle|nostrConnect|nostrDisconnect|prevQuote|qrCurrentType|saveCharterDraft|searchCharter|selectLang|shareArticle|shareCharter|showQRModal|signArticle|signCharter|stampArticle|submitAmendment|subscribeNewsletter|switchDonateTab|switchNavLang|switchPayTab|toggleAmbient|toggleFaq|verifyCharterHash)$',
      }],
      // Intentional control-char sanitizers in the Canada campaign functions.
      'no-control-regex': 'off',
      // Legacy code deliberately swallows errors with empty catch(_){} blocks.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // sc-bundle.js is generated by terser, which intentionally escapes
      // `</script>` → `<\/script>` to prevent breaking out of a script tag.
      'no-useless-escape': 'off',
    },
  },
  {
    // Cloudflare Pages functions — intentional control-char sanitizers in the
    // Canada campaign input-stripping helpers.
    files: ['functions/**/*.js'],
    rules: {
      'no-control-regex': 'off',
    },
  },
])
