class Api::UsersController < ApplicationController
  def index
    @users = User.where.not(id: Current.user.id)
    render json: @users, status: :ok
  end

  def show
    @user = User.find(:id)
    render json: @user, status: :ok
  end
end
