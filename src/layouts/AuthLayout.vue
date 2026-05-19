<template>
  <q-layout view="hHh lpR fFf" class="auth-layout-root">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.auth-layout-root {
  background: #07101e !important;

  // q-page inside auth layout should not impose padding or max-width
  .q-page {
    padding-bottom: 0 !important;
    max-width: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0 !important;
    min-height: 100vh;
    background: #07101e;
  }

  .q-page-container {
    padding-top: 0 !important;
    background: #07101e;
  }
}
</style>
