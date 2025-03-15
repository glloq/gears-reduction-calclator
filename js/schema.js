// js/schema.js

// Paramètres de base pour le dessin du schéma
const DEFAULT_FACTOR = 3;    // Facteur d'échelle pour la longueur de l'axe (px par dent)
const SMALL_GAP = 2;         // Écart minimal entre les axes
const HORIZ_OFFSET = 0;     // Décalage horizontal additionnel entre paires (optionnel)
const VERT_GAP = 15;         // Décalage vertical entre les niveaux de paires
const INITIAL_X = 50;        // Position de départ en X pour l'entrée
const INITIAL_Y = 20;        // Position de départ en Y pour l'entrée (sera augmenté si module renseigné)
const RECT_WIDTH = 50;       // Largeur des boîtes "IN"/"OUT"
const RECT_HEIGHT = 30;      // Hauteur des boîtes "IN"/"OUT"
const T_HEIGHT = 7;          // Hauteur du trait vertical central ("T")

// Récupération du canvas et de son contexte
const canvas = document.getElementById("gearCanvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "#000";
ctx.lineWidth = 2;

/**
 * Calcule la longueur de l'axe d'un engrenage en fonction de son nombre de dents.
 * @param {Object} gear - Objet { name: string, teeth: number }.
 * @param {string} type - "odd" ou "even" (pour éventuellement différencier)
 * @returns {number} Longueur de l'axe en pixels.
 */
function getAxisLength(gear, type) {
  // Ici, on utilise simplement le nombre de dents multiplié par un facteur.
  // Vous pouvez ajuster la formule selon vos besoins.
  return gear.teeth * DEFAULT_FACTOR;
}

/**
 * Lit la valeur du module depuis l'entrée HTML (id="module").
 * @returns {number|null} La valeur du module ou null si non renseigné.
 */
function getGearModule() {
  const moduleInput = document.getElementById("module");
  if (moduleInput && moduleInput.value.trim() !== "") {
    return parseFloat(moduleInput.value);
  }
  return null;
}

/**
 * Dessine un engrenage schématique.
 * @param {number} x Centre horizontal.
 * @param {number} y Ordonnée de l'axe.
 * @param {number} length Longueur de l'axe.
 * @param {string} label Texte du label (ex: "A: 20").
 * @param {string} labelPos "above" ou "below".
 * @returns {number} La position y en bas du "T".
 */
function drawGear(x, y, length, label, labelPos) {
  const half = length / 2;
  const endBar = 6; // Hauteur des petites barres aux extrémités

  // Axe horizontal
  ctx.beginPath();
  ctx.moveTo(x - half, y);
  ctx.lineTo(x + half, y);
  ctx.stroke();

  // Barre verticale gauche
  ctx.beginPath();
  ctx.moveTo(x - half, y - endBar/2);
  ctx.lineTo(x - half, y + endBar/2);
  ctx.stroke();

  // Barre verticale droite
  ctx.beginPath();
  ctx.moveTo(x + half, y - endBar/2);
  ctx.lineTo(x + half, y + endBar/2);
  ctx.stroke();

  // Trait vertical central ("T")
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + T_HEIGHT);
  ctx.stroke();

  // Label
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  if(labelPos === "above"){
    ctx.fillText(label, x, y - 10);
  } else {
    ctx.fillText(label, x, y + T_HEIGHT + 15);
  }
  return y + T_HEIGHT;
}

/**
 * Dessine une liaison verticale entre deux points de même abscisse.
 * @param {number} x Abscisse commune.
 * @param {number} yTop Ordonnée du haut.
 * @param {number} yBottom Ordonnée du bas.
 */
function drawVerticalLink(x, yTop, yBottom) {
  ctx.beginPath();
  ctx.moveTo(x, yTop);
  ctx.lineTo(x, yBottom);
  ctx.stroke();
}

/**
 * Dessine une boîte (rectangle) avec un texte.
 * @param {number} centerX Centre horizontal.
 * @param {number} topY Ordonnée du haut du rectangle.
 * @param {number} width Largeur du rectangle.
 * @param {number} height Hauteur du rectangle.
 * @param {string} text Texte à afficher.
 */
function drawLabelRectangle(centerX, topY, width, height, text) {
  const left = centerX - width / 2;
  ctx.beginPath();
  ctx.rect(left, topY, width, height);
  ctx.fillStyle = "#ddd";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, topY + height/2);
}

/**
 * Dessine l'assemblage schématique des engrenages.
 * Si un module est renseigné, on augmente la position initiale verticale de 30,
 * on trace pour la première paire des traits pointillés pour les deux centres jusqu'à y=15,
 * et on affiche l'entraxe sous forme "x mm" en haut du canvas.
 * Pour les paires intermédiaires, seul le trait pointillé pour l'engrenage pair (sortie) est tracé.
 * La distance horizontale entre les centres de chaque paire est calculée en fonction
 * des longueurs d'axes obtenues via getAxisLength().
 *
 * @param {Array} gears Tableau d'objets { name: string, teeth: number }.
 */
