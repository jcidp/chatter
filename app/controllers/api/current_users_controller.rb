class Api::CurrentUsersController < ApplicationController
  def show
    render json: Current.user.as_json(
      only: [:email]
    )
  end
end
