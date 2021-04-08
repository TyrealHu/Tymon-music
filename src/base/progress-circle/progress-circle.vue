<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle r="50" class="progress-bar" cx="50" cy="50" fill="transparent" :stroke-dasharray="circumference"
              :stroke-dashoffset="50"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      circumference() {
        return 2 * 50 * Math.PI
      }
    }
  },
  computed: {
    circumferencePercent() {
      console.log(this.percent)
      return this.circumference - this.circumference * this.percent
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.progress-circle
  position: relative

  circle
    stroke-width: 8px
    transform-origin: center

    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d

    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
