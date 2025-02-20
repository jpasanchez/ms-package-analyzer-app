<script setup>
</script>

<template>
  <div class="logo"><img src="./assets/logo-white.png" alt="Morgan Stanley Logo"></div>
  <main>
    <div class="upload-container">
      <div class="upload-box rounded-xl aspect-(--my-aspect-ratio) bg-white py-8 px-20 text-center">
        <div class="text-lg font-medium">Please Upload JSON File to Analyze</div>
        <div class="text-lg self-center font-medium">
          <div>
            <span class="material-symbols-outlined upload-icon ">upload</span>
          </div>
          Or drag and drop it
        </div>
        <div class="text-lg text-center">
          <button type="button" class="
          text-white
          uppercase
          bg-gray-800
          hover:bg-gray-900
          focus:outline-none
          focus:ring-4
          focus:ring-blue-300
          font-medium
          rounded-lg
          text-base
          px-5
          py-2.5
          cursor-pointer">Upload File</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
#app {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  padding: 20px;
}

.upload-container {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.upload-box {
  position: absolute;
  top: calc(100vw / 10);
  left: calc(100vw / 9);
  width: 100%;
  max-width: 354px;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

main {
  height: 100%;
}

.logo {
  display: inline-block;
  height: 20px;

  img {
    height: 100%;
  }
}

.upload-icon {
  display: block;
  font-size: 40px;
}
</style>
