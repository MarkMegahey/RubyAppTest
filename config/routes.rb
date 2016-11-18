Rails.application.routes.draw do
  resources :cars
  root 'cars#index'
  get '/json', to: 'cars#json', as: 'json'


  mount Cars::CarsAPI => '/api/cars'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
