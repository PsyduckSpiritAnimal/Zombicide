const WALKING_SPEED = 5
const paletteColors = [

  {
      r: 120,
      g: 5,
      b: 5
  },
  {
    r: 251,
    g: 242,
    b: 54
  },
  // green [1]
  {
    r: 99,
    g: 99,
    b: 99
  },
  // red [2]
  {
      r: 232,
      g: 150,
      b: 9
  },
  // purple [3]
  {
      r: 232,
      g: 46,
      b: 9
  }
  // gold [4]

]

let gamestate = "start" //
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let w = windowWidth / 20
let h = windowHeight / 20
let leftClick = false
let rightClick = false
let player, playerImg, skull, tree,borderImg, borderImg2
let zombieImg, runnerImg, samuraiImg, trashImg, bigImg
let left = false
let right = false
let front = false
let back = false
let enemies = []
let count = 0
let offsetX = 0
let offsetY = 0
let projectiles = []
let structures = []
let difficulty = 2
let special = -1
let house, houseImg
let weapon = "bow"
let charge = 0
let arrow, heartsImg, coinsImg
let robot = []
let playerHealth = 20
let maxHealth = 20
let textCounter = 100
let coins = 0
let graves = []
let xCorner = windowWidth/2 - offsetX - 1500
let yCorner = windowHeight/2 - offsetY - 1000
let graveImg, treeGuy, greenImg, stoneImg, bow, tribow, machinebow, spear, tFrame, sFrame, flamethrower
let response = false
let rows, cols, gamemap, activeSlot,fire
let damage = 0
let blocks = []
let walls = []
let items = []
let storeItems = []
let processCount = 0
let shop = false
let reference = 0
let zombieSkins = []
let enemyCount = 0
let kills = 0
let dead = false
let particles = []
let cooldown = 0

function preload() {
  playerImg = loadImage('graphics/temp.png')

  zombieImg = loadImage('graphics/main.png')
  runnerImg = loadImage('graphics/runner.png')
  samuraiImg = loadImage('graphics/samurai.png')
  trashImg = loadImage('graphics/trash.png')
  bigImg = loadImage('graphics/big.png')
  zombieSkins = [zombieImg, runnerImg, samuraiImg, trashImg, bigImg]
  tFrame = loadImage('graphics/topFrame.png')
  sFrame = loadImage('graphics/sideFrame.png')
  houseImg = loadImage('graphics/house2.png')
  arrow = loadImage('graphics/arrow.png')
  skull = loadImage('graphics/red-skull.png')
  tree = loadImage('graphics/tree.png')
  coinsImg = loadImage('graphics/coins-512.png')
  graveImg = loadImage('graphics/grave.png')
  treeGuyImg = loadImage('graphics/tree-monster.png')
  borderImg = loadImage('graphics/borderedge.png')
  borderImg2 = loadImage('graphics/borderedge2.png')
  greenImg = loadImage('graphics/green.png')
  stoneImg = loadImage('graphics/stone.png')
  fire = loadImage('graphics/fire.png')

  bow = loadImage('graphics/items/bow.png')
  machinebow = loadImage('graphics/items/machinebow.png')
  tribow = loadImage('graphics/items/tribow.png')
  spear = loadImage('graphics/items/spear1.png')
  flamethrower = loadImage('graphics/items/flamer.png')

  robot.push(loadImage('graphics/robot/robot-right.png'))
  robot.push(loadImage('graphics/robot/robot-left.png'))
  robot.push(loadImage('graphics/robot/robot-front.png'))
  robot.push(loadImage('graphics/robot/robot-back.png'))

  gamemap = loadTable('graphics/maps/gamemap.csv')
}

function setup() {
    createCanvas(windowWidth,windowHeight)
    init()
    frameRate(60)
    //noSmooth()
}

function draw() {
  stroke(0)
  resizeCanvas(windowWidth, windowHeight)
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
    if (gamestate == "start") {
        start()
    }
    else if (gamestate == "play") {
        play()
    }
    fill(255)
    textSize(50)
    //text(projectiles.length, windowWidth/2, 100)
}

