/*Classe FuncoesJavascriptHtml
* Cria elementos html via javascript
*/
const FuncoesJavascriptHtml = function(){
    this.posicao_inclusao = 'beforeend';
    this.tags_fechamento_simples = [
        "input",
        "br"
    ]
};

/**
 * obtem o typeof, diferentemente do typeof normal, retorna a palavra "array" em vez de "object" caso seja uma 
 * instancia do tipo array ou nodelist.
 * @param {variant} value - o valor a ser obtido o tipo
 * @returns {string} - o typeof encontrado
 */
FuncoesJavascriptHtml.prototype.typeof = function(value){
    let r = typeof value;
    if (Array.isArray(value) || value instanceof NodeList || value instanceof Array) {
        r = "array";
    }
    return r;
}

/**
 * Obtem o ultimo elemento html incluido conforme params.posicao
 * @param {json object} params - o mesmo params da criacao do elemento ou que contenha pelo menos seu .parent
 * @returns {object} - o elemento encontrado
 */
FuncoesJavascriptHtml.prototype.obter_ultimo_adicionado = function(params) {
    try {
        let retorno = null;
        if (typeof params.parent === "object") {                       
            switch((params.posicao || window.jshtml.posicao_inclusao).trim().toLowerCase()) {
                case "beforeend":
                    retorno = params.parent.lastChild;
                    break;
                case "afterbegin":
                    retorno = params.parent.firstChild;
                    break;
                case "afterend":
                    retorno = params.parent.nextSibling;
                    break;
                case "beforebegin":
                    retorno = params.parent.prevSibling;
                    break;
                default:
                    throw 'Posicao nao esperada: ' + (params.posicao || window.jshtml.posicao_inclusao);
                    break;                        
            }
        }  
        return retorno;              
    } catch(e) {
        console.log(e);
        alert(e.message || e);
        return null;
    }
}

/**
 * Cria um elemento html e retorna-o como texto ou DomObject, adicionalmente ja inserindo-o no html se passado 
 * params.parent nao nulo.
 * @param {json object | string} params - os parametros de criacao (json) ou a tag html(string)
 * @returns {object | string} - o elemento criado ou seu texto html (caso params.retornar_como = texto)
 */
FuncoesJavascriptHtml.prototype.criar_elemento = function(params) {
    try {
        let retorno = '';
        params = params || {};
        if (typeof params === "string") {
            params = {tag:params};
        }  
        params.retornar_como = params.retornar_como || 'string';              
        if (params.retornar_como === "string") {
            retorno += '<' + (params.tag || 'div');
            if (window.jshtml.typeof(params.props) === "array" && params.props.length) {
                let arr_props = [];
                for(let i in params.props) {
                    if (typeof params.props[i].value !== "undefined") {
                        arr_props.push(params.props[i].prop + '="' + params.props[i].value + '"');
                    } else {
                        arr_props.push(params.props[i].prop);
                    }
                }
                retorno += ' ' + arr_props.join(' ');
                
            }
            if (window.jshtml.tags_fechamento_simples.indexOf(params.tag) > -1) {
                retorno += '/>';
            } else {
                retorno += '>';
                retorno += (params.conteudo || '');
                retorno += '</'+ (params.tag || div) +'>';
            }
            if (typeof params.parent === "object") {                           
                console.log(params,retorno);                     
                params.parent.insertAdjacentHTML(params.posicao || window.jshtml.posicao_inclusao, retorno);
                retorno = window.jshtml.obter_ultimo_adicionado(params);
            }                 
        } else {
            retorno = document.createElement(params.tag);
            if (window.jshtml.typeof(params.props) === "array" && params.props.length) {
                for(let i in params.props) {
                    if (typeof params.props[i].value !== "undefined") {
                        retorno.setAttribute(params.props[i].prop, params.props[i].value);
                    } else {
                        retorno.setAttribute(params.props[i].prop);
                    }
                }
            }
            if (typeof params.parent === "object") {
                params.parent.insertAdjacentElement(params.posicao || window.jshtml.posicao_inclusao,retorno);                        
            }
        }
        return retorno;
    } catch (e){
        console.log(e);
        alert(e.message || e);
        return null;
    }
}

/*Instancia a classe em window.jshtml, se preferir outra designacao, altere, mas atencao que a própria classe
pode se referenciar por esse endereço. Então se alterar aqui, procure essa referencia no codigo e altere também.
Se possível, deixe como está.*/
window.jshtml = new FuncoesJavascriptHtml();

/*
uso comum:
window.jshtml.criar_elemento({
  tag:"div",
  parent:node,
  posicao:"afterbegin",
  props:[{
    prop:"class",
    value:"classe_a"
  }]
});
teste de comentarios
*/
