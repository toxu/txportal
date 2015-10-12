require Logger
defmodule Txportal.TxtWorkerController do
  use Txportal.Web, :controller

  @worker_status_url "http://10.21.133.28:12345/status"

  def status(conn, _) do
    HTTPoison.start
    rv = HTTPoison.post(@worker_status_url, "")
    rv_json = case rv do
             {:ok, resp} -> resp.body
             _ -> %{"Error" => "Failed to connect to worker"}
           end
    Logger.debug rv_json       

    text conn, rv_json
  end


end
