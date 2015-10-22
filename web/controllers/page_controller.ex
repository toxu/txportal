defmodule Txportal.PageController do
  use Txportal.Web, :controller

  def index(conn, param) do
    page = param["page"]
    #IO.inspect param
    render conn, "index.html", page: page
  end
end
