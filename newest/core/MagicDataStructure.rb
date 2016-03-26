class MagicDataStructure
  STRUCTURES = {}

  def self.methods
    @methods ||= {}
  end

  def self.define(method_name, time, &blk)
    self.methods[method_name] = DataStructureMethod.new(time, blk)
  end

  def self.expose(method_name, time)
    self.define(method_name, time) { |x| x.call(method_name) }
  end

  def self.make_alias(method_name, implementation, time)
    self.define(method_name, time) { |x| x.call(implementation) }
  end

  def self.inherited(subclass)
    STRUCTURES[subclass.name] = subclass.methods
  end
end
