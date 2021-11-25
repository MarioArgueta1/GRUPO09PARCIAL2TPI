//habilitacion de tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  });
function irArriba(pixeles) {
	// body...
	window.addEventListener("scroll", () => {
		var scroll = document.documentElement.scrollTop;
		//console.log(scroll);

		if(scroll > pixeles){
			btnSubir.style.right = 20 + "px";
		}
		else{
			btnSubir.style.right = -100 + "px";
		}
	})
}
irArriba(300);

	
