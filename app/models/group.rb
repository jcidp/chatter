class Group < ApplicationRecord
  belongs_to :chat, dependent: :destroy
  has_many :users, through: :chat
  has_one_attached :photo

  validates :name, presence: true, length: { maximum: 24 }

  def is_admin?(user_id)
    chat_user = self.find_chat_user(user_id)
    chat_user.is_admin || false
  end

  def make_admin(user_id)
    chat_user = self.find_chat_user(user_id)
    chat_user.is_admin = true
    chat_user.save
  end

  def remove_member(user_id)
    chat_user = self.find_chat_user(user_id)
    chat_user.destroy
  end

  private
    def find_chat_user(user_id)
      self.chat.chat_users.find_by(user_id: user_id)
    end
end
