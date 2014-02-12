<?php
 if (isset($_GET['url'])){
	 	$urlf='http://'.$_GET['url'];
		header("Content-type:text/xml");
		readfile($urlf);
 }
?>  

