var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lengthPixel = 5;
function Start() {
    Engine();
}
function Engine() {
    Atualiza();
    Desenha();
    window.requestAnimationFrame(Engine);
}
function Atualiza() {
    Mar.atualizar();
    Comida.atualizar();
    Player.atualizar();
}
function Desenha() {
    background.desenhar();
    Comida.desenhar();
    Player.desenhar();
    Mar.desenhar();
    Sede.desenhar();
}
var background = {
    cor: "#D2B48C",
    altura: canvas.height,
    largura: canvas.width,
    desenhar: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, 0, this.largura, this.altura);
    }
}
var Mar = {
    x: 0,
    y: 0,
    w: lengthPixel,
    h: lengthPixel,
    countX: 0,
	countY: 0,
    coord: [],
    ready: false,
    desenhar: function () {
        ctx.fillStyle = "blue";
        for (var m in this.coord) {
            var mr = this.coord[m];
            ctx.fillRect(mr.x, mr.y, mr.w, mr.h);
        }
    },
    atualizar: function () {
        // Criar Agua
		if(!this.ready){
			// Pos Y chegar no max em X
			if(this.countX > canvas.width - this.coord.length){
				var posY = this.countY + lengthPixel;
				this.countY += lengthPixel;
				this.countX = 0;
			}else{
				var posY = this.countY;
			}
			var posX = this.countX;
			this.coord.push({
				x: posX,
				y: posY,
				w: this.w,
				h: this.h
			});
			this.countX += lengthPixel;
			if(this.countY > canvas.height / 2)
			{
				this.ready = true;
			}
		}
    }
}

var Sede = {
    x: 150,
    y: 85,
    w: lengthPixel,
    h: lengthPixel,
    Life: 0,
    desenhar() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "black";
        ctx.font = "8px arial";
        ctx.fillText("Vidas: " + this.Life, 10, 20);
        ctx.fillText("Agentes: " + Player.monster.length,10, 10);
    }
}

var Comida = {
    x: 30,
    y: 30,
    w: lengthPixel,
    h: lengthPixel,
    quantidade: 10,
    coord: [],
    desenhar() {
        if (Mar.ready) {
            ctx.fillStyle = "brown";
            for (var c in this.coord) {
                var cm = this.coord[c];
                ctx.fillRect(cm.x, cm.y, cm.w, cm.h);
            }
        }
    },
    atualizar() {
        if (Mar.ready) {
            if (0 < this.quantidade) {
                var x = Math.floor((Math.random() * 295) + 1);
                var y = Math.floor((Math.random() * 145) + 1);
                // x
                x = String(x);
                var lastX = x[x.length];
                var n = "";
                // remove ultimo numero para por numero lengthPixel
                for (var i = 0; i < x.length - 1; i++) {
                    n += x[i];
                }
                if (lastX < lengthPixel) {
                    n += lengthPixel;
                } else {
                    n += 0;
                }
                x = parseInt(n);
                // y
                y = String(y);
                var lastY = y[y.length];
                n = "";
                // remove ultimo numero para por numero lengthPixel
                for (var i = 0; i < y.length - 1; i++) {
                    n += y[i];
                }
                if (lastY < lengthPixel) {
                    n += lengthPixel;
                } else {
                    n += 0;
                }
                y = parseInt(n);
                if (this.posicaoValida(x, y)) {
                    this.x = x;
                    this.y = y;
                    this.quantidade--;
                    this.coord.push({ x: this.x, y: this.y, w: this.w, h: this.h });
                }
            }
        }
    },
    posicaoValida(x, y) {
        var valido = true;
        var coord = Mar.coord;
        for (var item in coord) {
            if (x == coord[item].x && y == coord[item].y) {
                valido = false;
            }
        }
        return valido;
    }
}

var typeWalker = {
    oneDirection: 0,
    circle: 1
}

