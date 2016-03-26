class MagicAdt
  def self.implemented_methods
    @implemented_methods ||= []
  end

  def self.auto_implement(method_name)
    self.implemented_methods << method_name
  end

  def self.finalize!
    puts "#{self.name} #{self.implemented_methods}"
    # calculate the fastest combination of data structures
    # save that combination
    # define all methods
  end
end
