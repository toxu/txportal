require Logger
defmodule Txportal.TxtController do
  use Txportal.Web, :controller

  @result [
    %{"id" => "test1", "rv" =>"success"},
    %{"id" => "test2", "rv" =>"success"},
    %{"id" => "test3", "rv" =>"fail"},
    %{"id" => "test4", "rv" =>"success"},
  ]

  @txt_results_url "http://10.50.100.213:5984/txt_results/_design/txtbrowser/_view/txtbrowser"

  def results(conn, _) do
    HTTPoison.start
    rv = HTTPoison.get @txt_results_url
    rv_json = case rv do
             {:ok, resp} -> resp.body
             _ -> %{"Error" => "Failed to connect to database"}
           end
    text conn, rv_json
  end

end
