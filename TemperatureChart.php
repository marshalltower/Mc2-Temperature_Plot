
<!DOCTYPE html>
<html>
<head>
	<!-- tab setup-->
	<title>McMillan - Graphs</title>
	<link rel="icon" href="http://www.mcmillan-mcgee.com/public/images/orb.png">

	<!-- external css links-->
	<link href='https://fonts.googleapis.com/css?family=Calibri:400,700,400italic,700italic' rel='stylesheet'>
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1" />
	<!-- jquery sources-->
	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

	<link rel="stylesheet" type="text/css" href="mcmillanstyling.css">
	<script src="mcmillanfunc.js"></script>
	<script src="mcmillanjqry.js"></script>

</head>
<body onload="getInitData()">
	<div class="container">
		<div class="sidebar">
			<a href="http://www.mcmillan-mcgee.com/"><img class="companylogo" src="http://www.mcmillan-mcgee.com/public/images/Mc2_Mast_Logo.png"></a>
			<div class="modifiertitle">Modify Selection By:</div>
				<div class="modifier"><img class="dropdownarrow"/><div class="modifierspan">Electrodes</div></div>
					<div class="details" ><ul id="electrodelist"></ul></div>
				<div class="modifier"><img class="dropdownarrow"/><div class="modifierspan">Depth</div></div>
					<div class="details slider">
						<div class="slider-container">
							<div class="slider-wrapper">
								<div class="depthslider"></div>
							</div>
							<div class="slider-labels">
								<ul class="depthlabels" id="depthlabels">
								</ul>
							</div>
						</div>
					</div>
				<div class="modifier"><img class="dropdownarrow"/><div class="modifierspan">Date</div></div>
					<div  class="details" >
						<div class="datelabel">Start Date:</div>
						<div class="datepickerfrom-wrapper"><div class="datepicker datepickerfrom"></div></div>
						<div class="datelabel">End Date: </div>
						<div class="datepickerfrom-wrapper"><div class="datepicker datepickerto"></div></div>
						<div class="dateshortcuts-wrapper"><strong class="dateshortcuttitle">Shortcuts</strong>
							<div class="dateshortcuts">Last 7 Days</div>
							<div class="dateshortcuts">Last 30 Days</div>
							<div class="dateshortcuts">Last 60 Days</div>
							<div class="dateshortcuts">Last Quarter</div>
							<div class="dateshortcuts">Last Year</div>
							<div class="dateshortcuts">All Time</div>
						</div>
					</div>
				<div class="modifier"><img class="dropdownarrow"/><div class="modifierspan">Temperature</div></div>
					<div  class="details" id="optionstemp"  >
						<div class="tempoption-wrapper">
							<input type="radio" name="temperature" value="c" checked="checked">&degC
							</br>
							<input type="radio" name="temperature" value="f">&degF
						</div>
					</div>
		</div>
		
		<div class="main">
			<div class="graph-wrapper">
			<!-- vector graphic in 720p quality -->
				<svg class="graph" viewBox="0 0 1280 720" style="background-color:white; border-radius: 10px;">
					<!-- graph y range 50 to 600(from top)
						graph x range 100(from left) to 1200
					-->
					<g class="grid x-grid" id="xGrid">
					  <line x1="100" x2="100" y1="50" y2="600"></line>
					</g>
					<g class="grid y-grid" id="yGrid">
					  <line x1="100" x2="1200" y1="600" y2="600"></line>
					</g>
					<g class="labels x-labels" id="x-labels">
					</g>
					<g class="labels y-labels" id="y-labels">
					</g>
					<g class="data-container" id="data-container">
					</g>
				</svg>
			</div>
		</div>
	</div>
</body>
</html>
