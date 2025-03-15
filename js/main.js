function lancerRecherche() {
    let btn = document.getElementById("startStopBtn");
    btn.innerText = "⏳ Calcul en cours...";
    btn.classList.add("running");
    btn.disabled = true;

    document.getElementById("progress-bar").style.width = "0%";
    document.getElementById("progress-bar").style.display = "block";
    document.getElementById("status").innerText = "🟡 Calcul en cours...";

    const rapport = parseFloat(document.getElementById("rapport").value);
    const dentMenanteMin = parseInt(document.getElementById("val_menante_min").innerText);
    const dentMenanteMax = parseInt(document.getElementById("val_menante_max").innerText);
    const dentMeneeMin = parseInt(document.getElementById("val_menee_min").innerText);
    const dentMeneeMax = parseInt(document.getElementById("val_menee_max").innerText);
    const precision = parseFloat(document.getElementById("precision").value);
    const maxEtages = parseInt(document.getElementById("etages").value);
    const maxSolutions = parseInt(document.getElementById("max_solutions").value);

    // Récupération des valeurs optionnelles sans modifier la plage globale
    const dentMenanteFixeValue = document.getElementById("dent_menante_fixe").value;
    const dentMeneeFixeValue = document.getElementById("dent_menee_fixe").value;
    let dentMenanteFixe = dentMenanteFixeValue.trim() !== "" ? parseInt(dentMenanteFixeValue, 10) : null;
    let dentMeneeFixe = dentMeneeFixeValue.trim() !== "" ? parseInt(dentMeneeFixeValue, 10) : null;

    setTimeout(() => {
        const resultats = Engine.rechercherEngrenages(
            dentMenanteMin, dentMenanteMax,
            dentMeneeMin, dentMeneeMax,
            rapport, maxEtages, precision, maxSolutions,
            dentMenanteFixe, dentMeneeFixe
        );
        UI.afficherResultats(resultats);

        document.getElementById("progress-bar").style.width = "100%";
        document.getElementById("status").innerText = resultats.length > 0 ? "✅ Calcul terminé" : "⚠️ Aucun engrenage trouvé";

        btn.innerText = "🔍 Rechercher";
        btn.classList.remove("running");
        btn.disabled = false;
    }, 2000);
}
