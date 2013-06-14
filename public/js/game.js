//глобальная переменная для количества палочек
var game_sticks;
//для хранения количества палочек, которые взял сервер
var game_server_stick_count;
//для хранения количества палочек, которые взял браузер
var game_browser_stick_count;
//для хранения ходов
var game_server_move_count;
var game_browser_move_count;
//кто выиграл 1 - браузер, 2 - сервер
var game_winner;

//когда страница загрузится
$(document).ready(function(){
	//когда будет клик на элементе с id="start"
	$("#start").click(function () {
		//в html элемент с id="result" вставить html содержимое
		$("#result").html('Сервер начинает.');
		//20 палочек для новой игры
		game_sticks = 20;
		//всё обнуляем
		game_server_stick_count = 0;
		game_browser_stick_count = 0;
		game_server_move_count = 0;
		game_browser_move_count = 0;
		game_winner = 0;
		//массив палочек
		var sticks = new Array(game_sticks);
		//заполняется массив единицами
		var i = game_sticks;
		while (--i >= 0) {
			sticks[i] = 1;
		}
		//запускается функция игры в которую передаётся массив палочек
		play(sticks);
	});
});

//функция игры
function play(sticks){
	//ajax запрос на сервер
	//например запрос для
	//http://localhost:3000/play/result?sticks[]=1&sticks[]=0&sticks[]=1
	//то сервер получит sticks массив [1,0,1]
	request = $.ajax({
		//ссылка куда посылать запрос
		url: '/play/result',
		//массив будет в запросе
		data: {sticks: sticks},
		//формат ответа ожидается json
		dataType: "json",
		//не кешировать в браузере
		cache: false
		//когда ответ получен
	}).done(function(sticks) {
		//сервер сделал ход
		game_server_move_count ++;
		//подсчитать сколько единиц осталось в массиве
		var sticks_max = 0;
		for (var i in sticks) {
			if(sticks[i] == 1){
				sticks_max ++;
			}
		}
		
		//сервер взял всего палочек
		game_server_stick_count += game_sticks - sticks_max;
		
		//вывести данные как играл сервер
		$("#result").append('<br>Сервер взял палочек: ' + (game_sticks - sticks_max) + ', осталось: ' + sticks_max);
		
		//в игре осталось столько палочек
		game_sticks = sticks_max;
		
		//отобразить палочки визуально
		sticks_html = '';
		//цикл
		for (var i in sticks) {
			//если 1 то палочку
			if(sticks[i] == 1){
				sticks_html += '| ';
			}else{
				//если 0 то пробел
				sticks_html += '&nbsp; ';
			}
		}
		//добавить хтмл код палочек в элемент с id="result"
		$("#result").append('<br><span style="border: 1px solid #CCC;">' + sticks_html + '</span>');
		
		//теперь браузер берёт палочки
		
		//browser делает ход
		game_browser_move_count ++;
		//рассчитать сколько взять палочек
		//если палочек больше 5, то берём случайное количество от 1 до 3
		var sticks_take = 0;
		if(sticks_max > 4){
			sticks_take = Math.floor((Math.random()*3)+1);
		}
		
		//попытаться обыграть

		if(sticks_max == 4){
			sticks_take = 2
		}

		if(sticks_max == 3){
			sticks_take = 1;
		}

		if(sticks_max == 2){
			sticks_take = 2;
		}

		if(sticks_max == 1){
			sticks_take = 1;
		}

		if(sticks_max <= 0){
			sticks_take = 0;
		}
		//палочек нет больше, значит сервер взял последнюю и проиграл
		if(sticks_max == 0){
			$("#result").append('<br>Сервер проиграл.');
			//теперь надо отправить результат игры на сервер
			game_winner = 1;
			save();
		}
		//осталось одна палочка, значит браузер проиграл
		if(sticks_max == 1){
			$("#result").append('<br>Браузер проиграл.');
			//+1 ход и +1 палочка браузеру
			game_browser_stick_count ++;
			game_browser_move_count ++;
			game_winner = 2;
			//теперь надо отправить результат игры на сервер
			save();
		}
		
		//взять палочки
		if(sticks_max > 1){
			//теперь индексы массива палочек
			//пустой массив
			sticks_index = []
			//цикл по массиву палочек
			for(var i in sticks){
				//если есть единица то 
				if(sticks[i] == 1){
					//индек элемента вставить в массив индексов
					sticks_index.push(i) 
				}
			}

			//индексы размешиваем
			sticks_index = shuffle(sticks_index);
			//и берём первые индексы, столько сколько надо взять палочек
			sticks_index = sticks_index.slice(0, sticks_take);
			
			//теперь в массиве палочек заменить элементы на 0 в выбранных индексах
			for(var i in sticks_index){
				sticks[sticks_index[i]] = 0
			}
			
			//из оставшихся палочек вычитаем взятые палочки
			sticks_max -= sticks_take;
			//в игре осталось палочек
			game_sticks = sticks_max;
			//добавить данные про браузер сколько взял палочек
			$("#result").append('<br>Браузер взял палочек: ' + sticks_take + ', осталось: ' + game_sticks );
			
			//браузера взял всего палочек
			game_browser_stick_count += sticks_take;
			
			//опять визуально отпечатать палочки, надо бы поместить в функцию этот код
			sticks_html = '';
			for (var i in sticks) {
				if(sticks[i] == 1){
					sticks_html += '| ';
				}else{
					sticks_html += '&nbsp; ';
				}
			}
			$("#result").append('<br><span style="border: 1px solid #CCC;">' + sticks_html + '</span>');
			
			//и проверить если одна палочка осталось то сервер проиграл
			if(sticks_max == 1){
				$("#result").append('<br>Сервер проиграл.');
				//+1 ход и +1 палочка серверу
				game_server_stick_count ++;
				game_server_move_count ++;
				game_winner = 1;
				//теперь надо отправить результат игры на сервер
				save();
			}else{
				//если не проиграл то опять запустить функцию игры но уже с изменённым массивом палочек
				play(sticks);
			}
			
		}
		
		
	//на всякий пожарный, если сервер повиснет или не отвечает
	}).fail(function() {
		$("#result").html('Ошибка. Сервер отказался играть.');
	});
}

//функция для размешивания элементов в массиве
function shuffle ( myArray ) {
  var i = myArray.length, j, temp;
  if ( i === 0 ) return false;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = myArray[i];
     myArray[i] = myArray[j]; 
     myArray[j] = temp;
   }
   return myArray;
}

//функция для отправки результата игры на сервер
function save(){
	$("#result").append('<br>Сохранение результата игры...');
	//ajax запрос на сервер
	//например запрос для
	//http://localhost:3000/play/save?game_winner=1&game_server_stick_count=10 ...
	request = $.ajax({
		//ссылка куда посылать запрос
		url: '/play/save',
		//данные будет в запросе
		data: {
			game_server_stick_count: game_server_stick_count,
			game_server_move_count: game_server_move_count,
			game_browser_stick_count: game_browser_stick_count,
			game_browser_move_count: game_browser_move_count,
			game_winner: game_winner
		},
		//формат ответа ожидается json
		dataType: "json",
		//не кешировать в браузере
		cache: false
		//когда ответ получен
	}).done(function() {
		//ответ получен, данные сохранены
		$("#result").append('<br>Данные сохранены.');
	}).fail(function() {
		//на всякий пожарный, если сервер повиснет или не отвечает
		$("#result").append('<br>Ошибка. Сервер не отвечает, невозможно сохранить результат.');
	});
}