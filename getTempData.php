<?php
	/*normally would check to ensure being used by ajax call 
	and valid session is in use for security access
	*/
	
	include_once("dbConnect.php");

		try{
			//get connection
			$conn = connectdb();

			//grab post varables from ajax request
				
			$datefrom = date("Y-m-d H:i:s",strtotime($_POST["datefrom"]));
			$dateto = date("Y-m-d H:i:s",strtotime($_POST["dateto"]));
			$depthfrom = $_POST["depthfrom"];
			$depthto = $_POST["depthto"];
			$electrodes = (array)explode(",", $_POST["names"]);
			$temp = implode(",",$electrodes);
			//using array in bind param doesn't work even when converted to a string and enters as a single value so manually escaping characters to maintain security
			$temp = mysqli_real_escape_string($conn,$temp);
			$temp = str_replace(",","','",$temp);

			//sql string
			$sql = "SELECT id, time, name, bgs, temperature from electrode_data where (time BETWEEN ? and ?) AND (bgs BETWEEN ? and ?) AND (name IN ('" . $temp ."')) AND (is_bad = 'N')";
			
			//bind post variables with sql string for security
			$stmt = mysqli_prepare($conn,$sql);
			mysqli_stmt_bind_param($stmt,'ssii',$datefrom,$dateto,$depthfrom,$depthto);
			//run query and save result
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			$data = array();
			
			//output result
			foreach ($result as $row){
				$data[] = $row;			
			}
			
			//**data result in json format**
			echo(json_encode($data));
		}
		catch(Exception $e){
				echo($e);
		}
		finally{
			//clear data and close connection
			mysqli_free_result($result);
			mysqli_close($conn);
			
		}
	
?>