import { ref } from 'vue'

export function useFileUpload({ maxSize = 5 * 1024 * 1024, allowedTypes = ['application/json'] } = {}) {
  const file = ref(null);
  const error = ref(null);
  const content = ref(null);
  const vulnerabilities = ref([]);
  const loading = ref(false);
  const step = ref('upload');

  const setStep = (newStep) => {
    step.value = newStep;
  };

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

    if (!error.value) setStep('validate');
  };

  const removeFile = () => {
    file.value = null;
    content.value = null;
    error.value = null;

    setStep('upload')
  };

  const checkVulnerabilities = async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    loading.value = true;

    if (!content.value) return;
    try {
      const jsonData = JSON.parse(content.value);
      if (!jsonData.dependencies) return;

      const results = [];
      const dependencies = Object.keys(jsonData.dependencies);

      for (const [index, pkg] of dependencies.entries()) {
        const response = await fetch(`http://localhost:3001/api/osv`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            package: { name: pkg, ecosystem: 'npm' }
          })
        });
        await sleep(1000);
        const data = await response.json();
        if (data.vulns && data.vulns.length > 0) {
          results.push({ package: pkg, line: index + 1 });
        }
      }

      vulnerabilities.value = results;
    } catch (err) {
      console.error('Error analyzing vulnerabilities:', err);
    } finally {
      loading.value = false;
      setStep('showResults');
    }
  };

  return {
    file,
    error,
    vulnerabilities,
    loading,
    step,
    setStep,
    selectFile,
    removeFile,
    checkVulnerabilities
  };
}
