# RETEX — Premiers lots du projet

**Type :** retour d'expérience de pilotage  
**Statut :** principe retenu pour les prochains lots  
**Date :** 2026-10-31

## 1. Principe à retenir : First Principles Thinking

Appliquer systématiquement l'approche **First Principles Thinking** (*raisonnement à partir des premiers principes*) avant de concevoir une solution ou de reprendre une pratique existante.

Le principe consiste à décomposer le problème jusqu'aux faits, contraintes et besoins fondamentaux qui le constituent, puis à reconstruire une solution adaptée. Il ne s'agit pas de reproduire par défaut une architecture, une méthode ou un modèle connu au seul motif qu'il est courant ou qu'il a déjà été utilisé.

## 2. Application au projet Anno 117 Planner

Pour le catalogue de données, cette approche conduit notamment à distinguer :

1. **Le besoin utilisateur** : connaître les bâtiments nécessaires pour satisfaire les besoins d'une population donnée.
2. **Le modèle théorique** : représenter les paliers de population, les besoins, les biens ou services qui peuvent les satisfaire et les chaînes de bâtiments associées.
3. **Les paramètres de dimensionnement** : rendement nominal, cadence, quantité par cycle et consommation théorique.
4. **Les paramètres réels** : rendement effectivement obtenu dans une partie, dépendant par exemple des conditions d'implantation ou d'exploitation.
5. **La validation** : confronter progressivement le modèle aux observations en jeu et qualifier les écarts.

Cette séparation permet de fournir rapidement une aide au dimensionnement théorique, sans attendre de connaître tous les rendements réels. Les rendements mesurés pourront ensuite affiner les calculs pendant la phase de validation.

## 3. Conséquences sur le pilotage et la conception

- Partir du problème et des résultats attendus, pas d'une solution technique présupposée.
- Séparer les faits établis, les hypothèses, les paramètres théoriques et les mesures réelles.
- Identifier les inconnues qui bloquent réellement une fonctionnalité et celles qui peuvent être traitées dans une phase ultérieure.
- Concevoir des incréments utiles et vérifiables, plutôt que rechercher une complétude théorique préalable.
- Tracer les hypothèses et les décisions qui structurent le modèle.
- Réexaminer régulièrement les choix à la lumière des observations et des retours d'utilisation.

## 4. Règle de travail pour les prochains lots

Chaque lot devra expliciter :
- le problème utilisateur traité ;
- les faits et contraintes de départ ;
- les hypothèses restantes ;
- le résultat fonctionnel minimal attendu ;
- les critères d'acceptation ;
- les validations nécessaires, en distinguant tests logiciels et observations en jeu.

**À retenir :** construire d'abord le modèle théorique utile au joueur ; intégrer et qualifier ensuite les rendements réels pour améliorer la précision du dimensionnement.
