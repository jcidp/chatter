class RemoveEmailFromUser < ActiveRecord::Migration[7.1]
  def change
    change_table :users, bulk: true do |t|
      t.remove :verified, type: :string, default: false, null: false
      t.remove :email, type: :string
      # t.remove_index column: [:email], name: "index_users_on_email", unique: true
    end
  end
end
