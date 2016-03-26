class LoopMethods < MagicMethods
  implement :unordered_each, :each do |t, blk|
    t.each(&blk)
  end
end
