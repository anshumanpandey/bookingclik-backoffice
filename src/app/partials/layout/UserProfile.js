/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "../../../_metronic";
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

const UserProfile = (props) => {
  const [forceShow, setForceShow] = useState(false)

  const { user, showHi, showAvatar, showBadge } = props;
  let usernameToDisplay = user.fullname || user.clientname || user.email

  if (user.client) {
    usernameToDisplay = user.client.clientname
  }

  let prefix = null

  if (user && user.type != "super_admin") {
    prefix = `Balance ${user.currencySymbol}${parseFloat(user.balance).toFixed(2)} (${user.credits} clicks)`
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bolder',
        marginRight: '0.5rem',
      }}>
        {prefix && prefix}
      </div>
      <Dropdown show={forceShow} className="kt-header__topbar-item kt-header__topbar-item--user" drop="down" alignRight>
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id="dropdown-toggle-user-profile"
        >
          <div className="kt-header__topbar-user" onClick={() => setForceShow(!forceShow)}>
            {showHi && (
              <span className="kt-header__topbar-welcome kt-hidden-mobile">
                Hi,
              </span>
            )}

            {showHi && (
              <span className="kt-header__topbar-username kt-hidden-mobile">
                {usernameToDisplay}
              </span>
            )}

            {showAvatar && user.pic && <img alt="Pic" src={user.pic} />}
            {showAvatar && !user.pic && <PersonOutlineIcon />}

            {showBadge && (
              <span className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">
                {/* TODO: Should get from currentUser */}
                John Doe
              </span>
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
          {/** ClassName should be 'dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          <div
            className="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/misc/bg-1.jpg")})`
            }}
          >
            <div className="kt-user-card__avatar">
              <img alt="Pic" className="kt-hidden" src={user.pic} />
              <span className="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success">
                S
              </span>
            </div>
            <div className="kt-user-card__name">{user.fullname}</div>
          </div>
          <div className="kt-notification">

            {(user.type != "super_admin") && (
              <>
                <Link to={`/edit-profile`} onClick={() => setForceShow(false)}>
                  <a className="kt-notification__item">
                    <div className="kt-notification__item-icon">
                      <i className="flaticon2-calendar-3 kt-font-success" />
                    </div>
                    <div className="kt-notification__item-details">
                      <div className="kt-notification__item-title kt-font-bold">
                        My Profile
                    </div>
                    </div>
                  </a>
                </Link>

              </>
            )}
            <div className="kt-notification__custom">
              <Link
                to="/logout"
                className="btn btn-label-brand btn-sm btn-bold"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(UserProfile);
