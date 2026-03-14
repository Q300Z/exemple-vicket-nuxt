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
      { label: 'Utilisateurs', value: '18+' },
      { label: 'Gain de temps', value: '50%+' },
      { label: 'Satisfaction', value: '99%' }
    ],
    features: [
      {
        title: 'Support White-Label',
        desc: 'Des composants UI personnalisables qui se fondent nativement dans votre produit.',
        icon: 'i-lucide-palette'
      },
      {
        title: 'Workflows Automatisés',
        desc: 'Intégrez des processus temporels et manuels pour automatiser votre support client.',
        icon: 'i-lucide-git-branch'
      },
      {
        title: 'Scoring Intelligent',
        desc: 'Algorithme de priorité basé sur des signaux réels pour traiter l\'urgent en priorité.',
        icon: 'i-lucide-brain-circuit'
      },
      {
        title: 'Visibilité par Équipe',
        desc: 'Compartimentez le support par départements (Engineering, Sales, Support L1).',
        icon: 'i-lucide-users-2'
      },
      {
        title: 'Base de Connaissances',
        desc: 'Réduisez le volume de tickets en permettant le self-service client intelligent.',
        icon: 'i-lucide-book-open'
      },
      {
        title: 'Developer-First',
        desc: 'Architecture SOLID et documentation riche pour une intégration en quelques minutes.',
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
