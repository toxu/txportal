require Logger
defmodule Txportal.UtterController do
  use Txportal.Web, :controller

  @db_url "http://10.50.100.213:5984"

  def projects(conn, _) do
    svr = :couchbeam.server_connection(@db_url, [])
    {:ok, db} = :couchbeam.open_db(svr, "utter-projects", [])
    {:ok, rv} = :couchbeam_view.all(db, [])
    jrv = rv |> Enum.map(&(getkey(&1)))
    json conn, jrv
  end

  def project_results(conn, %{"pname" => pname}) do
    svr = :couchbeam.server_connection(@db_url, [])
    {:ok, db} = :couchbeam.open_db(svr, "utter-#{pname}", [])
    {:ok, rv} = :couchbeam_view.fetch(db, {"utter", "target_commits"}, [{:limit, 20}, :descending])
    jrv = rv |> Enum.map(&(convToMap(&1)))
    json conn, jrv
  end

  def start_service(conn, _) do
    json conn, %{"result" => "ok"}
  end

  def stop_service(conn, _) do
    json conn, %{"result" => "ok"}
  end

  defp getkey({items}) do
    items |> Enum.find(
      fn
         ({"key", _k}) -> true
         (_) -> false
      end)
    |> elem 1
  end

  defp convToMap({items}) do
    items |> Enum.reduce(%{},
      fn {k, v}, acc ->
        Dict.put(acc, k, convToMap(v))
      end
    )
  end

  defp convToMap(list) when is_list(list) do
    list |> Enum.map(&(convToMap(&1)))
  end

  defp convToMap(other_types) do
    other_types
  end
end
