require Logger
defmodule Txportal.UtterController do
  use Txportal.Web, :controller

  @result ["hello"]
  @db_url "http://10.50.100.213:5984"

  def projects(conn, _) do
    svr = :couchbeam.server_connection(@db_url, [])
    {:ok, db} = :couchbeam.open_db(svr, "utter-projects", [])
    {:ok, rv} = :couchbeam_view.all(db, [])
    jrv = rv |> Enum.map(
      fn x ->
        getkey x
      end)
    json conn, jrv
  end

  def results(conn, _) do
    json conn, @result
  end

  defp getkey({items}) do
    rv = items
    |> Enum.find(
      fn tpl ->
        case tpl do
          {"key", _k} -> true
          _ -> false
        end
      end)
    |> elem 1
  end
end
