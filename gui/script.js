function camera(obj,sec){
	obj.url = obj.url ? obj.url : obj.src;
	this.obj = obj;
	this.sec = sec;
	this.loop = function () {
		var _this = this;
		setTimeout(function(){_this.step();},this.sec*3000);
	};
	this.step = function(){
		this.obj.src = this.obj.url+new Date().getTime();
	};
	this.loop();
}

    ImgCamera = function(url,loop,id,img){
        var _id = id;
        var _url = url;
        var _img = img;
        var _loop = loop;
        var _obj = new XMLHttpRequest();
        var _execute = function(){
            _obj.timeout = 10000;
            _obj.open('POST',_url,true);
            _obj.send(_id);
        };
        var _reset = function(){
            setTimeout(_execute,_loop);
        };
        _obj.onreadystatechange = function() {
            if(_obj.readyState == 4) {
                if(_obj.status == 200) {
                    document.getElementById(img).src = "data:image/png;base64,"+_obj.responseText;
                    setTimeout(_execute,_loop);
                }
            }
        };
        _obj.ontimeout = _reset;
        _obj.onabort = _reset;
        _obj.onerror = _reset;
        _execute();
    };
    
function mask_size(msk){
    k=0;
    for(j=0;j<msk.length;j++){
      if(msk[j]=='_'){
        k++;
      }
    }
    return k;
}
 
function mask_sort(one,two){
  return mask_size(one)-mask_size(two);
}

function mask_text_up(evt,obj,txt){
  var key = (evt.which) ? evt.which : event.keyCode;
  if(key==229){
    txt.sort(mask_sort);
    val = obj.value.replace(/\D/g,"").substring(0,mask_size(txt[txt.length-1])).split('');
    for(i=0;i<txt.length;i++){
      if(val.length<=mask_size(txt[i])){
        txt = txt[i].split('');
        for(i=0;i<txt.length;i++){
          if(txt[i]=='_'){
            if(val.length>0){
              txt[i] = val.shift();
            }else{
              txt[i] = '_';
            }
          }
        }
        obj.value = txt.join('');
        mask_load(obj);
        break;
      }
    }
    return false;
  }else{
    return true;
  }
}

function mask_text_dw(evt,obj,txt){
  var key = (evt.which) ? evt.which : event.keyCode;
  if(key==229){
    return true;
  }else{
    txt.sort(mask_sort);
    val = obj.value.replace(/\D/g,"").split('');
    if(key>=96&&key<=106){
      val.push(String.fromCharCode(key-48));
    }else if(key>=48&&key<=57){
      val.push(String.fromCharCode(key));
    }else if(key==8){
      val.pop();
    }else if(key==9||key==16||key==13){
      return true;
    }
    for(i=0;i<txt.length;i++){
      if(val.length<=mask_size(txt[i])){
        txt = txt[i].split('');
        for(i=0;i<txt.length;i++){
          if(txt[i]=='_'){
            if(val.length>0){
              txt[i] = val.shift();
            }else{
              txt[i] = '_';
            }
          }
        }
        obj.value = txt.join('');
        mask_load(obj);
        break;
      }
    }
    return false;
  }
}

function mask_real_bk(evt,obj,tam){
  txt=new Array();
  var key = (evt.which) ? evt.which : event.keyCode;
  val = obj.value.replace(/\D/g,"").split('');
  if(key==9||key==16||key==13){
    return true;
  }else if(key==8){
    val.pop();
  }else if(val.length>9){
    return false;
  }else if(key>=96&&key<=106){
    val.push(String.fromCharCode(key-48));
  }else if(key>=48&&key<=57){
    val.push(String.fromCharCode(key));
  }
  while(val.length>0&&val[0]=='0'){
    val.shift();
  }
  while(val.length<tam+1){
    val.unshift('0');
  }
  if(tam>0){
    for(i=0;i<tam;i++){
      txt.unshift(val.pop());
    }
    txt.unshift(".");
  }
  while(val.length>0){
    txt.unshift(val.pop());
  }
  obj.value = txt.join('');
  return false;
}

function mask_real_dw(evt,obj,tam){
  var key = (evt.which) ? evt.which : event.keyCode;
  if(key==229){
    return true;
  }else{
    txt=new Array();
    val = obj.value.replace(/\D/g,"").split('');
    if(key==9||key==16){
      return true;
    }else if(key==8){
      val.pop();
    }else if(val.length>=10){
      return false;
    }else if(key>=96&&key<=106){
      val.push(String.fromCharCode(key-48));
    }else if(key>=48&&key<=57){
      val.push(String.fromCharCode(key));
    }
    while(val.length>0&&val[0]=='0'){
      val.shift();
    }
    while(val.length<tam+1){
      val.unshift('0');
    }
    if(tam>0){
      for(i=0;i<tam;i++){
        txt.unshift(val.pop());
      }
      txt.unshift(".");
    }
    while(val.length>0){
      txt.unshift(val.pop());
    }
    obj.value = txt.join(''); 
    return false;
  }
}

