class Api::ChatsController < ApplicationController
  def index
    render json: Current.user.chats.ordered.as_json(
      current_user: Current.user
    )
  end

  def show
    render json: Current.user.chats.find(params[:id]).as_json(
      include: :messages,
      current_user: Current.user
    )
  end

  def create
    @receiver = User.find(params[:user_id])
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
