class Api::SessionsController < ApplicationController
  skip_before_action :authenticate, only: :create

  before_action :set_session, only: [:show, :destroy]

  def index
    render json: Current.user.sessions.order(created_at: :desc)
  end

  def show
    render json: @session
  end

  def create
    if (user = User.authenticate_by(email: params[:email], password: params[:password]))
      @session = user.sessions.create!
      response.set_header "X-Session-Token", @session.signed_id(expires_in: 30.minutes)

      render json: user, include_bio: true, status: :created
    else
      render json: { root: "Email or password is invalid" }, status: :unauthorized
    end
  end

  def destroy
    @session&.destroy
    render json: { message: "Logged out successfully" }, status: :ok
  end

  private

  def set_session
    @session = Current.session
  end
end
