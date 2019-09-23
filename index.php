<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

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

			$command = '/root/anaconda3/bin/python3.6 search_f.py ' . $search_path;

			exec($command, $out, $status);
			$arr = json_decode($out[0]);

			$result = array();
			foreach($arr as $item) {
				$itemUser = array();

			    $detect = $dbh->query('SELECT detect, vk_id from vectors_photo WHERE id = ' . $item[1])->fetch();
			    $row = $dbh->query('SELECT ur.url, ur.first_name, ur.last_name, ur.day_b, ur.month_b, ur.year_b, pr.political, pr.religion, pr.inspired_by, pr.people_main, pr.life_main, pr.smoking, pr.alcohol, ur.city_id, ur.soc, ur.photo from user_rostov_back as ur LEFT JOIN personal as pr ON pr.user_id = ur.vk_id WHERE ur.vk_id = ' . $detect['vk_id'])->fetch();
			    $city = $dbh->query('SELECT name from city WHERE vk_id = ' . $row['city_id'])->fetch();
			    $more = $dbh->query('SELECT * from user_more WHERE user_id = ' . $detect['vk_id'])->fetch();
			    $school = $dbh->query('SELECT sh.name, sh.year_from, sh.year_to, sh.year_graduated, ci.name as shci from school as sh, city as ci WHERE ci.vk_id = sh.city_id AND sh.user_id = ' . $detect['vk_id'])->fetchAll();
			    $occupation = $dbh->query('SELECT name, type from occupation WHERE user_id = ' . $detect['vk_id'])->fetch();

			    if($row['soc'] == 'ok') {
					$itemUser['img_full'] = array($row['photo'], 288, 288);
			    } else {
				    list($width, $height, $type, $attr) = getimagesize($more['photo']);
				    $itemUser['img_full'] = array($more['photo'], $width, $height);
				}

			    $itemUser['img'] = 'detect/' . $detect['detect'];

			    $maiden_name = '';
			    if($more['maiden_name'])
			    	$maiden_name = ' (' . $more['maiden_name'] . ')';
			    $itemUser['name'] = $row['first_name'] . ' ' . $row['last_name'] . $maiden_name;

			    $itemUser['city'] = $city['name'];

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

			    $itemUser['soc'] = $row['soc'];

			    $itemUser['url'] = $row['url'];

			    $per = round(1 - $item[0], 3) * 100;
			    if($per > 60)
			    	$color = '#00C322';
			    elseif($per > 50)
			    	$color = '#FFA500';
			    else
			    	$color = 'red';
			    $itemUser['target'] = '<span style="color: ' . $color . ';">' . $per . '%</span>';

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

			    if($row['political'])
			    	$itemUser['political'] = $polit[$row['political']];

			    if($row['religion'])
			    	$itemUser['religion'] = $row['religion'];

			    if($row['inspired_by'])
			    	$itemUser['inspired_by'] = $row['inspired_by'];

			    if($row['people_main'])
			    	$itemUser['people_main'] = $people[$row['people_main']];

			    if($row['life_main'])
			    	$itemUser['life_main'] = $life[$row['life_main']];

			    if($row['smoking'])
			    	$itemUser['smoking'] = $bad[$row['smoking']];

			    if($row['alcohol'])
			    	$itemUser['alcohol'] = $bad[$row['alcohol']];

			    if($school)
			    	$itemUser['school'] = $school;

			    if($occupation)
			    	$itemUser['occupation'] = $arrOccupation[$occupation['type']] . ':</div><div class="str-text"><span>' . $occupation['name'];

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
	<link rel="stylesheet" href="/css/main.css">
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
		<div class="loader"><img src="/images/loading.gif"></div>
	</div>
	<div class="top-block">
		<div class="top-area" style="margin: 30% 0 0 0;">
			<a href="/" title="На главную"><img class="logo" src="/images/logo1.png"></a>
			<div class="ag"><a href="/active" title="Активный гражданин">Активный гражданин</a></div>
			<div class="info">Ежедневные голосования на тему актуальных городских проблем г.Ростов Великий.</div>
			<!--<input type="file" id="file" accept="image/*">
			<label for="file">Поиск друзей по фото</label>
			<div class="info">Распознавание лиц с дальнейшим поиском в VK и OK. Нажмити зелёную кнопку. Загрузите фотографию.</br>Только для жителей Ростовского района.</div>-->
		</div>
		<div class="ajax-reply"></div>
	</div>
	<div class="box-img">
		<img class="close" src="/images/close.png">
		<img class="front" src="">
	</div>
	<div style="text-align: center; margin: 30px 0;"><a style="color: #155595; text-decoration: none;" href="mailto:info@smartrostov.ru" target="blank">info@smartrostov.ru</a></div>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
	<script src="/js/main.js"></script>
</body>
</html>