function start() {
  textStyle(BOLD)
  background(150, 25, 0)
  fill(255)
  rectMode(CENTER)
  rect(windowWidth/2, windowHeight/2, 300, 100)

  if (checkCursor(windowWidth/2 - 150, windowWidth/2 + 150, windowHeight/2 - 50, windowHeight/2 + 50)) {
      if (leftClick == true) {
        gamestate = "play"
      }
      else {
        fill(255,0,0)
        rect(windowWidth/2, windowHeight/2, 300, 100)
    }
  }
  textAlign(CENTER)
  fill(0)
  textSize(50)
  text("BEGIN", windowWidth/2,windowHeight/2 + 15)

  fill(200)
  textSize(100)
  text("ZOMBICIDE", windowWidth/2, 302)
  fill(255)
  text("ZOMBICIDE", windowWidth/2, 298)
  textStyle(NORMAL)



  let w = sFrame.width
  let h = sFrame.height
  for (let x = 0; x < windowHeight; x += h) {
    image(sFrame,0,x,w,h)
    image(sFrame,windowWidth - 50,x,w,h)
  }
  w = tFrame.width
  h = tFrame.height
  for (let y = 0; y < windowWidth; y += w) {
    image(tFrame,y,0,w,h)
    image(tFrame,y,windowHeight - 50,w,h)
  }

}

function play() {
  let xCorner = windowWidth/2 - offsetX - 1500
  let yCorner = windowHeight/2 - offsetY - 1000

  if (cooldown > 0) {
    cooldown--
  }
  else {
    damage = 0
  }

    buildWorld()

    for (let block of blocks) {
      block.display()
    }
    for (let grave of graves) {
      image(graveImg, xCorner + grave.x, yCorner + grave.y, 100, 100)
    }
    for (let structure of structures) {
      structure.display()
    }
    for (let zombie of enemies) {
      zombie.display()
      zombie.update()

    }

    if (!check(player)) {
      player.update()
    }
    for (let i of projectiles) {
      i.update()
    }
    setDirection()
    player.display()
    for (let particle of particles) {
      particle.show()
      particle.update()
      stroke(0)
    }
    if (status()) {
      if (response == true) {
        response = false
        difficulty++
        enemyCount = parseInt(Math.pow(1.5, difficulty))
        if (random(1) > 0.5) {
          special = parseInt(random(4))
        }
        else {
          special = -1
        }

        //summon()
        playerHealth = 20
        textCounter = 100
      }
      else {
        //between waves
        textAlign(CENTER)
        fill(255,0,0)
        textSize(50)
        text("Press Enter To Start Next Wave",windowWidth / 2, 150)
      }
    }
    health()
    hit()
    waves()
    displayEnemies()
    if (textCounter > 0) {
      waveNumber()
    }

    //near house
    if (distance(player.x, player.y, windowWidth/2 - offsetX, windowHeight/2 - offsetY) < 200) {
      if (!shop) {
        if (popUp("SHOP", 20, 0, (255), 120, color(255,0,0), windowWidth/2, windowHeight - 200, 200, 70)) {
          shop = true
          leftClick = false
        }
      }
    }
    else {
      shop = false
    }
    inventory()
    if (shop == true) {
      storeInterface()
    }
    else {
      cursor()
    }
    reference++
    if (leftClick == true) {
      weaponActive()
    }
    fill(255)
    //circle(player.x + 20, player.y + 30, 10)
}

function waves() {
  if (reference % parseInt(100 * Math.pow(.9,difficulty)) == 0) {
    if (enemyCount > 0) {
      enemyCount--
      if (special > -1) {
        summon(special)
      }
      else {
        summon(parseInt(random(4)))
      }
      if (difficulty > 5 && random(1) > .5) {
        waves()
      }
    }
  }
}

function storeInterface() {
  fill(80,80,80,195)
  rectMode(CORNER)
  rect(100, 100, window.innerWidth - 200, window.innerHeight - 200)

  fill(140)
  rect(100, 100, window.innerWidth - 200, 75)
  fill(255)
  textAlign(CENTER)
  textSize(50)
  text("STORE", window.innerWidth/2, 150)
  let x = 130
  let y = 200
  let z
  for (let i of storeItems) {
    if (checkCursor(i.x + 200, i.x + 200 + i.width - 220, i.y + 95, i.y + 175) == true) {
      i.hovered = true
      z = i
      if (leftClick) {
        i.purchase()
      }
    }
    else {
      i.hovered = false
    }
    i.display(x,y)

    x += (window.innerWidth - 300) / 3 + 40
    if (x > (window.innerWidth - 300)) {
      x = 130
      y += 250
    }
  }


}

