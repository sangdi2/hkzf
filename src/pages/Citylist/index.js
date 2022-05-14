import React from "react";
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import axios from "axios";
import {getcurrentcity} from '../../utils'
import {List,AutoSizer} from 'react-virtualized';


  const formatletter=(letter)=>{
       switch(letter){
           case "#":
               return "当前定位城市"
           case "hot":
               return "热门城市"
           default:
               return letter.toUpperCase()
       }
  }
  

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
    state={
        citylist:{},
        cityindex:[]
    }
     rowRenderer=({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) =>{
        const { cityindex} = this.state
        const letter = cityindex[index]
        return (
          <div key={key} style={style} className="city">
            <div className="title">{formatletter(letter)}</div>
            <div className="name">上海</div>
          </div>
        );
      }
    componentDidMount(){
        this.getcity()
    }
    async getcity(){
       const res=await axios.get('http://localhost:8088/area/city?level=1')
       const {citylist,cityindex}=chulilist(res.data.body)
       const re=await axios.get('http://localhost:8088/area/hot')
       citylist['hot']=re.data.body
       cityindex.unshift('hot')
       const city=await getcurrentcity()
       citylist['#']=[city]
       cityindex.unshift('#')
    //    console.log(citylist,cityindex)
       this.setState({
           cityindex:cityindex,
           citylist:citylist
       })

    }
    render(){
        return <div className="citylist">
            <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() => this.props.history.go(-1)}
      
    >城市选择</NavBar>
     <AutoSizer>
         {({width,height})=>(
                <List
                width={width}
                height={height}
                rowCount={this.state.cityindex.length}
                rowHeight={80}
                rowRenderer={this.rowRenderer}
                />
         )}
     </AutoSizer>
   
        </div>
    }
}