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
    stats: [
      { label: 'landing.stats.users', value: '18+' },
      { label: 'landing.stats.time_save', value: '50%+' },
      { label: 'landing.stats.satisfaction', value: '99%' }
    ],
    features: [
      {
        title: 'landing.features.white_label.title',
        desc: 'landing.features.white_label.desc',
        icon: 'i-lucide-palette'
      },
      {
        title: 'landing.features.workflows.title',
        desc: 'landing.features.workflows.desc',
        icon: 'i-lucide-git-branch'
      },
      {
        title: 'landing.features.scoring.title',
        desc: 'landing.features.scoring.desc',
        icon: 'i-lucide-brain-circuit'
      },
      {
        title: 'landing.features.teams.title',
        desc: 'landing.features.teams.desc',
        icon: 'i-lucide-users-2'
      },
      {
        title: 'landing.features.knowledge.title',
        desc: 'landing.features.knowledge.desc',
        icon: 'i-lucide-book-open'
      },
      {
        title: 'landing.features.developer_first.title',
        desc: 'landing.features.developer_first.desc',
        icon: 'i-lucide-code-2'
      }
    ]
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
