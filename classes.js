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
        c.fillStyle = 'rgba(255,255,255,0)';
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}
class Door extends Collider {
    constructor({pos, width, height, levelKey}){
        super({pos, width, height});
        this.levelKey = levelKey;
        
    }

    draw() {
        c.fillStyle = 'rgba(0,255,0,0)';
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
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
    constructor({levelName, bgSrc, fgSrc, collisionMap, doorMap, size, offset, scale, unitScale, layerOffset = {x: 0,y: 0}}){
        this.Name = levelName;
        this.bg = new Image();
        this.bg.src = bgSrc;
        this.fg = new Image();
        this.fg.src = fgSrc;

        this.size = size;
        this.offset = offset;
        this.unitScale = unitScale;

        this.collisionsData = [];
        this.doorsData = [];
        this.colliders = [];
        this.doors = new Map();

        this.background = new Sprite({
            pos: {
                x: offset.x * unitScale,
                y: offset.y * unitScale
            },
            image: this.bg,
            scale: scale
        });
        this.foreground = new Sprite({
            pos: {
                x: offset.x * unitScale,
                 y: offset.y * unitScale
                }, 
            image: this.fg,
            scale: scale
        });

        for(let i = 0; i < collisionMap.length; i+= this.size.x){
            this.collisionsData.push(collisionMap.slice(i, this.size.x + i));
        }
        this.collisionsData.forEach((row, y) => {
            row.forEach((val, x) => {
                if(val != 0){
                    this.colliders.push(new Collider(
                        {pos: {
                            x: (x + offset.x + layerOffset.x) * unitScale,
                            y: (y + offset.y + layerOffset.y) * unitScale 
                        },
                        width: unitScale,
                        height: unitScale
                        }));
                    
                }
            });
        });
        for(let i = 0; i < doorMap.length; i+=this.size.x){
            this.doorsData.push(doorMap.slice(i, this.size.x + i));
        }
        this.doorsData.forEach((row, y) => {
            row.forEach((val, x) => {
                if(val != 0){
                    this.doors.set(new Door(
                        {
                            pos: {
                                x: (x + offset.x + layerOffset.x) * unitScale,
                                y: (y + offset.y + layerOffset.y) * unitScale
                            },
                            width: unitScale,
                            height: unitScale
                        }
                    ), val); 
                }
            })
        })

    }

    //***FIX THIS SHIT*** */
    draw(player){
        this.background.draw();
        this.colliders.forEach(collider => {
            collider.draw();
        });
        if(this.foreground.pos.y >= -155){
            player.draw();
            this.foreground.draw();
        }
        else{
            this.foreground.draw();
            player.draw(); 
        }
        this.doors.forEach(function(val, key) {key.draw();});
    }
}
class GameStateManager {
    
    static levels = {};
    static movables = [];
    static currLevel;    

    static AddNewLevel(levelName, level){
        this.levels[levelName] = level;
    }
    static LoadNewLevel(levelName){
        console.log(levelName);
        this.currLevel = this.levels[levelName];
        this.movables = [this.currLevel.background, this.currLevel.foreground, ...this.currLevel.colliders, ...this.currLevel.doors.keys()];  
    }
}