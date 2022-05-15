import React from "react";
import { NavBar, Icon,Toast } from 'antd-mobile';
import './index.scss'
import axios from "axios";
import {getcurrentcity} from '../../utils'
import {List,AutoSizer} from 'react-virtualized';
import NavHeader from "../../components/NavHeader";


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
  const title=36
  const rowheight=52

  const ci=["北京","上海","广州","深圳"]
  

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
    constructor(props){
        super(props)
        this.state={
            citylist:{},
            cityindex:[],
            activeIndex:0
        }
        this.cityListComponent=React.createRef()
    }
    changcity=({label,value})=>{
      if(ci.indexOf(label)>-1){
        localStorage.setItem('hkzf_localcity',JSON.stringify({label,value}))
        this.props.history.go(-1)
      }else{
        Toast.info("该房源暂无数据",1)
      }
    }
    
     rowRenderer=({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) =>{
        // const { cityindex} = this.state
        const letter = this.state.cityindex[index]
        
        return (
          <div key={key} style={style} className="city">
            <div className="title">{formatletter(letter)}</div>
            {this.state.citylist[letter].map(item=><div className="name" key={item.value} onClick={()=>this.changcity(item)}>{item.label}</div>)}
            
          </div>
        );
      }
      getrowheight=({index})=>{
          return title+rowheight*this.state.citylist[this.state.cityindex[index]].length
      }
      renderrightindex=()=>{
          return this.state.cityindex.map((item,index)=>(
                    <li className="city-index-item" key={item} onClick={()=>{
                        this.cityListComponent.current.scrollToRow(index)
                    }}>
                        <span className={this.state.activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
                        </span>
                    </li>
          ))
      }
      onRowsRendered=({startIndex})=>{
         if(startIndex!==this.state.activeIndex){
             this.setState({
                 activeIndex:startIndex
             })
         }
      }
    async componentDidMount(){
        await this.getcity()
        this.cityListComponent.current.measureAllRows()
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
            <NavHeader>城市选择</NavHeader>
     <AutoSizer>
         {({width,height})=>(
                <List
                ref={this.cityListComponent}
                width={width}
                height={height}
                rowCount={this.state.cityindex.length}
                rowHeight={this.getrowheight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
                />
         )}
     </AutoSizer>
     <ul className="city-index">
         {this.renderrightindex()}
     
     </ul>
     
        </div>
    }
}