<template>
  <q-card class="finance-card cursor-pointer" :style="{ borderLeft: '4px solid ' + color, opacity: settled ? 0.7 : 1 }">
    <q-card-section class="q-py-sm" @click="$emit('click')">
      <div class="row items-center justify-between no-wrap">
        <div class="col">
          <div class="row items-center q-gutter-xs q-mb-xs">
            <div class="text-subtitle1 text-weight-bold" style="line-height: 1.3;">{{ loan.personName }}</div>
            <q-chip v-if="settled" color="positive" text-color="white" dense size="xs">
              {{ $t('loans.settled') }}
            </q-chip>
          </div>
          <div class="text-h6 text-weight-bold" :style="{ color: color }">
            {{ settings.currency }}{{ settings.formatNumber(loan.amount) }}
          </div>
          <q-linear-progress :value="progress" rounded size="6px" class="q-mt-xs q-mb-xs"
            :color="loan.type === 'receivable' ? 'positive' : 'negative'" track-color="grey-3" />
          <div class="row items-center justify-between">
            <div class="text-caption text-grey-7">
              {{ $t('loans.paid') }}: {{ settings.currency }}{{ settings.formatNumber(loan.paidAmount || 0) }}
            </div>
            <div v-if="remaining > 0" class="text-caption text-weight-medium" :style="{ color }">
              {{ $t('loans.remaining') }}: {{ settings.currency }}{{ settings.formatNumber(remaining) }}
            </div>
          </div>
          <div class="text-caption text-grey q-mt-xs">{{ formatDate(loan.date) }}</div>
        </div>
        <div class="column q-gutter-xs q-ml-sm">
          <q-btn v-if="!settled" flat round dense icon="payment" :style="{ color }"
            @click.stop="$emit('pay')" />
          <q-btn flat round dense icon="delete_outline" color="negative"
            @click.stop="$emit('delete')" />
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

defineEmits(['click', 'delete', 'pay'])

const settings = useSettingsStore()

const remaining = computed(() => (props.loan.amount || 0) - (props.loan.paidAmount || 0))
const progress = computed(() => {
  if (!props.loan.amount) return 0
  return (props.loan.paidAmount || 0) / props.loan.amount
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
