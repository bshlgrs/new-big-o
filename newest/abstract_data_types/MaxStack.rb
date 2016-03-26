class MaxStack < MagicAdt
  auto_implement :push!
  auto_implement :pop!

  auto_implement :length
  auto_implement :[]

  auto_implement :maximum

  def peek(idx)
    self[length - idx - 1]
  end

  finalize!
end
