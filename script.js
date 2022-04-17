
let apiDriven = "https://mock-api.driven.com.br/api/v6/uol/";
let nome_entrada;
let menssagem;
let chat =  document.querySelector(".chat");
let to="";
let tipo_msg="";
let aviso_envio="";
let tipo;
let lista_contatos;
let enter = document.querySelector(".texto");
enter.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        envio();
    }
});

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

function buscar_participantes(){
    let promise = axios.get(apiDriven+"participants");
    promise.then(postar_contatos);
}

function postar_contatos(response) {
    let participantes = response.data;
    let nomes="";
    for (j=0;j<=participantes.length-1;j++){
        let nome=participantes[j].name;
        nomes = nomes + "<div class='contato' onclick='check_contato(this)'><div class='parteum'><ion-icon class='icone_people_contato' name='person-circle'></ion-icon><h2>"+nome+"</h2></div><img class='img'/></div>"
    }
    lista_contatos=nomes;
    expor_infos_menu(lista_contatos)
}

 function expor_infos_menu(lista_contatos) {
    let fundo = document.querySelector(".fundo");
    fundo.classList.add("fundo_menu");
    fundo.setAttribute("onclick","ocultar()")
    let menu_lateral = document.querySelector(".menu");
    menu_lateral.classList.add("menu_lateral");
    menu_lateral.innerHTML="<div class='contatos'><div class='titulo_contatos'>Escolha um contato para enviar mensagem:</div><div class='contato' onclick='check_contato(this)'><div class='parteum'><ion-icon class='icone_people_contato' name='people'></ion-icon><h2>Todos</h2></div><img class='img'/></div>"+ lista_contatos+"</div><div class='visibilidade'><div class='titulo_visibilidade'>Escolha a visibilidade:</div><div class='contato' onclick='check_visibilidade(this)'><div class='parteum'><ion-icon class='icone_lock' name='lock-open'></ion-icon><h2>Público</h2></div><img class='img'/></div><div class='contato' onclick='check_visibilidade(this)'><div class='parteum'><ion-icon class='icone_lock' name='lock-closed'></ion-icon><h2>Reservadamente</h2></div><img class='img'/></div></div>";

 }

function abrir_menu(){
    aviso()
    buscar_participantes()
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
        promise.then(reinicio);
        promise.catch(erroEnvio);
        document.querySelector(".input").querySelector("input").value="" ;
        let aviso = document.querySelector(".aviso");
        aviso.innerHTML = "";
        aviso.classList.remove("enviando");
    }
}

function reinicio(){
   to="";
   tipo_msg="";
   buscar_msg();
}

function erroEnvio() {
    window.location.reload()
}

function entrar () {
    nome_entrada = document.querySelector(".tela_entrada").querySelector("input").value;
    let promise = axios.post(apiDriven+"participants", {name: nome_entrada});
    let tela = document.querySelector(".tela_entrada");
    tela.innerHTML="<img class='logo' src='imagens/logo_UOL.png'/><img class='load' src='imagens/load.jpg'/><h3>Entrando...</h3>"
    promise.then(ocultar_tela_entrada, setInterval(conexao,5000))
    promise.catch(tratarErro)
}


function tratarErro () {
    alert("Sinto muito, esse nome já está ativo. Por favor, tente novamente.");
}

function conexao () {
    let conex = axios.post(apiDriven+"status", {name: nome_entrada});
}

function expor_msg (response) {
    chat.innerHTML = "";
    let menssagens = response.data;
    setTimeout(buscar_msg, 3000);
    let cont=menssagens.length-1;
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
            let elemento_id = document.querySelector('.id'+i);
            elemento_id.scrollIntoView();
        }
    }
}

function ocultar_tela_entrada() {
    let tela_entrada = document.querySelector(".tela_entrada");
    tela_entrada.innerHTML="";
    tela_entrada.classList.remove("visivel")
    buscar_msg()
}

function buscar_msg () {
    let promise = axios.get(apiDriven+"messages");
    promise.then(expor_msg);
    
}

