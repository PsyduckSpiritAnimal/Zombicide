class Player {
    constructor(x,y,skin) {
        this.width = 40
        this.height = 60
        this.x = x
        this.dx = 0
        this.y = y
        this.dy = 0
        this.right = skin[0]
        this.left = skin[1]
        this.front = skin[2]
        this.back = skin[3]
        this.type = "player"
        this.direction = "forward"
    }

    display() {
        //setDirection()
        if (this.direction == "forward") {
            this.img = this.front
        }
        else if (this.direction == "left") {
            this.img = this.left
        }
        else if (this.direction == "right") {
            this.img = this.right
        }
        else {
            this.img = this.back
        }
        if (left == false && right == false && front == false && back == false) {
            this.img = this.front
        }
        image(this.img, this.x - 20, this.y - 10, 80, 80)
        fill(0,0,255)
        //rect(this.x,this.y,this.width,this.height)
    }

    update() {
        offsetX += this.dx
        offsetY += this.dy
        if (offsetX > 1340 || offsetX < -1500 || offsetY > 665 || offsetY < -800) {
            offsetX -= this.dx
            offsetY -= this.dy
            return
        }
        for (let enemy of enemies) {
            enemy.x -= this.dx
            enemy.y -= this.dy
        }
        for (let x of particles) {
            for (let y of x.particles) {
                y.pos.x -= this.dx
                y.pos.y -= this.dy
            }
        }

        for (let p of projectiles) {
            if (distance(p.x,p.y,player.x + 20,player.y + 20) < 30) {

                let myIndex = projectiles.indexOf(p)
                if (myIndex !== -1) {
                    projectiles.splice(myIndex, 1)
                }
                if (playerHealth <= 0) {
                    gamestate = "start"
                    init()
                }
                hurt(p)
                playerHealth--
            }
            p.x -= this.dx
            p.y -= this.dy
        }
        for (let structure of structures) {
            structure.x -= this.dx
            structure.y -= this.dy
        }
    }
}


class Enemy {
    constructor(x,y,img, dWidth, dHeight, width, height, range) {
        this.speed = random(1,2)
        this.damage = 1
        this.count = count
        count++
        this.width = width + 25
        this.dWidth = dWidth
        this.height = height + 15
        this.dHeight = dHeight
        this.x = x
        this.dx = 0
        this.y = y
        this.dy = 0
        this.img = zombieSkins[img]
        this.health = 5
        this.type = "zombie"
        this.cooldown = 0
        this.value = 10
        this.range = range
        this.inPlay = true

        if (img == 1) {
            this.speed = 5
            this.health = 1
        }
        if (img == 2) {
            this.speed = 3
            this.health = 8
            this.damage = 2
        }
        if (img == 3) {
            this.speed = 2
        }
        if (img != 0) {
            this.value = parseInt(random(10,20))
        }
        this.maxHealth = this.health
    }

    display() {
        this.timer++
        if (this.timer > 100) {

        }
        if (this.health > 0) {
            if (this.img == zombieSkins[0]) {
                this.speed += random(-.1,.1)
                this.speed = constrain(this.speed, 1, 2.5 + (.1 * difficulty))
            }

            //display Health
            rectMode(CORNER)
            let x = 73 / this.maxHealth
            fill(100,100,100,100)
            rect(this.x + 3, this.y - 10, 75, 12)

            for (let i = 0; i < this.maxHealth; i++) {
                fill(255,0,0)
                rect(this.x + 2 + (i * x + 1), this.y - 9, x, 10)
                if (i < this.health) {
                    fill(0,255,0)
                    rect(this.x + 2 + (i * x + 1), this.y - 9, x, 10)
                }
            }

            if (this.img == zombieSkins[3]) {
                if (distance(this.x, this.y, player.x, player.y) < 600 && distance(this.x, this.y, player.x, player.y) > 400) {
                    this.speed = 0
                    if (reference % 50 == 0) {
                        let px = this.x
                        let py = this.y
                        let slopeX = player.x + 40 - px
                        let slopeY = player.y + 40 - py
                        let dist = distance(player.x, player.y, px, py)
                        let ball = new Projectile(px + 3 * (slopeX / dist * 20), py + 3 * (slopeY / dist * 20), slopeX / dist * 20, slopeY / dist * 20, arrow, slopeX, slopeY, 2)
                        projectiles.push(ball)
                    }
                }
                else {
                    this.speed = 2
                }
            }

            if (player.x > this.x) {
                this.dx = this.speed
            }
            else {
                this.dx = -this.speed
            }
            if (player.y > this.y) {
                this.dy = this.speed
            }
            else {
                this.dy = -this.speed
            }

            fill(255,0,0)
            //rect(this.x,this.y,this.width,this.height)
            image(this.img, this.x, this.y, this.dWidth, this.dHeight)

        }

    }
    update() {
        if (this.health > 0) {
            if (!checkX(this)) {
                this.x += this.dx
            }
            if (!checkY(this)) {
                this.y += this.dy
            }
        }
    }
}


function aabb(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}


class Projectile {
    constructor(x,y,dx,dy, img, run, rise, damage) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.inPlay = true
        this.width = 10
        this.height = 10
        this.type = "projectile"
        this.img = img
        this.rot = 0
        this.run = run
        this.rise = rise
        this.damage = damage
        this.timer = 0
    }

    update() {
        this.timer++

        if (this.timer > 100) {
            let myIndex = projectiles.indexOf(this)
            if (myIndex !== -1) {
                projectiles.splice(myIndex, 1)
            }
        }
        if (weapon == "flamethrower") {
            if (this.timer > 20) {
                let myIndex = projectiles.indexOf(this)
                if (myIndex !== -1) {
                    projectiles.splice(myIndex, 1)
                }
            }
        }

        if (this.inPlay) {
            this.rot += .10
            push()
            fill(255, 0, 0)
            translate(this.x, this.y)
            angleMode(RADIANS)

            rotate(atan((this.rise)/(this.run)) - 1.5708)
            if (this.run > 0) {
                rotate(2 * (1.5708))
            }
            if (this.img == arrow) {
                image(this.img, 0, 0, 40, 40)
            }
            else if (this.img == spear) {
                rotate(-0.785398)
                image(this.img, -40, -40, 100, 100)
            }
            else if (this.img == fire) {
                rotate(4*-0.785398)
               
                image(this.img, -40, -40, 100, 100)
            }
            pop()
            this.x += 10
            this.y += 10
            if (check(this)) {
                this.inPlay = false
            }
            this.x -= 10
            this.y -= 10
            this.x += this.dx
            this.y += this.dy
            fill(0,255,0)
            //rect(this.x,this.y, this.width, this.height)
        }
    }
}

class Structure {
    constructor(x,y,img, width, height) {
        this.x = x + 70
        this.y = y + 50
        this.width = width - 130
        this.height = height - 150
        this.img = img
    }

    display() {
        image(this.img, this.x - 70, this.y - 50, this.width + 130, this.height + 150)
    }
}

class item {
    constructor(slot) {
        this.slot = slot
        this.img
        this.name
    }
}