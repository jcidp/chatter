class Message < ApplicationRecord
  belongs_to :chat
  belongs_to :author, class_name: "User", foreign_key: "user_id", inverse_of: :messages
  has_one_attached :image

  validates :text, presence: true, if: -> { image.blank? }
  validates :image, presence: true, if: -> { text.blank? }

  after_create_commit do
    chat.users.each do |user|
      GlobalChatChannel.broadcast_to(
        user,
        chat_id: chat.id,
        message: MessageSerializer.new(self).as_json
      )
    end
  end

  scope :sorted, -> { order(id: :desc) }

  def self.create_with_image!(chat:, user_id:, text:, image: nil)
    message = chat.messages.build(user_id: user_id, text: text)

    if image.present?
      message.image.attach(
        io: process_image(image),
        filename: image.original_filename,
        content_type: image.content_type
      )
    end

    message.save!

    message
  end

  def self.process_image(image)
    processed_image = ImageProcessing::Vips
                      .source(image)
                      .resize_to_limit(480, 860)
                      .convert("jpg")
                      .saver(quality: 80)
                      .call

    File.open(processed_image.path)
  end
end
