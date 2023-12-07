import {updateBird, setupBird, getBirdRect} from './bird.js'
import { updatePipes, setupPipes, getPassedPipescount, getPipeRects } from './pipe.js'

console.log(updateBird)

document.addEventListener("keypress", handleStart, {once: true}) // logs the key press to start the game
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")


let lastTime
function updateLoop(time)  {
  if (lastTime == null ) { //the first update of the page is always NaN so this prevents that one
    lastTime = time
    window.requestAnimationFrame(updateLoop) 
    return 
  }
  const delta = time - lastTime // this makes sure we move according to how long it's been since the last frame (so the bird moves just as fast if the computer slows down)
  updateBird(delta)
  updatePipes(delta)
  if (checkLose()) return handleLose()
  lastTime = time
  window.requestAnimationFrame(updateLoop) //this updates every frame
}

function checkLose() {
  const birdRect = getBirdRect()
  const insidePipe = getPipeRects().some(rect => isCollision(birdRect, rect)) // checks if a pipe and a bird are colliding
  const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight
  return outsideWorld || insidePipe
}

function isCollision(rect1, rect2 ) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top //this is used to calc collision
  )
}

function handleStart() {
  title.classList.add("hide")
  setupBird()
  setupPipes()
  lastTime = null; // this stops the bird from shooting off the bottom of the screen and losing automatically on any restart
  window.requestAnimationFrame(updateLoop)
}

function handleLose() {
  setTimeout(() => {
    title.classList.remove("hide")
    subtitle.classList.remove("hide")
    subtitle.textContent = `${getPassedPipescount()} Pipes`
    document.addEventListener("keypress", handleStart, { once: true })
  }, 100)
}