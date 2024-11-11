class Api::CurrentUsersController < ApplicationController
  def show
    render json: Current.user, include_bio: true
  end

  def update
    @user = Current.user
    if @user.update(user_params)
      render json: @user, include_bio: true, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:current_user).permit(:username, :bio)
  end
end
