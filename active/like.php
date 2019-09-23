<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$error = 0;

if($_SESSION['token'] == $_POST['token']) {
	if($_POST['type'] == 'plus') {
		if(!in_array($_POST['likeId'], $_SESSION['plus'])) {
			$stmt= $dbh->prepare("UPDATE comment SET plus = plus + 1 WHERE id=?");
			$stmt->execute([(int) $_POST['likeId']]);

			$_SESSION['plus'][] = (int) $_POST['likeId'];
		}
	} elseif($_POST['type'] == 'minus') {
		if(!in_array($_POST['likeId'], $_SESSION['minus'])) {
			$stmt= $dbh->prepare("UPDATE comment SET minus = minus + 1 WHERE id=?");
			$stmt->execute([(int) $_POST['likeId']]);

			$_SESSION['minus'][] = (int) $_POST['likeId'];
		}
	}

	$result = $dbh->query('SELECT id, plus, minus from comment WHERE id = ' . (int) $_POST['likeId'])->fetch();
} else {
	$result = false;
}

$data = $result ? array('like' => $result ) : array("error" => true, 'mes' => 'Ошибка принятия голоса.');
die(json_encode($data));
?>