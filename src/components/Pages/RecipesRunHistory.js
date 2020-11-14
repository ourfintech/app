import { useAuth0 } from "@auth0/auth0-react";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, formatDistance, parseISO } from "date-fns";
import { API_URL } from "../../utils/utils";

const cardEqualHeight = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const cardFooter = {
  marginTop: "auto",
};

function RecipesRunHistory() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userRecipes, setUserRecipes] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getAllRecipes = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const apiUrl = `${API_URL}/recipes/run_history`;
        const metadataResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });
        const data = await metadataResponse.json();
        setUserRecipes(data);
      } catch (e) {
        console.error(e.message);
      }
    };

    getAllRecipes();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  }, [getAccessTokenSilently, user]);

  function RecipesList({ recipes }) {
    if (Object.keys(recipes).length > 0) {
      return (
        <>
          {Object.keys(recipes).map((i) => {
            const date = parseISO(recipes[i].run_time);
            const runTime = format(date, "PPp");
            const timeAgo = formatDistance(new Date(), date);
            return (
              <div className="card mb-4" key={recipes[i].id}>
                <div className="card-content">
                  <div className="content">
                    <h2>{recipes[i].data.task_name}</h2>
                    <div>
                      Event ID: <code>{recipes[i].id}</code>
                    </div>
                    <div>
                      Run time: {runTime}{" "}
                      <span className="tag is-light">{timeAgo} ago</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      );
    }
    return (
      <>
        <div className="card mb-4">
          <div className="card-content">
            <div className="content">
              <h2>Oh no!</h2>
              You do not have any recipes.
            </div>
          </div>
          <footer className="card-footer" style={cardFooter}>
            <Link to="/recipes/explore" className="card-footer-item">
              Why not take a look at what recipes you create?
            </Link>
          </footer>
        </div>
      </>
    );
  }

  return (
    <div>
      <section className="hero is-dark">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">My recipes</h1>
            <h2 className="subtitle">
              Here you can see all the recipes you&rsquo;ve created.
            </h2>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="columns">
          <div className="column is-2">
            <aside className="menu">
              <p className="menu-label">Recipes</p>
              <ul className="menu-list">
                <li>
                  <Link to="/recipes">My Recipes</Link>
                  <Link to="/recipes/explore">Explore Recipes</Link>
                  <Link to="/recipes/run_history" className="is-active">
                    Run History
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
          <div className="column">
            {userRecipes ? (
              <RecipesList recipes={userRecipes?.data} />
            ) : (
              <>
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width="100%"
                  height={150}
                  className="mb-4"
                />
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width="100%"
                  height={150}
                  className="mb-4"
                />
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width="100%"
                  height={150}
                  className="mb-4"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipesRunHistory;
