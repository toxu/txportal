defmodule Txportal.PageController do
  use Txportal.Web, :controller

  def index(conn, param) do
    page = param["page"]
    #IO.inspect param
    if !page do
      page = 1
    end
    render conn, "index.html", page: page
  end
end
