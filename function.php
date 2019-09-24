<?php
ini_set('display_errors', 1);

session_start();
//$_SESSION = array();
require_once('lp.php');
$initArr = array(\PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '+03:00'");
try {
    $dbh = new PDO('mysql:host=localhost;dbname=vk_new', $user, $pass, $initArr);
    $dbh->exec("set names utf8mb4");
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

$token = '';

if(!array_key_exists('token', $_SESSION) || !$_SESSION['token']) {
	$hash = md5(uniqid('aguid'));
	$token = substr($hash, 0, 4) . '-' . substr($hash, 4, 4) . '-' . substr($hash, 8, 4) . '-' . substr($hash, 12, 4);
}

$month = array('', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');
$relation = array('', 'Не женат', 'Встречается', 'Помолвлен', 'Женат', 'Всё сложно', 'В активном поиске', 'Влюблён', 'В гражданском браке');
$arrOccupation = array('work' => 'Место работы', 'university' => 'Место учебы', 'school' => 'Место учебы');
$polit = array('', 'Коммунистические', 'Социалистичеcкие', 'Умеренные', 'Либеральные', 'Консервативные', 'Монархические', 'Ультраконсервативные', 'Индифферентные', 'Либертарианские');
$people = array('', 'Ум и креативность', 'Доброта и честность', 'Красота и здоровье', 'Власть и богатство', 'Смелость и упорство', 'Юмор и жизнелюбие');
$life = array('', 'Семья и дети', 'Карьера и деньги', 'Развлечения и отдых', 'Наука и исследования', 'Совершенствование мира', 'Саморазвитие', 'Красота и искусство', 'Слава и влияние');
$bad = array('', 'Резко негативное', 'Негативное', 'Компромиссное', 'Нейтральное', 'Положительное');
?>