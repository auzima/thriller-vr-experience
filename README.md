<h1 align="center">🧟 Thriller VR Experience</h1>

> An immersive virtual reality escape game inspired by the iconic "Thriller" aesthetic, built with A-Frame, Vue and Vite.

<p align="center">
  <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/A%E2%80%93Frame-brightgreen?style=for-the-badge&labelColor=%23ef2d5e&color=%23ef2d5e" alt="A-Frame" />
  <img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Threejs" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

### https://github.com/auzima/thriller-vr-experience

## Gameplay features

* **Zombie AI traqueur** : Un système de pathfinding où les zombies pourchassent le joueur.
* **Système d'infection** : Interaction avec les ennemis modifiant l'état du joueur.
* **Énigmes et objets cachés** : Récupération d'objets iconiques (veste rouge, bague de promesse) pour débloquer de nouvelles zones.
* **Collisions personnalisées** : Murs invisibles et zones restreintes gérés par scripts (Cinéma, zones sécurisées).

---

## Included in the project

### Libs and components
* [aframe-extras](https://github.com/c-frame/aframe-extras) (MIT License)
* [aframe physx](https://github.com/c-frame/physx) (MIT License)
* [aframe-blink-controls](https://github.com/jure/aframe-blink-controls) (MIT License)
* Custom scripts : `zombie-chase.js`, `player-boundary.js`, `give-to-cashier.js`

### Movement modes support
* **Desktop** – Keyboard for move (*WASD* or Arrows keys) + Mouse for look control (Drag and drop)
* **Mobile** – 1x Finger touch to go forward + 2x Fingers touch to go backward + Gaze cursor for click
* **VR/AR** – Walk + Teleport (Grip for grab and laser for click) + Gaze cursor for click in AR

### 3D Models & assets
* **Zombies Animations** – [Mixamo Thriller Pack](https://www.mixamo.com/) is licensed under Mixamo Standard License.
* **Thriller's Cinema Palace** – [Model](https://sketchfab.com/3d-models/thrillers-cinema-palace-5ed7659b2eb34c0685f48814f9a73e43) by Sketchfab Community is licensed under CC BY 4.0.
* **Dark Forest** – [Model](https://sketchfab.com/3d-models/forest-9153c2b370934758bf14c395abe36b27) by Sketchfab Community is licensed under CC BY 4.0.
* **Michael Jackson's Jacket** – [Model](https://sketchfab.com/3d-models/michael--jackson-thriller-1b7a80272bb0428e95af5a9470178aeb) by Sketchfab Community is licensed under CC BY 4.0 *(Modified in Blender)*.
* **Golden Ring** – [Model](https://sketchfab.com/3d-models/golden-ring-67ccb642dc7847dd9a7e45c69046946e) by Sketchfab Community is licensed under CC BY 4.0.
* **Night Sky** – [The Moon](https://sketchfab.com/3d-models/the-moon-9916fcec59f04b07b3e8d7f077dc3ded) and [Stars](https://sketchfab.com/3d-models/extracted-minecraft-java-editions-stars-c8868b7ffc4a473eb5cd9203a59e3650) are licensed under CC BY 4.0.

---

## Quickstart

### Clone the repository
```sh
git clone [https://github.com/auzima/thriller-vr-experience.git](https://github.com/auzima/thriller-vr-experience.git)
cd thriller-vr-experience
`npm ci`
`npm run dev`
`npm run build`