<template>
  <div id="gameover">
    <h1>Game Over</h1>
    <h1 v-if="score">{{score}}</h1>
    <p>Thanks for playing!</p>
    <div @click.stop="jump" class="restart">restart</div>
  </div>
</template>

<script>
export default {
  name: 'gameover',
  data: () => {
    return {
      score: window.score
    }
  },
  methods: {
    jump () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#gameover {
  color: #fff;
  padding: 100px;
}
.restart {
  margin-top: 50px;
  background-color: #fff;
  display: inline-block;
  padding: 0 2em;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  color: #272822;
  cursor: pointer;
}
</style>
