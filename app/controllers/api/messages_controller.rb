class Api::MessagesController < ApplicationController
  def create
    @message = Current.user.messages.build(chat_id: params[:chat_id], text: params[:text])
    if @message.save
      render json: @message, status: :created
    else
      render json: { error: @message.errors }, status: :unprocessable_entity
    end
  end
end
