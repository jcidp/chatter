class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :email, :username, :avatar
  
  def avatar
     "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.avatar, only_path: true)}" if object.avatar.attached?
  end
end