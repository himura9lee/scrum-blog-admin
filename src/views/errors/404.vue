<template>
  <error code="404" desc="Oh~~页面不见了~" :src="src"/>
</template>
<script>
import error404 from '@/assets/404.svg'
import error from './error.vue'
export default {
  name: 'err404',
  components: {
    error
  },
  data () {
    return {
      src: error404
    }
  }
}
</script>
