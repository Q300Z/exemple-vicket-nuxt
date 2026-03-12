<script setup lang="ts">
import { VicketValidationError } from '../utils/errors'

/**
 * Ticket Interaction Dialog (SRP).
 * 100% Native Nuxt UI v4 Style.
 */
interface Props {
  open: boolean
  templates: TicketTemplate[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:open'])

const { stripHtml } = useContent()
const { getBucket, clearAll, addFiles } = useFiles()
const { createTicketSchema } = useTicketForm()
const ticketFiles = getBucket('ticket')

/* ── STATE ── */
const step = ref<'category' | 'form' | 'success' | 'error'>('category')
const selectedTemplate = ref<TicketTemplate | null>(null)
const formData = ref<Record<string, unknown>>({})
const error = ref<Error | null>(null)
const isSubmitting = ref(false)
const schema = ref<unknown>(null)

const selectTemplate = (template: TicketTemplate) => {
  selectedTemplate.value = template
  formData.value = {}
  schema.value = createTicketSchema(template.fields)
  step.value = 'form'
}

const reset = () => {
  step.value = 'category'
  selectedTemplate.value = null
  formData.value = {}
  error.value = null
  clearAll()
}

const onSubmit = async () => {
  if (!selectedTemplate.value) return
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    await createTicket({
      template_id: selectedTemplate.value.id,
      answers: formData.value as Record<string, string>,
      attachments: ticketFiles.value
    })
    step.value = 'success'
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as any
    if (e.statusCode === 422) {
      error.value = new VicketValidationError('Validation échouée', e.data?.errors || {})
    } else {
      error.value = e instanceof Error ? e : new Error(String(e))
    }
    step.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = (val: boolean) => {
  emit('update:open', val)
  if (!val && props.open) {
    setTimeout(reset, 300)
  }
}
</script>

<template>
  <UModal
    :open="open"
    @update:open="handleClose"
  >
    <section class="vk-dialog-content p-1" aria-label="Formulaire de support">
      <!-- STEP: CATEGORY -->
      <div v-if="step === 'category'" class="p-6 space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">Besoin d'aide ?</h2>
          <p class="text-sm text-[var(--ui-text-muted)] mt-1">Choisissez une catégorie pour votre demande.</p>
        </div>

        <div class="grid gap-2">
          <UButton
            v-for="tpl in templates"
            :key="tpl.id"
            variant="ghost"
            color="neutral"
            class="flex items-center justify-start gap-4 p-4 rounded-2xl group"
            @click="selectTemplate(tpl)"
          >
            <template #leading>
              <div class="w-10 h-10 rounded-xl bg-[var(--ui-bg-accented)] flex items-center justify-center text-[var(--ui-primary)]">
                <UIcon name="i-lucide-message-square" class="w-5 h-5" />
              </div>
            </template>
            <div class="text-left">
              <p class="font-bold text-[var(--ui-text-highlighted)]">{{ tpl.label }}</p>
              <p class="text-xs text-[var(--ui-text-muted)] line-clamp-1">{{ stripHtml(tpl.description || '') }}</p>
            </div>
            <template #trailing>
              <UIcon name="i-lucide-chevron-right" class="ms-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </template>
          </UButton>
        </div>
      </div>

      <!-- STEP: FORM -->
      <UCard v-else-if="step === 'form'" variant="ghost" class="border-none shadow-none">
        <template #header>
          <div class="flex items-center gap-4">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left"
              @click="step = 'category'"
            />
            <span class="font-bold">{{ selectedTemplate?.label }}</span>
          </div>
        </template>

        <UForm :schema="schema" :state="formData" class="space-y-6" @submit="onSubmit">
          <VicketFieldFactory
            v-for="field in selectedTemplate?.fields"
            :key="field.id"
            v-model="formData[field.id]"
            :field="field"
            @files-added="addFiles('ticket', $event)"
          />

          <UButton
            type="submit"
            block
            size="lg"
            label="Envoyer"
            :loading="isSubmitting"
            class="rounded-xl"
          />
        </UForm>
      </UCard>

      <!-- SUCCESS / ERROR -->
      <VicketErrorSwitcher
        v-else-if="step === 'error'"
        :error="error"
        @retry="step === 'form' ? onSubmit() : reset()"
      />

      <div v-else-if="step === 'success'" class="p-12 text-center space-y-6">
        <UIcon name="i-lucide-check-circle" class="w-16 h-16 text-success mx-auto" />
        <h2 class="text-2xl font-bold">Demande envoyée !</h2>
        <UButton label="Fermer" block class="rounded-xl" @click="handleClose(false)" />
      </div>
    </section>
  </UModal>
</template>
