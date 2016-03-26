class MagicArray < MagicDataStructure
  def initialize
    @arr = []
  end

  define(:push!, :constant) do |val|
    @arr << val
  end

  define(:[], :constant) do |idx|
    @arr[idx]
  end

  expose :[]=, :constant

  make_alias :pop!, :pop, :constant
end

