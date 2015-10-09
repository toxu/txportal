defmodule Txportal.Router do
  use Txportal.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Txportal do
    pipe_through :api

    get "/txt/results", TxtController, :results

    get "/utter/projects", UtterController, :projects
    get "/utter/projects/:pname", UtterController, :project_results
    get "/utter/start", UtterController, :start_service
    get "/utter/stop", UtterController, :stop_service

    get "/couchpotato/:db/design/:design/view/:view", PotatoController, :view_results
    get "/couchpotato/:db/design/:design/view/:view/key/:key", PotatoController, :key_results
    get "/couchpotato/:db/design/:design/view/:view/startkey/:startkey/endkey/:endkey", PotatoController, :key_range_results
  end

  scope "/", Txportal do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

end
