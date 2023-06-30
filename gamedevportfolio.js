
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
const collisionsDataArray = [];
for(let i = 0; i < collisions.length; i+= 50){
    collisionsDataArray.push(collisions.slice(i, 50 + i));
}
const colliders = [];
collisionsDataArray.forEach((row, y) => {
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
const movables = [background, foreground, ...colliders];
let lastKey = '';

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

function rectangularCollision({rect1, rect2}){
    return (
        rect1.pos.x + rect1.width >= rect2.pos.x &&
        rect1.pos.x <= rect2.pos.x + rect2.width &&
        rect1.pos.y <= rect2.pos.y + rect2.height &&
        rect1.pos.y + rect1.height >= rect2.pos.y
    )
}

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


