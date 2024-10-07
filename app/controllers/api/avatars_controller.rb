class Api::AvatarsController < ApplicationController
  def update
    @user = Current.user
    if @user.avatar.attach(params[:avatar])
      render json: @user, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