var Player = {
    cor: "white",
    x: Sede.x,
    y: Sede.y,
    w: lengthPixel,
    h: lengthPixel,
    typeWalker: typeWalker.oneDirection,
    comida: false,
    agua: false,
    monster: [],
    desenhar() {
        // Se tiver desenhado o cenario
        if (Mar.ready) {
            for (var m in this.monster) {
                var monst = this.monster[m];
                ctx.fillStyle = monst.cor;
                ctx.fillRect(monst.x, monst.y, monst.w, monst.h);
            }
        }
        

    },
    inserir: function () {
        this.monster.push({
            x: Sede.x,
            y: Sede.y,
            w: lengthPixel,
            h: lengthPixel,
            typeWalker: typeWalker.oneDirection,
            comida: false,
            agua: false,
            cor: this.cor
        })
    },
    atualizar: function () {
        // Se tiver desenhado o cenario
        if (Mar.ready) {
            // Laço para cada monster fazer atualizaçao do percurso
            for (var m in this.monster) {
                var mons = this.monster[m];

                // Verifica se tem Agua
                if (this.HasAgua(mons)) {
                    mons.agua = true;
                    if (mons.comida) {
                        mons.cor = "#FFD700";
                    } else {
                        mons.cor = "#00BFFF";
                    }
                }
                // Verifica se tem Agua
                if (this.HasComida(mons)) {
                    mons.comida = true;
                    if (mons.agua) {
                        mons.cor = "#FFD700";
                    } else {
                        mons.cor = "#FF6347";
                    }

                }

                // Verifica qual tipo de walker o monster é
                if (mons.agua && mons.comida) {
                    this.BackSede(mons);
                }
                else if (typeWalker.oneDirection == mons.typeWalker) {
                    this.WalkerMonster(mons);
                }
            }
        }
    },
    HasAgua: function (mons) {
        var coord = Mar.coord;
        for (var item in coord) {
            if (mons.x == coord[item].x && mons.y == coord[item].y) {
                return true;
            }
        }
        return false;
    },
    HasComida: function (mons) {
        var coord = Comida.coord;
        for (var item in coord) {
            if (mons.x == coord[item].x && mons.y == coord[item].y) {
                return true;
            }
        }
        return false;
    },
    BackSede: function (mons) {
        if (mons.x < Sede.x) {
            mons.x += lengthPixel;
        }
        else if (mons.x > Sede.x) {
            mons.x -= lengthPixel;
        }
        else if (mons.y < Sede.y) {
            mons.y += lengthPixel;
        }
        else if (mons.y > Sede.y) {
            mons.y -= lengthPixel;
        }
        // Chegou na Sede
        if (mons.x == Sede.x && mons.y == Sede.y) {
            mons.agua = false;
            mons.comida = false;
            mons.cor = this.cor;
            Sede.Life++;
        }
    },
    WalkerMonster: function (mons) {
        // Andar em uma direcao
        var d = {
            direita: 1,
            cima: 2,
            esquerda: 3,
            baixo: 4
        }
        var direcao = Math.floor((Math.random() * 4) + 1)
        // Direita
        if (mons.x < canvas.width - mons.w && direcao == d.direita) {
            mons.x += lengthPixel;
        }
        // Cima
        else if (mons.y > 0 && direcao == d.cima) {
            mons.y -= lengthPixel;
        }
        // esquerda
        else if (0 < mons.x && direcao == d.esquerda) {
            mons.x -= lengthPixel;
        }
        // baixo
        else if (mons.y < canvas.height && direcao == d.baixo) {
            mons.y += lengthPixel;
        }
    }
}
Start();

var newPlayer = setInterval(function () {
    Player.inserir();
}, 10000);

var deadPlayer = setInterval(function (){
	debugger;
	var player = Player.monster;
	var qntMorre = player.length - Sede.Life;
	// Sobra qnts lifes
	if(0 > qntMorre)
	{
		Sede.Life = Sede.Life -  player.length;
	}else{
		Sede.Life = 0;
	}
	// mata primeiro que nao tem agua ou comida
	for(var m in player)
	{
		if(0 < qntMorre){
			if(!player[m].comida || !player[m].agua)
			{
				player.splice(m, 1);
				qntMorre--;
			}
		}
	}
	// mata quem nao tiver agua
	for(var m in player)
	{
		if(0 < qntMorre){
			if(!player[m].agua)
			{
				player.splice(m, 1);
				qntMorre--;
			}
		}
	}
	// mata qm puder || salvas qm puder
	for(var m in player)
	{
		if(0 < qntMorre){
			player.splice(m, 1);
			qntMorre--;
		}
	}
}, 50000);