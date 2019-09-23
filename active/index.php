<?php
require_once($_SERVER["DOCUMENT_ROOT"].'/function.php');

$ag = $dbh->query('SELECT id, req, comment, date_active, count from ag_rostov WHERE active = 1 ORDER BY date_create DESC')->fetchAll();
$ag_array = array();
$out_num = 0;
$out_name = '';
$ag_comment = 0;
$out_res = array();
foreach($ag as $ag_item) {
	$one_array = array();
	$res = $dbh->query('SELECT id, res, count from respond WHERE req = ' . $ag_item['id'] . ' ORDER BY sort ASC')->fetchAll();
	$one_array = $ag_item;
	$one_array['res'] = $res;
	$out_num = $ag_item['id'];
	$out_name = $ag_item['req'];
	$ag_comment = $ag_item['comment'];
	foreach($res as $item_res) {
		$tmp_res = array();
		$tmp_res['label'] = $item_res['res'];
		$tmp_res['value'] = $item_res['count'];
		$out_res[] = $tmp_res;
	}
	if($ag_item['comment']) {
		$comment = $dbh->query('SELECT id, req, parent, name, avatar, post, plus, minus, date_create from comment WHERE ban = 0 AND req = ' . (int) $ag_item['id'] . ' ORDER BY id ASC')->fetchAll();
	}
	$ag_array[] = $one_array;
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
	<script type="text/javascript" src="https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.js"></script>
	<script type="text/javascript" src="/js/fusioncharts.theme.gammel.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet">
	<link rel="stylesheet" href="/css/main.css">
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-57789359-2"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-57789359-2');

	  var newToken = '<?php echo $token; ?>';
	  var num_ag = <?php echo $out_num; ?>;
	  var glob_req = <?php echo json_encode($out_name); ?>;
	  var glob_res = <?php echo json_encode($out_res); ?>;
	  var comment_show = <?php echo $ag_comment; ?>;
	  <?php
	  if($ag_comment) {
	  ?>
	  	var commentArray = <?php echo json_encode($comment); ?>;
	  <?php
	  }
	  ?>
	</script>
</head>
<body>
	<div class="area loader-area"></div>
	<div class="area gif-area">
		<div class="loader"><img src="/images/loading.gif"></div>
	</div>
	<div class="top-block">
		<div class="top-area-ag">
			<a href="/" title="На главную"><img class="logo" src="/images/logo1.png"></a>
			<div class="ag-title"><a href="/active/" title="Активный гражданин"><h1>Активный гражданин</h1></a></div>
			<div class="ag-button first js-create" style="max-width: 768px; width: 100%;">Создать голосование</div>
			<!--<div class="ag-button js-show">Посмотреть заявки</div>-->
			<div class="info">«Активный гражданин» — для тех, кто хочет изменить город к лучшему. Голосуй, создавай свои голосования, комментируй, смотри результаты. Всё в твоих руках.</div>
		</div>
		<style>

		</style>
		<div class="ajax-reply">
			<div class="wrap" id="opros">
			<?php
			foreach($ag_array as $opros) {
				list($date, $time) = explode(' ', $opros['date_active']);
				list($year, $m, $day) = explode('-', $date);
				list($hours, $min, $sec) = explode(':', $time);
			?>
				<div class="opros-date">Голосование началось <?php echo $day . ' ' . $month[(int) $m] . ' ' . $year . ' г. в ' . $hours . ':' . $min; ?></div>
				<div class="opros-title"><h2><?php echo $opros['req']; ?></h2></div>
			<?php
				foreach($opros['res'] as $id_res => $data_res) {
				?>
				<div class="ag-button-res no-chart" data-ag="<?php echo $opros['id']; ?>" data-res="<?php echo $data_res['id']; ?>"><?php echo $data_res['res']; ?></div>
				<?php
				}
				?>
				<div class="wrap" id="chart-container"></div>
				<?php
				if($ag_comment) {
				?>
				<div class="wrap" id="post-comment">
					<div class="comment-header"><h3>Обсуждение</h3><div>Имя:<span>Аноним</span><a class="js-show-personal" href="#" title="изменить">изменить</a></div></div>
					<div class="comment-personsl">
						<input type="text" name="comment_name" value="" placeholder="Введите ваше имя" />
						<h4>Выберите аватарку</h4>
						<div class="comment-personsl-box">
						<?php
						for($n = 0; $n < 35; $n++) {
							$act = '';
							if(!$n)
								$act = ' active';
						?>
							<div class="comment-personsl-img js-pers-img-<?php echo $n; ?><?php echo $act; ?>" data-img="<?php echo $n; ?>"><img src="/images/avatar/<?php echo $n; ?>.png" /></div>
						<?php
						}
						?>
						</div>
						<div class="comment-btn-box" style="display: block; margin-top: 30px;">
							<div class="comment-btn-cancel js-cancel-personal">Отмена</div>
							<div class="comment-btn-ok js-ok-personal">Отправить</div>
						</div>
					</div>
					<div id="post-id-0">
						<div class="comment-box">
							<img class="comment-root-img" src="/images/avatar/0.png" />
							<textarea data-post="0" class="comment-root-textarea" name="" placeholder="Комментировать"></textarea>
						</div>
						<div class="comment-btn-box" id="root-box">
							<div class="comment-btn-cancel js-cancel">Отмена</div>
							<div class="comment-btn-ok js-ok">Отправить</div>
						</div>
					</div>
				</div>
				<?php
				}
			}
			?>
			</div>
		</div>
	</div>
	<div style="text-align: center; margin: 30px 0;"><a style="color: #155595; text-decoration: none;" href="mailto:info@smartrostov.ru" target="blank">info@smartrostov.ru</a></div>
	<div class="box-img">
		<img class="close" src="/images/close.png">
		<img class="front" src="">
	</div>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
	<script src="/js/main.js"></script>
</body>
</html>

