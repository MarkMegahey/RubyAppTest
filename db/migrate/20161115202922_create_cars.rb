class CreateCars < ActiveRecord::Migration[5.0]
  def change
    create_table :cars do |t|
      t.string :name
      t.string :manufacturer
      t.string :colour

      t.timestamps
    end
  end
end
