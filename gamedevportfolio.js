
let canvas;
let c;
let player;
let interact;

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
    e: {pressed: false}
}
const levelDoorMap = {
    2043: 1
}

GameStateManager.AddNewLevel(new Level({
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
GameStateManager.AddNewLevel(new Level({
    bgSrc: './assets/gamedev_portfolio_lvl2.png',
    fgSrc: './assets/gamedev_portfolio_lvl2_fg.png',
    collisionMap: collisionsLvlTwo,
    doorMap: doorCollisionsLvlTwo,
    size: {
        x: 50,
        y: 50
    },
    offset: {
        x: -20,
        y: -20
    },
    scale: 1,
    unitScale: 32
}));
GameStateManager.LoadNewLevel(0);



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
    


console.log(GameStateManager.currLevel.colliders);
console.log(...GameStateManager.currLevel.doors.keys());
const movables = [GameStateManager.currLevel.background, GameStateManager.currLevel.foreground, ...GameStateManager.currLevel.colliders, ...GameStateManager.currLevel.doors.keys()];
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
    console.log(GameStateManager.currLevel); 
    render();
}
//MAIN GAME LOOP
function render() {
    
    //console.log(GameStateManager.currLevel.doors)
    //console.log(playerPos);
    //Recursive Call
    window.requestAnimationFrame(render);

    GameStateManager.currLevel.draw(player);
    
    //Collision Detection
    //Interactable Detection
    let doorCollision;
    GameStateManager.currLevel.doors.forEach((value, key) => {
        let door = {obj: key, val: value};
        if(
            rectangularCollision({
                rect1: player.collider,
                rect2: {
                    ...door.obj,
                    pos: {
                        x: door.obj.pos.x,
                        y: door.obj.pos.y + (1 * GameStateManager.currLevel.unitScale)
                    }
                }
            }) ||
            rectangularCollision({
                rect1: player.collider,
                rect2: {
                    ...door.obj,
                    pos: {
                        x: door.obj.pos.x,
                        y: door.obj.pos.y - (1 * GameStateManager.currLevel.unitScale)
                    }
                }
            })){
                doorCollision = door;
            }
    });
    if(doorCollision){
        interact.draw();
        if(keys.e.pressed){
            //change level
            //console.log(levelDoorMap[doorCollision.val])
            GameStateManager.LoadNewLevel(levelDoorMap[doorCollision.val]);
        }
    }

    let playerMove = true;
    player.moving = false;
    if(keys.w.pressed && lastKey == 'w'){
        player.moving = true;
        player.direction = 'up';
        for(let i = 0; i < GameStateManager.currLevel.colliders.length; i++){
            const boundary = GameStateManager.currLevel.colliders[i];
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
        for(let i = 0; i < GameStateManager.currLevel.colliders.length; i++){
            const boundary = GameStateManager.currLevel.colliders[i];
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
        for(let i = 0; i < GameStateManager.currLevel.colliders.length; i++){
            const boundary = GameStateManager.currLevel.colliders[i];
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
        for(let i = 0; i < GameStateManager.currLevel.colliders.length; i++){
            const boundary = GameStateManager.currLevel.colliders[i];
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
        case 'e':
            keys.e.pressed = true;
            break;
        case 'o':
            GameStateManager.currLevel.offset.x--;
            console.log(GameStateManager.currLevel);
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
        case 'e':
            keys.e.pressed = false;
            break;
    };
}


