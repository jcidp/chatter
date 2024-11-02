class Api::MessagesController < ApplicationController
  def create
    @chat = Current.user.chats.find(params[:chat_id])
    @message = Message.create_and_broadcast!(
      chat: @chat,
      user_id: Current.user.id,
      text: params[:text],
      image: params[:image]
    )

    if @message.persisted?
      head :ok
    else
      render json: { error: @message.errors }, status: :unprocessable_entity
    end
  end
end
