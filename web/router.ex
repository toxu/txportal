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
    get "/utter/results", UtterController, :results
    get "/utter/projects", UtterController, :projects
  end

  scope "/", Txportal do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Txportal do
  #   pipe_through :api
  # end
end
