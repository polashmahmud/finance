<template>
  <q-page class="privacy-policy-page" padding>
    <div class="policy-container">
      <h1 class="policy-title">{{ $t('privacyPolicy.title') }}</h1>
      <p class="policy-date">{{ $t('privacyPolicy.lastUpdated') }}: {{ lastUpdated }}</p>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.introduction.title') }}</h2>
        <p>{{ $t('privacyPolicy.introduction.content') }}</p>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.dataCollection.title') }}</h2>
        <p>{{ $t('privacyPolicy.dataCollection.content') }}</p>
        <ul>
          <li>{{ $t('privacyPolicy.dataCollection.item1') }}</li>
          <li>{{ $t('privacyPolicy.dataCollection.item2') }}</li>
          <li>{{ $t('privacyPolicy.dataCollection.item3') }}</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.dataUsage.title') }}</h2>
        <p>{{ $t('privacyPolicy.dataUsage.content') }}</p>
        <ul>
          <li>{{ $t('privacyPolicy.dataUsage.item1') }}</li>
          <li>{{ $t('privacyPolicy.dataUsage.item2') }}</li>
          <li>{{ $t('privacyPolicy.dataUsage.item3') }}</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.dataSecurity.title') }}</h2>
        <p>{{ $t('privacyPolicy.dataSecurity.content') }}</p>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.thirdParty.title') }}</h2>
        <p>{{ $t('privacyPolicy.thirdParty.content') }}</p>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.userRights.title') }}</h2>
        <p>{{ $t('privacyPolicy.userRights.content') }}</p>
        <ul>
          <li>{{ $t('privacyPolicy.userRights.item1') }}</li>
          <li>{{ $t('privacyPolicy.userRights.item2') }}</li>
          <li>{{ $t('privacyPolicy.userRights.item3') }}</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>{{ $t('privacyPolicy.contact.title') }}</h2>
        <p>{{ $t('privacyPolicy.contact.content') }}</p>
        <p><strong>Email:</strong> polashmahmud@gmail.com</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'

const lastUpdated = computed(() => new Date().toLocaleDateString())
</script>

<style lang="scss" scoped>
.privacy-policy-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.policy-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.policy-title {
  font-size: 28px;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
  text-align: center;
}

.policy-date {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.policy-section {
  margin-bottom: 28px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }

  p {
    color: #555;
    line-height: 1.7;
    margin-bottom: 12px;
  }

  ul {
    margin: 12px 0;
    padding-left: 24px;

    li {
      color: #555;
      line-height: 1.8;
      margin-bottom: 8px;
    }
  }
}

@media (max-width: 600px) {
  .policy-container {
    padding: 20px;
    margin: 16px;
  }

  .policy-title {
    font-size: 24px;
  }

  .policy-section h2 {
    font-size: 16px;
  }
}
</style>
