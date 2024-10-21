class Api::UsersController < ApplicationController
  def index
    if params[:group_id]
      group = Current.user.groups.find(params[:group_id])
      @users = group.non_members
    else
      @users = User.where.not(id: Current.user.id)
    end
    render json: @users, small: true, status: :ok
  end

  def show
    @user = User.find(params[:id])
    render json: @user, include_bio: true, status: :ok
  end
end
