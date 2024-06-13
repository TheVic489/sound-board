const express = require('express');
const multer = require('multer');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const player = require('play-sound')(opts= {});
const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( 
	cors({
		origin: '*',	
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Ruta para subir y guardar archivos MP3
app.post('/api/play/mp3', upload.single('file'), (req, res) => {
  console.log('Subiendo archivo MP3...');
  if (!req.file) {
    console.error('No se ha subido ningún archivo.');
    return res.status(400).send('No se ha subido ningún archivo.');
  }

  const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

  fs.rename(req.file.path, targetPath, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return res.status(500).send('Error al guardar el archivo.');
    }

    console.log(`Archivo ${req.file.originalname} subido y guardado con éxito.`);
    res.send(`Archivo ${req.file.originalname} subido y guardado con éxito.`);
  });
});

// Ruta para añadir y reproducir un video de YouTube
app.post('/api/play/youtube', async (req, res) => {
  console.log('Añadiendo video de YouTube...');
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    console.error('URL de YouTube no válida:', url);
    return res.status(400).send('URL de YouTube no válida.');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const filePath = path.join(__dirname, 'uploads', `${title}.mp3`);

    const stream = ytdl(url, { filter: 'audioonly' });
    const command = ffmpeg(stream)
      .audioCodec('libmp3lame')
      .format('mp3')
      .save(filePath);

    command.on('end', () => {
      console.log(`Video de YouTube ${title} descargado y guardado con éxito.`);
      res.send(`Video de YouTube ${title} descargado y guardado con éxito.`);
    });

    command.on('error', (err) => {
      console.error('Error al descargar el video de YouTube:', err);
      res.status(500).send('Error al descargar el video de YouTube.');
    });

  } catch (err) {
    console.error('Error al obtener información del video de YouTube:', err);
    res.status(500).send('Error al obtener información del video de YouTube.');
  }
});

// Ruta para obtener la lista de archivos
app.get('/api/files', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads')).map(file => ({
    title: file,
    filename: file,
    type: path.extname(file) === '.mp3' ? 'mp3' : 'unknown'
  }));

  res.json(files);
});

// Ruta para reproducir un archivo
app.get('/api/play/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    console.error('Archivo no encontrado:', req.params.filename);
    return res.status(404).send('Archivo no encontrado.');
  }
  console.log(filePath);
  player.play(filePath, function(err) {
    if (err) {
      console.error('Error al reproducir el archivo:', err);
      return res.status(500).send('Error al reproducir el archivo.');
    } else {
      return res.send(`Archivo ${req.params.filename} reproducido con éxito.`);
    }
  });

  console.log(`Reproduciendo archivo: ${req.params.filename}`);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
