import React, { useState } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login, instagramLogin, facebookLogin } from "../../crud/auth.crud";
import { Link } from "react-router-dom";
import { useAppState } from '../AppState';

function Login(props) {
  const { intl } = props;
  const [, setError] = useAppState('error');
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "3.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "2.5rem" });
  };

  window.onmessage = function (e) {
    if (e.data.token) {
      props.login(e.data.token);
    }
  };

  return (
    <>
      <div className="kt-login__head">
        {/*TODO: enable later<span className="kt-login__signup-label">
          Don't have an account yet?
        </span>
        &nbsp;&nbsp;
        <Link to="/auth/registration" className="kt-link kt-login__signup-link">
          Sign Up!
        </Link>*/}
      </div>

      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>
              {/* https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage */}
              <FormattedMessage id="AUTH.LOGIN.TITLE" />
            </h3>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validate={values => {
              const errors = {};

              if (!values.email) {
                // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              if (!values.password) {
                errors.password = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              return errors;
            }}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              enableLoading();
              setStatus(null);
              setTimeout(() => {
                login(values.email, values.password)
                  .then(({ data: { token } }) => {
                    setError(null)
                    disableLoading();
                    props.login(token);
                  })
                  .catch((err) => {
                    console.log(err)
                    disableLoading();
                    setSubmitting(false);
                    if (err.response) {
                      setStatus(err.response.data.error);
                      console.log(err.response.data)
                    } else {
                      setStatus(
                        intl.formatMessage({
                          id: "AUTH.VALIDATION.INVALID_LOGIN"
                        })
                      );
                    }
                  });
              }, 1000);
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
                <form
                  noValidate={true}
                  autoComplete="off"
                  className="kt-form"
                  onSubmit={handleSubmit}
                >
                  {status ? (
                    <div role="alert" className="alert alert-danger">
                      <div className="alert-text">{status}</div>
                    </div>
                  ) : null}

                  <div className="form-group">
                    <TextField
                      type="email"
                      label="Email or Username"
                      margin="normal"
                      className="kt-width-full"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      type="password"
                      margin="normal"
                      label="Password"
                      className="kt-width-full"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      helperText={touched.password && errors.password}
                      error={Boolean(touched.password && errors.password)}
                    />
                  </div>

                  <div className="kt-login__actions">
                    <Link
                      to="/auth/forgot-password"
                      className="kt-link kt-login__link-forgot"
                    >
                      <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                    </Link>
                    <button
                      id="kt_login_signin_submit"
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                        {
                          "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                        }
                      )}`}
                      style={loadingButtonStyle}
                    >
                      Sign In
                  </button>
                  </div>
                </form>
              )}
          </Formik>
          {/* TODO: use later
          <div className="kt-login__divider">
            <div className="kt-divider">
              <span />
              <span>OR</span>
              <span />
            </div>
          </div>

          <div className="kt-login__options">
            <SocialButton
              className="fb connect"
              provider='facebook'
              appId='541432119845295'
              onLoginSuccess={(d) => {
                facebookLogin(d)
                  .then(({ data: { token }}) => {
                    props.login(token);
                  })
              }}
              onLoginFailure={(d) => console.log(d)}
            />
            <a href="#" className="btn btn-danger kt-btn" onClick={() => instagramLogin()}>
              <i className="fab fa-instagram" />
              Instagram
            </a>
            </div>*/}
        </div>
      </div>
    </>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Login)
);
