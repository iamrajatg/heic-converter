var converter = window.heicConverter

var format = "JPEG"

const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', handleFileSelection);

function handleFileSelection(event) {
  const file = event.target.files[0];

  // Extract the extension (considering potential dots in filenames)
  const extension = file.name.split('.').pop().toLowerCase();

  // Check for common HEIC extensions (case-insensitive)
  const isHEIC = ['heic', 'heif'].includes(extension);

  if (!isHEIC) {
    alert('Please select an HEIC image!');
    return;
  }
  // Process the HEIC file
  processHEIC(file);
}

function processHEIC(file) {
    file.arrayBuffer()
    .then(buffer=> 
      converter({
      buffer:new Uint8Array(buffer),
      format:format
    }))
    .then((conversionResult) => {
      var url = URL.createObjectURL(new Blob([conversionResult.buffer]));
      document.getElementById("target").innerHTML = `<img width="400"  height="auto" src="${url}">`;
  
      var link = document.createElement("a"); // Or maybe get it from the current document
      link.href = url;
      link.download = `myimage.${format.toLowerCase()}`;
      link.innerText = "Click here to download the file";
      document.getElementById("downloadLinkWrapper").replaceChildren(link) // Or append it whereever you want
      URL.revokeObjectURL() 
    })
    .catch((e) => {
      console.log(e);
    });
}

// fetch("https://alexcorvi.github.io/heic2any/demo/1.heic")
//   .then((res) => res.blob())
//   .then((blob) => blob.arrayBuffer())
//   .then(buffer=> 
//     converter({
//     buffer:new Uint8Array(buffer),
//     format:format
//   }))
//   .then((conversionResult) => {
//     var url = URL.createObjectURL(new Blob([conversionResult.buffer]));
//     document.getElementById("target").innerHTML = `<img src="${url}">`;

//     var link = document.createElement("a"); // Or maybe get it from the current document
//     link.href = url;
//     link.download = `myimage.${format.toLowerCase()}`;
//     link.innerText = "Click here to download the file";
//     document.body.appendChild(link); // Or append it whereever you want
//     URL.revokeObjectURL() 
//   })
//   .catch((e) => {
//     console.log(e);
//   });