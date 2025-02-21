import { computed, ref } from 'vue'

export function useFileUpload({ maxSize = 5 * 1024 * 1024, allowedTypes = ['application/json'] } = {}) {
  const file = ref(null);
  const error = ref(null);
  const content = ref(null);

  const step = ref(1);


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

  const checkVulnerabilities = async (vulnerabilities) => {
    if (!content.value) return;
    try {
      const jsonData = JSON.parse(content.value);
      if (!jsonData.dependencies) return;

      const results = [];
      const dependencies = Object.keys(jsonData.dependencies);

      for (const [index, pkg] of dependencies.entries()) {
        const response = await fetch(`https://api.osv.dev/v1/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            package: { name: pkg, ecosystem: 'npm' }
          })
        });
        const data = await response.json();
        if (data.issues && data.issues.length > 0) {
          results.push({ package: pkg, line: index + 1 });
        }
      }

      vulnerabilities.value = results;
    } catch (err) {
      console.error('Error analyzing vulnerabilities:', err);
    }
  };

  return {
    file,
    error,
    content,
    selectFile,
    removeFile,
    checkVulnerabilities
  };
}
