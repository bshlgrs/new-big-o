class AccessMethods < MagicMethods
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
end
