class MessageSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :text, :user_id, :chat_id, :created_at, :image

  def image
    "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.image, only_path: true)}" if object.image.attached?
  end
end
