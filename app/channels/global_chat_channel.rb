class GlobalChatChannel < ApplicationCable::Channel
  def subscribed
    stream_or_reject_for current_user
  end

  def unsubscribed
    stop_stream_for current_user
  end
end
