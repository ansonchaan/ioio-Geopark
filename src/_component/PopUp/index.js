import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { updateGoStart, updateOpenPanel1, updateOpenPanel2, updateShowPanel2, updateInitial } from "../../reducers";

const PopUp = (props) => {
    const [globalData, setGlobalData] = useState(null);
    const popupElem = useRef(null);
    const updateIsShownFunc = useRef(null);
    const clearTimerFunc = useRef(null);

    useEffect(()=>{
        if(props.data)
            setGlobalData(props.data['global']);
    },[props.data]);

    useEffect(()=>{
        let timer = null;
        let backtohometimer = null;
        let isShown = false;

        props.dispatch(updateInitial(true));

        const idle = () => {
            if(!isShown){
                if(timer) clearTimeout(timer);
                if(backtohometimer) clearTimeout(backtohometimer);
                timer = setTimeout(()=>{
                    isShown = true;
                    showPopup();
                },1000 * 60);
            }
        }

        const showPopup = () => {
            popupElem.current.classList.add('active');
    
            if(backtohometimer) clearTimeout(backtohometimer);
            backtohometimer = setTimeout(()=>{
                backToHome();
                updateIsShown(false);
                popupElem.current.classList.remove('active');
            },1000 * 30);
        }

        const clearTimer = () => {
            if(timer) clearTimeout(timer);
            if(backtohometimer) clearTimeout(backtohometimer);
        }
        clearTimerFunc.current = {clearTimer}

        const updateIsShown = (bool) => {
            isShown = bool;
        }
        updateIsShownFunc.current = {updateIsShown}

        window.addEventListener("touchstart", idle);
        window.addEventListener("mousedown", idle);

        return () => {
            window.removeEventListener("touchstart", idle);
            window.removeEventListener("mousedown", idle);
        }
    },[]);

    const HandleButton = (bool) => {
        if(!bool){
            setTimeout(()=>{
                backToHome();
            },600);
        }

        clearTimerFunc.current.clearTimer();
        popupElem.current.classList.remove('active');
        updateIsShownFunc.current.updateIsShown(false);
    }

    const backToHome = () => {
        props.dispatch(updateInitial(true));
        props.dispatch(updateGoStart(true));
        props.dispatch(updateOpenPanel1(false));
        props.dispatch(updateOpenPanel2(false));
        props.dispatch(updateShowPanel2(false));
    }

    return (
        <div ref={popupElem} id="popup" className={props.lang}>
            <div id="content" className="exo cap">
                <div dangerouslySetInnerHTML={{__html:globalData && globalData.continue}}></div>
                <div><div onClick={()=>HandleButton(true)}><span>{globalData && globalData.yes}</span></div><div onClick={()=>HandleButton(false)}><span>{globalData && globalData.no}</span></div></div>
            </div>
            <div id="bg"></div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
      lang: state.lang,
      data: state.data ? state.data[state.lang] : null
    };
};

export default connect(mapStateToProps)(PopUp);