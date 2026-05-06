export async function startCamera(videoElement: HTMLVideoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Current browser does not support camera access.');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
    },
    audio: false,
  });

  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;

  await new Promise<void>((resolve) => {
    if (videoElement.readyState >= 1) {
      resolve();
      return;
    }

    const handleLoadedMetadata = () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      resolve();
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  });

  await videoElement.play();

  return () => {
    stream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  };
}
