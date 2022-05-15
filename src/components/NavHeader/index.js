import React from "react";
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
export default class NavHeader extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        return  <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.go(-1)}
        
      >{this.props.children}</NavBar>
    }
}