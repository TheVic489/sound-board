
# Sound Board Project

## 🖥️ Frontend

The frontend of this project is a user-friendly web interface designed to interact with the backend server. It allows users to upload MP3 files directly or provide YouTube URLs to download and play as audio files. The frontend is built using HTML, CSS, and vanilla JavaScript, ensuring a smooth and responsive experience across modern browsers.

### Key Features

- **Upload and Play MP3 Files**: Users can easily upload MP3 files from their devices, which are then processed and made available for playback through the server.
- **Download and Play Audio from YouTube Videos**: By entering a YouTube URL, users can have the audio extracted from the video and played back through the system.
- **Display List of Uploaded Files**: A dynamic list displays all the files that have been uploaded, providing easy access to previously uploaded content.
- **Server-Side Playback**: Sounds are played back on the server, enhancing the overall performance and reliability of the audio playback.

## 🎧 Backend

The backend of the Sound Board project is powered by Node.js and Express, leveraging several libraries to handle file uploads, YouTube video processing, and audio file management. It serves as the backbone for the application, processing requests from the frontend, managing file storage, and handling audio playback.

### Dependencies

- Express for setting up the web server and routing.
- Multer for handling file uploads.
- YTDL-Core and FFmpeg for downloading and converting YouTube videos to MP3 format.
- Play-Sound for controlling audio playback on the server.

## 🚀 Getting Started

To get started with the Sound Board project, follow these steps:

1. **Clone the Repository**
   ```
   git clone https://github.com/TheVic489/sound-board
   ```

2. **Navigate to the Backend Directory**
   ```
   cd backend
   ```

3. **Install Dependencies**
   ```
   npm install
   ```

4. **Start the Backend Server**
   ```
   npm run start
   ```

5. **Access the Frontend**
   Open the `frontend/index.html` file in your preferred web browser to begin interacting with the Sound Board.

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙌 Contributing

We welcome contributions from the community. If you'd like to contribute, please fork the repository, make your changes, and submit a pull request.

## Enjoy the Sounds 🎶
