class Api::ChatsController < ApplicationController
  def index
    render json: Current.user.chats
  end

  def show
    render json: Current.user.chats.find(params[:id])
  end

  def create
    @receiver = User.find(params[:user_id])
    if @receiver && Current.user
      @chat = Chat.create!
      @chat.chat_users.create!(user_id: @receiver.id)
      @chat.chat_users.create!(user_id: Current.user.id)
      
      render json: @chat, status: :created
    else
      render json: { message: "Invalid user" }, status: :unprocessable_entity
    end
  end
end
