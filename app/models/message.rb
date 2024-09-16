class Message < ApplicationRecord
  belongs_to :chat
  belongs_to :author, class_name: "User", foreign_key: "user_id"

  validates :text, presence: true
end
