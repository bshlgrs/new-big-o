class DataStructureMethod
  attr_accessor :time, :blk

  def initialize(time, blk)
    @time = time
    @blk = blk
  end

  def inspect
    "method[#{time}]"
  end
end
