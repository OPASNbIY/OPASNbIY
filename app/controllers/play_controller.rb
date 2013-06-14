class PlayController < ApplicationController
  def result

	#получаем массив данных из get запроса, попутно конвертируя элементы из строковых в числовые
	sticks = params[:sticks].map(&:to_i)

	#находим сколько палочек (единиц) осталось
	sticks_max = sticks.count(1)

	#рассчитать сколько взять палочек
	#если палочек больше 5, то берём случайное количество от 1 до 3
	if(sticks_max > 4)
		sticks_take = rand(3) + 1
	end
	
	#попытаться обыграть
	if(sticks_max == 4)
		sticks_take = 3
	end

	if(sticks_max == 3)
		sticks_take = 2
	end

	if(sticks_max == 2)
		sticks_take = 1
	end

	if(sticks_max == 1)
		sticks_take = 1
	end

	if(sticks_max <= 0)
		sticks_take = 0
	end

	#взять палочки
	if(sticks_max > 0)
		#теперь индексы массива палочек
		sticks_index = []
		sticks.to_enum.with_index(1).each do |i, index|
			if(i == 1)
				sticks_index.push index-1
			end
		end
		
		#индексы размешиваем
		sticks_index = sticks_index.shuffle
		#и берём первые индексы, столько сколько надо взять палочек
		sticks_index = sticks_index[0..sticks_take - 1]
		
		#теперь в массиве палочек заменить элементы на 0 в выбранных индексах
		for i in sticks_index
			sticks[i] = 0
		end
	end
	
	#результат отобразить в формате json для javascript
	render :json => sticks

  end
  
	def save
		#берём из базы номер последней записи, тот же запрос SELECT * FROM results ORDER BY results.id DESC LIMIT 1
		result_last = Result.last
		id = 1
		#если записи есть
		if(result_last != nil)
			#то прибавляем 1
			id = result_last.id + 1
		end
		
		#создаём новый обьект результатов
		#result = Result.new(id: result_last_id, game_winner: params[:game_winner])
		result = Result.new(id: id, game_winner: params[:game_winner], game_server_stick_count: params[:game_server_stick_count], game_server_move_count: params[:game_server_move_count], game_browser_stick_count: params[:game_browser_stick_count], game_browser_move_count: params[:game_browser_move_count])
		#и сохраняем его
		result.save
		
		#вернуть результат записи
		render :json => result
	end
	
	def stat
		@stat = Result.find(:all, :order => "id")
	end
end