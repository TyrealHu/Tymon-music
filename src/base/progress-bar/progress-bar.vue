<template>
  <div class="progress-bar" ref="progressBar" @click="onProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn" :style="visibilitySyl"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'ProgressBar',
  data() {
    return {
      visibility: false
    }
  },
  computed: {
    visibilitySyl () {
      return this.visibility ? 'visibility:visible' : 'visibility:hidden'
    }
  },
  props: {
    percent: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
      this.visibility = true
    },
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      let delta = e.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(
        Math.max(
          0, delta + this.touch.left
        ),
        this.$refs.progressBar.clientWidth
      )
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.init = false
      this._triggerPercent()
    },
    onProgressClick(event) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = event.pageX - rect.left
      this.visibility = true
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent() {
      let percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth)
      setTimeout(() => {
        this.visibility = false
      }, 1000)
      this.$emit('change', percent)
    }
  },
  watch: {
    percent(newValue) {
      if (newValue >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth
        let offsetWidth = barWidth * newValue
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.progress-bar
  height: 30px

  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)

    .progress
      position: absolute
      height: 100%
      background: $color-theme

    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px

      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
