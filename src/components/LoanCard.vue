<template>
  <q-card class="finance-card cursor-pointer loan-card" :style="{ opacity: settled ? 0.65 : 1 }">
    <q-card-section class="q-pa-none" @click="$emit('click')">
      <div class="q-pa-md">
        <!-- Header row: name + status badge -->
        <div class="row items-center justify-between no-wrap q-mb-sm">
          <div class="row items-center q-gutter-sm" style="min-width: 0;">
            <q-avatar :style="{ background: color + '15' }" size="38px">
              <q-icon name="person" :style="{ color }" size="20px" />
            </q-avatar>
            <div style="min-width: 0;">
              <div class="text-subtitle1 text-weight-bold ellipsis" style="line-height: 1.3;">{{ loan.personName }}</div>
              <div class="text-caption text-grey-6">{{ formatDate(loan.date) }}</div>
            </div>
          </div>
          <q-chip v-if="settled" color="positive" text-color="white" dense size="sm" icon="check_circle">
            {{ $t('loans.settled') }}
          </q-chip>
        </div>

        <!-- Amount -->
        <div class="text-h5 text-weight-bold q-mb-xs" :style="{ color }">
          {{ settings.currency }}{{ settings.formatNumber(effectiveTotal) }}
        </div>
        <div v-if="loan.type === 'loan'" class="text-caption text-grey-6 q-mb-xs" style="margin-top: -4px;">
          {{ $t('loans.principal') }}: {{ settings.currency }}{{ settings.formatNumber(loan.amount) }}
          &middot; {{ loan.interestRate }}%
        </div>

        <!-- Progress -->
        <q-linear-progress :value="progress" rounded size="8px" class="q-mb-sm"
          :color="loan.type === 'receivable' ? 'positive' : 'negative'" track-color="grey-3" />

        <!-- Stats row -->
        <div class="row items-center justify-between q-mb-xs">
          <div class="text-caption" style="color: #64748b;">
            {{ $t('loans.paid') }}: <span class="text-weight-medium" style="color: #334155;">{{ settings.currency }}{{ settings.formatNumber(loan.paidAmount || 0) }}</span>
          </div>
          <div v-if="remaining > 0" class="text-caption text-weight-bold" :style="{ color }">
            {{ $t('loans.remaining') }}: {{ settings.currency }}{{ settings.formatNumber(remaining) }}
          </div>
        </div>

        <!-- Action buttons -->
        <div v-if="!settled" class="row justify-end q-gutter-xs q-mt-xs">
          <q-btn flat dense no-caps size="sm" :style="{ color }" icon="payment"
            :label="loan.type === 'receivable' ? $t('loans.receiveBtn') : loan.type === 'loan' ? $t('loans.installments') : $t('loans.payBtn')"
            @click.stop="$emit('pay')" style="border-radius: 8px;" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from 'stores/settingsStore'

const props = defineProps({
  loan: { type: Object, required: true },
  color: { type: String, default: '#111' },
  settled: { type: Boolean, default: false },
})

defineEmits(['click', 'delete', 'pay', 'edit'])

const settings = useSettingsStore()

const effectiveTotal = computed(() =>
  props.loan.type === 'loan'
    ? (props.loan.totalAmount || props.loan.amount || 0)
    : (props.loan.amount || 0),
)
const remaining = computed(() => effectiveTotal.value - (props.loan.paidAmount || 0))
const progress = computed(() => {
  if (!effectiveTotal.value) return 0
  return (props.loan.paidAmount || 0) / effectiveTotal.value
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
