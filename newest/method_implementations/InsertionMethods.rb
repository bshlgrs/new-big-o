class InsertionMethods < MagicMethods
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
end
