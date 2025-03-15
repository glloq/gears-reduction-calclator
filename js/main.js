async function lancerRecherche() {
  // Afficher les instructions d'aide sur le canvas
  if (typeof drawInitialInstructions === 'function') {
    drawInitialInstructions();
  }
  // Effacer les logs précédents
  UI.clearLogs();

  const btn = document.getElementById("startStopBtn");
  btn.innerText = "⏳ Calcul en cours...";
  btn.classList.add("running");
  btn.disabled = true;

  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";
  progressBar.style.display = "block";
  UI.afficherMessageStatus("🟡 Calcul en cours...");

  const rapport = parseFloat(document.getElementById("rapport").value);
  const dentMenanteMin = parseInt(document.getElementById("val_menante_min").innerText);
  const dentMenanteMax = parseInt(document.getElementById("val_menante_max").innerText);
  const dentMeneeMin = parseInt(document.getElementById("val_menee_min").innerText);
  const dentMeneeMax = parseInt(document.getElementById("val_menee_max").innerText);
  const precision = parseFloat(document.getElementById("precision").value);
  const maxEtages = parseInt(document.getElementById("etages").value);
  const maxSolutions = parseInt(document.getElementById("max_solutions").value);
  const maxIterations = parseInt(document.getElementById("max_iterations").value);

  // Valeurs optionnelles pour engrenages fixes
  const dentMenanteFixeValue = document.getElementById("dent_menante_fixe").value;
  const dentMeneeFixeValue = document.getElementById("dent_menee_fixe").value;
  const dentMenanteFixe = dentMenanteFixeValue.trim() !== "" ? parseInt(dentMenanteFixeValue, 10) : null;
  const dentMeneeFixe = dentMeneeFixeValue.trim() !== "" ? parseInt(dentMeneeFixeValue, 10) : null;

  try {
    const resultats = await Engine.rechercherEngrenages(
      dentMenanteMin,
      dentMenanteMax,
      dentMeneeMin,
      dentMeneeMax,
      rapport,
      maxEtages,
      precision,
      maxSolutions,
      maxIterations,
      dentMenanteFixe,
      dentMeneeFixe
    );
    UI.afficherResultats(resultats);
    progressBar.style.width = "100%";
    UI.afficherMessageStatus(resultats.length > 0 ? "✅ Calcul terminé" : "⚠️ Aucun engrenage trouvé");
  } catch (err) {
    UI.afficherMessageStatus("⚠️ Erreur lors du calcul");
    console.error(err);
  }

  btn.innerText = "🔍 Rechercher";
  btn.classList.remove("running");
  btn.disabled = false;
}
