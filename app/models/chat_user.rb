class ChatUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat

  validates :user, :chat, presence: true
end
