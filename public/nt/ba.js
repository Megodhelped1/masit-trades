
function curswitch(o,loc){
	const rand2 = Math.floor(Math.random() * o.length) + 1;
	//return ;
	//console.log(o,o[rand2-1],rand2);
	$(loc||'.h75').text(`(${o[rand2-1]})`);
}

class Ba{
	constructor(i,h,c,d){
		this.item=i||"p";
		this.holder=h||`#perc`;
		this.currentlabel=c||`#ss`;
		/*l,m,h,
		this.low=l;
		this.mid=m;
		this.hi=h;*/
		this.divisor=d||10;
		this.ll=30;
		this.hl=80;
	}
	low_(l){
		this.low=l;
	}
	mid_(l){
		this.mid=l;
	}
	hi_(l){
		this.hi=l;
	}
	setupl(){
		var o='';
		for (var i = 1; i <= (100/this.divisor); i++) {
			o=`${o}<div class="bar" id="${this.item}${i*this.divisor}"></div>`;
		}
		$(this.holder).html(o);
		this.redraw(0,this.low['u'],this.low['d']);
	}
	redraw(perc,color,darkcolor){
		for (var i = 0; i < (perc+1); i+=this.divisor) {
			$(`#${this.item}${i+this.divisor}`).css('background',color);
		}
		for (var i = perc; i < 101; i+=this.divisor) {
			$(`#${this.item}${i+this.divisor}`).css('background',darkcolor); 
		}
	}
	lowb(n){
		this.ll=n;
	}
	hib(n){
		this.hl=n;
	}

	auto(status,interval){ 

		if (status=="1") {
			setInterval(()=>{

				const rand2 = Math.floor(Math.random() * 10) + 1;
				let perc=rand2*10;
				//console.log(perc);

				this.init(perc);
			},(interval*1000));
		}else{
			//set at 0
		}
	}

	init(perc){  //manual

		$(this.currentlabel).text(`${perc}%`);

		if (perc<=this.ll) { 

			this.redraw(perc,this.low['u'],this.low['d']);

		}else if (perc>this.ll && perc<=this.hl) {
			
			this.redraw(perc,this.mid['u'],this.mid['d']);

		}else if (perc>this.hl) {
			
			this.redraw(perc,this.hi['u'],this.hi['d']);
		} 
	}
}
/*
window['setupl']=function(){
	var o='';
	for (var i = 1; i <= 10; i++) {
		o=`${o}<div class="bar" id="p${i*10}"></div>`;
	}

	$('#perc').html(o);
	window['redraw'](0,window['low']['u'],window['low']['d']);

	$('#ss').text(`0%`);
}


window['redraw']=function(perc,color,darkcolor){
	for (var i = 0; i < (perc+1); i+=10) {
		$(`#p${i+10}`).css('background',color);
	}
	for (var i = perc; i < 101; i+=10) {
		$(`#p${i+10}`).css('background',darkcolor); 
	}
}
 
window['loa9der']=function(perc){  

			$('#ss').text(`${perc}%`);

			if (perc<=30) { 

				window['redraw'](perc,window['low']['u'],window['low']['d']);

			}else if (perc>30 && perc<=80) {
				
				window['redraw'](perc,window['mid']['u'],window['mid']['d']);

			}else if (perc>80) {
				
				window['redraw'](perc,window['high']['u'],window['high']['d']);
			} 

}*/