class Api::GroupsController < ApplicationController
  def show
    @group = Current.user.groups.find(params[:id])
    render json: @group, status: :ok
  end

  def create
    @user_ids = params[:user_ids]
    begin
      ActiveRecord::Base.transaction do
        @chat = Chat.create!
        Group.create!(chat_id: @chat.id, name: params[:name], description: params[:description])
        @chat.chat_users.create!(user_id: Current.user.id, is_admin: true)
        @user_ids.each do |user_id|
          @chat.chat_users.create!(user_id: user_id, is_admin: false)
        end
      end
      render json: @chat, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_entity
    end 
  end

  def update
  end
end
