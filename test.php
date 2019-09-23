<?php
$user = 'myliveweb';
$pass = 'Otstoy16';
try {
    $dbh = new PDO('mysql:host=localhost;dbname=vk_new', $user, $pass);
    $dbh->exec("set names utf8mb4");
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
$month = array('', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');
$relation = array('', 'Не женат', 'Встречается', 'Помолвлен', 'Женат', 'Всё сложно', 'В активном поиске', 'Влюблён', 'В гражданском браке');
$arrOccupation = array('work' => 'Место работы', 'university' => 'Место учебы', 'school' => 'Место учебы');

if( isset( $_POST['upload'] ) ) {

	$uploaddir = './uploads';

	$done_files = '';

	if($_FILES['my']) {
		$file = $_FILES['my'];

		$file_name = $file['name'];
		$arrExt = explode('.', $file_name);
		$ext = strtolower($arrExt[count($arrExt)-1]);
		$filename = substr(md5(microtime() . rand(0, 9999)), 0, 20) . '.' . $ext;

		if(move_uploaded_file($file['tmp_name'], "$uploaddir/$filename")){
			$search_path = "uploads/" . $filename;

			$command = '/root/anaconda3/bin/python3.6 search.py ' . $search_path;
			exec($command, $out, $status);
			$arr = json_decode($out[0]);

			$result = array();
			foreach($arr as $item) {
				$itemUser = array();

			    $row = $dbh->query('SELECT * from user_rostov_back WHERE vk_id = ' . int($item[1]))->fetch();
			    $detect = $dbh->query('SELECT detect from vectors_photo WHERE id = ' . int($item[2]))->fetch();
			    $more = $dbh->query('SELECT * from user_more WHERE user_id = ' . int($item[1]))->fetch();
			    $school = $dbh->query('SELECT sh.name, sh.year_from, sh.year_to, sh.year_graduated, ci.name as shci from school as sh, city as ci WHERE ci.vk_id = sh.city_id AND sh.user_id = ' . int($item[1]))->fetchAll();
			    $occupation = $dbh->query('SELECT name, type from occupation WHERE user_id = ' . int($item[1]))->fetch();

			    $itemUser['img_full'] = $row['path_img'];
			    $itemUser['img'] = 'detect/' . $detect['detect'];

			    $maiden_name = '';
			    if($more['maiden_name'])
			    	$maiden_name = ' (' . $more['maiden_name'] . ')';
			    //$itemUser['name'] = $row['first_name'] . ' ' . $row['last_name'] . $maiden_name;
			    $itemUser['name'] = $item[1];

			    $birday = '';
			    if($row['day_b'])
			    	$birday .= $row['day_b'];
			    if($row['month_b'])
			    	$birday .= ' ' . $month[$row['month_b']];
			    if($row['year_b'])
			    	$birday .= ' ' . $row['year_b'] . ' г.';

			    if($birday) {
			    	$itemUser['birday'] = $birday;
			    }

			    $itemUser['url'] = $row['url'];

			    $itemUser['target'] = $item[0];

			    if($more['relation'])
			    	$itemUser['relation'] = $relation[$more['relation']];

			    if($more['mobile_phone'])
			    	$itemUser['mobile_phone'] = $more['mobile_phone'];

			    if($more['home_phone'])
			    	$itemUser['home_phone'] = $more['home_phone'];

			    if($more['followers_count'])
			    	$itemUser['followers_count'] = $more['followers_count'];

			    if($more['home_town'])
			    	$itemUser['home_town'] = $more['home_town'];

			    if($more['interests'])
			    	$itemUser['interests'] = $more['interests'];

			    if($more['music'])
			    	$itemUser['music'] = $more['music'];

			    if($more['activities'])
			    	$itemUser['activities'] = $more['activities'];

			    if($more['movies'])
			    	$itemUser['movies'] = $more['movies'];

			    if($more['tv'])
			    	$itemUser['tv'] = $more['tv'];

			    if($more['books'])
			    	$itemUser['books'] = $more['books'];

			    if($more['games'])
			    	$itemUser['games'] = $more['games'];

			    if($more['about'])
			    	$itemUser['about'] = $more['about'];

			    if($more['quotes'])
			    	$itemUser['quotes'] = $more['quotes'];

			    if($more['skype'])
			    	$itemUser['skype'] = $more['skype'];

			    if($more['instagram'])
			    	$itemUser['instagram'] = $more['instagram'];

			    if($more['twitter'])
			    	$itemUser['twitter'] = $more['twitter'];

			    if($school)
			    	$itemUser['school'] = $school;

			    if($occupation)
			    	$itemUser['occupation'] = $arrOccupation[$occupation['type']] . ': ' . $occupation['name'];

			    $result[] = $itemUser;
			}
		}
	}

	$data = $result ? array('file' => $result ) : array('error' => 'Ошибка загрузки файлов.');

	die(json_encode($data));
}
?>
<!DOCTYPE html>
<html lang="ru-RU">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Cache-control" content="public">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="keywords" content="" />
	<meta name="description" content="">
	<meta name="author" content="">
	<title>Smart Ростов</title>
	<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
	<link rel="stylesheet" href="main.css">
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-57789359-2"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', 'UA-57789359-2');
	</script>
</head>
<body>
	<div class="area loader-area"></div>
	<div class="area gif-area">
		<div class="loader"><img src="images/loading.gif"></div>
	</div>
	<div style="max-width: 960px; padding: 15px; margin: 0 auto;">
		<div class="top-area" style="text-align: center; margin: 27% 0 0 0;">
			<img src="images/logo.png" style="display: block; position: relative; left: 50%; margin-bottom: 15px;">
			<input type="file" id="file" accept="image/*">
			<label for="file">Поиск друзей по фото</label>
		</div>
		<div class="ajax-reply"></div>
	</div>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
	<script src="main.js"></script>
</body>
</html>
