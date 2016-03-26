module MagicMethods
  ####### access
  implement :first, :[] do |t|
    t[0]
  end

  implement :get_next, :[] do |t, node|
    t[node.pos + 1]
  end

  implement :get_prev, :[] do |t, node|
    t[node.pos - 1]
  end

  implement :[], :first, get_next: :linear do |t, idx|
    node = t.first
    idx.times { node = t.get_next(node) }
    node
  end

  implement :last, :[] do |t|
    t[t.length - 1]
  end

  ######### insertion
  implement :push!, insert_at_index!: :constant do |t, val|
    t.insert_at_index!(t.length, val)
  end

  implement :insert_at_index!, :[], :insert_before_node!, :push! do |t, idx, val|
    if idx == t.length
      t.push!(val)
    else
      t.insert_before_node!(t[idx], val)
    end
  end

  implement :insert_at_index!, :[], :insert_after_node!, :insert_at_start! do |t, idx, val|
    if idx == 0
      t.insert_at_start!(val)
    else
      node = t[idx - 1]
      t.insert_after_node(node, val)
    end
  end

  ############ removal
  implement :remove_at_end!, :remove_by_index! do |t|
    t.remove_by_index!(t.length - 1)
  end

  ############ loops
  implement :unordered_each, :each do |t, blk|
    t.each(&blk)
  end

  ############# reductions
  implement :maximum, :unordered_each do |t|
    biggest = nil
    t.unordered_each(Proc.new { |e|
      biggest = e if biggest.nil? || e > biggest
    })
    biggest
  end
end
