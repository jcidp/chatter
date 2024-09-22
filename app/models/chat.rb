class Chat < ApplicationRecord
  has_many :chat_users
  has_many :users, through: :chat_users
  has_many :messages, dependent: :destroy

  self.implicit_order_column = "created_at"

  def self.ordered
    all.sort { |a, b| (b.last_message_at || b.created_at) <=> (a.last_message_at || a.created_at) }
  end
  
  def as_json(options={})
    current_user = options.delete(:current_user)
    include_messages = options.delete(:include) == :messages
    json = super({ only: :id }.merge(options)).merge(name: name(current_user))
    json["messages"] = messages.sorted.map { |message| message.as_json } if include_messages
    json
  end

  def last_message_at
    self.messages.last&.created_at
  end

  def name(current_user)
    self.users.filter { |user| user != current_user }.first.username
  end

  def self.find_or_create_by_users!(user1, user2)
    chat = Chat.joins(:chat_users)
               .where(chat_users: { user_id: [user1.id, user2.id] })
               .group(:id)
               .having("COUNT(*) = 2")
               .select("chats.id")
               .first
    if chat.nil?
      ActiveRecord::Base.transaction do
        chat = Chat.create!
        chat.chat_users.create!(user_id: user1.id)
        chat.chat_users.create!(user_id: user2.id)
      end
    end
    chat
  end
end
