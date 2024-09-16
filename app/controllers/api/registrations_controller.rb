class Api::RegistrationsController < ApplicationController
  skip_before_action :authenticate

  def create
    @user = User.new(user_params)
    @user.username = params[:email].split("@")[0]

    if @user.save
      send_email_verification
      @session = @user.sessions.create!
      response.set_header "X-Session-Token", @session.signed_id(expires_in: 1.minutes)
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private
    def user_params
      params.permit(:email, :password, :password_confirmation)
    end

    def send_email_verification
      UserMailer.with(user: @user).email_verification.deliver_later
    end
end
