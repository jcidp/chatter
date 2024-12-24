class Group < ApplicationRecord
  belongs_to :chat, dependent: :destroy
  has_many :users, through: :chat
  has_one_attached :photo

  validates :name, presence: true, length: { minimum: 3, maximum: 24 }
  validates :description, length: { maximum: 80 }

  def self.create_with_chat!(name:, description:, admin:, user_ids:)
    ActiveRecord::Base.transaction do
      chat = Chat.create!
      Group.create!(
        chat_id: chat.id,
        name: name,
        description: description
      )
      chat.chat_users.create!(user_id: admin.id, is_admin: true)
      user_ids.each do |user_id|
        chat.chat_users.create!(user_id: user_id, is_admin: false)
      end
      chat
    end
  end

  def admin?(user_id)
    chat_user = find_chat_user(user_id)
    chat_user.is_admin || false
  end

  def update_photo!(user:, photo:)
    raise Unauthorized, "Only admins can edit a group" unless admin?(user)

    unless self.photo.attach(
      io: process_image(photo),
      filename: photo.original_filename,
      content_type: photo.content_type
    )
      errors.add(:photo, "failed to upload")
      raise ActiveRecord::RecordInvalid, self
    end
  end

  def make_admin(user_id)
    chat_user = find_chat_user(user_id)
    chat_user.is_admin = true
    chat_user.save
  end

  def add_users(user_ids)
    ActiveRecord::Base.transaction do
      user_ids.each do |user_id|
        chat.chat_users.create!(user_id: user_id, is_admin: false)
      end
    end
  end

  def remove_member(user_id)
    chat_user = find_chat_user(user_id)
    chat_user.destroy
  end

  def non_members
    member_ids = users.pluck(:id)
    User.where.not(id: member_ids)
  end

  private

  class Unauthorized < StandardError; end

  def find_chat_user(user_id)
    chat.chat_users.find_by(user_id: user_id)
  end

  def process_image(image)
    processed_image = ImageProcessing::Vips
                      .source(image)
                      .resize_to_fill(360, 360)
                      .convert("jpg")
                      .saver(quality: 80)
                      .call

    File.open(processed_image.path)
  end
end
