class CreateGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :groups do |t|
      t.string :name
      t.text :description
      t.belongs_to :chat, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
