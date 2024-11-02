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
    @other_user = users(:john_smith)
    expected_response = [
      {
        id: @user.chats[0].id,
        name: @other_user.username,
        image: nil,
        profile_id: @other_user.id,
        type: "profile",
        last_message: {
          text: "MyText",
          created_at: @user.chats[0].messages&.last&.created_at
        }
      },
      {
        id: @user.chats[1].id,
        name: @other_user.username,
        image: nil,
        profile_id: @other_user.id,
        type: "profile",
        last_message: nil
      }
    ]
    assert_equal expected_response.to_json, @response.body
  end

  test "should get show" do
    @chat = chats(:one)
    @chat.messages.create(text: "last message", user_id: @user.id)
    @messages = @chat.messages.sorted.as_json(only: [:text, :user_id, :created_at], include: :image)
    @other_user = users(:john_smith)
    expected_response = {
      id: @chat.id,
      name: @other_user.username,
      image: nil,
      profile_id: @other_user.id,
      type: "profile",
      messages: @messages
    }
    get api_chat_url(@chat), headers: default_headers
    assert_equal expected_response.to_json, @response.body
  end

  test "should create a new chat when it doesn't exist" do
    @other_user = users(:jane_doe)
    assert_difference("Chat.count") do
      post api_chats_url, params: { user_id: @other_user.id }, headers: default_headers
    end
    assert_equal [@other_user, @user], Chat.last.users.order(:id)
  end

  test "should not create a new chat if it already exists, and return it instead" do
    @other_user = users(:john_smith)
    @chat_two = chats(:two)
    assert_no_difference("Chat.count") do
      post api_chats_url, params: { user_id: @other_user.id }, headers: default_headers
    end
    assert_equal [@user, @other_user], @chat_two.users.order(:id)
  end
end
