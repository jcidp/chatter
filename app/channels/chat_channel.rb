class ChatChannel < ApplicationCable::Channel
  def subscribed
    chat_id = params[:id]
    @chat = current_user.chats.find(chat_id)
    stream_or_reject_for @chat
  end

  def unsubscribed
    stop_stream_for @chat
  end

  def receive(data)
    chat = current_user.chats.find(data["id"])
    message = chat.messages.create(user_id: current_user.id, text: data["text"])
    ChatChannel.broadcast_to(chat, { 
      message: message.as_json,
      type: 'new_message'
    })
  end
end
