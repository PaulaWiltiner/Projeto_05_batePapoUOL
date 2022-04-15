
let apiDriven = "https://mock-api.driven.com.br/api/v6/uol/";
let nome_entrada;
let menssagem;
let chat =  document.querySelector(".chat");

function contatos () {
    
}

function envio () {
    menssagem = document.querySelector(".texto").value ;
    let dados = {
        from: nome_entrada,
        to: "Todos",
        text: menssagem,
        type: "message" 
    }
    let promise = axios.post(apiDriven+"messages", dados);
    promise.then(buscar_msg)
    promise.catch(erroEnvio)
    document.querySelector("input").value="" ;
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

