let paletaJugador = document.querySelector('#paleta-jugador');
let paletaMaquina = document.querySelector('#paleta-maquina');
let bolita = document.querySelector('#bolita');

paletaJugador.style.marginLeft = '30px';
paletaJugador.style.marginTop = '0px';
paletaMaquina.style.marginLeft = '1060px';
paletaMaquina.style.marginTop = '0px';
bolita.style.marginLeft = '542px';
bolita.style.marginTop = '220px';

let wPresionado = false;
let sPresionado = false;

let id; 

//Velocidad de la bolita
let Vx = -1;
let Vy = -1;
let V = Math.sqrt(Math.sqrt(Math.pow(Vx,2)+Math.pow(Vy,2)));

document.addEventListener('keydown', (e) => {
    if (e.keyCode == '87') {
        wPresionado = true;
    } else if(e.keyCode == '83'){
        sPresionado = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode == '87') {
        wPresionado = false;
    } else if(e.keyCode == '83') {
        sPresionado = false;
    }    
});

cicloJuego();

function reset(){
    new Audio('css/puntos.mp3').play();
    clearInterval(id);
    Vx = -1;
    Vy = -1;
    V = Math.sqrt(Math.sqrt(Math.pow(Vx,2)+Math.pow(Vy,2)));
    bolita.style.marginLeft = '542px';
    bolita.style.marginTop = '220px';
    cicloJuego();
    console.log('reseteo');
}

function cicloJuego() {
    setTimeout(()=>{
        id = setInterval(() => {

            if(marginLeft(bolita)<0){
                document.querySelector('#puntos-maquina').innerHTML = Number(document.querySelector('#puntos-maquina').innerHTML)+1;
                reset();
                return;
            }
            if((marginLeft(bolita)+20) > 1100){
                document.querySelector('#puntos-jugador').innerHTML = Number(document.querySelector('#puntos-jugador').innerHTML)+1;
                reset();
                return;
            }
            if(marginTop(bolita)<0 || (marginTop(bolita)+20) > 450){
                new Audio('css/choque.mp3').play();
                Vy = -Vy;
            }

            let paleta = (marginLeft(bolita)+10<450) ? paletaJugador : paletaMaquina;

            if(detectarColision(paleta)){
                new Audio('css/golpe.mp3').play();
                let angulo;
                let type = (marginLeft(paleta) == 30) ? 'jugador' : 'maquina';

                if(bolita.centerY < paleta.centerY){
                    angulo = (type == 'jugador' ? -Math.PI/4 : (-3*Math.PI)/4);
                }else if(bolita.centerY > paleta.centerY){
                    angulo = (type == 'jugador' ? Math.PI/4 : (3*Math.PI)/4);
                }else if (bolita.centerY == paleta.centerY) {
                    angulo = (type == 'jugador' ? 0 : Math.PI);
                }

                V += 0.5;
                Vx = V * Math.cos(angulo);
                Vy = V * Math.sin(angulo);
            }

            let nivelMaquina = 0.05;
            paletaMaquina.style.marginTop = `${marginTop(paletaMaquina)+((bolita.centerY - (marginTop(paletaMaquina)+36)))* nivelMaquina}px`;

            bolita.style.marginLeft = `${marginLeft(bolita)+Vx}px`;
            bolita.style.marginTop = `${marginTop(bolita)+Vy}px`

            if (wPresionado && marginTop(paletaJugador)>0) {
                paletaJugador.style.marginTop = `${marginTop(paletaJugador)-2}px`;
            }else if(sPresionado && marginTop(paletaJugador)<378){
                paletaJugador.style.marginTop = `${marginTop(paletaJugador)+2}px`
            }

            if(marginTop(paletaMaquina)<0){
                paletaMaquina.style.marginTop = '0px';
            }else if (marginTop(paletaMaquina) > 378) {
                paletaMaquina.style.marginTop = '378px';
            }

        }, 5);
    },500)
}

function detectarColision(paleta){
    bolita.top = marginTop(bolita);
    bolita.bottom = marginTop(bolita)+20;
    bolita.left = marginLeft(bolita);
    bolita.right = marginLeft(bolita)+20;
    bolita.centerX = marginLeft(bolita)+10;
    bolita.centerY = marginTop(bolita)+10;

    paleta.top = marginTop(paleta);
    paleta.bottom = marginTop(paleta) + 72;
    paleta.left = marginLeft(paleta);
    paleta.right = marginLeft(paleta)+10;
    paleta.centerX = marginLeft(paleta)+5;
    paleta.centerY = marginTop(paleta) +36;

    return bolita.left < paleta.right && bolita.top < paleta.bottom && bolita.right > paleta.left && bolita.bottom > paleta.top;
}

function marginTop(elem){
    return Number(elem.style.marginTop.split('p')[0]);
}

function marginLeft(elem){
    return Number(elem.style.marginLeft.split('p')[0]);
}
