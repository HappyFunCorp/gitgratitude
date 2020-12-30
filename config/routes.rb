Rails.application.routes.draw do
  root to: 'home#index'

  resources :lockfiles
  resources :ecosystems
  resources :projects do
    member do
      post :refresh
    end

    resources :releases
  end
  
  resources :repositories do
    resources :commits
    resources :tags
  end
  
  resources :authors

  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
end
