<template>
  <v-app class="full-height">
    <router-view class="full-height" />
    <notifications
      group="app"
      classes="vue-notification"
      position="top right"
      :max="3"
    />
  </v-app>
</template>
<style scoped>
.full-height {
  height: 100%;
}
</style>
