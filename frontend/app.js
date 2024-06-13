const apiUrl = 'http://127.0.0.1:3000/api';

// Helper function to display messages
const showMessage = (message, duration = 3000) => {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = message;
  messageContainer.classList.add('show');
  setTimeout(() => {
    messageContainer.classList.remove('show');
  }, duration);
};

// Function to create and append sound boxes
const createSoundBox = (title, type, filename) => {
  const soundGrid = document.getElementById('sound-grid');
  const soundBox = document.createElement('div');
  soundBox.classList.add('sound-box');
  soundBox.innerHTML = `
    <h3>${title}</h3>
    <button data-type="${type}" data-filename="${filename}">Reproducir</button>
  `;
  soundGrid.appendChild(soundBox);
};

// Fetch and display files from the server
const loadFiles = async () => {
  try {
    console.log(apiUrl)
    const response = await fetch(`${apiUrl}/files`);
    console.log(response) // This gives me a readable stream 
    const files = await response.json();

    if (Object.keys(files).length === 0) {
      showMessage('No hay archivos cargados.');
      return;
    }

    files.forEach(file => {
      createSoundBox(file.title, file.type, file.filename);
    });
  } catch (error) {
    showMessage('Error al cargar los archivos');
    console.log(error)
  }
};

// Function to handle MP3 form submission
const handleMP3FormSubmit = async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('mp3-file');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/play/mp3`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      showMessage(result);
      createSoundBox(file.name, 'mp3', file.name);
    } catch (error) {
      showMessage('Error al subir el archivo MP3');
    }
  }
};

// Function to handle YouTube form submission
const handleYouTubeFormSubmit = async (event) => {
  event.preventDefault();
  const url = document.getElementById('youtube-url').value;

  try {
    const response = await fetch(`${apiUrl}/play/youtube`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result = await response.text();
    const filename = result.match(/Video de YouTube (.+) descargado y guardado con éxito./)[1] + '.mp3';
    showMessage(result);
    createSoundBox(url, 'youtube', filename);
  } catch (error) {
    showMessage('Error al añadir el video de YouTube');
  }
};

// Function to handle sound box button clicks
const handleSoundBoxClick = (event) => {
  // Send the filename to the server to play in the server
  const button = event.target;
  const filename = button.getAttribute('data-filename');
  
  const sendRequest = async () => {
    const response = await fetch(`${apiUrl}/play/${filename}`);
    const result = await response.text();
    // showMessage(result);
  };

  sendRequest();

};

// Attach event listeners
document.getElementById('mp3-form').addEventListener('submit', handleMP3FormSubmit);
document.getElementById('youtube-form').addEventListener('submit', handleYouTubeFormSubmit);
document.getElementById('sound-grid').addEventListener('click', handleSoundBoxClick);

// Load files on page load
window.onload = loadFiles;
