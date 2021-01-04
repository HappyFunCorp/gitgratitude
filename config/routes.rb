Rails.application.routes.draw do
  root to: 'home#index'

  resources :lockfiles
  resources :ecosystems
  resources :projects do
    member do
      post :refresh
    end

    resources :releases do
      collection do
        get '/version/:version', to: 'releases#version', as: :version, constraints: { version: /[0-9\.]*/ }
      end
    end
  end
  
  resources :repositories do
    resources :commits
    resources :tags
  end
  
  resources :authors

  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
end
