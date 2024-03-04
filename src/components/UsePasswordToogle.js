import React, { useState } from 'react'

const UsePasswordToogle = () => {
    const [visible,setVisibility] = useState(false);

    const Icon = (
        <i style={{ position : "absolute", right : "15px", top : "70%", color : "#ccc", cursor : "pointer", transform : "translateY(-50%)" }} title = {visible ? "hide password": "show password"} class={visible ? "fa fa-eye-slash": "fa fa-eye"} onClick={()=> setVisibility(visibility => !visibility)} ></i>
    );

    const InputType = visible ? "text" : "password";

    return [InputType, Icon];
}

export default UsePasswordToogle