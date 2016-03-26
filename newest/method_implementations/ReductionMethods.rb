class ReductionMethods < MagicMethods
  implement :maximum, :unordered_each do |t|
    biggest = nil
    t.unordered_each(Proc.new { |e|
      biggest = e if biggest.nil? || e > biggest
    })
    biggest
  end
end
