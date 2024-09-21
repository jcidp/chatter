require "test_helper"

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user, @token = sign_in_as(users(:lazaro_nixon))
  end

  def default_headers
    { "Authorization" => "Bearer #{@token}" }
  end

  test "should get index" do
    other_user = users(:john_smith)
    get api_users_url, headers: default_headers
    assert_equal [other_user].to_json, @response.body
  end

  # test "should get show" do
  #   get api_user_url
  #   assert_response :success
  # end
end