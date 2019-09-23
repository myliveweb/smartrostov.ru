<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$error = 0;

$result = $dbh->query('SELECT id, req, parent, name, avatar, post, plus, minus, date_create from comment WHERE req = ' . (int) $_POST['req'] . ' AND id > ' . (int) $_POST['maxComm'] . ' ORDER BY id ASC')->fetchAll();
$like = $dbh->query('SELECT id, plus, minus from comment WHERE req = ' . (int) $_POST['req'] . ' ORDER BY id ASC')->fetchAll();

$data = array('update' => $result, 'like' => $like);
die(json_encode($data));
?>