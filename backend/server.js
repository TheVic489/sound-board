const express = require('express');
const multer = require('multer');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

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
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo.');
  }
  
  const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

  fs.rename(req.file.path, targetPath, (err) => {
    if (err) {
      return res.status(500).send('Error al guardar el archivo.');
    }

    res.send(`Archivo ${req.file.originalname} subido y guardado con éxito.`);
  });
});

// Ruta para reproducir un archivo MP3
app.get('/api/play/mp3/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado.');
  }

  const stream = fs.createReadStream(filePath);
  const command = ffmpeg(stream)
    .audioCodec('libmp3lame')
    .format('mp3');

  res.setHeader('Content-Type', 'audio/mp3');
  command.pipe(res);
});

// Ruta para añadir y reproducir un video de YouTube
app.post('/api/play/youtube', async (req, res) => {
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('URL de YouTube no válida.');
  }

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

  const filePath = path.join(__dirname, 'uploads', `${title}.mp3`);
  const stream = ytdl(url, { format });

  stream.pipe(fs.createWriteStream(filePath))
    .on('finish', () => {
      res.send(`Video de YouTube ${title} descargado y guardado con éxito.`);
    })
    .on('error', (err) => {
      res.status(500).send('Error al descargar el video de YouTube.');
    });
});

// Ruta para reproducir un video de YouTube guardado como MP3
app.get('/api/play/youtube/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado.');
  }

  const stream = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'audio/mp3');
  stream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
