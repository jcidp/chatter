class GroupSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :photo

  def photo
    if object.photo.attached?
      if instance_options[:small]
        small_photo
      else
        full_size_photo
      end
    end
  end

  def full_size_photo
    "#{Rails.configuration.x.api_base_url}#{rails_blob_path(object.photo, only_path: true)}"
  end

  def small_photo
    variant = object.photo.variant(resize_to_limit: [40, 40])
    "#{Rails.configuration.x.api_base_url}#{rails_representation_path(variant, only_path: true)}"
  end
end
