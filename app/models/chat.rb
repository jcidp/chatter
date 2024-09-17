class Chat < ApplicationRecord
  has_many :chat_users
  has_many :users, through: :chat_users
  has_many :messages, dependent: :destroy

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
end
