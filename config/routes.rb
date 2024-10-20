Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  namespace :api, :defaults => {:format => :json} do
    post "login", to: "sessions#create"
    delete "logout", to: "sessions#destroy"
    post "sign_up", to: "registrations#create"
    resources :sessions, only: [:index, :show, :destroy]
    resource  :password, only: [:edit, :update]
    namespace :identity do
      resource :email,              only: [:edit, :update]
      resource :email_verification, only: [:show, :create]
      resource :password_reset,     only: [:new, :edit, :create, :update]
    end
    resource :current_user, only: [:show, :update]
    resources :chats, only: [:index, :show, :create]
    resources :messages, only: [:create]
    resources :users, only: [:index, :show]
    resource :avatar, only: [:update]
    resources :groups, only: [:show, :create, :update]
    put "groups/:id/photo", to: "groups#update_photo"
    post "groups/:id/admins/:user_id", to: "groups#add_admin"
    delete "groups/:id/members/:user_id", to: "groups#remove_member"
    delete "groups/:id/members", to: "groups#leave"
  end

  get "up" => "rails/health#show", as: :rails_health_check

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
