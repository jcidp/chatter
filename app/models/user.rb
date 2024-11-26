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

  def setup_welcome_chats
    ActiveRecord::Base.transaction do
      bot_id = User.find_by!(username: "chatter_bot").id
      chat = Chat.create!
      chat.chat_users.create!(user_id: bot_id)
      chat.chat_users.create!(user_id: id)
      send_welcome_messages!(chat, bot_id)
      Chat.first.chat_users.create!(user_id: id, is_admin: false)
    end
  rescue ActiveRecord::ActiveRecordError => e
    Rails.logger.debug { "Error setting up welcome chats: #{e}" }
  end

  private

  def send_welcome_messages!(chat, bot_id)
    chat.messages.create!(text: "Welcome to chatter!", user_id: bot_id)
    chat.messages.create!(text: "You can start a chat with a single user, like this one!", user_id: bot_id)
    chat.messages.create!(text: "You can also create a group, like the 'New users group'", user_id: bot_id)
    chat.messages.create!(text: "Have fun chatting with others!", user_id: bot_id)
  end
end
