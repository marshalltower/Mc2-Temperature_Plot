<?php

	define("URL",parse_url(getenv("CLEARDB_DATABASE_URL")),true);
	define("SERVERNAME",URL["host"],true);
	define("USERNAME",URL["user"],true);
	define("PASSWORD",URL["pass"],true);
	define("DATABASE",substr(URL["path"], 1),true);

	function connectdb()
	{
		$conn = mysqli_connect(SERVERNAME, USERNAME, PASSWORD, DATABASE);
		if(mysqli_connect_errno())
		{
			echo(mysqli_connect_error());
			exit; //null value
		}
		return $conn;

	}

?>