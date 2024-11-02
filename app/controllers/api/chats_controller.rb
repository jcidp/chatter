class Api::ChatsController < ApplicationController
  def index
    chats = Current.user.chats.ordered
    render json: chats, each_serializer: ChatSerializer, current_user: Current.user, include_last_message: true,
           status: :ok
  end

  def show
    chat = Current.user.chats.find(params[:id])
    render json: chat, serializer: ChatSerializer, current_user: Current.user, include_messages: true, status: :ok
  end

  def create
    @receiver = User.find_by(id: params[:user_id])
    if @receiver && Current.user
      begin
        @chat = Chat.find_or_create_by_users!(Current.user, @receiver)
        render json: @chat, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    else
      render json: { message: "Invalid user" }, status: :unprocessable_entity
    end
  end
end
