class ChatChannel < ApplicationCable::Channel
  def subscribed
    chat_id = params[:id]
    @chat = current_user.chats.find(chat_id)
    stream_or_reject_for @chat
  end

  def unsubscribed
    stop_stream_for @chat
  end
end
