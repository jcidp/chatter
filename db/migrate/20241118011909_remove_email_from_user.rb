class RemoveEmailFromUser < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :email, :string, null: false
    remove_index :users, :email, unique: true
    remove_column :users, :verified, default: false, null: false
  end
end
