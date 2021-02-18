// import config from "../config";
import React from 'react';
import myCache from "memory-cache";

const ReactIsInDevMode = () => { 
  return '_self' in React.createElement('div');
}

//
// Actions
//
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";
export const INITIAL = "INITIAL";
export const GO_START = "GO_START";
export const UPDATE_OPEN_PANEL_1 = "UPDATE_OPEN_PANEL_1";
export const UPDATE_OPEN_PANEL_2 = "UPDATE_OPEN_PANEL_2";
export const UPDATE_SHOW_PANEL_1 = "UPDATE_SHOW_PANEL_1";
export const UPDATE_SHOW_PANEL_2 = "UPDATE_SHOW_PANEL_2";
export const UPDATE_INFORM_PANEL_1 = "UPDATE_INFORM_PANEL_1";
export const UPDATE_INFORM_PANEL_2 = "UPDATE_INFORM_PANEL_2";
export const UPDATE_HIDE_PANEL = "UPDATE_HIDE_PANEL";

export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAILURE = "FETCH_FAILURE";

export const updateLanguage = lang => ({ type: UPDATE_LANGUAGE, lang: lang });
export const updateInitial = isInitial => ({ type: INITIAL, isInitial: isInitial });
export const updateGoStart = goStart => ({ type: GO_START, goStart: goStart });
export const updateOpenPanel1 = openPanel1 => ({ type: UPDATE_OPEN_PANEL_1, openPanel1: openPanel1 });
export const updateOpenPanel2 = openPanel2 => ({ type: UPDATE_OPEN_PANEL_2, openPanel2: openPanel2 });
export const updateShowPanel1 = showPanel1 => ({ type: UPDATE_SHOW_PANEL_1, showPanel1: showPanel1 });
export const updateShowPanel2 = showPanel2 => ({ type: UPDATE_SHOW_PANEL_2, showPanel2: showPanel2 });
export const updateInformPanel1 = informPanel1 => ({ type: UPDATE_INFORM_PANEL_1, informPanel1: informPanel1 });
export const updateInformPanel2 = informPanel2 => ({ type: UPDATE_INFORM_PANEL_2, informPanel2: informPanel2 });
export const updateHidePanel = hidePanel => ({ type: UPDATE_HIDE_PANEL, hidePanel: hidePanel });

export const fetchDataRequest = () => ({ type: FETCH_REQUEST });
export const fetchDataSuccess = (data) => ({ type: FETCH_SUCCESS, data: data});
export const fetchDataError = () => ({ type: FETCH_FAILURE });

const promise = (
  dispatch,
  fetchData,
  cache,
  lang,
  singlePostTitle = null
) => {
  return new Promise(resolve => {
    if (!cache) {
      fetchData(resolve);
    } else {
      if (cache.data) {
        if (cache.lang !== lang) {
          fetchData(resolve);
          console.log("-------------------- Different language, fetch again");
        } else if (
          singlePostTitle !== null &&
          cache.data.uid !== singlePostTitle
        ) {
          dispatch(fetchDataSuccess({})); // clear data
          fetchData(resolve); // fetch again
          console.log(
            "-------------------- But different single post title, fetch again"
          );
        } else {
          // dispatch(fetchDataSuccess(pageName,cache.data));
          resolve(cache.data);
          console.log("-------------------- Used cache data");
        }
      }
    }
  }).catch(function(e) {
    console.log(e);
  });
};

export const fetchAllData = () => (dispatch, getState) => {
  const state = getState();
  const cache = myCache.get(`data`);
  let { lang } = state;

  if (!cache) console.log(`-------------------- Data No Cache`);
  else console.log(`-------------------- Data Cached`);

  const fetchData = resolve => {

    // start message
    dispatch(fetchDataRequest());

    const path = ReactIsInDevMode() ? '//dev.ioiocreative.com/geo-park/cms/api' : '/geo-park/cms/api';
    fetch(path,{ 
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const results = data;
      // const results = config;

      // save data to store
      dispatch(fetchDataSuccess(results));

      // put data to cache
      // myCache.put(`data`, {
      //   data: results,
      //   lang: lang
      // });
      // console.log(`-------------------- Data has been Cached`);
      // console.log(`-------------------- Client cache:`, myCache.keys());

      resolve(results);
    });
  };

  return promise(dispatch, fetchData, cache, lang);
};

//
// Reducer
//
const initialState = {
  lang: "tc",
  // deviceType: "desktop",
  // isMobile: false,
  isInitial: false,
  hidePanel: true,

  data: null,
  // projectsData: null,
  // projectSingleData: null
};
const reducer = (state = initialState, action) => {
  // console.log("                     !!!", action.type, "!!!");
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, lang: action.lang };

    case INITIAL:
      return { ...state, isInitial: action.isInitial };

    case GO_START:
      return { ...state, goStart: action.goStart };

    case UPDATE_OPEN_PANEL_1:
      return { ...state, openPanel1: action.openPanel1 };
      
    case UPDATE_OPEN_PANEL_2:
      return { ...state, openPanel2: action.openPanel2 };

    case UPDATE_SHOW_PANEL_1:
      return { ...state, showPanel1: action.showPanel1 };

    case UPDATE_SHOW_PANEL_2:
      return { ...state, showPanel2: action.showPanel2 };
      
    case UPDATE_INFORM_PANEL_1:
      return { ...state, informPanel1: action.informPanel1 };

    case UPDATE_INFORM_PANEL_2:
      return { ...state, informPanel2: action.informPanel2 };

    case UPDATE_HIDE_PANEL:
      return { ...state, hidePanel: action.hidePanel };

    case FETCH_SUCCESS:
      return { ...state, data:action.data.content, langData:action.data.languages }

    default:
      return state;
  }
};

export default reducer;
