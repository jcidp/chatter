class Message < ApplicationRecord
  belongs_to :chat
  belongs_to :author, class_name: "User", foreign_key: "user_id"

  validates :text, presence: true

  scope :sorted, -> { order(id: :desc) }

  def as_json(options={})
    super({ only: [:text, :user_id, :created_at] }.merge(options))
  end
end
