<script setup lang="ts">
/* ── Props / Emits ── */
import { IdentificationSchema, createTicketSchema } from '../utils/vicket.schemas'
import { initialFormValues } from '../composables/useVicket'
import { VicketDataTransformer } from '../utils/vicket.transformer'
import { NOTIFICATION_SERVICE_KEY } from '../types/interaction'
import { VICKET_VALIDATORS_KEY } from '../types/validation'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: boolean
  templates: Template[]
}>(), {
  open: false,
  modelValue: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
}>()

/* ── Internal state ── */
// Defensive injection (ISP/DIP)
const notifications = inject(NOTIFICATION_SERVICE_KEY, {
  success: () => {},
  error: () => {},
  warn: () => {},
  celebrate: () => {}
})

const customValidators = inject(VICKET_VALIDATORS_KEY, {})

const { buckets, clearAll } = useFiles()
const { isLoading: isSupportLoading, loadError } = useSupportState()

// Navigation SRP
const { step, goTo, resetSteps } = useStepManager(['identify', 'details', 'success'], 'identify')

const selectedTemplateId = ref('')
const isSubmitting = ref(false)
const emailLimitReached = ref(false)

const state = reactive<Record<string, unknown>>({
  email: '',
  title: '',
  ...initialFormValues.answers
})

/* ── Computed ── */
const isOpen = computed({
  get: () => props.open || props.modelValue,
  set: (val) => {
    emit('update:open', val)
    emit('update:modelValue', val)
  }
})

const selectedTemplate = computed(
  () => props.templates?.find(t => t.id === selectedTemplateId.value) || null
)

const orderedQuestions = computed(() =>
  [...(selectedTemplate.value?.questions || [])].sort((a, b) => a.order - b.order)
)

const modalTitle = computed(() => {
  if (step.value === 'success') return 'Demande envoyée'
  return 'Soumettre une demande'
})

const templateOptions = computed(() => (props.templates || []).map(t => ({
  value: t.id,
  label: t.name,
  description: t.description
})))

const currentSchema = computed(() => {
  if (step.value === 'identify') return IdentificationSchema
  return createTicketSchema(orderedQuestions.value, customValidators)
})

/* ── Methods ── */
const resetAndClose = () => {
  resetSteps()
  Object.keys(state).forEach(key => state[key] = '')
  selectedTemplateId.value = props.templates?.length > 0 ? props.templates[0].id : ''
  emailLimitReached.value = false
  clearAll()
  isOpen.value = false
}

