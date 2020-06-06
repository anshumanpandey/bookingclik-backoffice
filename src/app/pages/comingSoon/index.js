import React, { useState } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../_metronic";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login, instagramLogin, facebookLogin } from "../../crud/auth.crud";

function Login(props) {
  const { intl } = props;
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
      <div className="kt-grid kt-grid--ver kt-grid--root">
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
        >
          <div style={{ width: '100%'}} className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
              style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`,
                width: '100%',
                alignItems: 'center'
              }}
            >
              <div className="kt-grid__item">
                  <img
                    alt="Logo"
                    src={toAbsoluteUrl("/media/logos/logo-4.png")}
                  />
              </div>
              <div style={{ width: '50%', textAlign: 'center' }} className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                <div className="kt-grid__item kt-grid__item--middle">
                  <h2 style={{ fontSize: '3.5rem', fontVariant: 'bold'}} className="kt-login__subtitle">
                    Our website is coming soon!
                  </h2>
                  <h4 style={{ fontSize: '1.5rem'}} className="kt-login__subtitle">
                    CarrentalClik is a website that allows you to find the best Car Rental, Hotel, Flights, Cruises around the world!
                    For More details please email admin@bookingclik.com
                  </h4>
                </div>
              </div>
              <div className="kt-grid__item">
                <div className="kt-login__info">
                  <div className="kt-login__copyright">
                    &copy; 2020 Bookingclik Ltd
                  </div>
                  <div className="kt-login__menu">

                  </div>
                </div>
              </div>
            </div>
          </div>
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
