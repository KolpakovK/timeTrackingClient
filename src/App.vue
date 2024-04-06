<template>
  <div class="flex flex-col flex-1">
    <Navigation></Navigation>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navigation from "./components/Navigation.vue"

  export default {
    components: {
      Navigation
    }
  }
</script>
