<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$error = 0;

if((int) $_POST['req'] < 0) {
	$error++;
}

if((int) $_POST['postId'] < 0) {
	$error++;
}

if(strlen(trim($_POST['post'])) < 1) {
	$error++;
}

if(!$error && $_SESSION['token'] == $_POST['token']) {
	$stmt = $dbh->prepare("INSERT INTO comment (req, parent, name, avatar, post, plus, minus, ban, date_create) VALUES (:req, :parent, :name, :avatar, :post, 0, 0, 0, NOW())");
	$stmt->bindParam(':req', $_POST['req']);
	$stmt->bindParam(':parent', $_POST['postId']);
	$stmt->bindParam(':name', $_POST['name']);
	$stmt->bindParam(':avatar', $_POST['avatar']);
	$post = trim($_POST['post']);
	$stmt->bindParam(':post', $post);
	$stmt->execute();
	$last_id = $dbh->lastInsertId();

	$post = $dbh->query('SELECT id, req, parent, name, avatar, post, date_create from comment WHERE id = ' . (int) $last_id)->fetch();

	$result['id'] = $post['id'];
	$result['req'] = $post['req'];
	$result['parent'] = $post['parent'];
	$result['name'] = $post['name'];
	$result['avatar'] = $post['avatar'];
	$result['post'] = $post['post'];
	$result['date_create'] = $post['date_create'];
} else {
	$result = false;
}

$data = $result ? array('post' => $result ) : array("error" => true, 'mes' => 'Ошибка публикации комментария.');
die(json_encode($data));
?>