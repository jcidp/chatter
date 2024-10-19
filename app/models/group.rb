class Group < ApplicationRecord
  belongs_to :chat, dependent: :destroy
  has_one_attached :photo

  validates :name, presence: true, length: { maximum: 24 }
end
