<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$error = 0;

if(strlen(trim($_POST['req'])) < 8) {
	$error++;
}

$req_list = array();
if($_POST['type_create'] == 2) {
	$count_items = 0;
	foreach($_POST['res_item'] as $item) {
		if(strlen(trim($item)) > 0) {
			$count_items++;
			$req_list[] = $item;
		}
	}
	if($count_items < 2)
		$error++;
} else {
	$req_list[] = 'Да';
	$req_list[] = 'Нет';
}

$comment = 0;
if($_POST['comment'] == 1)
	$comment = 1;

if(!$error && $_SESSION['token'] == $_POST['token']) {
	$stmt = $dbh->prepare("INSERT INTO ag_rostov (vk_id, name, req, active, close, soc, comment, date_create, date_active, date_close, count) VALUES (0, '', :req, 0, 0, '', :comment, NOW(), NULL, NULL, 0)");
	$req = trim($_POST['req']);
	$stmt->bindParam(':req', $req);
	$stmt->bindParam(':comment', $comment);
	$stmt->execute();
	$result = $dbh->lastInsertId();
	foreach($req_list as $res_id => $res) {
		$stmt = $dbh->prepare("INSERT INTO respond (req, res, sort, count) VALUES (:req, :res, :sort, 0)");
		$stmt->bindParam(':req', $result);
		$res_tmp = trim($res);
		$stmt->bindParam(':res', $res_tmp);
		$stmt->bindParam(':sort', $res_id);
		$stmt->execute();
	}
} else {
	$result = false;
}

$data = $result ? array('add' => $result ) : array("error" => true, 'mes' => 'Ошибка добавления голосования.');
die(json_encode($data));
?>