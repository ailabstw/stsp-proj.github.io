<template>
  <transition name="fade" mode="out-in">
    <keep-alive :include='cachedViews'>
      <UploadForm/>
    </keep-alive>
  </transition>
</template>

<script>
import UploadForm from './UploadForm'
export default {
  name: 'TableMain',
  components: {
    UploadForm
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>
