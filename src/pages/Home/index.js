import React from "react";
import { TabBar } from 'antd-mobile';
import './index.css'
import {Route} from 'react-router-dom';
import Index from "../Index";
import Findhouse from "../Findhouse";
import Zixun from "../Zixun";
import My from "../My";






export default class Home extends React.Component{
  
    state = {
      selectedTab:this.props.location.pathname,
      hidden: false,
      fullScreen: true,
    }
  
 

  render() {
    
    return (
      <div className="home">
        

          <Route exact path="/home" component={Index}/>
          <Route path="/home/findhouse" component={Findhouse}/>
          <Route path="/home/zixun" component={Zixun}/>
          <Route path="/home/my" component={My}/>
       
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          noRenderContent={true}
        >
          <TabBar.Item
            title="首页"
            key="Life"
            icon={<i className="iconfont icon-ind"/>
            }
            selectedIcon={<i className="iconfont icon-ind"/>
            }
            selected={this.state.selectedTab === '/home'}
            
            onPress={() => {
              this.setState({
                selectedTab: '/home/index',
              });
              this.props.history.push('/home')
              console.log(this)
            }}
            data-seed="logId"
          >
            
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-findHouse"/>
            }
            selectedIcon={
              <i className="iconfont icon-findHouse"/>
            }
            title="找房"
            key="Koubei"
            
            selected={this.state.selectedTab === '/home/findhouse'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/findhouse',
              });
              this.props.history.push('/home/findhouse')
            }}
            data-seed="logId1"
          >
           
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-infom"/>
            }
            selectedIcon={
              <i className="iconfont icon-infom"/>
            }
            title="咨讯"
            key="Friend"
            
            selected={this.state.selectedTab === '/home/zixun'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/zixun',
              });
              this.props.history.push('/home/zixun')
            }}
          >
           
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-my"/>}
            selectedIcon={<i className="iconfont icon-my"/>}
            title="我的"
            key="my"
            selected={this.state.selectedTab === '/home/my'}
            onPress={() => {
              this.setState({
                selectedTab: '/home/my',
              });
              this.props.history.push('/home/my')
            }}
          >
           
          </TabBar.Item>
        </TabBar>
      </div>
      
    );
  }
      
}