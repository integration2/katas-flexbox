# Katas Flexbox

Une série d'exercices pour vous familiariser avec Flexbox. Le guide visuel **`katas-flexbox-guide-visuel.pdf`** contient les consignes détaillées et des exemples de rendu attendu.

## Consignes de travail

**Point important :** Résolvez **un seul exercice à la fois**, puis faites un **commit séparé** pour chacun. L'idée est d'avoir un historique lisible, où chaque commit correspond à un exercice résolu.

```
Exemple de workflow :
1. Résoudre l'exercice A1
2. git add katas.css
3. git commit -m "Résolution exercice A1"
4. Résoudre l'exercice A2
5. git add katas.css
6. git commit -m "Résolution exercice A2"
... et ainsi de suite pour chaque exercice
```

---

## A. Les alignements

### Exercice A1
Avec `justify-content`, alignez les trois items à droite.

### Exercice A2
Avec `flex-direction`, alignez les trois items à droite, mais dans l'ordre inverse.

### Exercice A3
Utilisez `justify-content` pour répartir les items uniformément sur la ligne, en collant le premier et le dernier contre les bords du conteneur.

### Exercice A4
Même principe que A3, mais cette fois **sans** coller le premier et le dernier item aux bords.

### Exercice A5
Par défaut, `flex-wrap` est sur `no-wrap` et `align-items` sur `stretch`. Modifiez ces propriétés et jouez avec `justify-content` pour obtenir deux rangées d'items bien répartis.

Sur les items : utilisez `flex-basis` pour une largeur de 80 px et ajoutez une petite marge.

### Exercice A6
Reprenez les règles de l'exercice précédent et ajoutez `align-content` pour que les deux rangées s'alignent en haut.

### Exercice A7
Toujours sur la base de l'exercice précédent : réglez `align-content` pour que la première rangée soit en haut et la seconde en bas.

---

## B. Les marges

### Exercice B1
Placez le premier item tout seul à gauche avec un `margin-right`.

### Exercice B2
Centrez les items flex à l'aide de `justify-content` et `align-items`.

### Exercice B3
Centrez l'unique item flex en utilisant les marges automatiques.

---

## C. Le dimensionnement des items flex

### Exercice C1 – flex-basis
`flex-grow` est à 0 (pas d'expansion) et `flex-shrink` à 1 (compression possible). Modifiez `flex-basis` pour que les boîtes n'aient pas de largeur initiale et occupent uniquement leur largeur minimum. La valeur 0 donne ce résultat.

### Exercice C2 – flex-basis
Avec `flex-basis` à 0, les boîtes n'ont plus de largeur de départ. Ajustez `flex-grow` pour qu'elles puissent s'agrandir de façon égale dans le conteneur.

### Exercice C3 – flex-basis
`flex-grow` reste à 0. Modifiez `flex-basis` pour que l'espace soit distribué en tenant compte de la taille du contenu de chaque item.

### Exercice C4 – flex-shrink
`flex-grow` à 0, `flex-basis` à `auto` : chaque item prend la taille max de son contenu. Désactivez la compression (`flex-shrink`) pour voir les items déborder du conteneur.

### Exercice C5 – flex-shrink et flex-basis
Ajustez `flex-grow` et `flex-basis` pour que chaque item ne prenne que la taille minimum de son contenu.

### Exercice C6 – width versus flex-basis
Ajoutez un `width` ou un `max-width` pour que chaque boîte fasse un tiers de la largeur.

### Exercice C7 – flex-grow
Modifiez `flex-grow` pour que la boîte avec la classe `deux` essaie d'occuper deux fois plus d'espace que les deux autres.

### Exercice C8 – flex-grow
Comme C7, mais ajoutez cette fois un `min-width` sur tous les items pour que la proportion 2× soit réellement respectée.

---

## D. Les alignements (suite)

### Exercice D1
Le premier et le troisième item doivent être en haut à gauche. Le deuxième doit se retrouver en bas à droite.

### Exercice D2
Complétez les règles CSS pour obtenir une mise en page classique (header, aside 1, aside 2, main, footer).

---

## Fichiers du projet

- **`index.html`** : structure HTML et énoncés des exercices
- **`katas.css`** : fichier où écrire vos solutions CSS
- **`katas-flexbox-guide-visuel.pdf`** : guide visuel des rendus attendus
- **`tests/`** : tests d’auto-évaluation (A/, B/, C/, D/ par section)
- **`.github/classroom/autograding.json`** : configuration des tests pour GitHub Classroom

Ouvrez `index.html` dans un navigateur pour voir vos résultats au fur et à mesure.

## Vérifier vos solutions

Vous pouvez lancer les tests automatiques localement avant de pousser votre code :

```bash
npm install
npx playwright install chromium
npm test
```

Pour tester un seul exercice : `npm run test:single -- A1` (remplacez A1 par l’ID de l’exercice).

Les tests s'exécutent aussi automatiquement à chaque push sur GitHub (via GitHub Classroom).
