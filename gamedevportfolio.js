
let canvas;
let c;
let player;
let interact;

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
}
const levels = [];
levels.push(new Level({
    bgSrc: './assets/gamedev_portfolio_lvl1.png',
    fgSrc: './assets/gamedev_portfolio_lvl1_fg.png',
    collisionMap: collisionsLvlOne,
    doorMap: doorCollisionsLvlOne,
    size: {
        x: 50,
        y: 50
    },
    offset: {
        x: -15,
        y: -15
    },
    scale: 2,
    unitScale: 8
}));


const playerImage = new Image();
const interactImage = new Image();
playerImage.src ='./assets/player.png'
interactImage.src = "./assets/interact.png";

interact = new Sprite({
    pos: {
        x: 112,
        y: 40
    },
    image: interactImage,
    scale: 1,
    frames: 4,
    });
    



const movables = [levels[0].background, levels[0].foreground, ...levels[0].colliders, ...levels[0].doors];
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
    
    //console.log(interact.width);
    //player.drawCollider = true;
    console.log(levels[0]); 
    render();
}
//MAIN GAME LOOP
function render() {
    
    //console.log(playerPos);
    window.requestAnimationFrame(render);
    levels[0].background.draw();
    levels[0].colliders.forEach(collider => {
        collider.draw();
    });
    if(levels[0].foreground.pos.y >= -155){
        player.draw();
        levels[0].foreground.draw();
    }
    else{
        levels[0].foreground.draw();
        player.draw(); 
    }
    
   /*  levels[0].doors.forEach(door => {
        door.dlg.showDialog();
        door.dlg.show = false;
    })  */
    

    //Collision Detection
    //Interactable Detection
    for(let i = 0; i < levels[0].doors.length; i++){
        const door = levels[0].doors[i];
        if(
            rectangularCollision({
                rect1: player.collider,
                rect2: {
                    ...door,
                    pos: {
                        x: door.pos.x,
                        y: door.pos.y + (1 * levels[0].unitScale)
                    }
                }
            }) ||
            rectangularCollision({
                rect1: player.collider,
                rect2: {
                    ...door,
                    pos: {
                        x: door.pos.x,
                        y: door.pos.y - (1 * levels[0].unitScale)
                    }
                }
            })){
                interact.draw();
                break;
            }
    }
    let playerMove = true;
    player.moving = false;
    if(keys.w.pressed && lastKey == 'w'){
        player.moving = true;
        player.direction = 'up';
        for(let i = 0; i < levels[0].colliders.length; i++){
            const boundary = levels[0].colliders[i];
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
                
                //console.log(boundary.pos.y + ' , '+ 'colliding');
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
        for(let i = 0; i < levels[0].colliders.length; i++){
            const boundary = levels[0].colliders[i];
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
                ///console.log('colliding');
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
        for(let i = 0; i < levels[0].colliders.length; i++){
            const boundary = levels[0].colliders[i];
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
                //console.log('colliding');
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
        for(let i = 0; i < levels[0].colliders.length; i++){
            const boundary = levels[0].colliders[i];
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
                //console.log('colliding');
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


