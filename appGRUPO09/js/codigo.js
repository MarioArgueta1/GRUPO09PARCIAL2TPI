var fila="<tr><td class='id'></td><td class='foto'></td><td class='video'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td></tr>";
var productos=null;
function crearBoton(id){
	var boton="<button class='x' onclick='borrarProducto("+id+");'>Borrar</button>";
    return boton;
}

function obtenerProductos() {
	fetch('http://localhost:3000/productos')
        .then(res=>res.json())
        .then(data=>{
			productos=data;
			productos.forEach(
			function(producto){
				producto.price=parseFloat(producto.price)
			});
		listarProductos(data)})
	.catch(error => {
        alert(error);
    })
}

function filtrarProductos() {
	var titulo=document.getElementById("titulo");
	var preciofiltro=document.getElementById("preciofiltro");
	var criteriofiltro=document.getElementById("criteriofiltro");
	var sdata;
	fetch('http://localhost:3000/productos')
        .then(res=>res.json())
        .then(data=>{
			productos=data;
			productos.forEach(
			function(producto){
				producto.price=parseFloat(producto.price)
			sdata = data.filter(item => (item.title.includes(titulo.value)) 
			&& ((item.price > preciofiltro.value && criteriofiltro.value == 1)
			|| (item.price < preciofiltro.value && criteriofiltro.value == 2)
			|| (criteriofiltro.value == 0)))});
			listarProductos(sdata);
		})
	.catch(error => {
        alert(error);
    })
	
}

function borrarProducto(id) {
	var delresult;
	var url='http://localhost:3000/productos/'+id;
	fetch(url,{method:"DELETE"})
        .then( res=>res.status)
        .then(codigo=>{
			switch(codigo) {
				case 200: alert("producto borrado");			         
					document.querySelector("inventario").click();
					break;
				case 404: alert("producto no existe");break; }
	}); 				 
}

function crear() {
	var id=document.getElementById("id");
	var foto=document.getElementById("foto");
	var video=document.getElementById("video");
	var precio=document.getElementById("precio");
	var titulo=document.getElementById("titulo");
	var descripcion=document.getElementById("descripcion");
	var categoria=document.getElementById("categoria");
	const datos = {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify({ id:id.value, image:foto.value, video:video.value, price:precio.value, title:titulo.value, category:categoria.value, description:descripcion.value  })
	};
	fetch('http://localhost:3000/productos/', datos);
	obtenerProductos();
}

function actualizarProducto() {
	var id=document.getElementById("id");
	var foto=document.getElementById("foto");
	var video=document.getElementById("video");
	var precio=document.getElementById("precio");
	var titulo=document.getElementById("titulo");
	var descripcion=document.getElementById("descripcion");
	var categoria=document.getElementById("categoria");
	const requestOptions = {
	    method: 'PUT',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ id:id.value, image:foto.value, video:video.value, price:precio.value, title:titulo.value, category:categoria.value, description:descripcion.value })
	};
	fetch('http://localhost:3000/productos/'+id.value, requestOptions);	
	obtenerProductos();				 
}

function codigoCat(catstr) {
	var code="null";
	switch(catstr) {
		case "Deportiva":code="c1";break;
	    case "Minimoto":code="c2";break;
		case "Motoneta":code="c3";break;
		case "Motocarro":code="c4";break;
	}
	return code;
}   

var orden=0;	  
	  
function listarProductos(productos) {
	var precio=document.getElementById("price"); 
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	var num=productos.length;
	var listado=document.getElementById("listado");
	var ids,titles,prices,descriptions,categories,fotos;
	var tbody=document.getElementById("tbody"),nfila=0;
	tbody.innerHTML="";
	var catcode;
	for(i=0;i<num;i++) tbody.innerHTML+=fila;
	var tr; 
	ids=document.getElementsByClassName("id");
	titles=document.getElementsByClassName("title");
	descriptions=document.getElementsByClassName("description");
	categories=document.getElementsByClassName("category");   
	fotos=document.getElementsByClassName("foto"); 
	videos=document.getElementsByClassName("video");    
	prices=document.getElementsByClassName("price");   
	if(orden===0) {orden=-1;precio.innerHTML="Precio"}
	else
	    if(orden==1) {ordenarAsc(productos,"price");precio.innerHTML="Precio A";precio.style.color="darkgreen"}
	    else 
	 	   if(orden==-1) {ordenarDesc(productos,"price");precio.innerHTML="Precio D";precio.style.color="blue"}
	var boton="";
	listado.style.display="block";
	for(nfila=0;nfila<num;nfila++) {
        ids[nfila].innerHTML=productos[nfila].id;
		boton = crearBoton(productos[nfila].id);
		titles[nfila].innerHTML=productos[nfila].title;
		descriptions[nfila].innerHTML=productos[nfila].description;
		categories[nfila].innerHTML=productos[nfila].category+boton;
		catcode=codigoCat(productos[nfila].category);
		tr=categories[nfila].parentElement;
		tr.setAttribute("class",catcode);
		prices[nfila].innerHTML="$"+productos[nfila].price;
		fotos[nfila].innerHTML="<img src='"+productos[nfila].image+"'>";
		videos[nfila].innerHTML="<iframe width='260' height='150' src='"+productos[nfila].video+"'"+" title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
		fotos[nfila].firstChild.setAttribute("onclick","window.open('"+productos[nfila].image+"');" );
		ids[nfila].setAttribute("onclick","datosActualizar('"+productos[nfila].id+"'"+","+"'"+productos[nfila].image+"'"+","+"'"+productos[nfila].video+"'"+","+"'"+productos[nfila].price+"'"+","+"'"+productos[nfila].title+"'"+","+"'"+productos[nfila].description+"'"+","+"'"+productos[nfila].category+"'"+");" );
	}
}

function datosActualizar(id,urlfoto,urlvideo,precio,titulo,descripcion,categoria) {
	var table = document.getElementById("tabla");
	var rows = table.getElementsByTagName("tr");
	for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
    	var createClickHandler = function(row) {
    		return function() {
				var Id=document.getElementById("id");
				var UrlFoto=document.getElementById("foto");
				var UrlVideo=document.getElementById("video");
				var Precio=document.getElementById("precio");
				var Titulo=document.getElementById("titulo");
				var Descripcion=document.getElementById("descripcion");
				var Categoria=document.getElementById("categoria");
				Id.value = id;
				UrlFoto.value = urlfoto;
				UrlVideo.value = urlvideo;
				Precio.value = precio;
				Titulo.value = titulo;
				Descripcion.value = descripcion;
				Categoria.value = categoria;
    	  	};
    	};
    currentRow.onclick = createClickHandler(currentRow);
  	}
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
    	if(a[p_key] > b[p_key]) return -1;
		if(a[p_key] < b[p_key]) return 1;
		return 0;
   	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
    	if(a[p_key] > b[p_key]) return 1;
		if(a[p_key] < b[p_key]) return -1;
		return 0;
	});
}