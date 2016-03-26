class Implementation
  attr_reader :name, :requirements, :implementation

  def self.create(name, constant_time_requirements, other_requirements, implementation)
    constant_time_requirements.each do |req|
      other_requirements[req] = :constant
    end

    self.new(name, other_requirements, implementation)
  end


  def initialize(name, requirements, implementation)
    @name = name
    @requirements = requirements
    @implementation = implementation
  end

  def inspect
    "Impl[#{name}](#{requirements})"
  end
end
