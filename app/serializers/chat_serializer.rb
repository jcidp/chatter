class ChatSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :profile_id, :type

  attribute :last_message, if: :include_last_message?
  has_many :messages, if: :include_messages?
  
  def name
    object.group ? object.group.name : other_user&.username
  end
  
  def last_message
    last_message = object.messages.last
    if last_message
      text = last_message.text || "(Image)"
      {text: text}.merge last_message&.as_json(only: :created_at) if last_message
    end
  end
  
  def image
    if object.group
      GroupSerializer.new(object.group, small: true).photo
    else
      UserSerializer.new(other_user, small: true).avatar if other_user
    end
  end
  
  def profile_id
    object.group ? object.group.id : other_user&.id
  end
  
  def messages
    object.messages.sorted
  end

  def type
    object.group ? "group" : "profile" 
  end
  
  def other_user
    @other_user ? @other_user : @other_user = object.users.find { |user| user != instance_options[:current_user] }
  end
  
  def include_messages?
    instance_options[:include_messages]
  end

  def include_last_message?
    instance_options[:include_last_message]
  end
end