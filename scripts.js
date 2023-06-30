class Sprite {
    constructor({pos, velocity, image}){
        this.pos = pos;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image,
            this.pos.x,
            this.pos.y, 
            this.image.width / 2,
            this.image.height / 2
            );
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

let canvas;
let c;
let player;
const unitScale = 8;
const lvlOffset = {
    x: -15,
    y: -15
};
const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
}

const image = new Image();
const foregroundImage = new Image();
const playerImage = new Image();
playerImage.src ='./assets/player.png'
foregroundImage.src = './assets/gamedev_portfolio_lvl1_fg.png'
image.src = "./assets/gamedev_portfolio_lvl1.png";

window.onload = () => {
    //Handle Keyboard Input
    window.addEventListener('keydown', (e) => handleKeydown(e));
    window.addEventListener('keyup', (e) => handleKeyup(e));
    //Bind DOM elements and context => start render
    canvas = document.querySelector('#_canvas');
    c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    
    player = new Player({
        image: playerImage,
        imageScale: 2,
        frames: 6,
        frameSize: {
            x: 15,
            y: 22
        }});
    //player.drawCollider = true;

    render();
}


const collisionsMap = [];
for(let i = 0; i < collisions.length; i+= 50){
    collisionsMap.push(collisions.slice(i, 50 + i));
}
const colliders = [];
collisionsMap.forEach((row, y) => {
    row.forEach((val, x) => {
        if(val != 0){
            colliders.push(new Collider(
                {pos: {
                    x: (x + lvlOffset.x) * unitScale,
                    y: (y + lvlOffset.y) * unitScale 
                }}));
            
        }
    });
});

const background = new Sprite({
    pos: {
        x: lvlOffset.x * unitScale,
         y: lvlOffset.y * unitScale
        }, 
    image: image
});
const foreground = new Sprite({
    pos: {
        x: lvlOffset.x * unitScale,
         y: lvlOffset.y * unitScale
        }, 
    image: foregroundImage
})



let lastKey = '';




function handleKeydown(e){
    
    switch(e.key){
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    };
}
function handleKeyup(e){
    
    switch(e.key){
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    };
}

const movables = [background, foreground, ...colliders];

