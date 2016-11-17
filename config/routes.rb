Rails.application.routes.draw do
  root 'cars#index'
  get '/cars/json', to: 'cars#json', as: 'json'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
