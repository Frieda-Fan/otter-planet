export async function startCamera(videoElement: HTMLVideoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;

  await videoElement.play();

  return () => {
    stream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  };
}