function popUp(message, textS, textColor, color1, color2, color3, x, y, w, h) {
  rectMode(CENTER)
  fill(color1)
  if (checkCursor(x - w / 2, x + w / 2, y - h / 2, y + h / 2)) {
    if (leftClick) {
      leftClick == false
      fill(color3)
      rect(x,y,w,h)
      textAlign(CENTER)
      textSize(textS)
      fill(textColor)
      text(message, x, y + 5)
      return true
    }
    fill(color2)
  }
  rect(x,y,w,h)
  textAlign(CENTER)
  textSize(textS)
  fill(textColor)
  text(message, x, y + 5)
}


function distance(x1, y1, x2, y2) {
  return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))
}


function mousePressed() {
    if (mouseButton == LEFT) {
      leftClick = true
    }
    else if (mouseButton == RIGHT) {
      rightClick = true
    }
}


function mouseReleased() {
    leftClick = false
    rightClick = false
    let px = player.x + 20
      let py = player.y + 30
      let slopeX = mouseX - px
      let slopeY = mouseY - py
      let dist = distance(mouseX, mouseY, px, py)

      if (weapon == 'bow' && charge >= 15) {
        let ball = new Projectile(player.x + 20 + 2 * (slopeX / dist * 20), player.y + 30 + 2 * (slopeY / dist * 20), slopeX / dist * 20, slopeY / dist * 20, arrow, slopeX, slopeY, 3)
        projectiles.push(ball)
        charge = 0
      }
      if (weapon == 'tribow' && charge >= 15) {
        for (let i = -1; i < 2; i++) {
          let ball = new Projectile(player.x + 20 + (i * 10) + 3 * (slopeX / dist * 20), player.y + 30 + (i * 10) + 3 * (slopeY / dist * 20), slopeX / dist * 20 + (3 * i), slopeY / dist * 20 + (3 * i), arrow, slopeX, slopeY, 2)
          projectiles.push(ball)
        }
        charge = 0
      }

}

function weapons() {
  storeItems = []

  storeItems.push(new storeItem("machinebow", machinebow, 200, 0, "Shred your enemies with the automatic machinebow!"))
  storeItems.push(new storeItem("tribow", tribow, 500, 15, "Not sure how you would shoot this thing but I guess 3 arrows is better than 1."))
  storeItems.push(new storeItem("spear", spear, 750, 30, "I mean it's a spear. It gets the job done."))
  storeItems.push(new storeItem("flamethrower", flamethrower, 950, 0, "Burn them all..."))

  for (let i = 0; i < 2; i++) {
    storeItems.push(new storeItem("bow", bow, 50, 15))
  }
}

function weaponActive() {
  let px = player.x + 40
  let py = player.y + 40
  let slopeX = mouseX - px
  let slopeY = mouseY - py
  let dist = distance(mouseX, mouseY, px, py)
  if (weapon == 'machinebow') {
    if (reference % 10 == 0) {
        let ball = new Projectile(player.x + 40 + 3 * (slopeX / dist * 20), player.y + 40 + 3 * (slopeY / dist * 20), slopeX / dist * 20, slopeY / dist * 20, arrow, slopeX, slopeY, 1)
        projectiles.push(ball)
    }
  }
  else if (weapon == 'flamethrower') {
    if (reference % 10 == 0) {
      let ball = new Projectile(player.x + 40 + 3 * (slopeX / dist * 20), player.y + 40 + 3 * (slopeY / dist * 20), slopeX / dist * 10, slopeY / dist * 15, fire, slopeX, slopeY, 1)
      projectiles.push(ball)
    }
    if (reference % 12 == 0) {
      let ball = new Projectile(player.x + 40 + 3 * (slopeX / dist * 20), player.y + 40 + 3 * (slopeY / dist * 20), slopeX / dist * 10 + 3, slopeY / dist * 15 + 3, fire, slopeX, slopeY, 1)
      projectiles.push(ball)
      ball = new Projectile(player.x + 40 + 3 * (slopeX / dist * 20), player.y + 40 + 3 * (slopeY / dist * 20), slopeX / dist * 10 - 3, slopeY / dist * 15 - 3, fire, slopeX, slopeY, 1)
      projectiles.push(ball)
    }
  }
  else if (weapon == 'spear') {
    if (charge >= 30 && leftClick == true) {
      leftClick = false
      charge = 0
      let ball = new Projectile(player.x + 40 + 3 * (slopeX / dist * 20), player.y + 40 + 3 * (slopeY / dist * 20), slopeX / dist * 30, slopeY / dist * 30, spear, slopeX, slopeY, 10)
      projectiles.push(ball)
    }
  }
}

