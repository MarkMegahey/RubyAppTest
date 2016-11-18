module Cars
  class CarsAPI < Grape::API

    format :json

    desc "Car List", {
        :notes => <<-NOTE
        Get All Cars
         __________________
        NOTE
    }

    get do
      Car.all
    end


    desc "Car By Id", {
        :notes => <<-NOTE
        Get Car By Id
         __________________
        NOTE
    }

    params do
      requires :id, type: Integer, desc: "Car id"
    end

    get ':id' do
      begin
        car = Car.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        error!({ status: :not_found }, 404)
      end
    end

    desc "Delete Car By Id", {
        :notes => <<-NOTE
        Delete Car By Id
         __________________
        NOTE
    }

    params do
      requires :id, type: Integer, desc: "Car id"
    end

    delete ':id' do
      begin
        car = Car.find(params[:id])
        { status: :success } if product.delete
      rescue ActiveRecord::RecordNotFound
        error!({ status: :error, message: :not_found }, 404)
      end
    end

    desc "Update Car By Id", {
        :notes => <<-NOTE
        Update Car By Id
                        __________________
        NOTE
    }

    params do
      requires :id, type: Integer, desc: "Car id"
      requires :name, type: String, desc: "Car name"
      requires :manufacturer, type: String, desc: "Car manufacturer"
      requires :colour, type: String, desc: "Car colour"
    end

    put ':id' do
      begin
        car = Car.find(params[:id])
        if car.update({
                              name: params[:name],
                              manufacturer: params[:manufacturer],
                              colour: params[:colour]
                          })
          { status: :success }
        else
          error!({ status: :error, message: car.errors.full_messages.first }) if car.errors.any?
        end


      rescue ActiveRecord::RecordNotFound
        error!({ status: :error, message: :not_found }, 404)
      end
    end


    desc "Create Car", {
        :notes => <<-NOTE
        Create Car
         __________________
        NOTE
    }

    params do
      requires :name, type: String, desc: "Car name"
      requires :manufacturer, type: String, desc: "Car manufacturer"
      requires :colour, type: String, desc: "Car colour"
    end

    post do
      begin
        car =  Car.create({
                                      name: params[:name],
                                      manufacturer: params[:manufacturer],
                                      colour: params[:colour],
                                  })
        if car.save
          { status: :success }
        else
          error!({ status: :error, message: car.errors.full_messages.first }) if car.errors.any?
        end

 
      rescue ActiveRecord::RecordNotFound
        error!({ status: :error, message: :not_found }, 404)
      end
    end
  end
end
