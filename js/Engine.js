class Engine {
  static async rechercherEngrenages(
    dentMenanteMin,
    dentMenanteMax,
    dentMeneeMin,
    dentMeneeMax,
    rapportCible,
    maxEtages,
    precisionToleree,
    maxSolutions,
    maxIterations,
    dentMenanteFixe,
    dentMeneeFixe
  ) {
    let solutions = [];
    let compteurIterations = 0;
    const LOG_FREQUENCY = 1000; // Affichage d'un log tous les 1000 itérations

    // Fonction récursive asynchrone pour explorer les combinaisons
    async function rechercher(chaine, profondeur, rapportActuel, etageLimite) {
      if (compteurIterations > maxIterations) {
        UI.ajouterLog("Limite d'itérations atteinte. Arrêt de la recherche.");
        return;
      }
      compteurIterations++;

      if (compteurIterations % LOG_FREQUENCY === 0) {
        UI.ajouterLog(
          `Itération: ${compteurIterations}, profondeur: ${profondeur}, rapportActuel: ${rapportActuel.toFixed(3)}`
        );
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      // Si la profondeur maximale (nombre de paires) est atteinte, évaluer la solution
      if (profondeur === etageLimite) {
        const ecartPourcentage = Math.abs((rapportActuel - rapportCible) / rapportCible) * 100;
        if (ecartPourcentage <= precisionToleree) {
          solutions.push(chaine);
          UI.ajouterLog(
            `Solution trouvée: [${chaine.map(pair => `[${pair[0]}, ${pair[1]}]`).join(" ")}] avec rapport: ${rapportActuel.toFixed(2)} (écart: ${ecartPourcentage.toFixed(2)}%)`
          );
        }
        return;
      }

      // Pour le premier engrenage, si une valeur fixe est renseignée, on la prend uniquement au premier niveau
      let A_start = dentMenanteMin;
      let A_end = dentMenanteMax;
      if (profondeur === 0 && dentMenanteFixe != null) {
        A_start = dentMenanteFixe;
        A_end = dentMenanteFixe;
      }

      for (let A = A_start; A <= A_end; A++) {
        for (let B = dentMeneeMin; B <= dentMeneeMax; B++) {
          if (B <= A) continue;
          // Pour le dernier engrenage de la chaîne, si une valeur fixe est renseignée, l'utiliser
          if (profondeur === etageLimite - 1 && dentMeneeFixe != null) {
            B = dentMeneeFixe;
          }
          const rapport = B / A;
          const nouveauRapport = rapportActuel * rapport;
          if (nouveauRapport > rapportCible) continue;
          let nouvelleChaine = [...chaine, [A, B]];
          await rechercher(nouvelleChaine, profondeur + 1, nouveauRapport, etageLimite);
          // Si B était fixé, on ne doit pas itérer plus loin dans cette boucle
          if (profondeur === etageLimite - 1 && dentMeneeFixe != null) break;
        }
      }
    }

    // Recherche progressive par nombre d'étages
    for (let etageLimite = 1; etageLimite <= maxEtages; etageLimite++) {
      solutions = []; // Réinitialiser pour ce niveau
      UI.ajouterLog(`Démarrage de la recherche pour ${etageLimite} étage(s)...`);
      await rechercher([], 0, 1, etageLimite);
      if (solutions.length > 0) {
        UI.ajouterLog(`Solutions trouvées avec ${etageLimite} étage(s). Arrêt de la recherche.`);
        break;
      } else {
        UI.ajouterLog(`Aucune solution trouvée pour ${etageLimite} étage(s).`);
      }
    }

    UI.ajouterLog(`Total d'itérations: ${compteurIterations}.`);

    // Tri des solutions par proximité du rapport cible
    solutions.sort((a, b) => {
      let rapportA = a.reduce((acc, [m, n]) => acc * (n / m), 1);
      let rapportB = b.reduce((acc, [m, n]) => acc * (n / m), 1);
      return Math.abs(rapportA - rapportCible) - Math.abs(rapportB - rapportCible);
    });

    return solutions.slice(0, maxSolutions);
  }
}
