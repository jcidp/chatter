class ChatSerializer < ActiveModel::Serializer
  attributes :id, :name, :last_message, :image

  attribute :last_message, if: :include_last_message?
  has_many :messages, if: :include_messages?

  def name
    other_user = object.users.find { |user| user != instance_options[:current_user] }
    other_user&.username
  end

  def last_message
    last_message = object.messages.last
    last_message&.as_json(only: [:text, :created_at])
  end

  def image
    other_user = object.users.find { |user| user != instance_options[:current_user] }
    UserSerializer.new(other_user).avatar if other_user
  end

  def messages
    object.messages.sorted
  end

  def include_messages?
    instance_options[:include_messages]
  end

  def include_last_message?
    instance_options[:include_last_message]
  end
end