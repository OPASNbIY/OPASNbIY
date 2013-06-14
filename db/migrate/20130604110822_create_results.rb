class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.integer :id
      t.integer :game_winner

      t.timestamps
    end
  end
end
