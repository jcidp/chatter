class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :email, :username, :bio, :avatar  
  
  attribute :bio, if: :include_bio?
  attribute :is_admin, if: :include_is_admin?

  def avatar
    if object.avatar.attached?
      if instance_options[:small]
        small_avatar
      else
        full_size_avatar
      end
    end
  end

  def full_size_avatar
    "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.avatar, only_path: true)}"
  end

  def small_avatar
    variant = object.avatar.variant(resize_to_limit: [40, 40])
    "#{Rails.configuration.x.api_base_url}#{rails_representation_path(variant, only_path: true)}"
  end

  def is_admin
    object.chat_users.find_by(chat_id: instance_options[:chat_id])&.is_admin || false
  end

  def include_bio?
    instance_options[:include_bio]
  end

  def include_is_admin?
    instance_options[:chat_id]
  end
end
