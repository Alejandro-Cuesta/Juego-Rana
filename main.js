
class Game {

constructor() {
  this.conteiner = document.getElementById("game-container");
  this.personaje = null;
  this.monedas = []
  this.puntuacion = 0;
  this.crearEscenario();
  this.agregarEventos();
  this.puntosElement = document.getElementById("puntos")
  this.tiempoRestante = 30;
  this.tiempoElement = document.getElementById("tiempo");
  this.iniciarCuentaAtras();
  this.juegoTerminado = false;

}
finalizarJuego() {
  this.juegoTerminado = true;
  const mensaje = document.createElement("div");
  mensaje.id = "mensaje-final";
  mensaje.innerHTML = `
    <h2>¡Tiempo terminado!</h2>
    <p>Puntuación final: ${this.puntuacion}</p>
    <button id="reiniciar">Reiniciar</button>
  `;
  this.conteiner.appendChild(mensaje);
  document.getElementById("reiniciar").addEventListener("click", () => {
    location.reload(); 
  });
}

crearEscenario() {
    this.personaje = new Personaje();
    this.conteiner.appendChild(this.personaje.element);
    for (let i = 0; i < 5; i++) {
        const moneda = new Moneda();
        this.monedas.push(moneda);
        this.conteiner.appendChild(moneda.element);
    }
}

iniciarCuentaAtras() {
    this.intervaloTiempo = setInterval(() => {
        this.tiempoRestante--;
        this.tiempoElement.textContent = `Tiempo: ${this.tiempoRestante}`;

        if (this.tiempoRestante <= 0) {
            clearInterval(this.intervaloTiempo);
             this.finalizarJuego();

        }
    }, 1000);
}

agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    this.checkColisiones();
}

checkColisiones() {
    setInterval(() => {
         if (this.juegoTerminado) return;
     this.monedas.forEach((moneda, index) => 
        {
       if (this.personaje.colisionaCon(moneda)) {
         this.conteiner.removeChild(moneda.element);
         this.monedas.splice(index, 1);
         this.actualizarPosicion(1)

         const nuevaMosca = new Moneda();
         this.monedas.push(nuevaMosca);
         this.conteiner.appendChild(nuevaMosca.element);
       
         const sonido = new Audio(`RanaS.mp3.mp3`);
         sonido.volume = 1.0;
         sonido.play().catch((err) => {
            console.error("No se pudo reproducir el sonido:", err);
         });
        }
       });
    }, 100);
}

actualizarPosicion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
 }
}
class Personaje {
    constructor() {
      this.x = 50;
      this.y = 300;
      this.width = 220;
      this.height = 220;
      this.velocidad = 10;
      this.saltando = false;
      this.element = document.createElement("div");
      this.element.classList.add("personaje");
      this.actualizarPosicion();
    }
    mover(evento) {
      if (typeof juego !== "undefined" && juego.juegoTerminado) return;


      if(evento.key === "ArrowRight") {
        this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft") {
        this.x -= this.velocidad;
    } else if (evento.key === "ArrowUp") {
        if (!this.saltando) { 
          this.saltar();
     }
    }
    this.actualizarPosicion();
    }

    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 240;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                 this.y -= 10;
                this.actualizarPosicion();
            } else {
                clearInterval(salto);
                this.caer();
            }
            }, 20);
    }
    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                 this.y += 10;
                 this.actualizarPosicion();
            } else {
                clearInterval(gravedad);
                this.y = 300;
                this.saltando = false;
                this.actualizarPosicion();
            }
        }, 20);
    }
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    colisionaCon(objeto) {
        const rana = this.element.getBoundingClientRect();
        const mosca = objeto.element.getBoundingClientRect();

        const margen = 60; 

        return (
           rana.left + margen < mosca.right - margen &&
           rana.right - margen > mosca.left + margen &&
           rana.top + margen < mosca.bottom - margen &&
           rana.bottom - margen > mosca.top + margen
        );   
    }
}
class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 80;
        this.height = 80;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }
     actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
} 
}

const juego = new Game();