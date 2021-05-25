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
FuncoesJavascriptHtml.prototype.typeof = function(value){
    let r = typeof value;
    if (Array.isArray(value) || value instanceof NodeList || value instanceof Array) {
        r = "array";
    }
    return r;
}
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
 * @param {object} params - os parametros de criacao
 * @returns 
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
window.jshtml = new FuncoesJavascriptHtml();

/*
uso:
window.jshtml.criar_elemento({
  tag:"div",
  parent:node,
  posicao:"afterbegin",
  props:[{
    prop:"class",
    value:"classe_a"
  }]
});
*/
