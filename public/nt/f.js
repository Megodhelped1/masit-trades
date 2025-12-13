
$('.gti').text(`+0.00%`);
$('.lti').text(`-0.00%`);

window['flasher']=function(status=1){

	if (status=="1") {
		setInterval(()=>{

			try{
				let r=Math.floor(Math.random() * 90 + 10);
				let d=Math.floor(Math.random() * 90 + 10);
				let g=Number(`${r}.${d}`);
				let l=Math.abs(100-g);

				//console.log(r,d,g,l);

				$('.gti').text(`+${g}%`);
				$('.lti').text(`-${l.toFixed(2)}%`);
			}catch(e){
				console.log(e.message);
			}

			//console.log("called");

		},700);
	}

}