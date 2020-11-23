Rails.application.routes.draw do
  root to: 'home#index'

  resources :lockfiles
  resources :projects
end
