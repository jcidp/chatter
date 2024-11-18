class User < ApplicationRecord
  has_secure_password

  has_many :sessions, dependent: :destroy
  has_many :chat_users, dependent: :destroy
  has_many :chats, through: :chat_users
  has_many :messages, inverse_of: "author", dependent: :destroy
  has_many :groups, through: :chats
  has_one_attached :avatar

  validates :password, allow_nil: true, length: { minimum: 8 }
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 24 }
  validates :bio, length: { maximum: 80 }

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end
end
