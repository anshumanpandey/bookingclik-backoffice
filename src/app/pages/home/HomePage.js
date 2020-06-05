import React, { Suspense, lazy, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import { LayoutSplashScreen } from "../../../_metronic";
import Notification from "../../widgets/Notification";
import { useAppState } from '../AppState';
import MyClick from "../myClicks/myClick";
import Payments from "../payments"
import Supplier from "../supplier"
import BlacklistedCompanies from "../blacklistedCompanies"
import * as auth from "../../store/ducks/auth.duck";
import { getUserByToken } from "../../crud/auth.crud";


const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

function HomePage({ user, menuConfig, fulfillUser }) {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  const [success, setSuccess] = useAppState('success');
  const [error, setError] = useAppState('error');

  const routes = [
    { path: "/transactions", component: Payments },
    { path: "/click", component: MyClick },
    { path: "/supplier", component: Supplier },
    { path: "/blacklist", component: BlacklistedCompanies },
  ]

  let defaultRoute = 'click';
  if (user.type == 'super_admin') {
    defaultRoute = 'supplier';
  }

  useEffect(() => {
    getUserByToken()
      .then((res) => {
        console.log(fulfillUser)
        fulfillUser(res.data)
      })
  }, [])

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      {success && (
        <Notification msg={success} onClose={() => setSuccess(false)} />
      )}
      {error && (
        <Notification msg={error} onClose={() => setError(false)} severity={'error'} />
      )}
      <Switch>
        {
          /* Redirect from root URL to /clients. */
          <Redirect exact from="/dashboard" to={`/${defaultRoute}`} />
        }
        {
          routes
            .filter((r) => {
              const currentRoute = menuConfig.header.items.find(i => i.page === r.path.replace(/\//g, ''))
              if (!user) return true;
              if (!currentRoute) return true;
              if (!currentRoute.roles) return true;
              if (currentRoute.roles.length === 0) return true;


              return currentRoute.roles.some(r => user.type == r)
            })
            .filter((r) => {
              const currentRoute = menuConfig.aside.items.find(i => i.page === r.path.replace(/\//g, ''))
              if (!user) return true;
              if (!currentRoute) return true;
              if (!currentRoute.roles) return true;
              if (currentRoute.roles.length === 0) return true;

              return currentRoute.roles.some(r => user.type == r)
            })
            .map(r => <Route key={r.path} path={r.path} component={r.component} />)}
        {/*<Redirect to="/error/error-v1" />*/}
        <Redirect to="/" />
      </Switch>
    </Suspense>
  );
}

export default connect(
  ({ auth, builder }) => ({ user: auth.user, menuConfig: builder.menuConfig, }),
  auth.actions
)(HomePage);