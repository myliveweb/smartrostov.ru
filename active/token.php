<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

if($_POST['type'] == 'set_token') {
	$_SESSION['token'] = $_POST['token'];

	$_SESSION['vote'] = array();
	if($_POST['vote'])
		$_SESSION['vote'] = $_POST['vote'];

	$_SESSION['plus'] = array();
	if($_POST['plus'])
		$_SESSION['plus'] = $_POST['plus'];

	$_SESSION['minus'] = array();
	if($_POST['minus'])
		$_SESSION['minus'] = $_POST['minus'];
}

die(json_encode($_SESSION));
?>