function checkCursor(x1, x2, y1, y2) {
    if (mouseX < x1) {
        return false
    }
    if (mouseX > x2) {
        return false
    }
    if (mouseY < y1) {
        return false
    }
    if (mouseY > y2) {
        return false
    }
    return true
}


function init() {
  //used once upon pressing play
  shop = false
  coins = 0
  difficulty = 2
  damage = 0
  playerHealth = 20
  offsetX = 0
  offsetY = 0
  structures = []
  enemies = []
  projectiles = []
  items = []
  weapons()

    player = new Player(windowWidth/2,windowHeight/2, robot)
    let type = -1

    for (let i = 0; i <  Math.pow(1.5, difficulty); i++) {
      summon(0)

    }
    let house = new Structure(windowWidth/2 - 200,windowHeight/2 - 400, houseImg, 400, 400)
    structures.push(house)
    activeSlot = 0
    for (let i = 0; i < 9; i++) {
      let slot = new item(i)
      items.push(slot)
    }
    items[0].img = bow
    items[0].name = "bow"
    items[0].charge = 15

}


function summon(type) {
  let r = (parseInt(random(4) + 1))
  let zombie
  let ww = window.innerWidth / 2
  let wh = window.innerHeight / 2
  let x
  let y
  if (r == 1) {
    x = ww - 1500
    y = wh + random(-1000,1000)
  }
  else if (r == 2) {
    x = ww + 1500
    y = wh + random(-1000,1000)
  }
  else if (r == 3) {
    x = ww + random(-1500, 1500)
    y = wh + 1000
  }
  else {
    x = ww + random(-1500, 1500)
    y = wh - 1000
  }
  zombie = new Enemy(x, y, type, 80, 80, 40, 60, 80)

  if (!check(zombie)) {
    processCount = 0
    enemies.push(zombie)
  }
  else if (processCount < 8) {
    processCount++
    summon(type)
  }
}

function buildWorld() {
  background(8, 73, 4)
  rectMode(CENTER)
  fill(46, 84, 29)
  rect(windowWidth/2 - offsetX, windowHeight/2 - offsetY, 3000, 2000)

  fill(79, 79, 79)
  rect(windowWidth/2 - offsetX, windowHeight/2 - offsetY, 500, 500)
  fill(59, 59, 59)
  rect(windowWidth/2 - offsetX, windowHeight/2 - offsetY, 450, 450)

  image(borderImg, windowWidth/2 - offsetX - 1850, windowHeight/2 - offsetY - 1000, 3700, 2000)

  if (reference % 30 == 0) {
    explode(windowWidth/2 - offsetX + 70,windowHeight/2 - offsetY - 370,2)

  }
  if (reference % 33 == 0) {
    explode(windowWidth/2 - offsetX + 70 + random(-20,20),windowHeight/2 - offsetY - 390,2)
    explode(windowWidth/2 - offsetX + 70 + random(-20,20),windowHeight/2 - offsetY - 390,2)
  }
  if (reference % 38 == 0) {
    explode(windowWidth/2 - offsetX + 70 + random(-25,25),windowHeight/2 - offsetY - 420,2)
    explode(windowWidth/2 - offsetX + 70 + random(-25,25),windowHeight/2 - offsetY - 420,2)
    explode(windowWidth/2 - offsetX + 70 + random(-25,25),windowHeight/2 - offsetY - 420,2)
  }
}

function textBox(content) {
  noCursor()
  fill(20)
  rect(mouseX,mouseY,content.length * 8, 30)
  fill(255)
  textAlign(LEFT)
  textSize(20)
  text(content,mouseX + 5,mouseY + 20)
}

