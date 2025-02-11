const video = document.getElementById('webcam');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      const enhancedStream = canvas.captureStream(30); // Capture enhanced stream
      // Use enhancedStream as a virtual camera source
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

async function processVideo() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  async function enhanceFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = canvas.toDataURL('image/jpeg').split(',')[1]; // Convert to base64
    const response = await fetch('http://localhost:5000/enhance', {
      method: 'POST',
      body: JSON.stringify({ frame }),
      headers: { 'Content-Type': 'application/json' },
    });
    const enhancedFrame = await response.blob();
    const imageUrl = URL.createObjectURL(enhancedFrame);
    ctx.drawImage(await createImageBitmap(enhancedFrame), 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(enhanceFrame);
  }

  enhanceFrame();
}

startWebcam();