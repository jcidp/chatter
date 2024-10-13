class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :email, :username, :bio, :avatar  
  
  attribute :bio, if: :include_bio?

  def avatar
    "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.avatar, only_path: true)}" if object.avatar.attached?
  end

  def include_bio?
    instance_options[:include_bio]
  end
end
