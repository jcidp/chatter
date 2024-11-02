class Message < ApplicationRecord
  belongs_to :chat
  belongs_to :author, class_name: "User", foreign_key: "user_id", inverse_of: :messages
  has_one_attached :image

  validates :text, presence: true, if: -> { image.blank? }
  validates :image, presence: true, if: -> { text.blank? }

  scope :sorted, -> { order(id: :desc) }
end