function mask_real_up(evt,obj,tam){
  var key = (evt.which) ? evt.which : event.keyCode;
  if(key==229){
    txt=new Array();
    val = obj.value.replace(/\D/g,"").substring(0,10).split('');
    while(val.length>0&&val[0]=='0'){
      val.shift();
    }
    while(val.length<tam+1){
      val.unshift('0');
    }
    if(tam>0){
      for(i=0;i<tam;i++){
        txt.unshift(val.pop());
      }
      txt.unshift(".");
    }
    while(val.length>0){
      txt.unshift(val.pop());
    }
    obj.value = txt.join('');
    return false;
  }else{
    return true;
  }
}

function mask_load(obj){
    k = obj.value.length;
    for(i=0;i<k;i++){
        if(obj.value.charAt(i)=='_'){
          for(j=i-1;j>=0;j--){
            if(obj.value.charAt(j)>='0'&&obj.value.charAt(j)<='9'){
              return obj.setSelectionRange(j+1,j+1);
            }
          }
          return obj.setSelectionRange(i,i);
        }
    }
    obj.setSelectionRange(k,k);
}


		function splash(status){
			document.getElementById('splash').style.display=status?'block':'none';
		}


		function popup(element){
			element.style.display='none';
		}


function httprequest(address,posting,callback){
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
        request = new XMLHttpRequest(); // IE7+, Firefox, Chrome, Opera, Safari

    }
    request.onreadystatechange=function(){
        if(request.readyState==4 && request.status==200){
            callback(request.responseText);
        }
    }
    request.open(posting.length?"POST":"GET",address,true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=iso-8859-1");
    request.send(posting.length?posting:null);
}

function geolocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(
			function(gps){
				httprequest("//maps.google.com/maps/api/geocode/json?latlng="+gps.coords.latitude + ","
					+ gps.coords.longitude,"", function(txt){
						obj = JSON.parse(txt);
		arg = new Array();
		if(obj.status=="OK"){
			for(r in obj.results){
				for(c in obj.results[r].address_components){
					if(obj.results[r].address_components[c].types.indexOf("postal_code")!=-1){
						if(obj.results[r].address_components[c].types.indexOf("postal_code_prefix")==-1){
							arg.push({postalcode:obj.results[r].address_components[c].short_name,
							coordinates:coordinates(
								obj.results[r].geometry.bounds.southwest.lat,
								obj.results[r].geometry.bounds.southwest.lng,
								obj.results[r].geometry.bounds.northeast.lat,
								obj.results[r].geometry.bounds.northeast.lng
							)});
						}
					}
				}
			}
		}

						httprequest("/webservice/geolocation.php?accuracy=" + gps.coords.accuracy,
							JSON.stringify(arg), function(ret){
								obj = document.getElementById('geolocation').innerHTML=ret;
							}
						)
					}
				)
			}, 
			function(error){
				switch(error.code){
					case error.TIMEOUT:
						//document.write('Timeout');
						break;
					case error.POSITION_UNAVAILABLE:
						//document.write('Position unavailable');
						break;
					case error.PERMISSION_DENIED:
						//document.write('Permission denied');
						break;
					case error.UNKNOWN_ERROR:
						//document.write('Unknown error');
						break;
				}
			}
		);
	}
}

function coordinates(lat1, lon1, lat2, lon2){
	var dLat = (lat2-lat1)*Math.PI/180;
	var dLon = (lon2-lon1)*Math.PI/180;
	var lat1 = (lat1)*Math.PI/180;
	var lat2 = (lat2)*Math.PI/180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	return Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function openFullscreen(obj) {
  if (obj.requestFullscreen) {
    obj.requestFullscreen();
  } else if (obj.mozRequestFullScreen) { // Firefox
    obj.mozRequestFullScreen();
  } else if (obj.webkitRequestFullscreen) { // Chrome, Safari and Opera 
    obj.webkitRequestFullscreen();
  } else if (obj.msRequestFullscreen) { // IE-Edge 
    obj.msRequestFullscreen();
  }
}

function closeFullscreen(obj) {
  if (obj.exitFullscreen) {
    obj.exitFullscreen();
  } else if (obj.mozCancelFullScreen) { // Firefox
    obj.mozCancelFullScreen();
  } else if (obj.webkitExitFullscreen) { // Chrome, Safari and Opera
    obj.webkitExitFullscreen();
  } else if (obj.msExitFullscreen) { // IE-Edge
    obj.msExitFullscreen();
  }
}
