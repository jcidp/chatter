class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :email, :username, :bio, :avatar
  attribute :bio, if: :include_bio?
  attribute :admin?, key: :is_admin, if: :include_is_admin?

  def avatar
    return unless object.avatar.attached?

    if instance_options[:small]
      small_avatar
    else
      full_size_avatar
    end
  end

  def full_size_avatar
    generate_url(object.avatar)
  end

  def small_avatar
    return unless object.avatar.attached?

    variant = object.avatar.variant(resize_to_limit: [40, 40])
    generate_url(variant, is_variant: true)
  end

  def admin?
    object.chat_users.find_by(chat_id: instance_options[:chat_id])&.is_admin || false
  end

  def include_bio?
    instance_options[:include_bio]
  end

  def include_is_admin?
    instance_options[:chat_id]
  end

  private

  def generate_url(attachment, is_variant: false)
    return unless attachment

    if Rails.env.development?
      path = if is_variant
               rails_representation_path(attachment, only_path: true)
             else
               rails_blob_path(attachment, only_path: true)
             end
      "http://localhost:3001#{path}"
    elsif is_variant
      attachment.processed
      attachment.url(expires_in: 30.minutes)
    else
      attachment.url(expires_in: 30.minutes)
    end
  end
end
