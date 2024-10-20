class Api::CurrentUsersController < ApplicationController
  def show
    render json: Current.user, include_bio: true
  end

  def update
    @user = Current.user
    @user.update!(user_params)
    render json: @user, include_bio: true, status: :ok
  end

  private
    def user_params
      params.require(:current_user).permit(:username, :bio)
    end
end
