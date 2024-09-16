class CreateChatUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_users do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :chat, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
