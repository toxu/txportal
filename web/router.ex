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

    post "/scheduler/:action", SchedulerController, :redirect

    get "/butter/projects", ButterController, :projects
    get "/butter/projects/:pname", ButterController, :project_results
    get "/butter/start", ButterController, :start_service
    get "/butter/stop", ButterController, :stop_service

    get "/couchpotato/:db/design/:design/view/:view", PotatoController, :view_results
    get "/couchpotato/:db/design/:design/view/:view/key/:key", PotatoController, :key_results
    get "/couchpotato/:db/design/:design/view/:view/startkey/:startkey/endkey/:endkey", PotatoController, :key_range_results
    
    get "/couchpotato/:db/:document/:rev", PotatoController, :delete_document
  end

  scope "/", Txportal do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

end
