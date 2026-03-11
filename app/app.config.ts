export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    // Global component styling (OCP: Extending without modifying components)
    card: {
      slots: {
        root: 'subtle-gradient luminous-border shadow-sm rounded-2xl'
      }
    },
    modal: {
      slots: {
        content: 'glass-effect luminous-border shadow-2xl ring-0'
      }
    },
    button: {
      slots: {
        root: 'transition-all duration-200 active:scale-95'
      }
    }
  }
})
