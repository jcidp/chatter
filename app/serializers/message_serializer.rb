class MessageSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :text, :user_id, :chat_id, :created_at, :image, :author

  def image
    return unless object.image.attached?

    if Rails.env.development?
      "http://localhost:3001#{rails_blob_path(object.image, only_path: true)}"
    else
      object.image.url(expires_in: 30.minutes)
    end
  end

  def author
    object.author.username
  end
end
