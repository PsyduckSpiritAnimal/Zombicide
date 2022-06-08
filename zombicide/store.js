class storeItem {
    constructor(name, img, price, charge,lore) {
        this.name = name
        this.img = img
        this.price = price
        this.hovered = false
        this.width = (window.innerWidth - 300) / 3.2
        this.x
        this.y
        this.charge = charge
        this.lore = "testing the textBox feature"
    }

    display(x,y) {
        this.x = x
        this.y = y
        //background
        fill(200)
        rect(x,y, this.width, 200)

        //image
        fill(170)
        rect(x + 20,y + 20, 160, 160)
        fill(220)
        rect(x + 25,y + 25, 150, 150)
        image(this.img, x + 30, y + 30, 140, 140)

        //name
        fill(170)

        rect(x + 200,y + 25, this.width - 220, 50)
        fill(255)
        textAlign(LEFT)
        textSize(40)
        text(this.name, x + 205, y + 60)
        if (this.hovered == true) {
            fill(150,0,0)
            rect(x + 200,y + 95, this.width - 220, 80)

        }
        else {
            fill(255, 0, 0)
            rect(x + 200,y + 95, this.width - 220, 80)
        }

        //price
        fill(227, 227, 57)
        textAlign(CENTER)
        textSize(50)
        text("$" + this.price, x + 200 + (this.width - 220) / 2, y + 155)
    }

    purchase() {
        leftClick = false
        let openSlot
        for (let i = 0; i < 9; i++) {
            if (!items[i].name) {
                openSlot = i
                break
            }
        }
        if (coins >= this.price && openSlot) {
            coins -= this.price
            items[openSlot].name = this.name
            items[openSlot].img = this.img
            items[openSlot].charge = this.charge
        }
    }
}