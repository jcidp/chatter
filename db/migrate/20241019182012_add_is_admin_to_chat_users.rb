class AddIsAdminToChatUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :chat_users, :is_admin, :boolean
  end
end
