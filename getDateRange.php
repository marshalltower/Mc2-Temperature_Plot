<?php
	include_once("dbConnect.php");

		try{
			//get connection
			$conn = connectdb();

			//sql string
			$sql = "SELECT MIN(time) as FromDate, MAX(time) as ToDate FROM electrode_data";
			
			$stmt = mysqli_prepare($conn,$sql);
			
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