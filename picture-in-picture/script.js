const videoEl = document.getElementById('video');
const btn = document.getElementById('btn');

// prompt to select a media stream, pass to video element, then play
async function selecMediaStream() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoEl.srcObject = mediaStream;
    videoEl.onloadedmetadata = () => {
      videoEl.play();
    };
  } catch (err) {
    // handle error here
    console.log('oops, error here:', err);
  }
}

btn.addEventListener('click', async () => {
  // disable button
  btn.disabled = true;

  // start picture in picture
  await videoEl.requestPictureInPicture();
  //reset btn
  btn.disabled = false;
});

// on load
selecMediaStream();
