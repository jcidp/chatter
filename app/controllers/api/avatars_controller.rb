class Api::AvatarsController < ApplicationController
  def update
    @user = Current.user
    if @user.avatar.attach(
      io: process_image(params[:avatar]),
      filename: params[:avatar].original_filename,
      content_type: params[:avatar].content_type
      )
      render json: @user, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def process_image(image)
      p image
      processed_image = ImageProcessing::MiniMagick
        .source(image)
        .resize_to_limit(360, 360)
        .convert("jpg")
        .saver(quality: 80)
        .call

      File.open(processed_image.path)
    end
end
