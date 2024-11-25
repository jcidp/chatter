# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
users = [
  {
    username: "chatter_bot",
    bio: "A helpful bot that welcomes you to Chatter"
  },
  {
    username: "sarah-miller12",
    bio: "Lets chat!"
  },
  {
    username: "edith.rhodes93"
  },
  {
    username: "raymsym",
    bio: "Available"
  },
  {
    username: "joe_cool9",
    bio: ";)"
  },
  {
    username: "scott_kelly_the_king",
    bio: "Baltimore born and raised! Probably cracking open a cold one with the boys"
  }
]

users.each do |user|
  User.find_or_create_by!(
    username: user[:username],
    email: "#{user[:username]}@email.com",
    bio: user[:bio]
  ) do |new_user|
    new_user.password = "Pas$word1234"
  end
end

chat = Chat.first || Chat.create!
Group.find_or_create_by!(
  name: "New users group",
  description: "Say hi to other new users!",
  chat_id: chat.id
)
chat.chat_users.create!(user_id: 1, is_admin: true)
chat.messages.create!(text: "Welcome everyone! Feel free to send a message when you join", user_id: 1)
