//localStorage.clear();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mainToken(t) {
	var fd = new FormData();
	fd.append('type', t);
	fd.append('token', token);
	fd.append('vote', voteLS);
	fd.append('plus', likePlus);
	fd.append('minus', likeMinus);
	// AJAX запрос
	$.ajax({
		url         : '/active/token.php',
		type        : 'POST', // важно!
		data        : fd,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			if(t == 'get_token') {
				token = respond.token;
				localStorage.setItem("token", token);

				voteLS = respond.vote;
				let serialVoteLS = JSON.stringify(voteLS); //сериализуем его
				localStorage.setItem("vote", serialVoteLS);


				likePlus = respond.plus;
				let serialLikePlus = JSON.stringify(likePlus); //сериализуем его
				localStorage.setItem("likePlus", serialLikePlus);

				likeMinus = respond.minus;
				let serialLikeMinus = JSON.stringify(likeMinus); //сериализуем его
				localStorage.setItem("likeMinus", serialLikeMinus);
			}
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
	return false;
}
var files; // переменная. будет содержать данные файлов
var margin = 1;
var agFields = 2;
var max_comm = 0;

var voteLS = JSON.parse(localStorage.getItem("vote"));
if(!voteLS)
	voteLS = [];

var commName = localStorage.getItem("commName");
if(!commName)
	commName = 'Аноним';

var commAva = localStorage.getItem("commAva");
if(!commAva)
	commAva = 0;

var likePlus = JSON.parse(localStorage.getItem("likePlus"));
if(!likePlus)
	likePlus = [];

var likeMinus = JSON.parse(localStorage.getItem("likeMinus"));
if(!likeMinus)
	likeMinus = [];

var token = localStorage.getItem("token");
if(!token)
	token = newToken;

if(newToken)
	mainToken('set_token');
else if(!token)
	mainToken('get_token');

// заполняем переменную данными, при изменении значения поля file
$('input[type=file]').on('change', function(){
	event.stopPropagation(); // остановка всех текущих JS событий
	event.preventDefault();  // остановка дефолтного события для текущего элемента - клик для <a> тега

	$('#file').blur();
	// ничего не делаем если files пустой
	if(!this.files.length) return;

	// создадим объект данных формы
	var data = new FormData();

	data.append('my', this.files[0]);

	// добавим переменную для идентификации запроса
	data.append('upload', 1);

	$('.area').show();
	$('.info, .ag').hide();
	// AJAX запрос
	$.ajax({
		url         : './index.php',
		type        : 'POST', // важно!
		data        : data,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success     : function( respond, status, jqXHR ) {
			var html = '';
			if( typeof respond.error === 'undefined' ) {
				html += '<div style="margin-top: 15px;">';
				$.each(respond.file, function( key, val ) {
					 html += '<div style="width: 33%; float: left; text-align: center;">';
					 if(!key) {
					 	html += '<div><img id="radius-' + key + '" data-id="' + key + '" src="' + val.img + '" class="radius active"></div>';
					 	html += '<div id="link-' + key + '" data-id="' + key + '" style="margin-top: 15px;" class="link active">' + val.name + '</div>';
					 } else {
					 	html += '<div><img id="radius-' + key + '" data-id="' + key + '" src="' + val.img + '" class="radius"></div>';
					 	html += '<div id="link-' + key + '" data-id="' + key + '" style="margin-top: 15px;" class="link">' + val.name + '</div>';
					 }

					 html += '</div>';
				} );
				html += '</div>';
				html += '<div style="clear: both;"></div>';
				html += '<div style="margin-top: 25px; padding-top:20px; border-top: 1px solid #e7e8ec; position: relative;">';
				$.each(respond.file, function( key, val ) {
					 if(!key)
					 	html += '<div id="block-' + key + '" class="block active" style="position: absolute;">';
					 else
					 	html += '<div id="block-' + key + '" class="block" style="position: absolute; display: none;">';
					 if(val.birday)
					 	html += '<div class="str-desc">День рождения:</div><div class="str-text"><span>' + val.birday + '</span></div><div class="clear"></div>';
					 if(val.city)
					 	html += '<div class="str-desc">Город:</div><div class="str-text"><span>' + val.city + '</span></div><div class="clear"></div>';
					 if(val.img_full)
					 	html += '<div class="str-text nomargin-l"><span data-url="' + val.img_full[0] + '" data-w="' + val.img_full[1] + '" data-h="' + val.img_full[2] + '" class="link-d">Полное фото</span></div><div class="clear"></div>';
					 if(val.relation)
					 	html += '<div class="str-desc">Семейное положение:</div><div class="str-text"><span>' + val.relation + '</span></div><div class="clear"></div>';
					 if(val.occupation)
					 	html += '<div class="str-desc">' + val.occupation + '</span></div><div class="clear"></div>';
					 if(val.home_town)
					 	html += '<div class="str-desc">Родной город:</div><div class="str-text"><span>' + val.home_town + '</span></div><div class="clear"></div>';
					 html += '<div class="border"><span>Контактная информация</span></div>';
					 if(val.mobile_phone)
					 	html += '<div class="str-desc">Мобильный телефон:</div><div class="str-text"><span>' + val.mobile_phone + '</span></div><div class="clear"></div>';
					 if(val.home_phone)
					 	html += '<div class="str-desc">Домашний телефон:</div><div class="str-text"><span>' + val.home_phone + '</span></div><div class="clear"></div>';
					 if(val.skype)
					 	html += '<div class="str-desc">Skype:</div><div class="str-text"><span>' + val.skype + '</span></div><div class="clear"></div>';
					 if(val.instagram)
					 	html += '<div class="str-desc">Instagram:</div><div class="str-text"><span>' + val.instagram + '</span></div><div class="clear"></div>';
					 if(val.twitter)
					 	html += '<div class="str-desc">Twitter:</div><div class="str-text"><span>' + val.twitter + '</span></div><div class="clear"></div>';
					 if(val.soc == 'ok')
					 	site = 'ok.ru'
					 else
					 	site = 'vk.com/'
					 html += '<div class="str-desc">Личная страница:</div><div class="str-text" style="font-weight: bold;"><span>https://' + site + val.url + '</span></div><div class="clear"></div>';
					 if(val.school)
					 	html += '<div class="border"><span>Образование</span></div>';
					 if(val.school) {
					 	$.each(val.school, function( schkey, schval ) {
					 		if(schval.year_graduated > 0) {
					 			html += '<div class="str-desc">Школа:</div><div class="str-text"><span>' + schval.name + ' `' + schval.year_graduated + '</span></div><div class="clear"></div>';
					 		} else {
					 			html += '<div class="str-desc">Школа:</div><div class="str-text"><span>' + schval.name + '</span></div><div class="clear"></div>';
					 		}
					 		if(schval.year_from > 0 && schval.year_to > 0) {
					 			html += '<div class="str-text nomargin-l"><span>' + schval.shci + ', ' + schval.year_from + '-' + schval.year_to + '</span></div>';
					 		} else {
					 			html += '<div class="str-text nomargin-l"><span>' + schval.shci + '</span></div>';
					 		}
					 	});
					 }
					 if(val.political || val.religion || val.inspired_by || val.people_main || val.life_main || val.smoking || val.alcohol)
					 	html += '<div class="border"><span>Жизненная позиция</span></div>';
					 if(val.political)
					 	html += '<div class="str-desc">Полит. предпочтения:</div><div class="str-text"><span>' + val.political + '</span></div><div class="clear"></div>';
					 if(val.religion)
					 	html += '<div class="str-desc">Мировоззрение:</div><div class="str-text"><span>' + val.religion + '</span></div><div class="clear"></div>';
					 if(val.inspired_by)
					 	html += '<div class="str-desc">Вдохновляют:</div><div class="str-text"><span>' + val.inspired_by + '</span></div><div class="clear"></div>';
					 if(val.people_main)
					 	html += '<div class="str-desc">Главное в людях:</div><div class="str-text"><span>' + val.people_main + '</span></div><div class="clear"></div>';
					 if(val.life_main)
					 	html += '<div class="str-desc">Главное в жизни:</div><div class="str-text"><span>' + val.life_main + '</span></div><div class="clear"></div>';
					 if(val.smoking)
					 	html += '<div class="str-desc">Отн. к курению:</div><div class="str-text"><span>' + val.smoking + '</span></div><div class="clear"></div>';
					 if(val.alcohol)
					 	html += '<div class="str-desc">Отн. к алкоголю:</div><div class="str-text"><span>' + val.alcohol + '</span></div><div class="clear"></div>';
					 if(val.activities || val.interests || val.music || val.movies || val.tv || val.books || val.games || val.quotes || val.about)
					 	html += '<div class="border"><span>Личная информация</span></div>';
					 if(val.activities)
					 	html += '<div class="str-desc">Деятельность:</div><div class="str-text"><span>' + val.activities + '</span></div><div class="clear"></div>';
					 if(val.interests)
					 	html += '<div class="str-desc">Интересы:</div><div class="str-text"><span>' + val.interests + '</span></div><div class="clear"></div>';
					 if(val.music)
					 	html += '<div class="str-desc">Любимая музыка:</div><div class="str-text"><span>' + val.music + '</span></div><div class="clear"></div>';
					 if(val.movies)
					 	html += '<div class="str-desc">Любимые фильмы:</div><div class="str-text"><span>' + val.movies + '</span></div><div class="clear"></div>';
					 if(val.tv)
					 	html += '<div class="str-desc">Любимые телешоу:</div><div class="str-text"><span>' + val.tv + '</span></div><div class="clear"></div>';
					 if(val.books)
					 	html += '<div class="str-desc">Любимые книги:</div><div class="str-text"><span>' + val.books + '</span></div><div class="clear"></div>';
					 if(val.games)
					 	html += '<div class="str-desc">Любимые игры:</div><div class="str-text"><span>' + val.games + '</span></div><div class="clear"></div>';
					 if(val.quotes)
					 	html += '<div class="str-desc">Любимые цитаты:</div><div class="str-text nomargin-l">' + val.quotes + '</div><div class="clear"></div>';
					 if(val.about)
					 	html += '<div class="str-desc">О себе:</div><div class="str-text nomargin-l"><span>' + val.about + '</span></div><div class="clear"></div>';
					 html += '<div style="margin-top: 15px;">Точность: ' + val.target + '</div>';
					 html += '</div>';
				} );
				html += '</div>';
			}
			// ошибка
			else {
				 html += '<div style="margin-top: 15px;">';
				 html += '<div style="width: 100%; text-align: center;">';
			 	 html += '<div><img src="/images/bad.png" class="radius active" style="border-color: #eeeeee;"></div>';
			 	 html += '<div style="margin-top: 15px;">Ничего не найдено. Попробуйте другое фото.</div>';
				 html += '</div>';
				 html += '</div>';
				console.log('ОШИБКА: ' + respond.error );
			}
			$('.ajax-reply').fadeOut(100);
			$('.ajax-reply').html( html );
			$('.ajax-reply').fadeIn();
			if(margin) {
				margin = 0;
				$( ".top-area" ).animate({
					margin: 0,
					paddingTop: 0
				}, 1000, function() {
					$('.area').fadeOut(500);
				});
			} else {
				$('.area').fadeOut(500);
			}

		},
		// функция ошибки ответа сервера
		error: function( jqXHR, status, errorThrown ){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
});

$('.ajax-reply').on('click', '.radius, .link', function(){
	if($(this).hasClass('active'))
		return false;
	let id = $(this).data('id');
	$('.block').fadeOut();
	$('#block-' + id).fadeIn();
	$('.radius').removeClass('active');
	$('#radius-' + id).addClass('active');
	$('.link').removeClass('active');
	$('#link-' + id).addClass('active');
	return false;
});

$('.ajax-reply').on('click', '.link-d', function(){
	let sizeImg = innerWidth;
	if(sizeImg > 600)
		sizeImg = 600;
	let url = $(this).data('url');
	let width = $(this).data('w');
	if(sizeImg > width)
		sizeImg = width;
	let height = $(this).data('h');
	let koef = width / sizeImg;
	let newHeight = height / koef;
	$('.box-img .front').attr('src', url);
	$('.box-img').css('width', sizeImg + 'px');
	$('.box-img').css('marginLeft', '-' + (sizeImg / 2) + 'px');
	$('.box-img').css('marginTop', '-' + (newHeight / 2) + 'px');
	$('.box-img').show();
	return false;
});

$('.box-img .close').on('click', function(){
	$('.box-img').hide();
	return false;
});

$('.js-create').on('click', function(){
	var html = '';
	html += '<div class="ag-create">';
	html += '<form id="ag-form" name="ag-form" method="post">';
	html += '<div class="ag-title-create">Ваш вопрос?</div>';
	html += '<div class="ag-box"><textarea id="req" name="req"></textarea></div>';
	html += '<div class="ag-title-create" style="margin-top: 25px;">Варианты ответов</div>';
	html += '<div class="ag-type"><input class="ag-radio" id="radio-1" type="radio" name="type_create" value="1" checked="checked"><label for="radio-1">Да или Нет</label></div>';
	html += '<div class="ag-type"><input class="ag-radio" id="radio-2" type="radio" name="type_create" value="2"><label for="radio-2">Свои варианты</label></div>';
	html += '<div class="ag-checkbox">';
	html += '<input type="checkbox" class="checkbox" id="checkbox" name="comment" value="1" />';
	html += '<label for="checkbox">Комментарии</label>';
	html += '</div>';
	html += '<div class="ag-checkbox add">';
	html += '<img class="js-add-item" src="/images/add.png" alt="Добавить ответ" title="Добавить ответ" />';
	html += '</div>';
	html += '<div class="ag-box-item">';
	html += '<div class="ag-item"><input type="text" name="res_item[]" value="" placeholder="1"><img class="del-item" src="/images/minus_24.png" alt="Удалить" title="Удалить" /></div>';
	html += '<div class="ag-item"><input type="text" name="res_item[]" value="" placeholder="2"><img class="del-item" src="/images/minus_24.png" alt="Удалить" title="Удалить" /></div>';
	html += '</div>';
	html += '<div class="ag-button-complete first js-complete">Готово</div>';
	html += '</form>';
	html += '</div>';
	$('.top-area-ag .info').hide();
	$('.ajax-reply').hide();
	$('.ajax-reply').html( html );
	$('.ajax-reply').fadeIn();
	return false;
});
$('.ajax-reply').on('change', 'input[type=radio][name=type_create]', function(){
	let typePost = $(this).val();
	if(typePost == 1)
		$('.ag-box-item, .ag-checkbox.add').hide();
	if(typePost == 2)
		$('.ag-box-item, .ag-checkbox.add').show();
	return false;
});
$('.ajax-reply').on('click', '.js-add-item', function(){
	if(agFields < 7) {
		out = '<div class="ag-item"><input type="text" name="res_item[]" value="" placeholder=""><img class="del-item" src="/images/minus_24.png" alt="Удалить" title="Удалить" /></div>';
		$('.ag-box-item').append(out);
		agFields++;
		placeholder();
	}
	return false;
});
$('.ajax-reply').on('click', '.del-item', function(){
	if(agFields > 2) {
		$(this).parent().remove();
		agFields--;
		placeholder();
	}
	return false;
});
function placeholder() {
	$('.ag-item').each(function(index) {
		$(this).find('input').attr('placeholder', (index + 1));
	});
	if(agFields > 2)
		$('.del-item').addClass('active');
	else
		$('.del-item').removeClass('active');
}

function getDiff(strDate) {
	let date1 = new Date();
	let date2 = new Date(strDate);
	let day = Math.floor(Math.abs(date1 - date2) / 864e5);
	if(day)
		return day + ' дн.';
	let hours = Math.floor(Math.abs(date1 - date2) / 36e5);
	if(hours)
		return hours + ' час.';
	let min = Math.floor(Math.abs(date1 - date2) / 6e4);
	if(min)
		return min + ' мин.';
	return  Math.floor(Math.abs(date1 - date2) / 1e3) + ' сек.';
}

function buildComment() {
	$.each(commentArray, function(index, itemVal)	{
		max_comm = itemVal.id;
		timeOld = getDiff(itemVal.date_create);
		let itemComm = '';
		if(itemVal.parent > 0) {
			itemComm += '<div class="comment-body comment-sub" id="post-id-' + itemVal.id + '">';
		} else {
			itemComm += '<div class="comment-body" id="post-id-' + itemVal.id + '">';
		}
		itemComm += '<div class="comment-box">';
		itemComm += '<img class="comment-avatar" src="/images/avatar/' + itemVal.avatar + '.png" />';
		itemComm += '<div class="comment-name">' + itemVal.name + '<span class="js-time" data-comm-time="' + itemVal.date_create + '">' + timeOld + '</span></div>';
		itemComm += '<div class="comment-text">' + itemVal.post + '</div>';
		itemComm += '</div>';
		itemComm += '<div class="comment-service">';
		itemComm += '<span class="btn-response" data-comm-id="' + itemVal.id + '">Ответ</span>';
		if(itemVal.plus > 0)
			itemComm += '<span class="show-like show">' + itemVal.plus + '</span>';
		else
			itemComm += '<span class="show-like"></span>';
		if(likePlus.indexOf(itemVal.id.toString()) >= 0)
			itemComm += '<span class="show-like-img main"></span>';
		else
			itemComm += '<span class="show-like-img"></span>';
		if(itemVal.minus > 0)
			itemComm += '<span class="show-dlike show">' + itemVal.minus + '</span>';
		else
			itemComm += '<span class="show-dlike"></span>';
		if(likeMinus.indexOf(itemVal.id.toString()) >= 0)
			itemComm += '<span class="show-dlike-img main"></span>';
		else
			itemComm += '<span class="show-dlike-img"></span>';
		itemComm += '</div>';
		itemComm += '</div>';

		if(itemVal.parent > 0) {
			$('#post-id-' + itemVal.parent).append(itemComm);
		} else {
			$('#root-box').after(itemComm);
		}
	});
}
function intervalFunc() {
    var fd = new FormData();
	fd.append('req', num_ag);
	fd.append('maxComm', max_comm);
	// AJAX запрос
	$.ajax({
		url         : '/active/interval_update.php',
		type        : 'POST', // важно!
		data        : fd,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			$.each(respond.update, function(index, itemVal)	{
				max_comm = itemVal.id;
				timeOld = getDiff(itemVal.date_create);
				let itemComm = '';
				if(itemVal.parent > 0) {
					itemComm += '<div class="comment-body comment-sub" id="post-id-' + itemVal.id + '">';
				} else {
					itemComm += '<div class="comment-body" id="post-id-' + itemVal.id + '">';
				}
				itemComm += '<div class="comment-box">';
				itemComm += '<img class="comment-avatar" src="/images/avatar/' + itemVal.avatar + '.png" />';
				itemComm += '<div class="comment-name">' + itemVal.name + '<span class="js-time" data-comm-time="' + itemVal.date_create + '">' + timeOld + '</span></div>';
				itemComm += '<div class="comment-text">' + itemVal.post + '</div>';
				itemComm += '</div>';
				itemComm += '<div class="comment-service">';
				itemComm += '<span class="btn-response" data-comm-id="' + itemVal.id + '">Ответ</span>';
				if(itemVal.plus > 0)
					itemComm += '<span class="show-like show">' + itemVal.plus + '</span>';
				else
					itemComm += '<span class="show-like"></span>';
				if(likePlus.indexOf(itemVal.id.toString()) >= 0)
					itemComm += '<span class="show-like-img main"></span>';
				else
					itemComm += '<span class="show-like-img"></span>';
				if(itemVal.minus > 0)
					itemComm += '<span class="show-dlike show">' + itemVal.minus + '</span>';
				else
					itemComm += '<span class="show-dlike"></span>';
				if(likeMinus.indexOf(itemVal.id.toString()) >= 0)
					itemComm += '<span class="show-dlike-img main"></span>';
				else
					itemComm += '<span class="show-dlike-img"></span>';
				itemComm += '</div>';
				itemComm += '</div>';

				if(itemVal.parent > 0) {
					$('#post-id-' + itemVal.parent).append(itemComm);
				} else {
					$('#root-box').after(itemComm);
				}
			});

			$.each(respond.like, function(index, itemVal)	{
				let likeBox = $('#post-id-' + itemVal.id).find('.comment-service');
				if(itemVal.plus) {
					likeBox.find('show-like show').text(itemVal.plus);
				}
				if(itemVal.minus) {
					likeBox.find('show-dlike show').text(itemVal.minus);
				}
			});
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});

	$('.js-time').each(function(index)	{
		timeInterval = getDiff($(this).data('comm-time'));
		$(this).text(timeInterval);
	});
	return false;
}
function show_chart(nameChart, dataChart) {
	FusionCharts.ready(function(){
	    var fusioncharts = new FusionCharts({
	    type: 'bar2d',
	    renderAt: 'chart-container',
	    width: '100%',
	    height: '400',
	    dataFormat: 'json',
	    dataSource: {
	        // Chart Configuration
	        "chart": {
	            //"caption": nameChart,
	            "yAxisName": "Голосов",
	            "theme": "gammel",
	            "captionFontSize": '30',
	        },
	        // Chart Data
	        "data": dataChart
	    }
	});
    fusioncharts.render();
    });
}

$('.ajax-reply').on('click', '.js-complete', function(){
	var err = 0;
	if($.trim($('#req').val()).length < 8) {
		err++;
		$('#req').css('border', '1px solid red');
		$('#req').attr('placeholder', 'Напишите вопрос минимум 8 символов');
	} else {
		$('#req').css('border', '1px solid #e7e8ec');
	}
	if($('input[type=radio][name=type_create]:checked').val() == 2) {
		var goodFaileds = 0;
		$('.ag-item').each(function(index) {
			if($.trim($(this).find('input').val()).length > 0) {
				goodFaileds++;
				$(this).find('input').css('border', '1px solid #e7e8ec');
			}
		});
		if(goodFaileds < 2) {
			err++;
			$('.ag-item').each(function(index) {
				if($.trim($(this).find('input').val()).length > 0) {
					$(this).find('input').css('border', '1px solid #e7e8ec');
				} else {
					$(this).find('input').css('border', '1px solid red');
					$(this).find('input').attr('placeholder', 'Заполните минимум 2 ответа');
				}
			});
		}
	}

	if(err) {
		console.log('Выход по ошибке');
		return false;
	}
	$('.area').show();
	var data = new FormData($("#ag-form")[0]);
	data.append('token', token);
	// AJAX запрос
	$.ajax({
		url         : '/active/add.php',
		type        : 'POST', // важно!
		data        : data,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			var complete = '';
			if(respond.error) {
				complete += '<div class="wrap">';
				complete += '<div style="margin-top: 45px;"><img src="/images/bad.png" class="radius active" style="border-color: #eeeeee;"></div>';
				complete += '<div style="margin-top: 15px;">Произошла ошибка. Попробуйте создать голосование ещё раз.</div>';
				complete += '</div>';
			} else {
				complete += '<div class="wrap">';
				complete += '<div style="margin-top: 45px; color: green; font-size: 30px;">Поздравляем!</div>';
				complete += '<div style="margin: 45px 0;">Ваше голосование отправлено на модерацию. В течении 12 часов ваша заявка будет обработана и опубликована.</div>';
				complete += '<div><img src="/images/bad.png" class="radius active" style="border-color: #eeeeee;"></div>';
				complete += '</div>';
			}
			$('.ajax-reply').hide();
			$('.ajax-reply').html(complete);
			$('.ajax-reply').fadeIn();
			$('.area').fadeOut(500);
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
	return false;
});

$('.ajax-reply').on('click', '.ag-button-res', function(){
	var agId = $(this).data('ag');
	var resId = $(this).data('res');

    var fd = new FormData();
	fd.append('agId', agId);
	fd.append('resId', resId);
	fd.append('token', token);

	$('.area').show();
	// AJAX запрос
	$.ajax({
		url         : '/active/vote.php',
		type        : 'POST', // важно!
		data        : fd,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			if(respond.error) {
				$('.area').fadeOut(500);
			} else {
				var agRespond = respond.vote.ag;
				var resRespond = respond.vote.res;

				voteLS.push(agRespond.id);
				var serialVoteLS = JSON.stringify(voteLS); //сериализуем его
				localStorage.setItem("vote", serialVoteLS);

				$('.no-chart').hide();
				$('#chart-container').fadeIn();
				set_personal();
				buildComment();
				$('#post-comment').fadeIn();
				$('.area').fadeOut(500);
				show_chart(agRespond.req, resRespond);
				// начать повторы с интервалом 15 сек
				var timerId = setInterval('intervalFunc()', 15000);
			}
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
	return false;
});

$('.ajax-reply').on('focus', '.comment-root-textarea', function(){
	$(this).animate({
		height: 100
	}, 300, function() {
		$('.comment-btn-box').fadeIn();
	});
	return false;
});

$('.ajax-reply').on('click', '.js-cancel', function(){
	let btnBox = $(this).parent();
	let textarea = $(this).parent().prev().find('textarea');
	let postId = textarea.data('post');

	heightTA = 0;
	if(!postId)
		heightTA = 44;
	textarea.val('');
	textarea.css('border', '1px solid #e7e8ec');
	textarea.attr('placeholder', 'Комментировать');
	textarea.animate({
		height: heightTA
	}, 300, function() {
		btnBox.fadeOut();
	});
	if(postId) {
		textarea.parent().remove();
		btnBox.remove();
	}
	return false;
});

$('.ajax-reply').on('click', '.js-ok', function(){
	let btnBox = $(this).parent();
	let textarea = btnBox.prev().find('textarea');
	let post = $.trim(textarea.val());
	let postId = textarea.data('post');

	if(post.length == 0) {
		textarea.val('');
		textarea.css('border', '1px solid red');
		textarea.attr('placeholder', 'Напишите ваш комментарий');
		return false;
	}

    var fd = new FormData();
	fd.append('req', num_ag);
	fd.append('postId', postId);
	fd.append('post', post);
	fd.append('name', commName);
	fd.append('avatar', commAva);
	fd.append('token', token);

	$('.area').show();
	// AJAX запрос
	$.ajax({
		url         : '/active/comment.php',
		type        : 'POST', // важно!
		data        : fd,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			if(respond.error) {
				$('.area').fadeOut(500);
			} else {
				let commOut = '';
				let respPost = respond.post;
				max_comm = respPost.id;
				if(respPost.parent > 0) {
					commOut += '<div class="comment-body comment-new comment-sub" id="post-id-' + respPost.id + '">';
				} else {
					commOut += '<div class="comment-body comment-new" id="post-id-' + respPost.id + '">';
				}
				commOut += '<div class="comment-box">';
				commOut += '<img class="comment-avatar" src="/images/avatar/' + respPost.avatar + '.png" />';
				commOut += '<div class="comment-name">' + respPost.name + '<span class="js-time" data-comm-time="' + respPost.date_create + '">2 сек.</span></div>';
				commOut += '<div class="comment-text">' + respPost.post + '</div>';
				commOut += '</div>';
				commOut += '<div class="comment-service">';
				commOut += '<span class="btn-response" data-comm-id="' + respPost.id + '">Ответ</span>';
				commOut += '<span class="show-like"></span>';
				commOut += '<span class="show-like-img"></span>';
				commOut += '<span class="show-dlike"></span>';
				commOut += '<span class="show-dlike-img"></span>';
				commOut += '</div>';
				commOut += '</div>';

				if(!postId)
					btnBox.after(commOut);
				else
					btnBox.parent().append(commOut);
				$('#post-id-' + respPost.id).slideDown();

				heightTA = 0;
				if(!postId)
					heightTA = 44;
				textarea.val('');
				textarea.animate({
					height: heightTA
				}, 300, function() {
					btnBox.fadeOut();
				});
				if(postId) {
					textarea.parent().remove();
					btnBox.remove();
				}
				$('.area').fadeOut(500);
			}
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
	return false;
});

$('.js-show').on('click', function(){
	console.log('show');
	return false;
});

function set_personal() {
	$('.comment-header span').text(commName);
	$('.comment-root-img').attr('src', '/images/avatar/' + commAva + '.png');
	$('.comment-personsl input').val(commName);
	$('.comment-personsl-img').removeClass('active');
	$('.js-pers-img-' + commAva).addClass('active');
}

$('.ajax-reply').on('click', '.js-show-personal', function(){
	$('.comment-personsl').slideDown();
	return false;
});

$('.ajax-reply').on('click', '.comment-personsl-img', function(){
	$('.comment-personsl-img').removeClass('active');
	$(this).addClass('active');
	return false;
});

$('.ajax-reply').on('click', '.js-cancel-personal', function(){
	$('.comment-personsl').slideUp();
	$('.comment-personsl input').val(commName);
	$('.comment-personsl input').css('border', '1px solid #e7e8ec');
	$('.comment-personsl input').attr('placeholder', 'Введите ваше имя');
	set_personal();
	return false;
});

$('.ajax-reply').on('click', '.js-ok-personal', function(){
	inputPers = $('.comment-personsl input');
	namePers = $.trim(inputPers.val());
	if(namePers.length == 0) {
		inputPers.val('');
		inputPers.css('border', '1px solid red');
		return false;
	}
	commName = namePers;
	commAva = $('.comment-personsl-img.active').data('img');
	set_personal();
	$('.comment-personsl').slideUp();
	localStorage.setItem("commName", commName);
	localStorage.setItem("commAva", commAva);
	return false;
});

$('.ajax-reply').on('click', '.btn-response', function(){
	let btnBox = $(this).parent();

	if(!btnBox.next().is('.comment-box')) {

		let parentId = $(this).data('comm-id');

		let btnBlock = '';
		btnBlock += '<div class="comment-box" style="margin: 30px 0 0 44px;">';
		btnBlock += '<img class="comment-root-img" src="/images/avatar/' + commAva + '.png" />';
		btnBlock += '<textarea data-post="' + parentId + '" class="comment-textarea" name="" placeholder="Комментировать"></textarea>';
		btnBlock += '</div>';
		btnBlock += '<div class="comment-btn-box">';
		btnBlock += '<div class="comment-btn-cancel js-cancel">Отмена</div>';
		btnBlock += '<div class="comment-btn-ok js-ok">Отправить</div>';
		btnBlock += '</div>';

		btnBox.after(btnBlock);

		btnBox.next().find('textarea').animate({
			height: 100
		}, 300, function() {
			btnBox.next().next('.comment-btn-box').fadeIn();
		});
	}

	return false;
});

$('.ajax-reply').on('click', '.show-like-img, .show-dlike-img', function(){
	let boxLike = $(this).parent();
	let likeId = boxLike.find('.btn-response').data('comm-id');

	let typeLike = '';
	if($(this).hasClass('show-like-img')) {
		typeLike = 'plus';
		if(likePlus.indexOf(likeId.toString()) >= 0)
			return false;
	} else if($(this).hasClass('show-dlike-img')) {
		typeLike = 'minus';
		if(likeMinus.indexOf(likeId.toString()) >= 0)
			return false;
	}

    let fd = new FormData();
	fd.append('likeId', likeId);
	fd.append('type', typeLike);
	fd.append('token', token);

	$('.area').show();
	// AJAX запрос
	$.ajax({
		url         : '/active/like.php',
		type        : 'POST', // важно!
		data        : fd,
		cache       : false,
		dataType    : 'json',
		// отключаем обработку передаваемых данных, пусть передаются как есть
		processData : false,
		// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
		contentType : false,
		// функция успешного ответа сервера
		success: function( respond, status, jqXHR ) {
			if(respond.error) {
				$('.area').fadeOut(500);
			} else {
				let resLike = respond.like;

				if(typeLike == 'plus') {
					boxLike.find('.show-like').text(resLike.plus);
					boxLike.find('.show-like').show();
					boxLike.find('.show-like-img').addClass('main');

					likePlus.push(resLike.id);
					let serialLikePlus = JSON.stringify(likePlus); //сериализуем его
					localStorage.setItem("likePlus", serialLikePlus);
				}

				if(typeLike == 'minus') {
					boxLike.find('.show-dlike').text(resLike.minus);
					boxLike.find('.show-dlike').show();
					boxLike.find('.show-dlike-img').addClass('main');

					likeMinus.push(resLike.id);
					let serialLikeMinus = JSON.stringify(likeMinus); //сериализуем его
					localStorage.setItem("likeMinus", serialLikeMinus);
				}
				$('.area').fadeOut(500);
			}
		},
		fail: function(jqXHR, status, errorThrown){
			console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	});
	return false;
});

if(voteLS.indexOf(num_ag.toString()) >= 0) {
	$('#chart-container').fadeIn();
	if(comment_show) {
		set_personal();
		buildComment();
		$('#post-comment').fadeIn();
	}
	show_chart(glob_req, glob_res);
	// начать повторы с интервалом 15 сек
	var timerId = setInterval('intervalFunc()', 15000);
} else {
	$('.no-chart').fadeIn();
}