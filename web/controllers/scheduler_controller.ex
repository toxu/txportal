require Logger
defmodule Txportal.SchedulerController do
  use Txportal.Web, :controller

  @scheduler_status_url "http://10.50.104.13:23456/status"

  def status(conn, _) do
    HTTPoison.start
    rv = HTTPoison.post(@scheduler_status_url, "")
    rv_json = case rv do
             {:ok, resp} -> resp.body
             _ -> %{"Error" => "Failed to connect to worker"}
           end
    Logger.debug rv_json       

    text conn, rv_json
  end


end
