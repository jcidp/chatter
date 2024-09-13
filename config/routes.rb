Rails.application.routes.draw do
  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      # resources :posts
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
