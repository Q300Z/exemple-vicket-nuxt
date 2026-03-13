// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt({
  files: ['**/*.ts', '**/*.vue'],
  plugins: {
    'vuejs-accessibility': vuejsAccessibility,
    '@intlify/vue-i18n': vueI18n,
    '@stylistic': stylistic
  },
  rules: {
    // --- SOLID & LOGIC QUALITY ---
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // --- VUE & SECURITY ---
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'error',
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' }
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off',

    // --- ACCESSIBILITY (a11y) ---
    ...vuejsAccessibility.configs['flat/recommended'].map(c => c.rules).reduce((acc, r) => ({ ...acc, ...r }), {}),
    'vuejs-accessibility/label-has-for': 'error',
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/anchor-has-content': 'error',

    // --- INTERNATIONALIZATION (i18n) ---
    '@intlify/vue-i18n/no-dynamic-keys': 'warn',
    '@intlify/vue-i18n/no-unused-keys': ['error', { extensions: ['.json', '.vue'] }],
    '@intlify/vue-i18n/no-missing-keys': 'error',

    // --- STYLISTIC (Nuxt 4 Standard) ---
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/max-len': ['warn', { 
      code: 160, 
      ignoreUrls: true, 
      ignoreStrings: true, 
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignorePattern: '^\\s*d=' // Ignore SVG paths
    }],
    '@stylistic/type-annotation-spacing': 'error',
    '@stylistic/member-delimiter-style': ['error', {
      multiline: { delimiter: 'none' },
      singleline: { delimiter: 'comma', requireLast: false }
    }]
  }
})
