function api(cache,resource,object,callback,exception){
    if(cache){
        var backup = sessionStorage.getItem('api_'+cache);
        if(backup){
            callback(JSON.parse(backup));
            return true;
        }
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
                if(cache){
                    sessionStorage.setItem('api_'+cache,request.responseText);
                }
                callback(JSON.parse(request.responseText));
            }else{
                if(exception){ exception(request.status); }
            }
        }
    };
    request.open("POST","https://sergio.azamba.com.br/api/"+resource+".php",true);
    request.setRequestHeader("content-type","application/json; charset=UTF-8");
    request.send(JSON.stringify(object));
    return false;
}
function api_set_login(user,pswd,callback,exception){
    return api(null,"seguranca",{user:user,pswd:pswd},callback,exception);
}
function api_set_logout(callback,exception){
    return api(null,"seguranca",null,callback,exception);
}
function api_get_regiao(callback,exception){
    return api('localidade',"localidade",null,callback,exception);
}
function api_get_localidade(localidade,callback,exception){
    return api('localidade_'+localidade,"localidade",{regiao:localidade},callback,exception);
}
function api_get_token(email,prefixo,sufixo,callback,exception){
    return api(null,"validacao",{email:email,prefixo:prefixo,sufixo:sufixo},callback,exception);
}
function api_get_cadastro(token,callback,exception){
    return api(null,"cadastro",{token:token,usuario:null},callback,exception);
}
function api_set_cadastro(token,nome,data,genero,localidade,senha,callback,exception){
    return api(null,"cadastro",{token:token,usuario:{nome:nome,data:data,genero:genero,localidade:localidade,senha:senha}},callback,exception);
}
function api_get_atividade(callback,exception){
    return api('atividade',"atividade",null,callback,exception);
}
