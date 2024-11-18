require "test_helper"

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user, @token = sign_in_as(users(:lazaro_nixon))
  end

  def default_headers
    { "Authorization" => "Bearer #{@token}" }
  end

  test "should get index" do
    get api_users_url, headers: default_headers
    assert_equal [users(:john_smith).as_json(include: :avatar), users(:jane_doe).as_json(include: :avatar)].to_json,
                 @response.body
  end

  test "should get show" do
    another_user = users(:john_smith)
    get api_user_url(another_user), headers: default_headers
    assert_equal another_user.to_json(methods: :bio, include: :avatar), @response.body
    assert_response :success
  end
end
