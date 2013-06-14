class Result < ActiveRecord::Base
  attr_accessible :game_winner, :id, :game_server_stick_count, :game_server_move_count, :game_browser_stick_count, :game_browser_move_count
end
