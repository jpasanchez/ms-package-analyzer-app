<script setup>
import { ref } from 'vue'
import { useFileUpload } from '@/composables/fileUpload.js';
const { file, error, content, selectFile, removeFile } = useFileUpload();
const step = ref('upload');

const setStep = (newStep) => {
  step.value = newStep;
};

</script>
<template>
  <div class="logo"><img src="./assets/logo-white.png" alt="Morgan Stanley Logo"></div>
  <main>
    <div class="upload-container">
      <div class="upload-box rounded-xl aspect-(--my-aspect-ratio) bg-white py-8 px-20 text-center">
        <div v-if="step === 'upload'" class="text-lg font-medium">Please Upload JSON File to Analyze</div>

        <div v-if="step === 'validate'" class="text-lg font-medium">
          Ready to Analyze File
          <div class="select-none">
            <span class="material-symbols-outlined task-alt ">task_alt</span>
          </div>
        </div>
        <div class="text-lg self-center font-medium">
          <div v-if="step === 'upload'">
            <div class="select-none">
              <span class="material-symbols-outlined upload-icon ">upload</span>
            </div>
            Or drag and drop it
          </div>
          <div v-if="step === 'validate'" class="flex flex-col items-center">
            <div class="font-medium">File Name: </div>
            <div class="file-name rounded-full bg-gray-200 mt-2 p-2 text-sm font-normal w-3/4 text-center">
              {{ file.name }}
              <button class="material-symbols-outlined cancel" @click="() => { removeFile; setStep('upload'); }">cancel</button>
            </div>
<!--            <button v-if="file" @click="removeFile">Remove File</button>-->
<!--            <button v-if="step === 'validate'" @click="setStep('readyToAnalyze')">Validate File</button>-->
          </div>
        </div>
        <div class="text-lg text-center flex justify-center">
          <label v-if="step === 'upload'" class="file-upload
            text-white
            uppercase
            bg-gray-800
            hover:bg-gray-900
            focus:outline-none
            focus:ring-4
            focus:ring-blue-300
            font-medium
            rounded-lg
            px-5
            py-2.5
            cursor-pointer">
            <input type="file" @change="(e) => { selectFile(e); if (!error) setStep('validate'); }" hidden />
            <span class="text-sm">Upload File</span>
          </label>
          <div v-if="step === 'validate'" class="file-upload">
            <button @click="setStep('showResults')" class="
            text-white
            text-sm
            uppercase
            bg-gray-800
            hover:bg-gray-900
            focus:outline-none
            focus:ring-4
            focus:ring-blue-300
            font-medium
            rounded-lg
            px-5
            py-2.5
            cursor-pointer">Analyze</button>
          </div>
        </div>
        <div class="text-lg">
          <div v-if="error" style="color: #FF9494">{{ error }}</div>
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

.task-alt {
  display: block;
  font-size: 38px;
  margin-top: 8px;
}

.file-name {
  position: relative;
}

.cancel {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 30px;
  transform: translate(50%, -50%);
  cursor: pointer;
}
</style>