function keyPressed() {
    if (keyCode == 27 && shop == true) {
      shop = false
    }
    if (keyCode == 49) {
      activeSlot = 0
    }
    if (keyCode == 50) {
      activeSlot = 1
    }
    if (keyCode == 51) {
      activeSlot = 2
    }
    if (keyCode == 52) {
      activeSlot = 3
    }
    if (keyCode == 53) {
      activeSlot = 4
    }
    if (keyCode == 54) {
      activeSlot = 5
    }
    if (keyCode == 55) {
      activeSlot = 6
    }
    if (keyCode == 56) {
      activeSlot = 7
    }
    if (keyCode == 57) {
      activeSlot = 8
    }

    if (keyCode == 13 && response == false) {
      response = true
    }

    if (keyCode == 65) {
        left = true
        if (right == false) {

          player.dx = -WALKING_SPEED
        }
        else {
          player.dx = 0
        }
    }
    else if (keyCode == 68) {
        right = true
        if (left == false) {

          player.dx = WALKING_SPEED
        }
        else {
            player.dx = 0
        }
    }


    if (keyCode == 87) {
        front = true
        if (back == false) {

          player.dy = -WALKING_SPEED
        }
        else {
          player.dy = 0
        }
    }
    else if (keyCode == 83) {
        back = true
        if (front == false) {

          player.dy = WALKING_SPEED
        }
        else {
            player.dy = 0
        }
    }
}

function keyReleased() {
    if (keyCode == 65) {
      left = false
      if (right == false) {
        player.dx = 0
      }
      else {

        player.dx = WALKING_SPEED
      }
    }
    if (keyCode == 68) {
      right = false
      if (left == false) {
        player.dx = 0
      }
      else {

        player.dx = -WALKING_SPEED
      }
    }

    if (keyCode == 87) {
        front = false
        if (back == false) {
          player.dy = 0
        }
        else {

          player.dy = WALKING_SPEED
        }
      }
      if (keyCode == 83) {
        back = false
        if (front == false) {
          player.dy = 0
        }
        else {

          player.dy = -WALKING_SPEED
        }
      }
}

function explode(x,y,color) {
  let psystem = new Emitter(x + 20, y + 30)
  psystem.emit(128)
  psystem.setColor(paletteColors[color])
  particles.push(psystem)
}

function check(x) {

  x.x += x.dx
  x.y += x.dy
  for (let i of enemies) {
    if (i.count != x.count) {
      if (aabb(x, i)) {
        x.x -= x.dx
        x.y -= x.dy

        if (x.type == "projectile") {
          explode(i.x,i.y,0)
          i.health -= x.damage
          myIndex = projectiles.indexOf(x)
          if (myIndex !== -1) {
            projectiles.splice(myIndex, 1)
          }
          i.dx = x.dx
          i.dy = x.dy
          for (let j = 0; j < 1; j++) {
            if (!checkX(i)) {
                i.x += i.dx
            }
            if (!checkY(i)) {
                i.y += i.dy
            }
          }
          //kill enemy
          if (i.health <= 0) {
            kills++
            coins += i.value
            myIndex = enemies.indexOf(i)
            if (myIndex !== -1) {
              enemies.splice(myIndex, 1)
            }
          }
        }
        return true
      }
    }
  }
  if (aabb(x, player) && x.count >= 0) {
    x.x -= x.dx
    x.y -= x.dy

    return true
  }
  for (let structure of structures) {
    if (aabb(x, structure)) {
      x.x -= x.dx
      x.y -= x.dy
      return true
    }
  }
  x.x -= x.dx
  x.y -= x.dy
  return false
}

function checkX(x) {
  x.x += x.dx

  for (let i of enemies) {
    if (i.count != x.count) {
      if (aabb(x, i)) {
        x.x -= x.dx

        return true
      }
    }
  }
  if (aabb(x, player) && x.count >= 0) {
    x.x -= x.dx

    return true
  }
  for (let structure of structures) {
    if (aabb(x, structure)) {
      x.x -= x.dx
      return true
    }
  }

  x.x -= x.dx
  return false

}


