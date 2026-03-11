<template>
  <div>
    <UPageHero
      description="Découvrez l'intégration fluide de Vicket, la solution de support client moderne, dans un projet Nuxt 4 ultra-performant."
      :links="[{
        label: 'Tester le support',
        to: '/support',
        trailingIcon: 'i-lucide-message-circle',
        size: 'xl'
      }, {
        label: 'Documentation Vicket',
        to: 'https://vicket.app/fr/docs',
        target: '_blank',
        icon: 'i-lucide-book',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    >
      <template #title>
        <span class="primary-gradient-text">Vicket + Nuxt 4 Demo</span>
      </template>
    </UPageHero>

    <UPageSection
      id="features"
      title="Pourquoi choisir Vicket pour votre projet Nuxt ?"
      description="Une solution de support clé en main qui respecte votre identité visuelle et s'intègre en quelques minutes."
      :features="[{
        icon: 'i-lucide-user-check',
        title: 'Marque blanche totale',
        description: 'Personnalisez chaque pixel. Vos clients restent dans votre univers, sans redirection externe.'
      }, {
        icon: 'i-lucide-languages',
        title: 'Multilingue natif',
        description: 'Offrez un support dans la langue de vos utilisateurs sans effort supplémentaire.'
      }, {
        icon: 'i-lucide-zap',
        title: 'Performance Nuxt 4',
        description: 'Profitez de la nouvelle structure de dossiers et des optimisations de Nuxt 4 pour un support ultra-rapide.'
      }, {
        icon: 'i-lucide-shield',
        title: 'Proxy Sécurisé',
        description: 'Vos clés API sont protégées grâce au proxy backend intégré dans server/api/vicket.'
      }, {
        icon: 'i-lucide-layout',
        title: 'Composants Nuxt UI',
        description: 'Utilisez la puissance de Nuxt UI pour une interface cohérente et accessible.'
      }, {
        icon: 'i-lucide-rocket',
        title: 'Installation Instantanée',
        description: 'Générez vos pages de support en une commande avec le scaffold officiel Vicket.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Prêt à améliorer votre support client ?"
        description="Rejoignez les développeurs qui choisissent la simplicité et la performance avec Vicket et Nuxt."
        variant="subtle"
        class="glass-effect rounded-3xl p-12"
        :links="[{
          label: 'Essayer gratuitement',
          to: 'https://vicket.app/fr',
          target: '_blank',
          trailingIcon: 'i-lucide-external-link',
          color: 'neutral'
        }, {
          label: 'Voir l\'intégration',
          to: '/support',
          icon: 'i-lucide-message-square',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template>
