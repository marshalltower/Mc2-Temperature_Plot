	//json data from sidebar criteria to be used for graph
	var data = new Array();
	//electrod name and depth to generate sidebar electrode listing and depth
	var electrodes = new Array();
	var dateFrom, dateTo;
	var degrees = "c";
	var degreestop = 15;
	var degreesbottom = 0;
	
	var weekday = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
	var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
	function electrode(id,datetime,name,depth,temp){
		this.id = id;
		this.datetime = datetime;
		this.name = name;
		this.depth = depth;
		this.temp = temp;		
	}
	function getInitData(){
		getElectrodes();
		//change to retrieve sidebar values to generate graph
	}
	
	//ajax call
	function getGraphData() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				data = JSON.parse(this.responseText);
				setTempRange();
				fillGraphVisual();
				
			}
		};
		xhttp.open("POST","getTempData.php",true);
		xhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		var senddatefrom = new Date($(".datepickerfrom").datepicker("getDate"));
		var senddateto = new Date( $(".datepickerto").datepicker("getDate"));
			senddateto.setHours(23);
			senddateto.setMinutes(59);
			senddateto.setSeconds(59);
			senddateto.setMilliseconds(999);
		var senddepthfrom = Math.abs($(".depthslider").slider("values")[1]);
		var senddepthto = Math.abs($(".depthslider").slider("values")[0]);
		var names = $("input:checked[name='electrodename']").map(function(){
			return $(this).val();
		});
		
		var sentvariables = "&datefrom=" + senddatefrom.toISOString() + "&dateto=" + senddateto.toISOString() + "&depthfrom=" + senddepthfrom + "&depthto=" + senddepthto + "&names=" + names.get();
		//console.log(sentvariables);
		xhttp.send(sentvariables);
	}
	
	
	function getElectrodes() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				electrodes = JSON.parse(this.responseText);
				var list = document.getElementById("electrodelist");
				for(var i = 0 ; i < electrodes.length; i++){
					//create list item
					var templi = document.createElement("li");
					electrodes[i].color = getRandomColor();
					templi.style.color = electrodes[i].color;
					//creating checobox inside list item (doom cbx not showing text) extra: <span class='dot'>&bull;</span>
					templi.innerHTML = "<input type='checkbox' onchange='getGraphData()' checked name='electrodename' value='" + electrodes[i].name + "'>"  + electrodes[i].name + " &#9866; </input>";
					list.appendChild(templi);
					
				}
				var temp = document.createElement("li");
				temp.innerHTML = "<button type='button' class='allelectrodes'> Select / Deselect All </button>";
				list.appendChild(temp);
				
				//generate sidebar depth labels/max
				genDepthLabels();
				getDates();
			}
		};
		xhttp.open("POST","getElectrodes.php",true);
		xhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send();
	}
	
	
	function getDates() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				var temp = JSON.parse(this.responseText);
				dateFrom = new Date(temp[0].FromDate);
				dateTo = new Date(temp[0].ToDate);
				//format date for jquery datepicker
				//set datepicker default date and date ranges from min and max date from database
				$(".datepicker").datepicker({maxDate: dateTo, minDate:dateFrom, setDate: new Date(),onSelect: function(){
					genTimeline();
					getGraphData();
				}});
				//get current date and set start date one month prior
				var currentfrom = new Date($(".datepicker").datepicker().val());
				currentfrom.setDate(currentfrom.getDate()- 30);
				$(".datepickerfrom").datepicker("setDate", currentfrom);
				
				genTimeline();
				getGraphData();
			}
		};
		xhttp.open("POST","getDateRange.php",true);
		xhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send();
	}
	
	
	
	function fillGraphVisual(){
		
		var svgcontainer = document.getElementById("data-container");
			svgcontainer.innerHTML = "";
		for(var i = 0; i < electrodes.length; i++ ){
			var grouping = document.createElementNS("http://www.w3.org/2000/svg","g");
				grouping.setAttribute("class","data");
				grouping.setAttribute("id",electrodes.name);
				grouping.setAttribute("data-setname",electrodes.name);
			svgcontainer.appendChild(grouping);
			
			var polystr = "";
			var polyline = document.createElementNS("http://www.w3.org/2000/svg","polyline");
				polyline.setAttribute("style","fill:none;;stroke-width:3");
				polyline.style.stroke =  electrodes[i].color;
			grouping.appendChild(polyline);
			
			for(var j = 0; j < data.length; j++){
				
				if(electrodes[i].name == data[j].name){
					var timeline = ((getTimeRatio(new Date(data[j].time))*1100)+100);
					timeline = Number(Math.round(timeline + 'e2')+'e-2');
					var templine = (((getTempRatio(data[j].temperature))*550)+50);
					templine = Number(Math.round(templine + 'e2')+'e-2');
					
					var temp = document.createElementNS("http://www.w3.org/2000/svg","circle");
					temp.setAttribute("cx",timeline);
					temp.setAttribute("cy",templine);
					temp.setAttribute("data-value", data[j].id);
					temp.setAttribute("r","5");
					temp.style.fill = "white";
					temp.style.stroke = electrodes[i].color;
					
					grouping.appendChild(temp);
					polystr += " " + timeline + "," + templine;
				}
	
			}
			
			polyline.setAttribute("points",polystr);
		}
	}
	
	function getTempRatio(temperature){
		if(degrees =="c"){
			return (1-((temperature-degreesbottom)/(degreestop-degreesbottom)));
		}
		else{
			var temp = ((temperature*(9/5))+32);
			return (1-((temp-degreesbottom)/(degreestop-degreesbottom)));
		}
	}
	
	function getTimeRatio(date){
		var mindate = $(".datepickerfrom").datepicker("getDate");
		var maxdate = $(".datepickerto").datepicker("getDate");
		maxdate.setHours(23);
		maxdate.setMinutes(59);
		maxdate.setSeconds(59);
		maxdate.setMilliseconds(999);
		return (((date.getTime()-mindate.getTime())/(maxdate.getTime()-mindate.getTime())));
	}
	
	function setTempRange(){
		var tempmin = 10000.00;
		var tempmax = 0.00;
		
		for(var i = 0; i < data.length; i++){
			var temp = data[i].temperature;
			if(degrees == "f"){
				temp = parseFloat((parseFloat(temp)*(9/5))+32);
			}
			
			if(parseFloat(temp) < parseFloat(tempmin)){
				tempmin = temp;
			}
			if(parseFloat(temp) > parseFloat(tempmax)){
				tempmax = temp;
			}
		}
		//backup for if no data
		if((tempmin == 10000)&&(tempmax == 0)){
			tempmin = 1;
			tempmax = 99;
		}
		degreesbottom = Math.round(tempmin)-1;
		degreestop = Math.round(tempmax)+1;
		genTempline();
		
	}
	
	function genDepthLabels(){
		var maxdepths = 0;
		for( var i = 0; i < electrodes.length; i++){
			if(parseFloat(electrodes[i].bgs) > maxdepths){
				maxdepths = parseFloat(electrodes[i].bgs);
			}
		}
		$(".depthslider").slider({ min: -(maxdepths), values: [-(maxdepths),0]});
		
		//gen labels 
		var tempelectrodes = electrodes;
			//sort by depth
			tempelectrodes.sort(function(a,b){return a.bgs-b.bgs});
		//get list container
		var listwrapper = document.getElementById("depthlabels");
		
		for(var i = 0; i < tempelectrodes.length; i++){
			var temp = document.createElement("li");
			temp.setAttribute("data-edepth",tempelectrodes[i].bgs);
			temp.setAttribute("class","depthitems");
			temp.style.color = tempelectrodes[i].color;
			temp.innerHTML = tempelectrodes[i].name + " (" + tempelectrodes[i].bgs + "m)";
			listwrapper.appendChild(temp);
		}
		
	}
	
	function genTempline(){
		var diff = Number(Math.round(parseFloat((parseFloat(degreestop)-parseFloat(degreesbottom))/4) + 'e2')+'e-2');
	
		var ylabelwrapper = document.getElementById("y-labels");
			ylabelwrapper.innerHTML = "";
		for(var i = 0; i < 5; i++){
			var temp = document.createElementNS("http://www.w3.org/2000/svg","text");
			temp.setAttribute("x",80);
			temp.setAttribute("y",(600-(137.5*i)));
			temp.innerHTML = parseFloat(parseFloat(degreesbottom)+(i*diff));
		ylabelwrapper.appendChild(temp);
		}
		var temp = document.createElementNS("http://www.w3.org/2000/svg","text");
			temp.setAttribute("x","-250");
			temp.setAttribute("y",45);
			temp.setAttribute("class","label-title label-vertical");
			temp.innerHTML = "Temperature (&deg" + degrees.toUpperCase() + ")";
		ylabelwrapper.appendChild(temp);
	}
	
	function genTimeline(){
		var mindate = $(".datepickerfrom").datepicker("getDate");
		var maxdate = $(".datepickerto").datepicker("getDate");
		maxdate.setHours(23);
		maxdate.setMinutes(59);
		maxdate.setSeconds(59);
		maxdate.setMilliseconds(999);
		//alert(maxdate);
		var milliday = 24*60*60*1000;
		var daysdiff = Math.round(Math.abs((mindate.getTime() - maxdate.getTime())/(milliday)));
		var xlabelcontainer = document.getElementById("x-labels");
		
		xlabelcontainer.innerHTML = "";
		//alert(daysdiff);
		
		
		//generate svg points on ratio changing per day strength to keep label amounts at reasonable levels
		var startdate = mindate;
		while(startdate <= maxdate){
			var temp = document.createElementNS("http://www.w3.org/2000/svg","text");
				var timeline = ((getTimeRatio(startdate)*1100)+100);
				temp.setAttribute("x",timeline);
				temp.setAttribute("y",630);
				var datemod;
				
				if(daysdiff <= 1){
					temp.innerHTML = startdate.getHours() + ":00";
					datemod = startdate.setHours(startdate.getHours()+1);
				}
				else if(daysdiff <= 15){
					temp.innerHTML = startdate.getDate() + " " + weekday[startdate.getDay()] ;
					datemod = startdate.setDate(startdate.getDate()+1);
				}
				else if(daysdiff <= 40){
					temp.innerHTML = month[startdate.getMonth()] + " " + startdate.getDate();
					datemod = startdate.setDate(startdate.getDate()+3);
				}
				else if(daysdiff <= 70){
					temp.innerHTML = month[startdate.getMonth()] + " " + startdate.getDate();
					datemod = startdate.setDate(startdate.getDate()+7);
				}
				else if(daysdiff <= 365){
					temp.innerHTML = month[startdate.getMonth()] + " " + startdate.getFullYear() ;
					datemod = startdate.setMonth(startdate.getMonth()+1);
				}
				else{
					temp.innerHTML = startdate.getFullYear() ;
					datemod = startdate.setFullYear(startdate.getYear()+1);
				}
				
			xlabelcontainer.appendChild(temp);
			
			//iterator
			startdate = new Date(datemod);
		}
		
		//final x title append
		var temp = document.createElementNS("http://www.w3.org/2000/svg","text");
			temp.setAttribute("x",640);
			temp.setAttribute("y",670);
			temp.setAttribute("label-title",670);
			temp.innerHTML = "Time";
		xlabelcontainer.appendChild(temp);
		
	}
	
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}