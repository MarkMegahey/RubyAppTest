class CarsController < ApplicationController
  def index
  end

  def show
    @car = Car.find params[:id]
  end

  def new
  end

  def create
  end

  def json
    @cars = Car.all
    render json: @cars
  end
end
