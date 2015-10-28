require Logger
defmodule Txportal.SchedulerController do
  use Txportal.Web, :controller

  @scheduler_url Application.get_env(:txportal, :txt_sch_url)

  def redirect(conn, param) do
    {:ok, data, _conn_details} = Plug.Conn.read_body(conn)
    action = param["action"]
    HTTPoison.start
    rv = HTTPoison.post(@scheduler_url <> action, data)
    rv_json = case rv do
             {:ok, resp} -> resp.body
             _ -> %{"Error" => "Failed to connect to worker"}
           end
    text conn, rv_json
  end


end
