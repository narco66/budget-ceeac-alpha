# Contribuer à GESBUDEP

1. Lire le cahier des charges v5.0 avant d’ajouter une règle métier. En cas de divergence, l’ordre est : cahier et procédures, référentiels CEEAC, maquette Figma.
2. Ne pas coder une règle financière uniquement dans l’interface.
3. Les montants sont des entiers XAF. Pas de flottant.
4. Toute transition de dossier doit être autorisée, audité et couverte par un test.
5. Ne pas lancer `migrate:fresh` sur une base qui contient des données institutionnelles.
6. Les questions non tranchées vont dans `docs/generated/OPEN_QUESTIONS.md`, avec la décision provisoire.
7. Mettre à jour `docs/generated/IMPLEMENTATION_STATUS.md` à la fin d’une phase.
