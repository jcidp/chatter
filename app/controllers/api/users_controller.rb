class Api::UsersController < ApplicationController
  def index
    @users = User.where.not(id: Current.user.id)
    render json: @users, status: :ok
  end

  def show
    @user = User.find(params[:id])
    render json: @user, include_bio: true, status: :ok
  end
end
