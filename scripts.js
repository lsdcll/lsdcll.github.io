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

let canvas;
let c;
const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
}

const image = new Image()
const playerImage = new Image();
playerImage.src ='./assets/player.png'
image.src = "./assets/gamedev_portfolio_lvl1.png";

const unitScale = 8;
const background = new Sprite({pos: {x: -15 * unitScale, y: -15 * unitScale}, 
    image: image
})


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
    //Handle Keyboard Input
    window.addEventListener('keydown', (e) => handleKeydown(e));
    window.addEventListener('keyup', (e) => handleKeyup(e));
    //Bind DOM elements and context => start render
    canvas = document.querySelector('#_canvas');
    c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    render();

});

function handleKeydown(e){
    
    switch(e.key){
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
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

function render() {
    window.requestAnimationFrame(render);
    background.draw();
    
    c.drawImage(playerImage,
        1,
        1,
        playerImage.width / 6 - 2,
        playerImage.height / 6 - 2,
        Math.round(canvas.width / 2 - (playerImage.width / 6) / 2),
        Math.round(canvas.height / 2 - (playerImage.height / 6) / 2),
        15,
        22
        );

        if(keys.w.pressed){
            background.pos.y += 0.3; 
        }
        if(keys.a.pressed){
            background.pos.x += 0.3; 
        }
        if(keys.s.pressed){
            background.pos.y -= 0.3; 
        }
        if(keys.d.pressed){
            background.pos.x -= 0.3; 
        }
}


