class Api::CurrentUsersController < ApplicationController
  def show
    render json: Current.user
  end
end
