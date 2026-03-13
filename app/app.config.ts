export default defineAppConfig({
  ui: {
    // --- Nuxt UI v4 Standard Colors ---
    colors: {
      primary: 'indigo',
      neutral: 'zinc'
    },
    
    // --- Global Tokens ---
    radius: 'md',

    // --- Component Defaults (Respecting Nuxt UI Style) ---
    button: {
      slots: {
        base: 'transition-all duration-200 active:scale-95'
      }
    },
    card: {
      slots: {
        root: 'ring-1 ring-[var(--ui-border)] shadow-sm'
      }
    },
    modal: {
      slots: {
        content: 'shadow-2xl ring-1 ring-[var(--ui-border)]'
      }
    },
    formField: {
      slots: {
        label: 'font-semibold text-[var(--ui-text-highlighted)]'
      }
    }
  },

  // --- Landing Page Data (OCP) ---
  landing: {
    // ... rest of landing
  },

  // --- Branding & White-labeling (OCP) ---
  branding: {
    logo: {
      type: 'default', // 'default' | 'image'
      src: '',         // URL if type is 'image'
      alt: 'Vicket Support'
    }
  }
})
