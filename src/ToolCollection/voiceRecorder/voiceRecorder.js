import React, { useState, useEffect, useRef } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Ensure correct MIME type
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          setAudioChunks([]); // Reset audio chunks for the next recording
        };

        setMediaRecorder(recorder);
      } catch (error) {
        console.error('Error accessing audio devices:', error);
      }
    };

    initMediaRecorder();
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      setAudioChunks([]); // Reset chunks when starting a new recording
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Voice Recorder</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={startRecording}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          disabled={recording}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          disabled={!recording}
        >
          Stop Recording
        </button>
      </div>

      {/* Recording Indicator */}
      {recording && (
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse mr-2"></div>
          <span className="text-lg font-semibold">Recording...</span>
        </div>
      )}

      {audioURL && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Recorded Audio:</h2>
          <audio controls src={audioURL} className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
