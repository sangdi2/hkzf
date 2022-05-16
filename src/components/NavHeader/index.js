import React from "react";
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import  PropTypes  from "prop-types"



 class NavHeader extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
     defaulthandle=() => this.props.history.go(-1)
    render(){
        return  <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={this.props.func||this.defaulthandle}
        
      >{this.props.children}</NavBar>
    }
}

export default withRouter(NavHeader)