<template>
  <div class="lp-page">
    <LandingNavbar />

    <main class="lp-main">
      <HeroSection />
      <TrustedBySection />
      <FeatureGrid />
      <HowItWorks />
      <DashboardPreview />
      <IntegrationsSection />
      <ComparisonSection />
      <TestimonialsSection />
      <CTASection />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import LandingNavbar from 'src/components/landing/LandingNavbar.vue'
import HeroSection from 'src/components/landing/HeroSection.vue'
import TrustedBySection from 'src/components/landing/TrustedBySection.vue'
import FeatureGrid from 'src/components/landing/FeatureGrid.vue'
import HowItWorks from 'src/components/landing/HowItWorks.vue'
import DashboardPreview from 'src/components/landing/DashboardPreview.vue'
import IntegrationsSection from 'src/components/landing/IntegrationsSection.vue'
import ComparisonSection from 'src/components/landing/ComparisonSection.vue'
import TestimonialsSection from 'src/components/landing/TestimonialsSection.vue'
import CTASection from 'src/components/landing/CTASection.vue'
import LandingFooter from 'src/components/landing/LandingFooter.vue'

onMounted(() => {
  document.body.style.background = '#fafaf7'
})

onUnmounted(() => {
  document.body.style.background = ''
})
</script>

<style lang="scss">
// Global landing page styles — not scoped so children inherit
.lp-page {
  background: #fafaf7;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', 'Hind Siliguri', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #16161a;

  // Override .q-page padding added by Quasar
  .q-page {
    padding-bottom: 0;
    max-width: none;
    padding-left: 0;
    padding-right: 0;
    margin: 0;
  }
}

.lp-main {
  position: relative;
  z-index: 1;
}
</style>
