
class RemovalMethods < MagicMethods
  implement :remove_at_end!, :remove_by_index! do |t|
    t.remove_by_index!(t.length - 1)
  end
end
