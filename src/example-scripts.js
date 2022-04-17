export const scripts = [
  {
    name: "demo_fun.ex",
    code: `defmodule Demo do
@spec list_length([any]) :: integer

def list_length(l) do
  case l do
    [] -> 0
    [_ | tail] -> 1 + list_length(tail)
  end
end

@spec filter((any -> boolean), [any]) :: [any]

def filter(f, l) do
  case l do
    [] ->
      []

    [head | tail] ->
      filtered_tail = filter(f, tail)

      if f.(head) do
        [head | filtered_tail]
      else
        filtered_tail
      end
  end
end

@spec is_positive(integer) :: boolean

def is_positive(x) do
  x >= 0
end

def untyped(value) do
  value
end

@spec filter_positive([integer]) :: [integer]

def filter_positive(l) do
  filter(&is_positive/1, l)
end

def main(options) do
  choice =
    case options do
      %{:choice => v} -> v
    _ -> 1
    end

  l =
    case choice do
      1 -> [1 | [2 | [3 | []]]]
      2 -> untyped([1 | [2.0 | [3 | []]]])
      3 -> [true | []]
      4 -> untyped(42)
    end

  filter_positive(l)
end
end   
    `,
    showing: true
  },
  {
    name: "demo_cast.ex",
    code: `defmodule Demo do
@spec foo_cond(integer, any, any) :: integer

def foo_cond(x, y, b) do
  cond do
    b -> x
    true -> y
  end
end
end

[x, {y, z}] | {integer, any}  ~> {integer, float}
{x | integer ~> integer, {y, z}| {integer, any}  ~> {integer, float}}
  `,
    showing: true
  },
  {
    name: "demo_static.ex",
    code: `defmodule Demo do
  @spec foo_number_ops(integer, float, number) :: {}

  def foo_number_ops(x, y, z) do
    x + y

    x + x

    max(x, y)

    rem(x, x)

    {}
  end

  @spec foo_cond(integer, integer, boolean) :: integer

  def foo_cond(x, y, b) do
    cond do
      b -> x
      true -> y
    end
  end
end`,
    showing: false
  },
  {
    name: "demo_pattern.ex",
    code: `defmodule Demo do
@spec foo() :: {}

def foo() do
  x = 1

  y = 1.0

  z = max(x, y)

  {u, u} = {z, y}

  {1, z}

  %{1 => {u, v}, 2 => v} = %{1 => any_value(), 2 => x}

  {}
end

def any_value() do
  {}
end
end`,
    showing: true
  },
  {
    name: "demo_functional.ex",
    code: `defmodule Demo do
@spec list_length([any]) :: integer

def list_length(l) do
  case l do
    [] -> 0
    [_ | tail] -> 1 + list_length(tail)
  end
end

@spec filter((any -> boolean), [any]) :: [any]

def filter(f, l) do
  case l do
    [] ->
      []

    [head | tail] ->
      filtered_tail = filter(f, tail)

      if f.(head) do
        [head | filtered_tail]
      else
        filtered_tail
      end
  end
end

@spec is_positive(integer) :: boolean

def is_positive(x) do
  x >= 0
end

def untyped(value) do
  value
end

@spec filter_positive([integer]) :: [integer]

def filter_positive(l) do
  filter(&is_positive/1, l)
end

def main(options) do
  choice =
    case options do
      %{:choice => v} -> v
      _ -> 1
    end

  l =
    case choice do
      1 -> [1 | [2 | [3 | []]]]
      2 -> untyped([1 | [2.0 | [3 | []]]])
      3 -> [true | []]
      4 -> untyped(42)
    end

  filter_positive(l)
end
end`,
    showing: true
  }
]