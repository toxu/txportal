require Logger
defmodule Txportal.TxtController do
  use Txportal.Web, :controller

  @result [
    %{"id" => "test1", "rv" =>"success"},
    %{"id" => "test2", "rv" =>"success"},
    %{"id" => "test3", "rv" =>"fail"},
    %{"id" => "test4", "rv" =>"success"},
  ]

  def results(conn, _) do
    json conn, @result
  end

end
