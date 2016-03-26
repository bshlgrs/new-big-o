class MagicMethods
  def self.implementations
    @implementations ||= []
  end

  def self.implement(name, *requirements, **other_requirements, &implementation)
    MagicMethods.implementations << Implementation.create(name, requirements, other_requirements, implementation)
  end
end

