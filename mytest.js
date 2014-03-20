 var  _D=_diaobao ; 

  var boxs = _D.getByClass("box");
  var box1 = _D.getById("box1");

 var alert234 = function(){
 	console.log("234");
 }
 var alert123 = function(){
 	 console.log("123");
 }

// for(var i = 0 ; i<boxs.length ; i++){
// 	_D.addEvent(boxs[i],"click", alert123 );
// 	_D.addEvent(boxs[i],"mouseover", alert123 );
// 	_D.addEvent(boxs[i],"mouseover", alert123 );
// 	_D.addEvent(boxs[i],"mouseover", alert234 );

// 	_D.removeEvent(boxs[i],"mouseover", alert234 );
// }

// console.log( _D.curStyle(box1) );
// alert( _D.getStyle(box1,"backgroundColor") );
// alert( _D.setStyle(box1,"backgroundColor","#bac") );


_D.addEvent(box1,"click", function(){
	_D.animateTo(box1,{width:400,opacity:0.4},600,
		_D.tween.Quad.easeIn,
		function(){
	 // console.log( _D.getStyle(box1,"opacity") ,"###" );
	});

});
var i = 0 ;

var offset = _D.offset(box1);
console.log(offset);
_D.addEvent(box1,"click",function(event){
	var arr = [
     "clientX : ",event.clientX,
     "clientY : ",event.clientY,
     "pageX : ",event.pageX,
     "pageY : ",event.pageY
	];

	_D.getByClass("textArea")[0].innerHTML= arr.join("") ;
	// alert(_D.getByClass("textArea")[0] );

	// _D.addWheelListener(box1,function(event){ console.log("@@@");
	//   event.preventDefault();
	// });


});