function drawAdaptiveAssembly(gears) {
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const modValue = getGearModule(); // module, si renseigné
  
  // Définir la position initiale verticale (ajout de 30 si module est renseigné)
  let startY = INITIAL_Y;
  if (modValue) {
    startY += 30;
  }
  
  const n = gears.length;
  if(n < 2) return; // Au moins deux engrenages nécessaires
  
  // Première paire
  let currentX = INITIAL_X;
  let currentY = startY;
  
  // Calculer la longueur de l'axe pour le premier engrenage (type "odd")
  const axisOdd1 = getAxisLength(gears[0], "odd");
  // Dessiner le premier engrenage (entrée)
  const bottomEntry = drawGear(currentX, currentY, axisOdd1, `${gears[0].name}: ${gears[0].teeth}`, "above");
  
  // Calculer la longueur de l'axe pour le second engrenage (type "even")
  const axisEven1 = getAxisLength(gears[1], "even");
  // Calculer la position du centre du second engrenage en fonction de l'axe du premier et du second
  const secondX = currentX + (axisOdd1 / 2) + SMALL_GAP + (axisEven1 / 2);
  // Dessiner le second engrenage
  const bottomSecond = drawGear(secondX, currentY, axisEven1, `${gears[1].name}: ${gears[1].teeth}`, "above");
  
  if(modValue) {
    // Pour la première paire, tracer des traits pointillés pour les deux centres jusqu'à y=15
    ctx.save();
    ctx.strokeStyle = "gray";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(secondX, currentY);
    ctx.lineTo(secondX, 15);
    ctx.stroke();
    ctx.restore();
    
    // Calculer et afficher l'entraxe pour la première paire
    let centerDistance = modValue * (gears[0].teeth + gears[1].teeth) / 2;
    let midX = (currentX + secondX) / 2;
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${centerDistance.toFixed(2)} mm`, midX, 15);
  }
  
  // Afficher la boîte "IN" sous le premier engrenage
  drawLabelRectangle(currentX, bottomEntry, RECT_WIDTH, RECT_HEIGHT, "IN");
  
  if(n === 2) {
    // Si seulement deux engrenages, afficher "OUT" sous le second et terminer.
    drawLabelRectangle(secondX, bottomSecond, RECT_WIDTH, RECT_HEIGHT, "OUT");
    return;
  }
  
  // Pour les paires intermédiaires
  currentX = secondX;
  for(let i = 2; i < n; i += 2) {
    // Calculer la longueur d'axe pour la paire actuelle
    const axisOdd = getAxisLength(gears[i], "odd");
    const axisEven = getAxisLength(gears[i+1], "even");
    
    // Position horizontale du centre de la nouvelle paire:
    // On part du centre précédent, on ajoute la moitié de l'axe impair, un SMALL_GAP, puis la moitié de l'axe pair.
    const newX = currentX + (axisOdd / 2) + SMALL_GAP + (axisEven / 2) + HORIZ_OFFSET;
    
    let gearBottomY = currentY + VERT_GAP;
    // Dessiner le premier engrenage de la paire (impair)
    const bottomGear1 = drawGear(currentX, gearBottomY, axisOdd, `${gears[i].name}: ${gears[i].teeth}`, "below");
    drawVerticalLink(currentX, currentY, gearBottomY);
    // Dessiner le second engrenage de la paire (pair)
    const bottomGear2 = drawGear(newX, gearBottomY, axisEven, `${gears[i+1].name}: ${gears[i+1].teeth}`, "above");
    
    if(modValue) {
      let centerDistance = modValue * (gears[i].teeth + gears[i+1].teeth) / 2;
      let midX = (currentX + newX) / 2;
      ctx.save();
      ctx.strokeStyle = "gray";
      ctx.setLineDash([5, 5]);
      // Pour les paires intermédiaires, tracer uniquement pour l'engrenage pair (newX)
      ctx.beginPath();
      ctx.moveTo(newX, gearBottomY);
      ctx.lineTo(newX, 15);
      ctx.stroke();
      ctx.restore();
      
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${centerDistance.toFixed(2)} mm`, midX, 15);
    }
    
    // Mise à jour pour la prochaine paire
    currentX = newX;
    currentY = gearBottomY;
  }
  
  // Afficher la boîte "OUT" sous le dernier engrenage
  drawLabelRectangle(currentX, currentY + T_HEIGHT, RECT_WIDTH, RECT_HEIGHT, "OUT");
}

/**
 * Convertit une solution (tableau de paires) en tableau d'objets engrenages.
 * Chaque engrenage reçoit un nom (A, B, C, …) et le nombre de dents correspondant.
 * @param {Array} solution Chaîne de paires, par exemple [[20, 30], [15, 25]].
 * @returns {Array} Tableau d'objets { name: string, teeth: number }.
 */
function convertSolutionToGears(solution) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let gears = [];
  if(solution.length > 0) {
    gears.push({ name: letters[0], teeth: solution[0][0] });
    gears.push({ name: letters[1], teeth: solution[0][1] });
  }
  for(let i = 1; i < solution.length; i++) {
    gears.push({ name: letters[2 * i], teeth: solution[i][0] });
    gears.push({ name: letters[2 * i + 1], teeth: solution[i][1] });
  }
  return gears;
}

/**
 * Affiche le schéma pour la solution d'indice donné.
 * @param {number} index Index de la solution dans le tableau global.
 */
function displaySolutionSchematic(index) {
  if(!globalSolutions || !globalSolutions[index]) return;
  const solution = globalSolutions[index];
  const gears = convertSolutionToGears(solution);
  drawAdaptiveAssembly(gears);
}
