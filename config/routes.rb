Rails.application.routes.draw do
  root 'cars#show'

  get 'cars/index'

  get 'cars/new'

  get 'cars/create'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
