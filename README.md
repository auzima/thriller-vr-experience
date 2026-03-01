# 🧟‍♂️ Thriller VR Experience

Un mini-jeu en Réalité Virtuelle basé sur l'univers du célèbre clip *Thriller* de Michael Jackson. Développé avec **A-Frame**, **Vue.js** et **Vite**.

## 🎮 Gameplay
- **Immersion WebXR** : Jouable directement dans le navigateur avec un casque VR (Meta Quest, etc.).
- **Zombie Traqueur AI** : Un zombie intelligent sort du sol et poursuit le joueur.
- **Système d'Infection** : Si le zombie touche le joueur, les mains VR de ce dernier se transforment en mains de zombie !
- **Gestion des Collisions** : Un système de "murs invisibles" empêche le joueur et les ennemis de traverser les décors (Cinéma).

## 🛠️ Technologies Utilisées
- [A-Frame](https://aframe.io/) (Framework WebVR)
- [Vue.js 3](https://vuejs.org/) & [Vite](https://vitejs.dev/)
- Modèles 3D animés (glTF/glb) via Mixamo et Blender
- Scripts de composants A-Frame personnalisés en JavaScript

## 🚀 Comment lancer le projet en local
1. Cloner le repo : `git clone https://github.com/TON-PSEUDO/TON-REPO.git`
2. Installer les dépendances : `npm install`
3. Lancer le serveur local : `npm run dev`
4. Ouvrir l'adresse locale (ex: `localhost:5173`) dans un navigateur compatible WebXR.
