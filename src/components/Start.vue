<template>
  <div id="start">
    <p>Input your code:</p>
    <textarea name="code" id="code" cols="80" rows="14"></textarea>
    <div @click.stop="jump" class="button">Go!</div>
  </div>
</template>

<script>
export default {
  name: 'start',
  methods: {
    jump () {
      window.code = this.$el.querySelector('#code').value + '\n'
      this.$router.push('/game')
    }
  }
}
</script>

<style scoped>
#start {
  color: #fff;
  padding: 100px;
}
textarea {
  font-family: 'Consolas';
  font-size: 14px;
  line-height: 20px;
  padding: 10px;
  border-radius: 3px;
  border: none;
  display: block;
  margin: auto;
  color: #fff;
  background-color: #272822;
}
.button {
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
