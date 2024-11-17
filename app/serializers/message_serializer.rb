class MessageSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :text, :user_id, :chat_id, :created_at, :image, :author

  def image
    "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.image, only_path: true)}" if object.image.attached?
  end

  def author
    object.author.username
  end
end