function render() {
    //console.log(playerPos);
    window.requestAnimationFrame(render);
    background.draw();
    colliders.forEach(collider => {
        collider.draw();
    });
    if(foreground.pos.y >= -155){
        player.draw();
        foreground.draw();
    }
    else{
        foreground.draw();
        player.draw();
        
    }
    

    //c.fillStyle = 'blue';
    //c.fillRect(canvas.width /2, canvas.height/2, 1, canvas.height)
    //c.fillRect(canvas.width /2, canvas.height/2, canvas.width, 1)
    let playerMove = true;
    player.moving = false;
    if(keys.w.pressed && lastKey == 'w'){
        player.moving = true;
        player.direction = 'up';
        for(let i = 0; i < colliders.length; i++){
            const boundary = colliders[i];
            if(
                rectangularCollision({
                    rect1: player.collider,
                    rect2: {
                        ...boundary,
                        pos: {
                            x: boundary.pos.x,
                            y: boundary.pos.y + 0.3
                        }
                    }
                    }))
                    {
                playerMove = false;
                
                console.log(boundary.pos.y + ' , '+ 'colliding');
                break;
            } 
        }
        if(playerMove){
            movables.forEach(item => {
                item.pos.y += 0.3; 
            });
        }
    }
    else if(keys.a.pressed && lastKey == 'a'){
        player.moving = true;
        player.direction = 'left';
        for(let i = 0; i < colliders.length; i++){
            const boundary = colliders[i];
            if(
                rectangularCollision({
                    rect1: player.collider,
                    rect2: {
                        ...boundary,
                        pos: {
                            x: boundary.pos.x + 0.3,
                            y: boundary.pos.y 
                        }
                    }
                    }))
                    {
                playerMove = false;
                console.log('colliding');
                break;
            } 
        }
        if(playerMove){
            movables.forEach(item => {
                item.pos.x += 0.3; 
            });
        }
    }
    else if(keys.s.pressed && lastKey == 's'){
        player.moving = true;
        player.direction = 'down';
        for(let i = 0; i < colliders.length; i++){
            const boundary = colliders[i];
            if(
                rectangularCollision({
                    rect1: player.collider,
                    rect2: {
                        ...boundary,
                        pos: {
                            x: boundary.pos.x,
                            y: boundary.pos.y - 0.3 
                        }
                    }
                    }))
                    {
                playerMove = false;
                console.log('colliding');
                break;
            } 
        }
        if(playerMove){
            movables.forEach(item => {
                item.pos.y -= 0.3; 
            });
        }
    }
    else if(keys.d.pressed && lastKey == 'd'){
        player.moving = true;
        player.direction = 'right';
        for(let i = 0; i < colliders.length; i++){
            const boundary = colliders[i];
            if(
                rectangularCollision({
                    rect1: player.collider,
                    rect2: {
                        ...boundary,
                        pos: {
                            x: boundary.pos.x - 0.3,
                            y: boundary.pos.y  
                        }
                    }
                    }))
                    {
                playerMove = false;
                console.log('colliding');
                break;
            } 
        }
        if(playerMove){
            movables.forEach(item => {
                item.pos.x -= 0.3; 
            });
        }
        
    }
}
$(document).ready(function(){
    //Event Binding for Skill Icon Buttons
    $(".logoContainer").hover(function() {
        //console.log(this.dataset.skill);
        const progBar = document.querySelector('.skillLevel');
        switch (this.dataset.skill) {
            case "csharp":
                progBar.style.cssText = "width: 90%; background-image: linear-gradient(#546e7a, #37474f);";
                break;
            case "cplusplus":
                progBar.style.cssText = "width: 60%; background-image: linear-gradient(#0086d4, #00549d);";
                break;
            case "python":
                progBar.style.cssText = "width: 60%; background-image: linear-gradient(#ffc107, #cf9e09);";
                break;
            case "js":
                progBar.style.cssText = "width: 70%; background-image: linear-gradient(#ffd600, #d5b300);";
                break;
            case "php":
                progBar.style.cssText = "width: 45%; background-image: linear-gradient(#00bcd4, #00a3b8);";
                break;
            case "html":
                progBar.style.cssText = "width: 90%; background-image: linear-gradient(#ff6d00, #e65100);";
                break;
            case "css":
                progBar.style.cssText = "width: 65%; background-image: linear-gradient(#039be5, #0277bd);";
                break;
            case "mysql":
                progBar.style.cssText = "width: 60%; background-image: linear-gradient(#f57f17, #ca6813);";
                break;
            case "docker":
                progBar.style.cssText = "width: 35%; background-image: linear-gradient(#80d3f9, #0288d1);";
                break;
            case "vs":
                progBar.style.cssText = "width: 90%; background-image: linear-gradient(#ce93d8, #ab47bc);";
                break;
            case "vscode":
                progBar.style.cssText = "width: 75%; background-image: linear-gradient(#29b6f6, #0288d1);";
                break;
            case "unity":
                progBar.style.cssText = "width: 65%; background-image: linear-gradient(#526a76, #37474f);";
                break;
            case "unreal":
                progBar.style.cssText = "width: 40%; background-image: linear-gradient(#56717e, #455a64);";
                break;
            case "chatgpt":
                progBar.style.cssText = "width: 100%; background-image: linear-gradient(#6a8b9a, #546e7a);";
                break;
        }
        
    },
    function(){
        //console.log(this.dataset.skill);
        const progBar = document.querySelector('.skillLevel');
        progBar.style.cssText = "width : 1px;";
        switch (this.dataset.skill) {
            case "csharp":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#546e7a, #37474f);";
                break;
            case "cplusplus":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#0086d4, #00549d);";
                break;
            case "python":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#ffc107, #cf9e09);";
                break;
            case "js":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#ffd600, #d5b300);";
                break;
            case "php":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#00bcd4, #00a3b8);";
                break;
            case "html":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#ff6d00, #e65100);";
                break;
            case "css":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#039be5, #0277bd);";
                break;
            case "mysql":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#f57f17, #ca6813);";
                break;
            case "docker":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#80d3f9, #0288d1);";
                break;
            case "vs":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#ce93d8, #ab47bc);";
                break;
            case "vscode":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#29b6f6, #0288d1);";
                break;
            case "unity":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#526a76, #37474f);";
                break;
            case "unreal":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#56717e, #455a64);";
                break;
            case "chatgpt":
                progBar.style.cssText = "width: 0%; background-image: linear-gradient(#6a8b9a, #546e7a);";
                break;
        }
    });
    
    
});

function rectangularCollision({rect1, rect2}){
    return (
        rect1.pos.x + rect1.width >= rect2.pos.x &&
        rect1.pos.x <= rect2.pos.x + rect2.width &&
        rect1.pos.y <= rect2.pos.y + rect2.height &&
        rect1.pos.y + rect1.height >= rect2.pos.y
    )
}


