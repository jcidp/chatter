require "test_helper"

class Api::ChatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user, @token = sign_in_as(users(:lazaro_nixon))
  end

  def default_headers
    { "Authorization" => "Bearer #{@token}" }
  end

  test "should get index" do
    get api_chats_url, headers: default_headers
    assert_equal @user.chats.to_json, @response.body
  end

  test "should get show" do
    @chat = chats(:one)
    get api_chat_url(@chat), headers: default_headers
    assert_equal @chat.to_json, @response.body
  end

  test "should get create" do
    @other_user = users(:john_smith)
    assert_difference("Chat.count") do
      post api_chats_url, params: { user_id: @other_user.id }, headers: default_headers
    end
    assert_equal [@user, @other_user], Chat.last.users.order(:id)
  end
end
