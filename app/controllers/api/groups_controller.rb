class Api::GroupsController < ApplicationController
  def show
    @group = Current.user.groups.find(params[:id])
    render json: @group, include_members: true, status: :ok
  end

  def create
    chat = Group.create_with_chat!(
      name: params[:name],
      description: params[:description],
      admin: Current.user,
      user_ids: params[:user_ids]
    )
    render json: chat, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    @group = Current.user.groups.find(params[:id])
    if @group.admin? Current.user
      @group.update!(group_params)
      render json: @group, status: :ok
    else
      render json: { error: "Only admins can edit a group" }, status: :unauthorized
    end
  end

  def update_photo
    @group = Current.user.groups.find(params[:id])
    @group.update_photo!(user: Current.user, photo: params[:photo])
    render json: @group, status: :ok
  rescue Group::Unauthorized => e
    render json: { error: e.message }, status: :unauthorized
  rescue ActiveRecord::RecordInvalid
    render json: { errors: @group.errors.full_messages }, status: :unprocessable_entity
  end

  def add_members
    @group = Current.user.groups.find(params[:id])
    if @group.admin? Current.user.id
      begin
        @group.add_users(params[:user_ids])
        render json: @group, include_members: true, status: :ok
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    else
      render json: { error: "Only admins can manage group members" }, status: :unauthorized
    end
  end

  def add_admin
    @group = Current.user.groups.find(params[:id])
    if @group.admin? Current.user.id
      @group.make_admin(params[:user_id])
      render json: @group, include_members: true, status: :ok
    else
      render json: { error: "Only admins can manage group members" }, status: :unauthorized
    end
  end

  def remove_member
    @group = Current.user.groups.find(params[:id])
    if @group.admin? Current.user.id
      @group.remove_member(params[:user_id])
      render json: @group, include_members: true, status: :ok
    else
      render json: { error: "Only admins can manage group members" }, status: :unauthorized
    end
  end

  def leave
    @group = Current.user.groups.find(params[:id])
    @group.remove_member(Current.user.id)
    render json: { message: "Success" }, status: :ok
  end

  private

  def group_params
    params.require(:group).permit(:name, :description)
  end
end
