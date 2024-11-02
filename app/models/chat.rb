class Chat < ApplicationRecord
  has_many :chat_users, dependent: :destroy
  has_many :users, through: :chat_users
  has_many :messages, dependent: :destroy
  has_one :group, dependent: :destroy

  self.implicit_order_column = "created_at"

  def self.ordered
    all.sort { |a, b| (b.last_message_at || b.created_at) <=> (a.last_message_at || a.created_at) }
  end

  def last_message_at
    messages.last&.created_at
  end

  def self.find_or_create_by_users!(user1, user2)
    chat = find_chat_by_users(user1, user2)
    chat || create_chat_with_users!(user1, user2)
  end

  private_class_method def self.find_chat_by_users(user1, user2)
    Chat.joins(:chat_users)
        .where(chat_users: { user_id: [user1.id, user2.id], is_admin: nil })
        .group(:id)
        .having("COUNT(*) = 2")
        .select("chats.id")
        .first
  end

  private_class_method def self.create_chat_with_users!(user1, user2)
    ActiveRecord::Base.transaction do
      chat = Chat.create!
      chat.chat_users.create!(user_id: user1.id)
      chat.chat_users.create!(user_id: user2.id)
      chat
    end
  end
end
