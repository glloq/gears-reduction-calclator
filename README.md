# Calculateur d'Engrenages – Rapport de Réduction

Ce projet est une application web permettant de rechercher des combinaisons d'engrenages afin d'obtenir un rapport de réduction cible. 
![schema principe](https://github.com/glloq/gears-reduction-calculator/blob/main/exemple%20interface.png)


L'utilisateur peut définir les paramètres de calcul via une interface comprenant des sliders et des champs de saisie pour spécifier : 
- les plages de dents
- le nombre de résultats à afficher
- le nombre maximal d'étages
- des options fixes pour le premier et le dernier engrenage.
- Le module des engrenages peut également être renseigné pour afficher dynamiquement l'entraxe dans un schéma interactif dessiné sur un canvas qui s'adapte à la largeur disponible.

## Fonctionnalités

### Recherche d'engrenages : 
    
- Recherche récursive des combinaisons permettant d'obtenir le rapport de réduction souhaité, avec contrôle de la tolérance.
- Interface utilisateur interactive : Paramétrage via des sliders et des champs de saisie pour définir les plages de dents et autres options.  
- Affichage schématique : Génération d'un schéma dynamique représentant les engrenages et l'entraxe calculé, avec adaptation de la largeur des axes en fonction du nombre de dents.
- Logs de suivi : Affichage d'une zone de logs pour suivre l'avancement des calculs et obtenir des informations détaillées sur le processus de recherche.
