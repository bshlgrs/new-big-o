class MaxStack < MagicADT
  magic :push!
  magic :pop!
  magic_define :peek(length: :constant, get: :constant) do |idx|
    get(length - idx)
  end
  magic :maximum
end
