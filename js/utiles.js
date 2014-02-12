function localizacoordenadas()
	{
		 if (navigator.geolocation)
    {
    		navigator.geolocation.getCurrentPosition(muestraPosicion);
    }
 		 else{console.log="Geolocalización  no esta soportado por el navegador";}
	}; //fin localiza coordenadas
function muestraPosicion(position)
  {
  var longi=position.coords.latitude;
  var lati=position.coords.longitude;
  return [longi,lati] ; 
  } //fin muestra posicion	
function getLocation()
  {
 var x=document.getElementById("localizador");
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  x.innerHTML="Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;	
  }
//Genera un mapa de google maps  
function mapa()
 {
	var lat=$('#latitud2').val();
	var lon=$('#longitud2').val();
	var coords=new google.maps.LatLng(lat,lon);
	//Add map options
	var mapOptions = {
 //zoom level, between 0 to 21.
    zoom: 15,
    //center to the user location
    center: coords,
    //add map type controls.
    mapTypeControl: true,
    //navigation control options
    navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL
        },
    //default map type
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
// Create the map, and place it in the mapContainer div
	map = new google.maps.Map(
    document.getElementById("mapContainer"), mapOptions
    );
// Place the initial marker
    var marker = new google.maps.Marker({
                position: coords,
                map: map,
                title: "Tu estas Aquí!"
                });
 }; 
	
function progress(percent, element) {
	largo=element.height();
	var offset=element.offset();
	var alto=offset.top;
	var bajo=alto+largo;
	var progressBarHeight = parseFloat(percent) * parseFloat(largo / 100);
	$('#barometro_inte').css({position:'absolute',top:bajo,height:0});
	$('#barometro_inte').animate({top:bajo-progressBarHeight,height:progressBarHeight}, 800).html(percent + "%&nbsp;");
	$('#barometro_inte').animate({top:(bajo-progressBarHeight)-10,height:progressBarHeight+10}, 800).html(percent + "%&nbsp;");
	$('#barometro_inte').animate({top:bajo-progressBarHeight+10,height:progressBarHeight-10}, 800).html(percent + "%&nbsp;");
	$('#barometro_inte').animate({top:bajo-progressBarHeight,height:progressBarHeight}, 800).html(percent + "%&nbsp;");
}
function julday(year, month, day) {
	if (year < 0) { year ++; }
	var jy = parseInt(year);
	var jm = parseInt(month) +1;
	if (month <= 2) {jy--;	jm += 12;	} 
	var jul = Math.floor(365.25 *jy) + Math.floor(30.6001 * jm) + parseInt(day) + 1720995;
	if (day+31*(month+12*year) >= (15+31*(10+12*1582))) {
		ja = Math.floor(0.01 * jy);
		jul = jul + 2 - ja + Math.floor(0.25 * ja);
	}
	//console.log("Dia juliano: "+jul);
	return jul;
}
function Trig2(year,month,day) {
	n = Math.floor(12.37 * (year -1900 + ((1.0 * month - 0.5)/12.0)));
	RAD = 3.14159265/180.0;
	t = n / 1236.85;
	t2 = t * t;
	as = 359.2242 + 29.105356 * n;
	am = 306.0253 + 385.816918 * n + 0.010730 * t2;
	xtra = 0.75933 + 1.53058868 * n + ((1.178e-4) - (1.55e-7) * t) * t2;
	xtra += (0.1734 - 3.93e-4 * t) * Math.sin(RAD * as) - 0.4068 * Math.sin(RAD * am);
	i = (xtra > 0.0 ? Math.floor(xtra) :  Math.ceil(xtra - 1.0));
	j1 = julday(year,month,day);
	jd = (2415020 + 28 * n) + i;
	return (j1-jd + 30)%30;
}
//calculamos el dia de la fase lunar
function calcula_luna()
	{
		fecha=new Date();
		var ano=fecha.getFullYear();
		var mes=fecha.getMonth()+1;
		var dia=fecha.getDate();
		//console.log("dia: "+dia +" Mes es: "+mes+" Año es: "+ano);
		//Calcula del dia juliano
		julday(ano,mes,dia);
		var fecha_lunar= Trig2(ano,mes,dia);
	switch(fecha_lunar)
		{
		case checkLuna(fecha_lunar,0,6) :
			$('#fecha_lunar').text("Luna Nueva");
			$('<img>',{src:'images/nueva.png', alt:'Luna Nueva'}).appendTo($('#imagen_lunar'));
		break;
		case checkLuna(fecha_lunar,7,14) :
			$('#fecha_lunar').text("Cuarto Creciente");
			$('<img>',{src:'images/creciente.png', alt:'Cuarto Creciente', class:'circular'}).appendTo($('#imagen_lunar'));
		break;
		case checkLuna(fecha_lunar,15,21) :
			$('#fecha_lunar').text("Luna Llena");
			$('<img>',{src:'images/llena.png', alt:'Luna Llena'}).appendTo($('#imagen_lunar'));
		break;
		case checkLuna(fecha_lunar,22,28) :
			$('#fecha_lunar').text("Cuarto Menguante");
			$('<img>',{src:'images/menguante.png', alt:'Luna Menguante'}).appendTo($('#imagen_lunar')).addClass("imagen_lunar");
		break;
		}// fin switch
	}
	function checkLuna(valor,minimo, maximo)
	{
		if (valor<=maximo && valor>=minimo) {return valor;}
		else {return !valor; console.log("El valor no esta dentro del minimo y maximo:"+valor);}
	}