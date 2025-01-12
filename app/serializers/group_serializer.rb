class GroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :photo

  attribute :members, if: :include_members?

  def photo
    return unless object.photo.attached?

    if instance_options[:small]
      small_photo
    else
      full_size_photo
    end
  end

  def full_size_photo
    generate_url(object.photo)
  end

  def small_photo
    return unless object.photo.attached?

    variant = object.photo.variant(resize_to_limit: [40, 40])
    generate_url(variant, is_variant: true)
  end

  def members
    object.chat.chat_users.includes(:user).map do |chat_user|
      UserSerializer.new(chat_user.user, chat_id: object.chat.id)
    end
  end

  def include_members?
    instance_options[:include_members]
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
