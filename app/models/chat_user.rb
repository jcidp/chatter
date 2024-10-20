class ChatUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat

  validates :user, :chat, presence: true

  after_destroy :handle_user_leave

  private
    def handle_user_leave
      ensure_admin if self.chat.group
      destroy_chat_if_empty
    end

    def ensure_admin
      chat_users = self.chat.chat_users
      return if chat_users.exists?(is_admin: true)

      new_admin = chat_users.first
      if new_admin
      new_admin.update!(is_admin: true)
      end
    end

    def destroy_chat_if_empty
      if self.chat.chat_users.empty?
        self.chat.destroy
      end
    end
end
