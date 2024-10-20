class Api::GroupsController < ApplicationController
  def show
    @group = Current.user.groups.find(params[:id])
    render json: @group, include_members: true, status: :ok
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
    @group = Current.user.groups.find(params[:id])
    if @group.is_admin? Current.user
      @group.update!(group_params)
      render json: @group, status: :ok
    else
      render json: {error: "Only admins can edit a group" }, status: :unauthorized
    end
  end

  def update_photo
    @group = Current.user.groups.find(params[:id])
    if @group.is_admin? Current.user
      if @group.photo.attach(
          io: process_image(params[:photo]),
          filename: params[:photo].original_filename,
          content_type: params[:photo].content_type
        )
        render json: @group, status: :ok
      else
        render json: { errors: @group.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: {error: "Only admins can edit a group" }, status: :unauthorized
    end
  end

  def add_admin
    @group = Current.user.groups.find(params[:id])
    if @group.is_admin? Current.user.id
      @group.make_admin(params[:user_id])
      render json: @group, include_members: true, status: :ok
    else
      render json: {error: "Only admins can manage group members" }, status: :unauthorized
    end
  end

  def remove_member
    @group = Current.user.groups.find(params[:id])
    if @group.is_admin? Current.user.id
      @group.remove_member(params[:user_id])
      render json: @group, include_members: true, status: :ok
    else
      render json: {error: "Only admins can manage group members" }, status: :unauthorized
    end
  end

  def leave
    @group = Current.user.groups.find(params[:id])
    @group.remove_member(Current.user.id)
    render json: {message: "Success"}, status: :ok
  end

  private
    def group_params
      params.require(:group).permit(:name, :description)
    end

    def process_image(image)
      p image
      processed_image = ImageProcessing::MiniMagick
        .source(image)
        .resize_to_limit(360, 360)
        .convert("jpg")
        .saver(quality: 80)
        .call

      File.open(processed_image.path)
    end
end
