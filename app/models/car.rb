class Car < ApplicationRecord
  validates :name, presence: true
  validates :manufacturer, presence: true
  validates :colour, presence: true
end
