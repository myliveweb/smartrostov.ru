<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$error = 0;

if(!isset($_SESSION['vote']) || !is_array($_SESSION['vote']))
	$_SESSION['vote'] = array();

if($_SESSION['token'] == $_POST['token'] && !in_array($_POST['agId'], $_SESSION['vote'])) {
	$stmt= $dbh->prepare("UPDATE ag_rostov SET count = count + 1 WHERE id=?");
	$stmt->execute([(int) $_POST['agId']]);

	$stmt= $dbh->prepare("UPDATE respond SET count = count + 1 WHERE id=?");
	$stmt->execute([(int) $_POST['resId']]);

	$ag = $dbh->query('SELECT id, req, comment, date_active, count from ag_rostov WHERE id = ' . (int) $_POST['agId'])->fetch();
	$result['ag'] = $ag;

	$res = $dbh->query('SELECT id, res, count from respond WHERE req = ' . (int) $_POST['agId'] . ' ORDER BY sort ASC')->fetchAll();
	$out_res = array();
	foreach($res as $item_res) {
		$tmp_res = array();
		$tmp_res['label'] = $item_res['res'];
		$tmp_res['value'] = $item_res['count'];
		$out_res[] = $tmp_res;
	}
	$result['res'] = $out_res;
	$_SESSION['vote'][] = (int) $_POST['agId'];
} else {
	$result = false;
}

$data = $result ? array('vote' => $result ) : array("error" => true, 'mes' => 'Ошибка принятия голоса.');
die(json_encode($data));
?>