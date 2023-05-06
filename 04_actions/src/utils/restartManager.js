import sceneManager from './sceneManager';

let isGameOver = false;
let scene;

// pause를 해주는 함수입니다.
export function gameOver(_scene) {
  isGameOver = true;
  scene = _scene;
}

// restart 하는 event listener입니다.
document.addEventListener('keydown', (event) => {
  if (!isGameOver) {
    return;
  }
  if (event.key !== 'Enter') {
    return;
  }
  sceneManager.restartGame(scene);
  isGameOver = false;
});
