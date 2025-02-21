<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useFileUpload } from '@/composables/fileUpload.js';
const { file, error, selectFile, removeFile, checkVulnerabilities, vulnerabilities, loading, step, setStep } = useFileUpload();
const isDragging = ref(false);

const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event) => {
  if (event.relatedTarget === null) {
    isDragging.value = false;
  }
};
const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer.files.length > 0) {
    selectFile({ target: { files: event.dataTransfer.files } });
    if (!error) {
      setStep('validate');
    }
  }
};

onMounted(() => {
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('dragleave', handleDragLeave);
  document.addEventListener('drop', handleDrop);
});

onUnmounted(() => {
  document.removeEventListener('dragover', handleDragOver);
  document.removeEventListener('dragleave', handleDragLeave);
  document.removeEventListener('drop', handleDrop);
});
</script>
<template>
  <div class="dropzone" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop">
    <div v-if="isDragging" class="drop-overlay">
      <p>Drop It Like Its Hot ️‍🔥️‍🔥️‍🔥</p>
    </div>
    <div class="logo"><img src="./assets/logo-white.png" alt="Morgan Stanley Logo"></div>
    <main>
      <div class="upload-container">
        <div class="upload-box rounded-xl aspect-(--my-aspect-ratio) bg-white py-8 px-20 text-center">
          <div class="text-lg font-medium">
            <div v-if="step === 'upload'">Please Upload JSON File to Analyze</div>
            <div v-if="step === 'validate'">
              Ready to Analyze File
              <div class="select-none">
                <span class="material-symbols-outlined task-alt ">task_alt</span>
              </div>
            </div>
            <div v-if="step === 'showResults'">Please review packages with vulnerabilities</div>
          </div>

          <div class="text-lg self-center font-medium">
            <div v-if="step === 'upload'">
              <div class="select-none">
                <span class="material-symbols-outlined upload-icon ">upload</span>
              </div>
              Or drag and drop it
            </div>
            <div v-if="step === 'validate' && file" class="flex flex-col items-center">
              <div class="font-medium">File Name: </div>
              <div class="file-name rounded-full bg-gray-200 mt-2 p-2 text-sm font-normal w-3/4 text-center">
                {{ file.name }}
                <button class="material-symbols-outlined cancel" @click="removeFile">cancel</button>
              </div>
            </div>
            <div v-if="step === 'showResults'" class="flex flex-col items-center">
              <button class="button-redo rounded-full bg-gray-200 mt-2 p-2 text-sm font-normal w-3/4 text-center uppercase cursor-pointer text-white" @click="removeFile">Start Over</button>
            </div>
          </div>
          <div class="text-lg text-center flex justify-center">
            <label v-if="step === 'upload'" class="file-upload text-white uppercase bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 cursor-pointer">
              <input type="file" @change="(e) => { selectFile(e) }" hidden />
              <span class="text-sm">Upload File</span>
            </label>
            <div v-if="step === 'validate'" class="file-upload">
              <button @click="checkVulnerabilities();"
                class="text-white text-sm uppercase bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-3 cursor-pointer">
                  Analyze
                <span v-if="loading" class="material-symbols-outlined spinner">progress_activity</span>
              </button>
            </div>
          </div>

          <!-- Errors -->
          <div class="text-lg">
            <div v-if="error" style="color: var(--color-red)">{{ error }}</div>
          </div>
        </div>


        <div class="results-box">
          <div v-if="vulnerabilities.length > 0 && step === 'showResults'">
            <h3 class="text-2xl text-white">Vulnerable Packages:</h3>
            <transition-group name="staggered" tag="ul" class="grid gap-3 mt-6">
              <li v-for="(vuln, index) in vulnerabilities" :key="vuln.package" :style="{ animationDelay: `${index * 0.3}s` }" class="vuln-item rounded-xl bg-white aspect-(--my-aspect-ratio-2) py-8 px-20">
                {{ vuln.package }} (Line: {{ vuln.line }})
              </li>
            </transition-group>
          </div>
        </div>
      </div>
    </main>
  </div>
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

  @media (min-width: 1600px) {
    left: 460px;
  }
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

.results-box {
  display: block;
  grid-column-start: 2;
  position: absolute;
  top: 10vw;
  left: 11.1111111111vw;

  @media (min-width: 1600px) {
    left: 150px;
  }
}

.button-redo {
  background-color: var(--color-dark-red);

  &:hover {
    background-color: var(--color-darker-red);
  }
}

.spinner {
  font-size: 15px;
  display: inline-block;
  animation: spin 2s infinite linear;
  position: relative;
  left: 6px;
  top: 2px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.vuln-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;
}

.staggered-enter-active {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