const onSubmit = async () => {
  if (step.value === 'identify') {
    goTo('details')
    return
  }

  isSubmitting.value = true
  try {
    const payload = VicketDataTransformer.toCreateTicketPayload(state, orderedQuestions.value, buckets.value)

    const result = await createTicket({
      ...payload,
      templateId: selectedTemplate.value!.id
    })

    emailLimitReached.value = result.emailLimitReached ?? false
    goTo('success')
    notifications.celebrate()
  } catch (submitError) {
    notifications.error(
      'Erreur', 
      submitError instanceof Error ? submitError.message : 'Impossible de créer le ticket.'
    )
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => props.templates,
  (newTemplates) => {
    if (newTemplates?.length > 0 && !selectedTemplateId.value) {
      selectedTemplateId.value = newTemplates[0].id
    }
  },
  { immediate: true }
)
</script>

<template>
  <VicketAdaptiveModal 
    :open="isOpen" 
    :title="modalTitle"
    @update:open="isOpen = $event"
    @close="resetAndClose"
  >
    <!-- ── Loading state ── -->
    <div
      v-if="isSupportLoading && step !== 'success'"
      class="py-12 flex flex-col items-center justify-center space-y-4"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-10 h-10 animate-spin text-primary"
      />
      <p class="text-sm text-gray-500">
        Chargement des motifs de contact...
      </p>
    </div>

    <!-- ── Error / No templates ── -->
    <div
      v-else-if="(!templates || templates.length === 0 || loadError) && step !== 'success'"
      class="py-12 text-center space-y-4"
    >
      <div
        class="p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center"
        :class="loadError ? 'bg-error-50 dark:bg-error-950/20 text-error' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'"
      >
        <UIcon
          :name="loadError ? 'i-lucide-alert-circle' : 'i-lucide-message-square-off'"
          class="w-8 h-8"
        />
      </div>
      <div class="space-y-1">
        <p class="font-bold">
          {{ loadError ? 'Erreur de connexion' : 'Aucun motif de contact' }}
        </p>
        <p class="text-sm text-gray-500 max-w-xs mx-auto">
          {{ loadError ? 'Veuillez vérifier votre configuration API.' : 'Votre dashboard Vicket ne contient aucun template de ticket publié.' }}
        </p>
      </div>
      <UButton
        color="neutral"
        variant="subtle"
        class="rounded-full"
        @click="resetAndClose"
      >
        Fermer
      </UButton>
    </div>

    <!-- ── Success state ── -->
    <div
      v-else-if="step === 'success'"
      class="py-8 text-center space-y-6"
    >
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary ring-8 ring-primary-50 dark:ring-primary-950/20">
        <UIcon
          name="i-lucide-check"
          class="w-12 h-12"
        />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Ticket créé avec succès !
        </h2>
        <p
          v-if="emailLimitReached"
          class="text-gray-500"
        >
          Votre ticket a été créé, mais la limite d'envoi d'emails a été atteinte.
        </p>
        <p
          v-else
          class="text-gray-500 max-w-xs mx-auto"
        >
          Un lien sécurisé vous a été envoyé par email pour suivre votre demande en temps réel.
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        class="rounded-full px-8"
        @click="resetAndClose"
      >
        Fermer la fenêtre
      </UButton>
    </div>

    <!-- ── Form Steps ── -->
    <UForm
      v-else
      :schema="currentSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <!-- Step 1: Identify -->
      <template v-if="step === 'identify'">
        <div class="bg-primary-50 dark:bg-primary-950/20 p-4 rounded-xl border border-primary-100 dark:border-primary-900/50 flex gap-3">
          <UIcon
            name="i-lucide-info"
            class="w-5 h-5 text-primary shrink-0"
          />
          <p class="text-sm text-primary-800 dark:text-primary-200">
            Nous répondons généralement en moins de 24h. Assurez-vous d'utiliser une adresse valide.
          </p>
        </div>

        <UFormField
          label="Votre adresse email"
          name="email"
          required
          help="Nous utiliserons cet email pour vous envoyer les mises à jour de votre ticket."
        >
          <UInput
            v-model="state.email"
            type="email"
            icon="i-lucide-mail"
            placeholder="jean.dupont@exemple.com"
            size="lg"
            class="w-full"
            autocomplete="email"
          />
        </UFormField>

        <div
          v-if="templates && templates.length > 1"
          class="space-y-3"
        >
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Comment pouvons-nous vous aider ?
          </p>
          <URadioGroup
            v-model="selectedTemplateId"
            :items="templateOptions"
            color="primary"
            class="grid gap-3"
            :ui="{
              item: 'border p-4 rounded-xl transition-all hover:border-primary-500/50',
              base: 'cursor-pointer'
            }"
          >
            <template #label="{ item }">
              <div class="min-w-0">
                <span class="block font-bold text-gray-900 dark:text-white">{{ item.label }}</span>
                <span
                  v-if="item.description"
                  class="block text-xs text-gray-500 mt-0.5"
                >{{ item.description }}</span>
              </div>
            </template>
          </URadioGroup>
        </div>

        <UButton
          type="submit"
          block
          size="xl"
          class="rounded-xl shadow-lg shadow-primary-500/20"
        >
          Continuer vers les détails
        </UButton>
      </template>

      <!-- Step 2: Details -->
      <template v-else-if="step === 'details'">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          size="sm"
          class="-ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          @click="step = 'identify'"
        >
          Retour à l'email
        </UButton>

        <div class="space-y-1">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ selectedTemplate?.name }}
          </h2>
          <p class="text-sm text-gray-500">
            Veuillez détailler votre demande ci-dessous.
          </p>
        </div>

        <div class="space-y-5">
          <UFormField
            label="Sujet de la demande"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              placeholder="Ex: Problème de connexion à mon compte"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <!-- Dynamic questions (SRP: Handled by VicketFieldFactory) -->
          <div
            v-for="question in orderedQuestions"
            :key="question.id"
            class="space-y-1"
          >
            <UFormField
              :label="question.label"
              :name="question.id"
              :required="question.required"
            >
              <VicketFieldFactory
                v-model="state[question.id]"
                :question="question"
              />
            </UFormField>
          </div>

          <UButton
            type="submit"
            block
            size="xl"
            class="rounded-xl shadow-lg shadow-primary-500/20 mt-4"
            :loading="isSubmitting"
          >
            Soumettre ma demande
          </UButton>
        </div>
      </template>
    </UForm>
  </VicketAdaptiveModal>
</template>
