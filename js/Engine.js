class Engine {
    static rechercherEngrenages(dentMenanteMin, dentMenanteMax, dentMeneeMin, dentMeneeMax, rapportCible, maxEtages, precisionToleree, maxSolutions) {
        let solutions = [];
        let compteurIterations = 0;
        const MAX_ITERATIONS = 1 000 000; // Protection anti-boucle infinie
        const LOG_FREQUENCY = 1000;   // Fréquence d'affichage des logs

        // Fonction récursive pour rechercher les solutions
        function rechercher(chaine, profondeur, rapportActuel, etageLimite) {
            if (compteurIterations > MAX_ITERATIONS) {
                UI.ajouterLog("Limite d'itérations atteinte. Arrêt de la recherche.");
                return;
            }
            compteurIterations++;

            // Log périodique
            if (compteurIterations % LOG_FREQUENCY === 0) {
                UI.ajouterLog(`Itération: ${compteurIterations}, profondeur: ${profondeur}, rapportActuel: ${rapportActuel.toFixed(3)}`);
            }

            // Si on atteint la profondeur désirée, évaluer la solution
            if (profondeur === etageLimite) {
                const ecartPourcentage = Math.abs((rapportActuel - rapportCible) / rapportCible) * 100;
                if (ecartPourcentage <= precisionToleree) {
                    solutions.push(chaine);
                    UI.ajouterLog(`Solution trouvée: [${chaine.map(pair => `[${pair[0]}, ${pair[1]}]`).join(", ")}] avec rapport: ${rapportActuel.toFixed(2)} (écart: ${ecartPourcentage.toFixed(2)}%)`);
                }
                return;
            }

            // Parcours de la plage des engrenages
            for (let A = dentMenanteMin; A <= dentMenanteMax; A++) {
                for (let B = dentMeneeMin; B <= dentMeneeMax; B++) {
                    if (B <= A) continue; // Assurer un rapport > 1

                    const rapport = B / A;
                    const nouveauRapport = rapportActuel * rapport;
                    if (nouveauRapport > rapportCible) continue; // Éviter de dépasser la cible

                    let nouvelleChaine = [...chaine, [A, B]];
                    rechercher(nouvelleChaine, profondeur + 1, nouveauRapport, etageLimite);
                }
            }
        }

        // Recherche progressive par nombre d'étages
        for (let etageLimite = 1; etageLimite <= maxEtages; etageLimite++) {
            solutions = []; // Réinitialiser pour chaque niveau
            UI.ajouterLog(`Démarrage de la recherche pour ${etageLimite} étage(s)...`);
            rechercher([], 0, 1, etageLimite);
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
