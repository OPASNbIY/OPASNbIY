class AddGameServerStickCountAndGameServerMoveCountAndGameBrowserStickCountAndGameBrowserMoveCountToResult < ActiveRecord::Migration
  def change
    add_column :results, :game_server_stick_count, :integer
    add_column :results, :game_server_move_count, :integer
    add_column :results, :game_browser_stick_count, :integer
    add_column :results, :game_browser_move_count, :integer
  end
end
