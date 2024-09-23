class Api::MessagesController < ApplicationController
  def create
    @chat = Current.user.chats.find(params[:chat_id])
    @message = @chat.messages.build(user_id: Current.user.id, text: params[:text])
    if @message.save
      ChatChannel.broadcast_to(@chat, @message)
      # render json: @message, status: :created
    else
      render json: { error: @message.errors }, status: :unprocessable_entity
    end
  end
end
