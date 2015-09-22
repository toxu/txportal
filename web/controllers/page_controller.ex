defmodule Txportal.PageController do
  use Txportal.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
