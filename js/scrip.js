
let greenWordsArray = [];

function procesarTexto() {
    greenWordsArray = [];
    const input = document.getElementById("inputText").value;
    const output = document.getElementById("output");
    output.innerHTML = '';
    const words = input.split(/\s+/);
    let startIdx = 0;
    let pf = 0;

    while (startIdx < words.length) {
        pf++;

        let endIdx;
        if (startIdx + 19 < words.length && words[startIdx + 19].endsWith('.')) {
            endIdx = startIdx + 20;
        } else {
            endIdx = startIdx + 19;
            while (endIdx < words.length && !words[endIdx].endsWith('.')) {
                endIdx++;
            }
            endIdx++;
        }

        let paragraphWords = words.slice(startIdx, endIdx);

        if (paragraphWords.length > 0) {
            appendParagraph(paragraphWords, pf);
            greenWordsArray.push(...paragraphWords);
        }

        startIdx = endIdx;

        if (paragraphWords.length < 20) break;
    }

    updateJoinedTexts();
}

function appendParagraph(words, pf) {
    const output = document.getElementById("output");
    words.forEach((word, pp) => {
        const wordContainer = document.createElement('div');
        wordContainer.className = "caja";
        const label = document.createElement('span');
        label.className = 'etiqueta';
        label.innerText = `pf${pf} pp${pp + 1}`;
        wordContainer.appendChild(label);

        const items = [
            { className: 'verde', text: word },
            { className: 'rojo', text: word, contentEditable: true },
            { className: 'morado', text: word, contentEditable: true }
        ];

        for (let item of items) {
            const elem = document.createElement('div');
            elem.className = item.className;
            elem.innerText = item.text;

            if (item.contentEditable) {
                elem.contentEditable = "true";
            }

            wordContainer.appendChild(elem);
        }

        output.appendChild(wordContainer);
    });

    output.querySelectorAll('.rojo, .morado').forEach((element) => {
        element.addEventListener('input', updateJoinedTexts);
    });
}

function updateJoinedTexts() {
    document.querySelector(".joinedText.verde .content").innerText = greenWordsArray.join(' ');

    const redElems = Array.from(document.querySelectorAll("#output .rojo"));
    document.querySelector(".joinedText.rojo .content").innerText = redElems.map(e => e.innerText).join(' ');

    const purpleElems = Array.from(document.querySelectorAll("#output .morado"));
    document.querySelector(".joinedText.morado .content").innerText = purpleElems.map(e => e.innerText).join(' ');
}

function copyToClipboard(selector) {
    let range = document.createRange();
    range.selectNode(document.querySelector(selector));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Texto copiado al portapapeles.');
}

function exportToJson() {
    const redElems = Array.from(document.querySelectorAll("#output .rojo"));
    const redText = redElems.map(e => e.innerText);
    const purpleElems = Array.from(document.querySelectorAll("#output .morado"));
    const purpleText = purpleElems.map(e => e.innerText);
    const data = {
        greenText: greenWordsArray,
        redText: redText,
        purpleText: purpleText
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    a.click();
}

function importFromJson() {
    const fileInput = document.getElementById('importJson');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);
        greenWordsArray = data.greenText;

        document.getElementById("output").innerHTML = ''; // Limpiar las cajas existentes
        let pf = 1;
        let startIdx = 0;
        let endIdx;

        while (startIdx < greenWordsArray.length) {
            let pp = 1;

            if (startIdx + 19 < greenWordsArray.length && greenWordsArray[startIdx + 19].endsWith('.')) {
                endIdx = startIdx + 20;
            } else {
                endIdx = startIdx + 19;
                while (endIdx < greenWordsArray.length && !greenWordsArray[endIdx].endsWith('.')) {
                    endIdx++;
                }
                endIdx++;
            }

            const paragraphWords = greenWordsArray.slice(startIdx, endIdx);
            for (let i = 0; i < paragraphWords.length; i++) {
                appendParagraph([paragraphWords[i]], pf);
                document.querySelector(`#output .caja:last-child .etiqueta`).innerText = `pf${pf} pp${pp}`;
                document.querySelector(`#output .caja:last-child .rojo`).innerText = data.redText[startIdx + i];
                document.querySelector(`#output .caja:last-child .morado`).innerText = data.purpleText[startIdx + i];
                pp++;
            }

            startIdx = endIdx;
            pf++;
        }

        updateJoinedTexts();
    };

    reader.readAsText(file);
}

document.getElementById("processBtn").addEventListener("click", procesarTexto);

