class Api::CurrentUsersController < ApplicationController
  def show
    render json: Current.user
  end

  def update
    @user = Current.user
    @user.update!(user_params)
    render json: @user, status: :ok
  end

  private
    def user_params
      params.require(:current_user).permit(:username, :bio)
    end
end
