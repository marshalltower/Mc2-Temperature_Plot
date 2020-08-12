	$(document).ready(function(){
		//custom datepicker for date sidepanel
		//$(".datepicker").datepicker({maxDate: time});
		//moved to getdate function as min and max not available on document ready
		
		//slider creation with range for depth
		$(".depthslider").slider({orientation: "vertical", range: true, min: -100, max: 0, values: [-100,0], step: .001});
		
		//temporary dynamic tooltips only when slider is moving
		var tooltipmin = $("<div class='tooltip1' />").hide();
		var tooltipmax = $("<div class='tooltip1' />").hide();
		
		//slider event triggered always when one thumb moved.
		$(".depthslider").on("slide", function(event, ui){
				tooltipmin.text(Math.abs(ui.values[0]));
				tooltipmax.text(Math.abs(ui.values[1]));
				$(".depthitems").each(function(i,obj){
					obj.style.opacity = "1";
					if((parseFloat(obj.getAttribute('data-edepth')) < Math.abs(ui.values[1])) || (parseFloat(obj.getAttribute('data-edepth')) > Math.abs((ui.values[0])))){
						obj.style.opacity = ".3";
					}
				});
	
		});
		
		$(".depthslider").on("slidestop",function(event, ui){
			getGraphData();
		});
		
		
		//attach dynamic tooltips to each slider handle		
		$(".depthslider").find(".ui-slider-handle").first().append(tooltipmin).hover(function(){tooltipmin.show();tooltipmax.show()},function(){tooltipmin.hide();tooltipmax.hide()});
		$(".depthslider").find(".ui-slider-handle").last().append(tooltipmax).hover(function(){tooltipmin.show();tooltipmax.show()},function(){tooltipmin.hide();tooltipmax.hide()});
		
		
		//graph datapoint interaction
		/*$("circle").click(function(){
			alert($(this).attr("data-value"));			
		});
		*/
		
		//temperature radio button events
		$('input[type=radio][name=temperature]').change(function(){
			if(this.value == "c"){
				degrees = "c";			}
			else{
				degrees = "f";
			}
			setTempRange();
			fillGraphVisual();
		});
		
		//select all for electrode checkboxes event
		$('#electrodelist').on('click', '.allelectrodes', function(){
			if($('input[type=checkbox][name=electrodename]:checked').length == $('input[type=checkbox][name=electrodename]').length){
				$('input[type=checkbox][name=electrodename]').prop('checked','');
			}
			else{
				$('input[type=checkbox][name=electrodename]').prop('checked','checked');
				getGraphData();
			}
			
		});
		
		//checkbox event
		//moved to inside of tag on creation in getElectrodes functions
		
		//rotate arrow on sidebar when panel areas clicked
		$(".modifier").click(function(){
			var initialhidden = $(this).next().css("display");
			$(".details").hide();
			$(".dropdownarrow").css({
					"-webkit-transform": "rotate(0deg)",
					"-moz-transform": "rotate(0deg)",
					"transform": "rotate(0deg)" 
				});
			$(".modifier").css({"color":"white","background-color":"#333"});
			if(initialhidden == "none"){
				var nxtdetails = $(this).next();
				nxtdetails.show();
				$(this).find(".dropdownarrow").css({
					"-webkit-transform": "rotate(90deg)",
					"-moz-transform": "rotate(90deg)",
					"transform": "rotate(90deg)" 
				});
				$(this).css({"color":"#333","background-color":"white"});
			}
			
		});
		
		//datepicker event
		//moved to datepicker creation
		
		//data shortcut to set from date
		$(".dateshortcuts").click(function(){
			$(".datepickerto").datepicker("setDate", new Date());
			var currentfrom = new Date($(".datepickerto").datepicker().val());
			
			switch($(this).html()){
				case "Last 7 Days":
					currentfrom.setDate(currentfrom.getDate()- 7);
					break;
				case "Last 30 Days":
					currentfrom.setDate(currentfrom.getDate()- 30);
					break;
				case "Last 60 Days":
					currentfrom.setDate(currentfrom.getDate()- 60);
					break;
				case "Last Quarter":
					var qtr = Math.floor((currentfrom.getMonth() + 3)-3);
					currentfrom = new Date(currentfrom.getFullYear(),Math.floor((qtr-1)*3),1);
					break;
				case "Last Year":
					currentfrom.setDate(currentfrom.getDate()- 365);
					break;
				case "All Time":
					currentfrom = dateFrom;
					break;
			}
			$(".datepickerfrom").datepicker("setDate", currentfrom);
			genTimeline();
			getGraphData();
		});
		
		var datatooltip = $("<div class='tooltip1'>test</div>").hide();
		//svg dot point hover tooltip
		$(".data-container").on("hover", "circle", function(){
				$(this).append(datatooltip);
				datatooltip.show();
			},function(){
				$(this).remove(datatooltip);
				datatooltip.hide();
		});
		
		$(".data-container").on("click", "circle", function(){
			for(var i = 0; i < data.length; i++){
				if(data[i].id == ($(this).attr("data-value"))){
						var temp = data[i].temperature;
						if(degrees == "f"){
							temp = parseFloat((parseFloat(temp)*(9/5))+32);
						}
						alert(temp + "\u00B0" + degrees.toUpperCase() + " @ " + (new Date(data[i].time)) );
				}
			}
		
		});
			
	});
	
