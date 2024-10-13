class Api::MessagesController < ApplicationController
  def create
    @chat = Current.user.chats.find(params[:chat_id])
    @message = @chat.messages.build(user_id: Current.user.id, text: params[:text])
    @image = params[:image]
    
    if @image.present?
      @message.image.attach(
        io: process_image(@image),
        filename: @image.original_filename,
        content_type: @image.content_type
      )
    end
    
    if @message.save
      ChatChannel.broadcast_to(@chat, {
        message: MessageSerializer.new(@message).as_json,
        type:"new_message"
      })
      head :ok
    else
      render json: { error: @message.errors }, status: :unprocessable_entity
    end
  end

  private

    def process_image(image)
      p image
      processed_image = ImageProcessing::MiniMagick
        .source(image)
        .resize_to_limit(480, 860)
        .convert("jpg")
        .saver(quality: 80)
        .call

      File.open(processed_image.path)
    end
end
