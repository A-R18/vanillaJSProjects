const form = document.getElementById("qr-form");
const qrCode = document.getElementById("qr-code");
const qrCodeSpot = document.getElementById("qrcodeimg");

const onGenerateSubmit = (e) => {
  e.preventDefault();
  clearUI();
  const url = document.getElementById("url").value;
  const size = document.getElementById("size").value;

  if (url === "") {
    alert("Please enter a URL");
  } else {
    showSpinner();
  }

  setTimeout(() => {
    hideSpinner();
    generateQRCode(url, size);
    setTimeout(() => {
      const saveUrl = qrCodeSpot.querySelector("img").src; // Get the src value
      const updatedSaveUrl = saveUrl.startsWith("https://")
        ? saveUrl
        : `https://${saveUrl}`; // Prepend https:// if missing

      createSaveBtn(saveUrl);
    }, 50);
  }, 1500);
};

const generateQRCode = (url, size) => {
  const qrcode = new QRCode("qrcodeimg", {
    text: url,
    width: size,
    height: size,
  });
};

const showSpinner = () => {
  document.getElementById("spinner").style.display = "block";
};

const hideSpinner = () => {
  document.getElementById("spinner").style.display = "none";
};

const clearUI = () => {
  qrCodeSpot.innerHTML = "";
};

const createSaveBtn = (saveUrl) => {
  const link = document.createElement("a");
  link.id = "save-link";
  link.style.cssText = `
    background-color: rgb(239 68 68); 
    color: white;
    text-decoration: none; 
    font-weight: bold; 
    font-size: 14px; 
    padding: 8px; 
    transition: background-color 0.2s;
    //margin-top: 200px; 
    border-radius: 10px;
    margin:auto;

  `;
  link.href = saveUrl;
  link.innerHTML = "Save Image";
  document.querySelector(".generated").appendChild(link);
};

hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
