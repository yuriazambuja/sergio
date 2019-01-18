function gui_popup(message){
    alert(message);
}
function gui_request(resource,callback,exception){
    var backup = sessionStorage.getItem('gui_'+resource);
    if(backup){
        callback(backup);
        return true;
    }
    var request;
    if(window.XDomainRequest){
        request = new window.XDomainRequest();
    }else if(window.ActiveXObject){
        try{
            request = new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e){
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }else{
        request = new XMLHttpRequest();
    }
    request.onreadystatechange=function(){
        if(request.readyState==4){
            if(request.status==200){
                sessionStorage.setItem('gui_'+resource,request.responseText);
                callback(request.responseText);
            }else{
                if(exception){ exception(request.status); }
            }
        }
    };
    request.open("GET","./"+resource+".html",true);
    request.send();
    return false;
}
function gui_location(){
    var url = window.location.origin + window.location.pathname;
    if(arguments.length){
        url += "#/";
        for (i = 0; i < arguments.length; i++) {
            url += arguments[i] + "/";
        }
    }
    return url;
}
function gui_redirect(url){
    gui_replace(url);
    gui_navegation();
}
function gui_replace(url){
    window.history.replaceState({},'',window.location.origin+window.location.pathname+'?'+url);
}
function gui_argument(index){
    return window.location.search.substring(1).split('/')[index+1];
}
function gui_navegation(){
    if(window.location.hash){
        gui_replace(window.location.hash.substring(1));
    }
    if(!window.location.search){
        gui_replace('/');
    }
    if(window.location.search.indexOf('/')==-1){
        gui_replace('/cadastro/'+window.location.search.substring(1)+'/');
    }
    var url = gui_argument(0);
    if(!url){
        url = 'default';
    }
    gui_loading(true);
    gui_request(url,function(obj){
        $('#conteudo').html(obj);
        gui_loading(false);
    },gui_exception);
    gui_hyperlink(false);
}
function gui_message(exception){
    switch(exception){
        case 0: return {redirect:null,message:"Erro ao processar a solicitacao.\nVerifique a sua conexao com a Internet e tente novamente."};
        case 401: return {redirect:null,message:"Erro ao processar a solicitacao.\nO seu acesso foi encerrado por inatividade."};
        case 404: return {redirect:null,message:"Erro ao processar a solicitacao.\nRecurso Indisponivel."};
        case 500: return {redirect:null,message:"Erro ao processar a solicitacao.\nEstamos enfrentando dificuldades tecnicas no momento."};
        default:  return {redirect:null,message:"Erro ao processar a solicitacao.\nOcorreu um erro não previsto. Tente novamente em breve."};
    }
}
function gui_exception(exception){
    gui_loading(false);
    obj = gui_message(exception);
    gui_popup(obj.message);
    if(obj.redirect){
        location.hash = obj.redirect;
    }
}
function gui_loading(status){
    if(status){
        $('body').addClass("loading");
    }else{
        $('body').removeClass("loading");
    }
}
function gui_hyperlink(status){
    if(status){
        $('body').addClass("hyperlink");
    }else{
        $('body').removeClass("hyperlink");
    }
}
var var_username = null;
function gui_set_username(username){
    var_username = username;
}
function gui_get_username(){
    return var_username;
}
$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      document.activeElement.blur();
      return false;
    }
});
$(window).on('load',function(){
    $("#hyperlink-sim").click(function(){
        gui_hyperlink(true);
    });
    $("#hyperlink-nao").click(function(){
        gui_hyperlink(false);
    });
    sessionStorage.clear();
    gui_loading(false);
    gui_navegation();
});
$(window).on('popstate',gui_navegation);
