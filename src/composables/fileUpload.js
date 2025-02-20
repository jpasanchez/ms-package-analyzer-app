import { ref } from 'vue';

export function useFileUpload({ maxSize = 5 * 1024 * 1024, allowedTypes = ['application/json'] } = {}) {
  const file = ref(null);
  const error = ref(null);
  const content = ref(null);

  const selectFile = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      error.value = 'Invalid file type';
      return;
    }

    if (selectedFile.size > maxSize) {
      error.value = 'File size exceeds the allowed limit';
      return;
    }

    file.value = selectedFile;
    error.value = null;
    readFileContent(selectedFile);
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      content.value = event.target.result;
    };
    reader.onerror = () => {
      error.value = 'Error reading file';
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    file.value = null;
    content.value = null;
    error.value = null;
  };

  return {
    file,
    error,
    content,
    selectFile,
    removeFile,
  };
}
