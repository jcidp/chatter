class ChatUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat

  after_destroy :handle_user_leave

  private

  def handle_user_leave
    ensure_admin if chat.group
    destroy_chat_if_empty
  end

  def ensure_admin
    chat_users = chat.chat_users
    return if chat_users.exists?(is_admin: true)

    new_admin = chat_users.first
    return unless new_admin

    new_admin.update!(is_admin: true)
  end

  def destroy_chat_if_empty
    return unless chat.chat_users.empty?

    chat.destroy
  end
end
