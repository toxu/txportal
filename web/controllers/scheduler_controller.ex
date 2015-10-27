require Logger
defmodule Txportal.SchedulerController do
  use Txportal.Web, :controller

  @scheduler_status_url "http://10.50.100.127:23456/"

  def redirect(conn, param) do
    {:ok, data, _conn_details} = Plug.Conn.read_body(conn)
    action = param["action"]
    HTTPoison.start
    rv = HTTPoison.post(@scheduler_status_url <> action, data)
    rv_json = case rv do
             {:ok, resp} -> resp.body
             _ -> %{"Error" => "Failed to connect to worker"}
           end
    text conn, rv_json
  end


end
