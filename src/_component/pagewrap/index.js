import React, { useRef, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from '../../reducers';

import Nav from "../Nav";
import Home from "../../page/home";
import SaiKung from "../../page/saikung";
import Northease from "../../page/northeast";


const PageWrap = (props) => {
  const bodyWrap = useRef(null);

  useEffect(()=>{
    if(props.match.params.lang !== props.lang){
      props.dispatch(updateLanguage(props.match.params.lang));
    }
  },[props.lang]);
    
  return (
    <>
      <div ref={bodyWrap} id="bodyWrap" className={`body_wrap ${props.lang} ${props.openPanel1 || props.openPanel2 ? 'disableScroll' : ''}`}>
        <Nav {...props} />
        <Switch>
          <Route exact path="/:lang/" render={props => {
            return <>
              <Home {...props} />
              <SaiKung {...props} />
              <Northease {...props} />
            </>
          }} />
          <Redirect from="*" to={"/" + props.lang + "/page-not-found/"} />
        </Switch>
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return { 
    lang: state.lang,
    openPanel1: state.openPanel1,
    openPanel2: state.openPanel2
  };
};

export default connect(mapStateToProps)(PageWrap);
