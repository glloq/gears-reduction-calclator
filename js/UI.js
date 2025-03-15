// UI.js - Gestion de l'affichage de l'interface, des résultats et des logs

var globalSolutions = [];

/**
 * Affiche les résultats de recherche dans le tableau.
 * Chaque solution est affichée sous la forme "A: nbr, B: nbr ; C: nbr, D: nbr ; ..."
 * et un bouton "Afficher schéma" permet de visualiser la solution correspondante.
 * @param {Array} solutions - Tableau des solutions (chaînes de paires)
 */
function afficherResultats(solutions) {
  globalSolutions = solutions;
  const tbody = document.getElementById("resultats");
  tbody.innerHTML = "";

  if (solutions.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Aucun résultat</td></tr>";
    return;
  }

  solutions.forEach((solution, index) => {
    // Calcul du rapport global et de l'erreur
    let ratio = solution.reduce((acc, [m, n]) => acc * (n / m), 1);
    let target = parseFloat(document.getElementById("rapport").value);
    let error = Math.abs((ratio - target) / target * 100);

    // Construction du texte des engrenages au format "A: nbr, B: nbr ; ..."
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let gearsText = "";
    solution.forEach((pair, i) => {
      let letter1 = letters[2 * i];
      let letter2 = letters[2 * i + 1];
      gearsText += `${letter1}: ${pair[0]}, ${letter2}: ${pair[1]}`;
      if (i < solution.length - 1) {
        gearsText += " ; ";
      }
    });

    // Création de la ligne du tableau
    let row = document.createElement("tr");

    let methodCell = document.createElement("td");
    methodCell.innerText = "Méthode";

    let gearsCell = document.createElement("td");
    gearsCell.innerText = gearsText;

    let ratioCell = document.createElement("td");
    ratioCell.innerText = ratio.toFixed(2);

    let errorCell = document.createElement("td");
    errorCell.innerText = error.toFixed(2);

    let buttonCell = document.createElement("td");
    let btn = document.createElement("button");
    btn.innerText = "Afficher schéma";
    btn.onclick = function () {
      displaySolutionSchematic(index);
    };
    buttonCell.appendChild(btn);

    row.appendChild(methodCell);
    row.appendChild(gearsCell);
    row.appendChild(ratioCell);
    row.appendChild(errorCell);
    row.appendChild(buttonCell);

    tbody.appendChild(row);
  });

  // Afficher par défaut le schéma de la première solution
  displaySolutionSchematic(0);
}

/**
 * Met à jour le message de statut affiché à l'utilisateur.
 * @param {string} message - Le message à afficher.
 */
function afficherMessageStatus(message) {
  const status = document.getElementById("status");
  status.innerText = message;
}

/**
 * Ajoute un message de log dans la div dédiée aux logs.
 * Les logs sont affichés sous le tableau des résultats.
 * @param {string} message - Le message de log.
 */
function ajouterLog(message) {
  const logDiv = document.getElementById("logs");
  if (logDiv) {
    const p = document.createElement("p");
    p.innerText = message;
    logDiv.appendChild(p);
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

// Exposer les fonctions globalement
window.UI = {
  afficherResultats: afficherResultats,
  afficherMessageStatus: afficherMessageStatus,
  ajouterLog: ajouterLog
};
