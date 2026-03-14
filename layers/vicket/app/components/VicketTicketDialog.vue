<script setup lang="ts">
import type { TicketTemplate } from '../types/vicket'
import { VicketValidationError } from '../utils/errors'
import { KNOWLEDGE_REPOSITORY_KEY, TICKET_REPOSITORY_KEY } from '../types/repository'

/**
 * Ticket Interaction Dialog (SRP).
 * 100% Native Nuxt UI v4 Style.
 * Autonomous: Managed via useSupportState.
 */
const { isDialogOpen, templates, prefilledData, customValidators, step } = useSupportState()

const { stripHtml } = useContent()
const { getBucket, clearAll, addFiles } = useFiles()
const { createTicketSchema } = useTicketForm()
const ticketsRepo = inject(TICKET_REPOSITORY_KEY)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const knowledgeRepo = inject(KNOWLEDGE_REPOSITORY_KEY)
const ticketFiles = getBucket('ticket')
const { saveTicket } = useTicketHistory()

/* ── STATE ── */
const selectedTemplate = ref<TicketTemplate | null>(null)
const formData = ref<Record<string, unknown>>({})
const error = ref<Error | null>(null)
const isSubmitting = ref(false)
const isFormLoading = ref(false) // 3. Skeleton Optimization
const schema = ref<unknown>(null)
const emailLimitReached = ref(false)
const formRef = ref<{ validate: () => Promise<unknown> } | null>(null)
const focusedIndex = ref(-1) // 4. Keyboard Navigation

// 1. Dirty Check Logic (SRP)
const isDirty = computed(() => {
  if (step.value !== 'form') return false
  const hasText = Object.values(formData.value).some(val => 
    (typeof val === 'string' && val.trim().length > 0) || 
    (Array.isArray(val) && val.length > 0)
  )
  const hasFiles = ticketFiles.value.length > 0
  return hasText || hasFiles
})

const { t } = useI18n()

// --- PRE-FILL LOGIC ---
watch(() => isDialogOpen.value, (isOpen) => {
  if (isOpen && prefilledData.value) {
    const { template_id, answers } = prefilledData.value
    if (template_id) {
      const template = templates.value.find(t => t.id === template_id)
      if (template) {
        selectTemplate(template as TicketTemplate)
        if (answers) {
          formData.value = { ...formData.value, ...answers }
        }
      }
    }
  }
})

const selectTemplate = async (template: TicketTemplate) => {
  selectedTemplate.value = template
  isFormLoading.value = true
  step.value = 'form'
  
  // 3. Micro-loading simulation for skeleton demonstration (UX)
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Initialize formData with explicit defaults to satisfy Zod types (KISS)
  const initialData: Record<string, unknown> = {
    title: '',
    email: prefilledData.value?.answers?.email || ''
  }
  
  // 1.2 Business Sorting (SRP)
  const questions = sortQuestions(template.questions || [])
  
  questions.forEach(q => {
    const type = q.type?.toUpperCase()
    const isArrayType = type === 'CHECKBOX' || type === 'CHECKBOXES' || type === 'MULTI_SELECT'
    
    if (isArrayType) {
      initialData[q.id] = []
    } else if (type === 'FILE') {
      initialData[q.id] = null
    } else {
      initialData[q.id] = ''
    }
  })
  
  formData.value = initialData
  schema.value = createTicketSchema(questions, customValidators.value)
  isFormLoading.value = false

  // 2. Auto-focus first field (A11y)
  nextTick(() => {
    const firstInput = document.querySelector('.vk-dialog-content input, .vk-dialog-content textarea') as HTMLElement
    firstInput?.focus()
  })
}

const reset = () => {
  step.value = 'category'
  selectedTemplate.value = null
  formData.value = {}
  error.value = null
  emailLimitReached.value = false
  isFormLoading.value = false
  focusedIndex.value = -1
  clearAll()
}

const onSubmit = async () => {
  if (!selectedTemplate.value || !ticketsRepo) return
  isSubmitting.value = true
  emailLimitReached.value = false
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const response = await ticketsRepo.createTicket({
      email: String(formData.value.email),
      title: String(formData.value.title),
      templateId: selectedTemplate.value.id,
      answers: formData.value as Record<string, string>,
      fileMap: { ticket: ticketFiles.value }
    })
    
    // Save to local history for easy access (Showcase Feature)
    if (response.data?.id && response.data?.token) {
      saveTicket({
        id: response.data.id,
        token: response.data.token,
        title: String(formData.value.title)
      })
    }
    
    // 1.4 Quota Management
    if (response.data?.email_limit_reached) {
      emailLimitReached.value = true
    }
    
    step.value = 'success'
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as { statusCode?: number, data?: { errors?: any } }
    if (e.statusCode === 422) {
      error.value = new VicketValidationError('Validation échouée', e.data?.errors || {})
    } else {
      error.value = err instanceof Error ? err : new Error(String(err))
    }
    step.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  // 1. Dirty Check (Confirmation before closing)
  if (isDirty.value) {
    const confirmed = window.confirm(t('common.confirm_close'))
    if (!confirmed) {
      // Re-open if closed via VModel
      isDialogOpen.value = true
      return
    }
  }
  isDialogOpen.value = false
  setTimeout(reset, 300)
}

