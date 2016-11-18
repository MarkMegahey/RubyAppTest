class CarsController < ApplicationController
  def index
    @cars = Car.all
  end

  def show
    @car = Car.find(params[:id])
  end

  def new
    @car = Car.new
  end

  def create
    @car = Car.new(car_params)
    if @car.save
      flash[:notice] = 'Product added!'
      redirect_to root_path
    else
      flash[:error] = 'Failed to edit product!'
      render :new
    end
  end

  def edit
    @car = Car.find(params[:id])
  end

  def update
    @car = Car.find(params[:id])
    if @car.update_attributes(car_params)
      flash[:notice] = 'Product updated!'
      redirect_to root_path
    else
      flash[:error] = 'Failed to edit product!'
      render :edit
    end
  end

  def destroy
    @car = Car.find(params[:id])
    if @car.delete
      flash[:notice] = 'car deleted!'
      redirect_to root_path
    else
      flash[:error] = 'Failed to delete this car!'
      render :destroy
    end
  end

  def json
    @cars = Car.all
    render json: @cars
  end
end

  def car_params
   params.require(:car).permit(:name, :manufacturer, :colour)
  end
