class User < ApplicationRecord
  USERNAME_FORMAT = /\A(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,18}[a-z0-9]\z/

  has_secure_password

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end
  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end

  has_many :sessions, dependent: :destroy
  has_many :chat_users, dependent: :destroy
  has_many :chats, through: :chat_users
  has_many :messages, inverse_of: "author", dependent: :destroy
  has_many :groups, through: :chats
  has_one_attached :avatar

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, allow_nil: true, length: { minimum: 8 }
  validates :username, presence: true, format: {
    with: USERNAME_FORMAT,
    message: :invalid_format
  }, uniqueness: { case_sensitive: false }
  validates :bio, length: { maximum: 80 }

  normalizes :email, with: -> { _1.strip.downcase }

  before_validation if: :email_changed?, on: :update do
    self.verified = false
  end

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end

  def as_json(options = {})
    super({
      only: [:id, :email, :username]
    }.merge(options))
  end
end
