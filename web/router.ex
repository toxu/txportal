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
  end

  scope "/", Txportal do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

end
