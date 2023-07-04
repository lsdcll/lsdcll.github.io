class Sprite {
    constructor({pos, velocity, image, scale, frames = 1, border = 0}){
        this.pos = pos;
        this.image = image;
        this.scale = scale;
        this.frames = frames;
        this.border = border;
        this.frame = 0
        this.elapsedFrames = 0;
        this.frameRate = 23;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }

    draw() {
        /* c.drawImage(this.image,
            this.pos.x,
            this.pos.y, 
            this.image.width / scale,
            this.image.height / scale
        ); */
        c.drawImage(this.image,
            (this.frame) * (this.width / this.frames),
            0,
            (this.width / this.frames),
            (this.height),
            this.pos.x,
            this.pos.y,
            //15
            (this.width / this.frames) / this.scale,
            //22
            this.height / this.scale
        );
        if(this.frames > 1){
            this.elapsedFrames++;

            if(this.elapsedFrames % this.frameRate === 0){
                if(this.frame < this.frames - 1) this.frame++;
                else this.frame = 0;
            }
        }
        
    }
}
class Player {
    constructor({ image, imageScale = 1, frames = 6, frameSize = {x: 16, y: 16}, border = 1, colliderOffset = {x: 3, y: 13}}){
        this.image = image;
        this.frames = frames;
        this.frame = 0;
        this.elapsedFrames = 0;
        this.frameRate = 15;
        this.spriteSheetY = 1;
        this.moving = false;
        this.direction = 'down'
        this.border = border;
        this.imageScale = imageScale;
        this.frameSize = frameSize;
        this.pos = {
            x: Math.round(canvas.width / 2 - ((playerImage.width / this.frames) - 2) / 2) + 1,
            y: Math.round(canvas.height / 2 - (((playerImage.height / this.frames) + 2) / 2)) - 4
        }
        this.collider = new Collider({
            pos: {
                x: this.pos.x + colliderOffset.x,
                y: this.pos.y + colliderOffset.y
            },
            width: 7,
            height: 8
        })
        this.drawCollider = false;
    }

    draw(){
        if(this.direction == 'down' && this.moving) this.spriteSheetY = 6;
        else if(this.direction == 'up' && this.moving) this.spriteSheetY = 8;
        else if(this.direction == 'right' && this.moving) this.spriteSheetY = 7;
        else if(this.direction == 'left' && this.moving) this.spriteSheetY = 5;
        else if(this.direction == 'down' && !this.moving) this.spriteSheetY = 1;
        else if(this.direction == 'right' && !this.moving) this.spriteSheetY = 2;
        else if(this.direction == 'up' && !this.moving) this.spriteSheetY = 3;
        else if(this.direction == 'left' && !this.moving) this.spriteSheetY = 4;

        c.drawImage(this.image,
            (this.border + (this.frame<2?0:this.frame-1)) + (this.frame * (this.frameSize.x + 1) ),
            this.spriteSheetY + ((this.frameSize.y + 1) * (this.spriteSheetY - 1)),
            (this.image.width / this.frames) - (this.border*2),
            (this.image.height / 8) - (this.border*2),
            this.pos.x,
            this.pos.y,
            //15
            this.frameSize.x,
            //22
            this.frameSize.y
        );
        this.elapsedFrames++;

        if(this.elapsedFrames % this.frameRate === 0){
            if(this.frame < this.frames - 1) this.frame++;
            else this.frame = 0;
        }
            

        if(this.drawCollider){
            c.fillStyle = 'red';
            c.fillRect(this.collider.pos.x, this.collider.pos.y, this.collider.width, this.collider.height);
        }
            
            
    }
}
class Collider {
    constructor({pos, width = 8, height = 8}){
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.fillStyle = 'rgba(255,0,0,0)';
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}
class Door extends Collider {
    constructor({pos, width, height}){
        super({pos, width, height});
        
    }


}
class InteractDialog {
    constructor({interactDialog, dlgAction}){
        this.interactDialog = interactDialog;
        this.dlgAction = dlgAction;
        this.show = false;
    }

    
    draw() {
        
        if(this.show){
            console.log('show interact message');
            c.font = "10px Arial";
            c.textAlign = 'center';
            c.fillStyle = 'white';
            console.log(player.pos);
            c.fillText("Press a to interact", 114, 59);
        }
    }
    
    
}
class Level {
    constructor({_bg, _fg }){}
}