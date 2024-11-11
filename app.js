const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const equivalents = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#", "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };

function toggleTranspositionOptions() {
    const demiTonSection = document.getElementById('demi-ton-section');
    const tonaliteSection = document.getElementById('tonalite-section');
    const option = document.querySelector('input[name="transposition_option"]:checked').value;
    
    if (option === 'demi-ton') {
        demiTonSection.style.display = 'block';
        tonaliteSection.style.display = 'none';
        document.getElementById("tonalite_origine").value = "";
        document.getElementById("tonalite_cible").value = "";
    } else {
        demiTonSection.style.display = 'none';
        tonaliteSection.style.display = 'block';
    }
}

function nettoyerAccord(accord) {
    return accord.replace("#b", "").replace("b#", "");
}

function transposerAccord(accord, k) {
    accord = nettoyerAccord(accord);
    let baseNote = "", suffixe = "";

    if (notes.includes(accord.slice(0, 2))) {
        baseNote = accord.slice(0, 2);
        suffixe = accord.slice(2);
    } else if (notes.includes(accord.slice(0, 1))) {
        baseNote = accord.slice(0, 1);
        suffixe = accord.slice(1);
    }

    baseNote = equivalents[baseNote] || baseNote;
    let indexNote = notes.indexOf(baseNote);

    // Calcul de la nouvelle note avec gestion des indices négatifs
    const newIndex = (indexNote + k + notes.length) % notes.length;
    const newNote = notes[newIndex];
    
    return nettoyerAccord(newNote + suffixe);
}

function calculerDemiTons(tonaliteOrigine, tonaliteCible) {
    const origine = equivalents[tonaliteOrigine] || tonaliteOrigine;
    const cible = equivalents[tonaliteCible] || tonaliteCible;
    return (notes.indexOf(cible) - notes.indexOf(origine) + notes.length) % notes.length;
}

function processTransposition() {
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = `<p>Chargement en cours...</p>`;

    setTimeout(() => {
        const accordsInput = document.getElementById("accords").value;
        const accords = accordsInput.split(",");
        const option = document.querySelector('input[name="transposition_option"]:checked').value;
        let k = 0;

        try {
            if (option === 'demi-ton') {
                k = parseInt(document.getElementById("transposition").value);
                if (isNaN(k)) throw new Error("Veuillez entrer un nombre de demi-tons valide.");
            } else {
                const origine = document.getElementById("tonalite_origine").value.trim();
                const cible = document.getElementById("tonalite_cible").value.trim();
                if (!origine || !cible) throw new Error("Veuillez entrer les tonalités d'origine et de destination.");
                k = calculerDemiTons(origine, cible);
            }

            const transposedChords = accords.map(accord => transposerAccord(accord.trim(), k));
            displayResults(transposedChords, k);
        } catch (error) {
            alert(error.message);
        }
    }, 300);
}

function displayResults(transposedChords, k) {
    const normalizedK = (k % 12 + 12) % 12;  // Normalisation de k pour le calcul de la position de capo
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = `
        <h2>Accords Transposés : ${transposedChords.join(", ")}</h2>
        <h3>Position de capo : fret ${12 - normalizedK}</h3>
        <div class="chord-diagrams">
            ${transposedChords.map(accord => `
                <div class="chord">
                    <p>${accord}</p>
                    <img src="chord_images/${accord}.png" alt="Diagramme de ${accord}">
                </div>
            `).join('')}
        </div>
    `;
}
