
// JavaScript (script.js)
document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const processButton = document.getElementById("processButton");
  const originalText = document.getElementById("originalText");
  const greenText = document.getElementById("greenText");
  const redText = document.getElementById("redText");
  const purpleText = document.getElementById("purpleText");
  const downloadButton = document.getElementById("downloadButton");
  const colorSelect = document.getElementById("colorSelect");

  processButton.addEventListener("click", processText);

  // Función para procesar el texto
  function processText() {
    const inputText = textInput.value;
    const paragraphs = inputText.split("\n");

    let processedText = "";
    let greenProcessedText = "";
    let redProcessedText = "";
    let purpleProcessedText = "";

    paragraphs.forEach((paragraph, index) => {
      const words = paragraph.split(" ");

      words.forEach((word) => {
        // Las palabras en verde no son editables
        greenProcessedText += `<span class="green-word">${word}</span> `;

        // Etiqueta "PF" para las palabras en rojo
        redProcessedText += `<span class="red-label">PF</span><input class="red-word" type="text" value="${word}" /> `;

        // Etiqueta "PP" para las palabras en morado
        purpleProcessedText += `<span class="purple-label">PP</span><input class="purple-word" type="text" value="${word}" /> `;
      });

      greenProcessedText += "<br>";
      redProcessedText += "<br>";
      purpleProcessedText += "<br>";
    });

    // Mostrar el resultado en las cajas de texto
    greenText.innerHTML = greenProcessedText;
    redText.innerHTML = redProcessedText;
    purpleText.innerHTML = purpleProcessedText;
  }

  // Función para exportar el texto del color seleccionado
  downloadButton.addEventListener("click", function () {
    const selectedColor = colorSelect.value;
    let editedText = "";

    switch (selectedColor) {
      case "green":
        // Obtén el contenido del texto verde
        editedText = Array.from(document.querySelectorAll('.green-word')).map(word => word.textContent).join(' ');
        break;
      case "red":
        // Obtén el contenido de las cajas de texto rojo
        editedText = Array.from(document.querySelectorAll('.red-word')).map(input => input.value).join(' ');
        break;
      case "purple":
        // Obtén el contenido de las cajas de texto morado
        editedText = Array.from(document.querySelectorAll('.purple-word')).map(input => input.value).join(' ');
        break;
    }

    if (editedText) {
      const filename = `texto_${selectedColor}.txt`;
      exportToTextFile(editedText, filename);
    } else {
      alert("No hay texto para exportar en el color seleccionado.");
    }
  });

  // Función para exportar texto como archivo de texto
  function exportToTextFile(text, filename) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
});
