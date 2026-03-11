export default defineAppConfig({
  ui: {
    primary: 'indigo',
    neutral: 'zinc',
    button: {
      slots: {
        base: 'cursor-pointer transition-all duration-200'
      }
    },
    card: {
      slots: {
        root: 'transition-all duration-300'
      }
    }
  }
})
