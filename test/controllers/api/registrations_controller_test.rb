require "test_helper"

class Api::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "should sign up" do
    assert_difference("User.count") do
      post api_sign_up_url, params: { email: "lazaronixon@hey.com", password: "Secret1*3*5*", password_confirmation: "Secret1*3*5*" }
    end

    assert_response :created
  end
end