// 4. Keyboard Navigation Logic
const onKeydown = (e: KeyboardEvent) => {
  if (step.value !== 'category') return
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = (focusedIndex.value + 1) % templates.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusedIndex.value = (focusedIndex.value - 1 + templates.value.length) % templates.value.length
  } else if (e.key === 'Enter' && focusedIndex.value !== -1) {
    e.preventDefault()
    selectTemplate(templates.value[focusedIndex.value])
  }
}

// --- SHORTCUTS (A11y) ---
defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      if (isDialogOpen.value) handleClose()
    }
  },
  meta_enter: {
    usingInput: true,
    handler: () => {
      if (step.value === 'form' && !isSubmitting.value) {
        onSubmit()
      }
    }
  }
})
</script>

<template>
  <UModal
    v-model:open="isDialogOpen"
    :title="$t('common.new_ticket')"
    :description="$t('vicket.form_subtitle')"
    @update:open="(val) => { if (!val) handleClose() }"
    @keydown="onKeydown"
  >
    <template #content>
      <section 
        v-motion 
        class="vk-dialog-content p-1 focus:outline-none"
        aria-label="Formulaire de support"
        tabindex="-1"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
      >
        <!-- STEP: CATEGORY -->
        <div v-if="step === 'category'" class="p-6 space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">{{ $t('vicket.need_help') }}</h2>
            <p class="text-sm text-[var(--ui-text-muted)] mt-1">{{ $t('vicket.choose_category') }}</p>
          </div>

          <div class="grid gap-3" role="listbox">
            <button
              v-for="(tpl, index) in templates"
              :key="tpl.id"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 100 + (index * 50) } }"
              class="w-full flex items-center justify-start gap-4 p-4 rounded-2xl transition-all border outline-hidden"
              :class="[
                focusedIndex === index 
                  ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5 ring-2 ring-[var(--ui-primary)]/20' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/5'
              ]"
              role="option"
              :aria-selected="focusedIndex === index"
              :aria-label="$t('vicket.select_category', { name: tpl.name })"
              @click="selectTemplate(tpl)"
              @mouseenter="focusedIndex = index"
              @focus="focusedIndex = index"
            >
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[var(--ui-primary)] shrink-0">
                <UIcon :name="tpl.icon || 'i-lucide-message-square'" class="w-5 h-5" />
              </div>
              <div class="grow min-w-0">
                <p class="font-bold text-gray-900 dark:text-white truncate">{{ tpl.name }}</p>
                <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-1 mt-0.5">{{ stripHtml(tpl.description || '') }}</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="ms-auto w-4 h-4 text-gray-400 group-hover:text-[var(--ui-primary)] transition-colors" />
            </button>
          </div>
        </div>

        <!-- STEP: FORM -->
        <div v-else-if="step === 'form'" class="flex flex-col max-h-[80vh]">
          <div class="p-6 border-b border-[var(--ui-border)] shrink-0 flex items-center gap-4">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left"
              @click="step = 'category'"
            />
            <p class="font-bold text-gray-900 dark:text-white">{{ selectedTemplate?.name }}</p>
          </div>

          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <!-- Skeleton for form transition -->
            <div v-if="isFormLoading" class="space-y-6 animate-pulse">
              <div v-for="i in 4" :key="i" class="space-y-2">
                <USkeleton class="h-4 w-24 rounded" />
                <USkeleton class="h-12 w-full rounded-xl" />
              </div>
            </div>

            <!-- 1. Lazy Validation Strategy (Blur/Submit) -->
            <UForm 
              v-else
              ref="formRef"
              :schema="schema" 
              :state="formData" 
              class="space-y-6" 
              validate-on="blur"
              @submit="onSubmit"
            >
              <VicketFieldFactory
                v-for="field in selectedTemplate?.questions"
                :key="field.id"
                v-model="formData[field.id]"
                :question="field"
                @files-added="addFiles('ticket', $event)"
              />
              <UButton
                type="submit"
                block
                size="lg"
                :label="$t('common.send')"
                :loading="isSubmitting"
                class="rounded-xl mt-8"
              />
              <p class="text-center text-[10px] text-[var(--ui-text-muted)] font-medium uppercase tracking-widest">
                {{ $t('common.shortcut_submit') }}
              </p>
            </UForm>
          </div>
        </div>

        <!-- SUCCESS / ERROR -->
        <VicketErrorSwitcher
          v-else-if="step === 'error'"
          :error="error"
          @retry="(step as any) === 'form' ? onSubmit() : reset()"
        />

        <div v-else-if="step === 'success'" class="p-12 text-center space-y-6">
          <UIcon name="i-lucide-check-circle" class="w-16 h-16 text-success mx-auto" />
          <div class="space-y-2">
            <h2 class="text-2xl font-bold">{{ $t('vicket.request_sent') }}</h2>
            <p v-if="emailLimitReached" class="text-sm text-warning-500 font-medium animate-pulse">
              {{ $t('vicket.email_limit_warning') }}
            </p>
            <p v-else class="text-sm text-[var(--ui-text-muted)]">
              {{ $t('vicket.request_sent_desc') }}
            </p>
          </div>
          <UButton :label="$t('common.close')" block class="rounded-xl" @click="handleClose" />
        </div>
      </section>
    </template>
  </UModal>
</template>
