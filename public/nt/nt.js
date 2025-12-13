
	(async function (){
		//console.log("S");
//Things.length - 1
		for (var i = 7; i >= 1; i--) {
			//Things[i]

		const y=`<div class="nule" id="lb${i}">

		<div class="nulg">
		<div class="gra"></div>
		</div>
		<div class="nu1i">
		<div class="le">63243.40
		</div>
		<div class="ri">0.118523
		</div>
		</div>
		</div>`;
		var list = document.getElementById("le_s");
		 var newDiv = document.createElement('div');

            // Add HTML content as a string
            newDiv.innerHTML =y;
		list.appendChild(newDiv);

		}
	})();
	
	(async function (){
		//console.log("S");
//Things.length - 1
		for (var i = 7; i >= 1; i--) {
			//Things[i]

		const y=`<div class="nure" id="rb${i}">

		<div class="nurg">
		<div class="gra"></div>
		</div>
		<div class="nuri">
		<div class="le">0.118523
		</div>
		<div class="ri">63243.40
		</div>
		</div>
		</div>`;
		var list = document.getElementById("ri_s");
		 var newDiv = document.createElement('div');

            // Add HTML content as a string
            newDiv.innerHTML =y;
		list.appendChild(newDiv);
		
		}
	})();
	// Generate a random number between 13243.40 and 63243.40
function large() {
    // Generate a random number in the range [0, 50000] and add the minimum value (13243.40)
    return (Math.random() * (93243.40 - 1243.40)) + 82243.40;
    //return (Math.random() * (63243.40 - 62243.40)) + 62243.40;
}

function small() {
    const min = 0.118523;
  const max = 2.118523;
  return Math.random() * (max - min) + min;
}


	function r(){
		//return Math.floor(Math.random() * 101);
		return Math.floor(Math.random() * (100 - 10 + 1)) + 10; // 10 to 100
	}
	

//console.log(getRandomNumberBetweenRange());

	function rande(){

		for (var i = 7; i >= 1; i--) {
			$(`#lb${i}`).find('.gra').css('width',r());
			$(`#rb${i}`).find('.gra').css('width',r());

			$(`#rb${i}`).find('.ri').text(large().toFixed(2));
			$(`#lb${i}`).find('.le').text(large().toFixed(2));
			
			
			$(`#rb${i}`).find('.le').text(small().toFixed(4));
			$(`#lb${i}`).find('.ri').text(small().toFixed(4));
			
			//small()
		}

	}
	
	
//percdi
let di=new Ba('sq','#percdi','#ds1',5);
di.low_({u:'#DB0A0A',d:'#5B2020'});
di.mid_({u:'#C6A600',d:'#4B4522'});
di.hi_({u:'#08B04F',d:'#27482E'});
di.lowb(30);
di.hib(70);
di.setupl();




let ss=new Ba('ss','#percss','#ss1',10);
ss.low_({u:'#DB0A0A',d:'#5B2020'});
ss.mid_({u:'#C6A600',d:'#4B4522'});
ss.hi_({u:'#08B04F',d:'#27482E'});
ss.setupl();

