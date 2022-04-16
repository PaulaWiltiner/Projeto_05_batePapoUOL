
let apiDriven = "https://mock-api.driven.com.br/api/v6/uol/";
let nome_entrada;
let menssagem;
let chat =  document.querySelector(".chat");
let to="";
let tipo_msg="";
let aviso_envio="";
let tipo;

function aviso() {
    aviso_envio = "Enviando para " + to;
    if(tipo_msg==="Reservadamente"){
        aviso_envio = "Enviando para " + to + " (reservadamente)"
    }
    if(tipo_msg==="Público"){
        aviso_envio = "Enviando para " + to + " (público)"
    }
    let aviso = document.querySelector(".aviso");
    aviso.innerHTML = aviso_envio;
    aviso.classList.add("enviando");
}

function abrir_menu(){
    aviso()
    let fundo = document.querySelector(".fundo");
    fundo.classList.add("fundo_menu");
    fundo.setAttribute("onclick","ocultar()")
    let menu_lateral = document.querySelector(".menu");
    menu_lateral.classList.add("menu_lateral");
    menu_lateral.innerHTML=" <div class='contatos'><div class='titulo_contatos'>Escolha um contato para enviar mensagem:</div><div class='contato' onclick='check_contato(this)'><div class='parteum'><ion-icon class='icone_people_contato' name='people'></ion-icon><h2>Todos</h2></div><img class='img'/></div><div class='contato' onclick='check_contato(this)'><div class='parteum'><ion-icon class='icone_people_contato' name='person-circle'></ion-icon><h2>João</h2></div><img class='img'/></div></div><div class='visibilidade'><div class='titulo_visibilidade'>Escolha a visibilidade:</div><div class='contato' onclick='check_visibilidade(this)'><div class='parteum'><ion-icon class='icone_lock' name='lock-open'></ion-icon><h2>Público</h2></div><img class='img'/></div><div class='contato' onclick='check_visibilidade(this)'><div class='parteum'><ion-icon class='icone_lock' name='lock-closed'></ion-icon><h2>Reservadamente</h2></div><img class='img'/></div></div>";
}


function ocultar () {
    if (to==="Todos" && tipo_msg==="Reservadamente"){
        alert("Para que a mensagem seja enviada para Todos , por favor, escolha a opção Público.")
    }else {
        if(to === "" || tipo_msg ==="" ){
           alert("Antes de enviar a sua menssagem , você precisa escolher o destinatário e o tipo de visibilidade.")
        } else {
            let menu_lateral = document.querySelector(".menu");
            menu_lateral.innerHTML="";
            menu_lateral.classList.remove("menu_lateral");
            let fundo = document.querySelector(".fundo");
            fundo.classList.remove("fundo_menu");
        }
    }
}

function check_contato (elemento) {
    let contatos = document.querySelector(".contatos");
    if(contatos.querySelector(".check")===null){
        elemento.querySelector("img").setAttribute("src","imagens/checkmark.png");
        elemento.classList.add("check");
        to=elemento.querySelector(".parteum").querySelector("h2").innerHTML;
        aviso()
    }else {
        if(elemento.classList.contains("check")===false){
            contatos.querySelector(".check").querySelector("img").removeAttribute("src");
            contatos.querySelector(".check").classList.remove("check");
            elemento.querySelector("img").setAttribute("src","imagens/checkmark.png")
            elemento.classList.add("check");
            to=elemento.querySelector(".parteum").querySelector("h2").innerHTML;
            aviso()
        }
    }
}

function check_visibilidade (elemento) {
    let contatos = document.querySelector(".visibilidade");
    if(contatos.querySelector(".check")===null){
        elemento.querySelector("img").setAttribute("src","imagens/checkmark.png");
        elemento.classList.add("check");
        tipo_msg=elemento.querySelector(".parteum").querySelector("h2").innerHTML;
        aviso()
    }else {
        if(elemento.classList.contains("check")===false){
            contatos.querySelector(".check").querySelector("img").removeAttribute("src");
            contatos.querySelector(".check").classList.remove("check");
            elemento.querySelector("img").setAttribute("src","imagens/checkmark.png")
            elemento.classList.add("check");
            tipo_msg=elemento.querySelector(".parteum").querySelector("h2").innerHTML;
            aviso()
        }
    }
}

function envio () {
    menssagem = document.querySelector(".texto").value ;
    if(to==="" || tipo_msg===""){
        alert ("Antes de enviar , você precisa escolher o destinatário.")
    } else {
        if(tipo_msg==="Reservadamente"){
            tipo = "private_message"
        }
        if(tipo_msg==="Público"){
            tipo = "message"
        }
        let dados = {
            from: nome_entrada,
            to: to,
            text: menssagem,
            type: tipo
        }
        let promise = axios.post(apiDriven+"messages", dados);
        promise.then(buscar_msg);
        promise.catch(erroEnvio);
        document.querySelector("input").value="" ;
    }
}

function erroEnvio() {
    window.location.reload()
}

function entrar () {
    nome_entrada = prompt("Com qual nome gostaria de entrar no chat ?");
    let promise = axios.post(apiDriven+"participants", {name: nome_entrada});
    promise.then(buscar_msg, setInterval(conexao,5000))
    promise.catch(tratarErro)
}
entrar()

function tratarErro () {
    alert("Sinto muito, esse nome já está ativo. Por favor, tente novamente.");
    entrar();
}

function conexao () {
    let conex = axios.post(apiDriven+"status", {name: nome_entrada});
}

function expor_msg (response) {
    chat.innerHTML = "";
    let menssagens = response.data;
    setTimeout(buscar_msg, 3000);
    const cont=menssagens.length-1;
    for ( i=0 ; i<=cont ; i++ ){
        let menssagem = menssagens[i];
        let tipo = menssagem.type;
        if(tipo==="status"){
            chat.innerHTML = chat.innerHTML + "<div class='menssagem cinza2 id"+i+"'><p> <spam class='cinza' >"+ menssagem.time +" </spam><strong> "+ menssagem.from +" </strong>"+ menssagem.text+"</p></div>"
        }
        if(tipo==="message"){
            chat.innerHTML = chat.innerHTML + "<div class='menssagem id"+i+"'><p> <spam class='cinza' >"+ menssagem.time +" </spam><strong> "+ menssagem.from +"</strong> para "+ "<strong>"+ menssagem.to +"</strong> : "+ menssagem.text +"</p></div>"
        }
        if(tipo==="private_message"){
            if(nome_entrada===menssagem.to){
                 chat.innerHTML = chat.innerHTML + "<div class='menssagem rosa id"+i+"'><p>"+ menssagem.time +" </spam><strong> "+ menssagem.from +"</strong> reservadamente para "+ "<strong>"+ menssagem.to +"</strong> : "+ menssagem.text +"</p></div>"
            }
        }
        if (i===cont) {
            const element = document.querySelector('.id'+i);
            element.scrollIntoView();
        }
    }
}

function buscar_msg () {
    let promise = axios.get(apiDriven+"messages");
    promise.then(expor_msg);
    
}

