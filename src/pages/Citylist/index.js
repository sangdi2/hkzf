import React from "react";
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import axios from "axios";

const chulilist=list=>{
   const citylist={}
   
   list.forEach(item=>{
       const first =item.short.substr(0,1)
       if(citylist[first]){
           citylist[first].push(item)
       }else{
           citylist[first]=[item]
       }
   })
   const cityindex=Object.keys(citylist).sort()
   return {
       citylist,
       cityindex
   }
}
export default class Citylist extends React.Component{
    componentDidMount(){
        this.getcity()
    }
    async getcity(){
       const res=await axios.get('http://localhost:8088/area/city?level=1')
       const {citylist,cityindex}=chulilist(res.data.body)
       const re=await axios.get('http://localhost:8088/area/hot')
       citylist['hot']=re.data.body
       cityindex.unshift('hot')
       console.log(citylist,cityindex)

    }
    render(){
        return <div className="citylist">
            <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() => this.props.history.go(-1)}
      
    >城市选择</NavBar>
        </div>
    }
}