function checkY(x) {
  x.y += x.dy

  for (let i of enemies) {
    if (i.count != x.count) {
      if (aabb(x, i)) {
        x.y -= x.dy

        return true
      }
    }
  }
  if (aabb(x, player) && x.count >= 0) {
    x.y -= x.dy

    return true
  }
  for (let structure of structures) {
    if (aabb(x, structure)) {
      x.y -= x.dy
      return true
    }
  }
  x.y -= x.dy

  return false
}


function status() {
  for (let enemy of enemies) {
    if (enemy.health > 0) {
      return false
    }
  }
  enemies = []


  return true
}

function chargeMeter(max) {
  let x = windowWidth/2 - 4 * max
  if (charge < max) {
    charge += .5
  }
  for (let i = 0; i < charge; i++) {
    fill(0,255,255)
    rect(x + (8 * i), windowHeight - 95, 7, 7)
  }
}

function inventory() {
  rectMode(CORNER)
  if (weapon != "") {
    chargeMeter(items[activeSlot].charge)
  }
  for (let i = 0; i < 9; i++) {
    fill(92, 92, 92)
    rect(window.innerWidth / 2 + (i * 64) - 288, window.innerHeight - 84, 64, 64)
    fill(192, 192, 192)
    rect(window.innerWidth / 2 + (i * 64) - 283, window.innerHeight - 79, 54, 54)
    if (i == activeSlot) {
      fill(162, 162, 162)
      rect(window.innerWidth / 2 + (i * 64) - 288, window.innerHeight - 84, 64, 64)
      fill(220, 220, 220)
      rect(window.innerWidth / 2 + (i * 64) - 283, window.innerHeight - 79, 54, 54)
      if (weapon != items[i].name) {
        charge = 0
        weapon = items[i].name
      }
    }
    if (items[i].img) {
      image(items[i].img, window.innerWidth / 2 + (i * 64) - 288,window.innerHeight - 84, 64, 64)
    }
  }
  textAlign(CENTER)
  textSize(20)
  fill(255)
  text(items[activeSlot].name, windowWidth/2, windowHeight - 100)
}


function health() {
  rectMode(CORNER)
  fill(100,0,0)
  rect(20,20, maxHealth * 10, 20)
  fill(120,0,0)
  rect(22,22, maxHealth * 10 - 4, 16)
  fill(255,0,0)
  rect(20,20, playerHealth * 10, 20)
  fill(255,10,10)
  rect(22,22, playerHealth * 10 - 4, 16)

  fill(255,10,10)
  textAlign(LEFT)
  textSize(20)
  if (damage != 0) {
    text(damage, maxHealth * 10 + 30, 35)
  }

}


function hit() {
  for (let p of enemies) {
    if (p.cooldown < 1) {
      if (distance(p.x, p.y, player.x, player.y) < p.range) {
        if (playerHealth > 0) {
          playerHealth -= p.damage
          damage -= p.damage
          explode(player.x,player.y, 1)
          cooldown = 40
        }
        else {

          gamestate = "start"
          init()
        }
        p.cooldown = 30
        hurt(p)
      }
    }
    else {
      p.cooldown -= 1
    }
  }
}


function hurt(enemy) {
  let x = player.dx
  let y = player.dy
  player.dx = enemy.dx
  player.dy = enemy.dy
  for (let i = 0; i < 2; i++) {
    if (!check(player)) {
      player.update()
    }
  }
  player.dx = x
  player.dy = y
}


function waveNumber() {
  textAlign(CENTER)
  fill(255,0,0)
  textSize(50)
  text("Round " + (difficulty - 1), windowWidth/2, windowHeight/2)
  textCounter--
}


function setDirection() {
  if (left && !right && !front && !back) {
    player.direction = "left"
  }
  else if (!left && right && !front && !back) {
    player.direction = "right"
  }
  else if (front && !back) {
    player.direction = "back"
  }
  else if (!front && back) {
    player.direction = "forward"
  }
  else {
    player.direction = "forward"
  }
}

function displayEnemies() {
  fill(255,0,0)
  textSize(30)
  textAlign(CENTER)
  text(enemyCount + enemies.length,windowWidth - 65, 40)
  image(skull, windowWidth - 50, 10, 40, 40)
  image(coinsImg, windowWidth - 54, 45, 50, 50)
  fill(240, 240, 74)
  text(coins, windowWidth - 65, 80)
}