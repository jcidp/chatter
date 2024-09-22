require "test_helper"

class Api::MessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user, @token = sign_in_as(users(:lazaro_nixon))
  end

  def default_headers
    { "Authorization" => "Bearer #{@token}" }
  end

  test "should create new message" do
    chat = chats(:one)
    test_text = "Test text"
    assert_difference("Message.count") do
      post api_messages_url, params: { chat_id: chat.id, text: test_text }, headers: default_headers
    end
    assert_equal test_text, chat.messages.last.text
  end
end
