/* llancaweb.js
	Version:     0.1
 * Author:      Valentin Luque
 * Contact:     valenti.luque@gmail.com
 * Website:     http://www.artinfinity.net/
*/
(function($){
$.fn.recuperarxml=function(fichero,options)
		{		
			var settings=$.extend({
					resultado:{fecha:null,temperatura:null,texto:null,code:null,minima:null,maxima:null,minimat:null,maximat:null},
					astronomia:{sunrise:null,sunset:null,latitud:null,longitud:null},
					atmosfera:{humedad:null,visibilidad:null,presion:null,incremento:null},
					viento:{sensacion_termica:null,direccion:null,velocidad:null},
					woeid:'757813'
				},options||{});		
		fichero=fichero+settings.woeid+'&u=c';
		$("#cargando").show();
			var data2=$.ajax({
				type:'GET',
				url:'yahoo.php',
				data:{url:fichero},
				cache:false,
				async:false,
				dataType:'xml',
				success:function(data){
					$("#cargando").hide();}, //fin success
				error:function(ts)
				{console.log(ts.responseText);
				$("#fallo").show()} //fin error
				}).responseText; //fin ajax
					settings.resultado.fecha=$(data2).find("yweather\\:condition").attr("date");
					settings.resultado.temperatura=$(data2).find("yweather\\:condition").attr("temp");
					settings.resultado.texto=$(data2).find("yweather\\:condition").attr("text");
					settings.resultado.code=$(data2).find("yweather\\:condition").attr("code");
					settings.resultado.minima=$(data2).find("yweather\\:forecast:first").attr("low");
					settings.resultado.maxima=$(data2).find("yweather\\:forecast:first").attr("high");
					settings.resultado.minimat=$(data2).find("yweather\\:forecast:last").attr("low");
					settings.resultado.maximat=$(data2).find("yweather\\:forecast:last").attr("high");
					settings.astronomia.sunrise=$(data2).find("yweather\\:astronomy").attr("sunrise");
					settings.astronomia.sunset=$(data2).find("yweather\\:astronomy").attr("sunset");
					settings.astronomia.latitud=$(data2).find("geo\\:lat").text();
					settings.astronomia.longitud=$(data2).find("geo\\:long").text();
					settings.atmosfera.humedad=$(data2).find("yweather\\:atmosphere").attr("humidity");
					settings.atmosfera.visibilidad=$(data2).find("yweather\\:atmosphere").attr("visibility");
					settings.atmosfera.presion=$(data2).find("yweather\\:atmosphere").attr("pressure");
					settings.atmosfera.incremento=$(data2).find("yweather\\:atmosphere").attr("rising");
					settings.viento.sensacion_termica=$(data2).find("yweather\\:wind").attr("chill");
					settings.viento.direccion=$(data2).find("yweather\\:wind").attr("direction");
					settings.viento.velocidad=$(data2).find("yweather\\:wind").attr("speed");				
				var array=[settings.resultado,settings.astronomia,settings.atmosfera,settings.viento];
			/*	$.each(array,function(f,valor){
					$.each(valor,function(i,n)
						{console.log(i+" : "+n);});
				}); //fin array */
				dibuja_valores(settings.resultado,settings.astronomia,settings.atmosfera,settings.viento);
				traduce_codigo(settings.resultado.code);
				//progress($("#humedad2").val(),$('#barometro'));
}//fin funcion recuperarxml
$.fn.localizaxml=function(ciudad,resultado)
		{	$(resultado).html("");
		console.log("Entrado");	
		console.log(ciudad);
			consulta="select * from geo.places where text='"+ciudad+"'";
			var data2=$.ajax({
				type:'GET',
				url:'http://query.yahooapis.com/v1/public/yql',
				data:{q:consulta},
				dataType:'xml',
				async:false,
				success:function(data){
					$("#cargando").hide();
					espanyol=$(data).find("country").attr("code");
					if (typeof(espanyol)=='undefined') $(resultado).html("No se han encontrado resultados")
					else {
						(espanyol!='ES') ? $(resultado).html("La ciudad NO es española") :console.log("Española") ;
					}
				},
				error:function(ts)
				{	
					console.log(ts.responseText);
					$("#fallo").show();				}
				}).responseText; //fin ajax
						woeid=$(data2).find("locality1").attr("woeid");
						pais=$(data2).find("country:first").text();
						comunidad=$(data2).find("admin1:first").text();
						provincia=$(data2).find("admin2:first").text();
						destino=$(data2).find("name:first").text();
						latitud=$(data2).find("latitude:first").text();
						longitud=$(data2).find("longitude:first").text();
						cpostal=$(data2).find("postal:first").text();
						$.param(direccion={'Codigo ':woeid,'Destino':destino,'Provincia':provincia,'Comunidad Autónoma':comunidad,'Pais':pais,'Código Postal':cpostal,'Latitud':latitud,'Longitud':longitud});
						if  ($(resultado).html()!="No se han encontrado resultados") {
							cambia_valores(direccion);
							//dibuja_div(direccion,resultado)
							};
			return(direccion);
		} //fin fncion localizarxml
function dibuja_div(array,destino)
{
	$.each(array,function(i,v){
		$('<div>',{id:i}).html(i+": "+v).appendTo($(destino));
	}); //fin array
}//fin funcion dibuja_div
//Esta funcion cambia los valores de la cabecera para el resultado de la consulta
function cambia_valores(array)
{
	$('#Ciudad').text(array['Destino']);
	$('#Provincia').text(array['Provincia']);
	$('#Cautonoma').text(array['Comunidad Autónoma']);
	$('#Pais').text(array['Pais']);
}//fin funcion cambia valores
//muestra los valores de la consulta en los li correspondientes
function dibuja_valores(array,arraya,arrayfera,arrayviento)
{		
		$('#Fecha').text("Última Actualización: "+array.fecha);
		$('#temperatura').text('Temperatura: '+array.temperatura+" ºC ");
		$('#imagen').text(array.imagen);
		$('#MaxMin').text('Máxima: '+array.maxima+' Mínima: '+array.minima);
		$('#MaxMint').text('Máxima: '+array.maxima+' Mínima: '+array.minima);
		$('#sunrise').text("Amanece a las: "+arraya.sunrise);
		$('#sunset').text("Anochece a las : "+arraya.sunset);
		$('#latitud').text("Latitud : "+arraya.latitud);
		$('#longitud').text("Longitud : "+arraya.longitud);
		$('#latitud2').val(arraya.latitud);
		$('#longitud2').val(arraya.longitud);
		$('#humedad').text("Humedad : "+arrayfera.humedad+" %");
		$('#humedad2').val(arrayfera.humedad);
		$('#visibilidad').text("Visibilidad : "+arrayfera.visibilidad+" Km");	
		$('#presion').text("Presión : "+arrayfera.presion +"mbar");	
		$('#incremento').text("Incremento : "+arrayfera.incremento);
		$('#direccion').text("Dirección : "+arrayviento.direccion);
		$('#velocidad').text("Velocidad : "+arrayviento.velocidad+" Km/h");
		var velocidadn=parseFloat(arrayviento.velocidad)*parseFloat(0.539956803455723);
		$('#velocidadn').text("Vel. Nudos : "+velocidadn.toFixed(2)+" Nudos");
		$('#stermica').text("Sens. Term. : "+arrayviento.sensacion_termica+" ºC ");	
		$('#direccion2').val(arrayviento.direccion); //para la brujula
		calcula_viento(arrayviento.direccion);
		init();
}//fin funcion dibuja valores
//-----------------------
//chekqueamos que el valor del viento este entre dos valores mara hacer luego la funcion con case en 
//calcula viento
function checkRango(valor,minimo, maximo)
	{
		if (valor<=maximo && valor>=minimo) {return valor;}
		else {return !valor; console.log("El valor no esta dentro del minimo y maximo:"+valor);}
	}
//muestra el tipo de tiempo dependiendo de los grados.	
function calcula_viento(viento)
{
	switch (viento) {
		case checkRango(viento,0,22) :
			$('#nviento').text("Viento(N): Tramontana");
		break;
		case checkRango(viento,23,67) :
			$('#nviento').text("Viento(NE): Gregal");
		break;
		case checkRango(viento,68,128) :
			$('#nviento').text("Viento(E): Levante");
		break;
		case checkRango(viento,129,157) :
			$('#nviento').text("Viento(SE): Siroco");
		break;
		case checkRango(viento,158,202) :
			$('#nviento').text("Viento(S): Mediodia/Solano");
		break;
		case checkRango(viento,203,247) :
			$('#nviento').text("Viento(SW): Lebeche/Agrego");
		break;
		case checkRango(viento,248,292) :
			$('#nviento').text("Viento(W): Poniente");
		break;
		case checkRango(viento,293,337) :
			$('#nviento').text("Viento(NW): Maestral");
		break;
		case checkRango(viento,338,360) :
			$('#nviento').text("Viento(N): Tramontana");
		break;
	} //fin switch
} //fin fulcion calcula_viento
//nos conectamos a flickr con la api y cuenta de usuario y creamos las imagenes

//prevision sobre worldweatheronline
$.fn.previsionxml=function(options)
{
	var settings=$.extend({
		woeid:'20079147'
	},options||{});
	latitud=$('#latitud2').val();
	longitud=$('#longitud2').val();
	var cadena='http://api.worldweatheronline.com/free/v1/weather.ashx?q='+latitud+'+'+longitud+ '&format=json&num_of_days=5&key=tzrkjeamsrp8znazutgbw7n7';
			$.ajax({
				type:'GET',
				url:cadena,
				timeout:8000,
				dataType:'jsonp',
				async:false,
				success:function(data){
					$("#cargando").hide();
					$('#imagen').empty();
					$('<img>',{src:data.data.current_condition[0].weatherIconUrl[0].value}).appendTo($('#imagen'));					
					$.each(data.data.weather,function(i,v){
						$('#dia0'+i).addClass('fuerte').text(["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"][(new Date()).getDay()+i]);
						$('#dia0'+i).addClass('fuerte');
						$('#icono0'+i).empty();
						$('<img>',{src:v.weatherIconUrl[0].value,class:'circular'}).appendTo($('#icono0'+i));
						$('#fecha0'+i).text(v.date);
						$('#max0'+i).text('Máxima: '+v.tempMaxC);
						$('#min0'+i).text('Mínima: '+v.tempMinC);
						}); //fin each	
				}, //fin success
				error:function(ts)
				{	console.log(ts.responseText);}
			}); //fin ajax					
}//
//mensaje de fallo
function fallo_ajax(mensaje,destino)
{	$('div').html(mensaje).addClass("fallo").insertAfter($('"'+destino+'"'));	
	console.log("mensaje y destino:"+mensaje+destino);} //fin fallo
//traduce texto
$.fn.traductor=function()
{
	//variables
	var texto=$(this).text();
	var url="http://translate.google.es/translate_a/t?client=t&text=hello&hl=en&sl=en&tl=es&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=0&tsel=3"
				$.ajax({
				//type:'GET',
				url:'yahoo.php',
				data:url,
				contentType: 'application/json; charset=utf-8',
				success:function(data){
					$("#cargando").hide();				
				}, //fin success
				error:function(ts)
				{	
					console.log(ts.responseText);
				} // fin ERROR
				
				}); //fin ajax
}// fin traductor
function traduce_codigo(codigo)
{
	switch (codigo) {
		case '0' : valor="Tornado";
		break;
		case '1' : valor="Tormenta Tropical";
		break;
		case '2' : valor="Huracan";
		break;
		case '3' : valor="Tormentas Severas";
		break;
		case '4' : valor="Tormentas";
		break;
		case '5' : valor="Lluvia y nieve mezcladas";
		break;
		case '6' : valor="Lluvia Mezclada y Agua Nieve";
		break;
		case '7' : valor="Nieve y Agua Nieve Mixta";
		break;
		case '8' : valor="Llovizna Helada";
		break;
		case '9' : valor="Llovizna";
		break;
		case '10' : valor="Lluvia Helada";
		break;
		case '11' : valor="Chubascos";
		break;
		case '12' : valor="Chubacos";
		break;
		case '13' : valor="Copos de Nieve";
		break;
		case '14' : valor="Ligeras Nevadas";
		break;
		case '15' : valor="Viento y nieve";
		break;
		case '16' : valor="Nieve";
		break;
		case '17' : valor="Granizo";
		break;
		case '18' : valor="Aguanieve";
		break;
		case '19' : valor="Polvoroso";
		break;
		case '20' : valor="Brumoso";
		break;
		case '21' : valor="Neblina";
		break;
		case '22' : valor="Ahumado";
		break;
		case '23' : valor="Borrascoso";
		break;
		case '24' : valor="Ventoso";
		break;
		case '25' : valor="Frio";
		break;
		case '26' : valor="Nublado";
		break;
		case '27' : valor="Mayormente Nublado";
		break;
		case '28' : valor="Mayormente Nublado";
		break;
		case '29' : valor="Parcialmente Nublado";
		break;
		case '30' : valor="Parcialmente Nublado";
		break;
		case '31' : valor="Despejado";
		break;
		case '32' : valor="Soleado";
		break;
		case '33' : valor="Bueno";
		break;
		case '34' : valor="Bueno";
		break;
		case '35' : valor="Granizo y lluvia";
		break;
		case '36' : valor="Calido";
		break;
		case '37' : valor="Tormentas Aisladas";
		break;
		case '38' : valor="Rayos Dispersos";
		break;
		case '39' : valor="Rayos Dispersos";
		break;
		case '40' : valor="Aguaceros Dispersos";
		break;
		case '41' : valor="Fuertes Nevadas";
		break;
		case '42' : valor="Chubascos de Nieve";
		break;
		case '43' : valor="Mucha Nieve";
		break;
		case '44' : valor="Parcialmente Nublado";
		break;
		case '45' : valor="Tormentas";
		break;
		case '46' : valor="Nieve";
		break;
		case '47' : valor="Chubascos Aislados";
		break;
		case '28':valor="Parcialmente Nublado";
			} //fin switch
	$('#texto').text(valor);
};
$.fn.popup=function(elemento,options){
	var settings=$.extend({
				fichero:'aviso.html'	
				},options||{});		
	$(this).click(function(){
			elemento.fadeIn(1000);		
			$.ajax({
				url:settings.fichero,
				dataType:'html',
				success:function(data){
					elemento.append(data);
				}, //fin success
				error:function(ts)
				{	console.log(ts.responseText);} // fin ERROR
			}); //fin ajax
		elemento.css({
						top:$(window).height()*0.05,
						left:$(window).width()*0.02,	
						position:'absolute'
					});
		}); //click FIN
	$('a#close2').on('click',function(){
		elemento.fadeOut(500)
		});
}//fin funcion popup
})(jQuery);	