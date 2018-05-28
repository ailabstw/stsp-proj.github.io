<template>
  <transition name="fade" mode="out-in">
    <keep-alive :include='cachedViews'>
      <List/>
    </keep-alive>
  </transition>
</template>

<script>
import List from './List'
export default {
  name: 'TableMain',
  components: {
    List
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>
